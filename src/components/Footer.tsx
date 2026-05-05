"use client";

import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail, FiGlobe, FiCode } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0f1c] relative z-20 overflow-hidden">
            {/* Decorative Top Border with Gradient */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50" />
            
            {/* Glowing Orb in Background */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-oro/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-viola/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Image
                                    src="/fanta-logo.png"
                                    alt="FantArte Logo"
                                    width={240}
                                    height={80}
                                    className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                />
                            </motion.div>
                            <p className="text-gray-400 text-base leading-relaxed max-w-md text-center lg:text-left">
                                Il fantagioco ufficiale della <strong className="text-oro font-bold">Piazza dell&apos;Arte</strong>. 
                                Un&apos;esperienza immersiva dove il talento incontra la strategia, 
                                nata dalla collaborazione tra le associazioni storiche di Messina.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-oro">
                                    <FiGlobe size={18} />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-black uppercase tracking-widest">Contitolarità</p>
                                    <p className="text-gray-500 text-sm">Associazione Morgana & O.R.U.M.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-viola">
                                    <FiCode size={18} />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-black uppercase tracking-widest">Technical Lead</p>
                                    <p className="text-gray-500 text-sm">Massimo Mantineo</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="grid grid-cols-2 gap-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Piattaforma</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-400">
                                <Link href="/" className="hover:text-oro transition-colors">Home</Link>
                                <Link href="/regolamento" className="hover:text-oro transition-colors">Regolamento</Link>
                                <Link href="/leaderboards" className="hover:text-oro transition-colors">Classifiche</Link>
                                <Link href="/team/create" className="hover:text-oro transition-colors">Crea Squadra</Link>
                            </nav>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Legale</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-400">
                                <Link href="/privacy" className="hover:text-oro transition-colors">Privacy Policy</Link>
                                <Link href="/accordo" className="hover:text-oro transition-colors">Collaborazione</Link>
                                <Link href="/faq" className="hover:text-oro transition-colors">Domande Frequenti</Link>
                                <Link href="/contatti" className="hover:text-oro transition-colors">Supporto</Link>
                            </nav>
                        </div>
                    </div>

                    {/* Social & Contact */}
                    <div className="flex flex-col items-center lg:items-end space-y-8">
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs">Social & Socialize</h4>
                        <div className="flex gap-4">
                            {[
                                { icon: FiInstagram, href: "https://www.instagram.com/piazzadellarte_/", color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500" },
                                { icon: FiFacebook, href: "https://www.facebook.com/PiazzadellArte", color: "hover:bg-[#1877F2]" },
                                { icon: FiMail, href: "mailto:info@fantarte.it", color: "hover:bg-oro hover:text-blunotte" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5 }}
                                    className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 ${social.color}`}
                                >
                                    <social.icon size={22} />
                                </motion.a>
                            ))}
                        </div>
                        <div className="text-center lg:text-right">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Hai bisogno di aiuto?</p>
                            <a href="mailto:info@fantarte.it" className="text-oro font-bold hover:underline tracking-tight">info@fantarte.it</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-medium">
                        &copy; {new Date().getFullYear()} <span className="text-gray-400">FantArte</span>. All Rights Reserved.
                    </p>
                    
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">System Operational</span>
                    </div>

                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-gray-700 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-bold">Privacy</Link>
                        <Link href="/accordo" className="text-gray-700 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-bold">Accordo</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
