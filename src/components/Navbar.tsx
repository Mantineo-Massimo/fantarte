"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    FiLogOut, FiMenu, FiX, FiShield, FiChevronRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (pathname.startsWith("/auth")) return null;

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/artisti", label: "Partecipanti" },
        { href: "/leaderboards", label: "Classifiche" },
        { href: "/regole", label: "Regole" },
    ];

    if (status === "authenticated" && session) {
        navLinks.push({ href: "/team/create", label: "Squadra" });
        navLinks.push({ href: "/account", label: "Profilo" });
    }

    const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

    const filteredNavLinks = isAdmin 
        ? navLinks.filter(link => link.href !== "/") 
        : navLinks;

    return (
        <>
            <header 
                className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
                    scrolled 
                    ? "h-16 bg-blunotte/80 backdrop-blur-xl border-white/10" 
                    : "h-24 bg-transparent border-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="relative z-10 hover:opacity-80 transition-opacity">
                        <Image
                            src="/fanta-logo.png"
                            alt="FantArte"
                            width={220}
                            height={80}
                            className={`w-auto transition-all duration-300 ${scrolled ? "h-9" : "h-16"}`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {filteredNavLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`font-display text-sm font-medium tracking-wide transition-all relative py-2 group ${
                                        isActive ? "text-oro" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {link.label}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-oro transition-transform duration-300 origin-left ${
                                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                    }`} />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Action Section */}
                    <div className="hidden lg:flex items-center gap-6">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`p-2 rounded-lg transition-all ${
                                    pathname.startsWith("/admin")
                                    ? "text-oro bg-oro/10"
                                    : "text-gray-500 hover:text-oro"
                                }`}
                            >
                                <FiShield size={20} />
                            </Link>
                        )}

                        {status === "authenticated" ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 text-sm font-medium text-red-500/70 hover:text-red-500 transition-colors"
                            >
                                <FiLogOut size={18} />
                                <span>Esci</span>
                            </button>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="px-6 py-2 bg-oro text-blunotte font-bold text-sm rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                            >
                                Accedi
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[95] bg-blunotte pt-24 px-6 flex flex-col gap-2"
                    >
                        {filteredNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between p-4 rounded-xl font-display text-xl font-bold ${
                                    pathname === link.href ? "bg-oro/10 text-oro" : "text-gray-400"
                                }`}
                            >
                                {link.label}
                                <FiChevronRight />
                            </Link>
                        ))}
                        
                        <div className="mt-auto mb-10 space-y-4">
                            {status === "authenticated" ? (
                                <button
                                    onClick={() => signOut()}
                                    className="w-full p-4 rounded-xl bg-red-500/10 text-red-500 font-bold"
                                >
                                    Disconnetti
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="block w-full p-4 rounded-xl bg-oro text-blunotte font-bold text-center"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

