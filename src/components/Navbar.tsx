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
            <header className={`fixed top-0 w-full z-[100] transition-all duration-700 pointer-events-none
                ${scrolled ? "pt-4" : "pt-8"}
            `}>
                <div className="max-w-5xl mx-auto px-4 w-full">
                    <nav className={`pointer-events-auto relative flex items-center justify-between px-8 transition-all duration-700 ease-out glass rounded-[2.5rem] shadow-2xl border border-white/5
                        ${scrolled ? "h-16 py-2" : "h-24 py-4"}
                    `}>
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 group">
                                <Image
                                    src="/fanta-logo.png"
                                    alt="FantArte"
                                    width={200}
                                    height={80}
                                    className={`w-auto object-contain transition-all duration-700 ${scrolled ? "h-8" : "h-14"}`}
                                />
                            </Link>
                        </div>

                        {/* Desktop Revolution Menu */}
                        <div className="hidden md:flex items-center gap-1">
                            {filteredNavLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive
                                            ? "text-oro"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div 
                                                layoutId="nav-pill" 
                                                className="absolute inset-0 bg-white/5 rounded-2xl border border-white/5" 
                                            />
                                        )}
                                        <Icon size={14} className="relative z-10" />
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}

                            <div className="w-[1px] h-6 bg-white/10 mx-4" />

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-purple-500/10 ${pathname.startsWith("/admin")
                                        ? "text-purple-400 bg-purple-500/10"
                                        : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/5"
                                        }`}
                                >
                                    <FiShield size={14} />
                                    Admin
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
                                    className="px-8 py-3 bg-oro text-blunotte font-black rounded-full hover:scale-105 active:scale-95 transition-all ml-4 text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="flex md:hidden items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3 text-gray-400 hover:text-white transition-all bg-white/5 rounded-2xl"
                            >
                                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
