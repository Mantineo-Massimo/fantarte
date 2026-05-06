"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    FiHome, FiList, FiPlus, FiLogOut, FiSettings,
    FiBookOpen, FiUser, FiUsers, FiMenu, FiX, FiShield, FiCheck
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (pathname.startsWith("/auth")) return null;

    const navLinks = [
        { href: "/", label: "Home", icon: FiHome },
        { href: "/artisti", label: "Artisti", icon: FiUsers },
        { href: "/leaderboards", label: "Classifiche", icon: FiList },
        { href: "/regole", label: "Regole", icon: FiBookOpen },
    ];

    if (status === "authenticated" && session) {
        navLinks.push({ href: "/team/create", label: "Squadra", icon: FiPlus });
        navLinks.push({ href: "/account", label: "Profilo", icon: FiUser });
    }

    const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

    // Se admin, la home va sul logo (rimuoviamo il link Home dal menu per salvare spazio)
    const filteredNavLinks = isAdmin 
        ? navLinks.filter(link => link.href !== "/") 
        : navLinks;

    return (
        <>
            <header className={`fixed top-0 w-full z-[100] transition-all duration-500 pointer-events-none
                ${scrolled ? "pt-2" : "pt-6"}
            `}>
                <div className="max-w-7xl mx-auto px-4 w-full">
                    <nav className={`pointer-events-auto relative flex items-center justify-between px-6 transition-all duration-500 ease-in-out glass rounded-[2rem] shadow-2xl border border-white/10
                        ${scrolled ? "h-16" : "h-20"}
                    `}>
                        <div className="flex items-center min-w-[140px]">
                            <Link href="/" className="flex-shrink-0 group">
                                <Image
                                    src="/fanta-logo.png"
                                    alt="FantArte"
                                    width={160}
                                    height={60}
                                    className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-7" : "h-9"}`}
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center gap-1">
                            {filteredNavLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                            ? "text-oro"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div 
                                                layoutId="nav-pill" 
                                                className="absolute inset-0 bg-white/5 rounded-xl border border-white/10" 
                                            />
                                        )}
                                        <Icon size={16} className="relative z-10" />
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}

                            <div className="w-[1px] h-6 bg-white/10 mx-4" />

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`flex items-center justify-center p-2.5 rounded-2xl transition-all border border-purple-500/10 ${pathname.startsWith("/admin")
                                        ? "text-purple-400 bg-purple-500/10"
                                        : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/5"
                                        }`}
                                    title="Admin"
                                >
                                    <FiShield size={18} />
                                </Link>
                            )}

                            {status === "authenticated" ? (
                                <button
                                    onClick={() => signOut()}
                                    className="p-3 text-red-500/50 hover:text-red-500 transition-colors ml-2"
                                    title="Esci"
                                >
                                    <FiLogOut size={18} />
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="px-6 py-2.5 bg-oro text-blunotte font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all ml-4 text-sm shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex lg:hidden items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2.5 text-gray-400 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5"
                            >
                                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Revolution */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[95] bg-blunotte/98 backdrop-blur-3xl flex flex-col items-center justify-start overflow-y-auto pt-32 pb-20 px-6"
                    >
                        <div className="flex flex-col space-y-4 w-full max-w-sm">
                            {filteredNavLinks.map((link, index) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`flex items-center justify-between py-4 px-8 rounded-2xl text-xl font-black transition-all ${isActive ? "bg-oro text-blunotte shadow-[0_0_30px_rgba(255,215,0,0.3)]" : "glass text-gray-400"
                                                }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <Icon size={24} />
                                                {link.label}
                                            </div>
                                            {isActive && <FiCheck />}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-6 py-4 px-8 rounded-2xl text-xl font-black text-purple-400 border border-purple-500/20 bg-purple-500/5 mt-2"
                                >
                                    <FiShield size={20} />
                                    Admin
                                </Link>
                            )}

                            <div className="pt-12 flex flex-col gap-4">
                                {status === "authenticated" ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full py-6 rounded-[2rem] glass text-red-500 font-black text-xl border border-red-500/20"
                                    >
                                        Disconnetti
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="w-full py-5 rounded-2xl bg-oro text-blunotte font-black text-center text-xl shadow-[0_15px_30px_rgba(255,215,0,0.3)]"
                                    >
                                        Accedi Ora
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
