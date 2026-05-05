"use client";

import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail, FiGlobe, FiCode, FiHelpCircle } from "react-icons/fi";
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-5 space-y-8">
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
                                nata dalla collaborazione tra <strong className="text-white">Morgana</strong> e <strong className="text-white">Orume</strong>.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
                            <div className="space-y-4">
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Morgana</p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiInstagram size={18} /></a>
                                    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiFacebook size={18} /></a>
                                    <a href="mailto:associazione.morgana@gmail.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiMail size={18} /></a>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Orume</p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiInstagram size={18} /></a>
                                    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiFacebook size={18} /></a>
                                    <a href="mailto:orum.unime@gmail.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-oro transition-colors"><FiMail size={18} /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-center lg:text-left pt-2">
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Piattaforma</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-400 font-bold">
                                <Link href="/" className="hover:text-oro transition-colors">Home</Link>
                                <Link href="/regolamento" className="hover:text-oro transition-colors">Regolamento</Link>
                                <Link href="/leaderboards" className="hover:text-oro transition-colors">Classifiche</Link>
                                <Link href="/team/create" className="hover:text-oro transition-colors">Squadra</Link>
                            </nav>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Legale & Info</h4>
                            <nav className="flex flex-col gap-4 text-sm text-gray-400 font-bold">
                                <Link href="/privacy" className="hover:text-oro transition-colors">Privacy</Link>
                                <Link href="/accordo" className="hover:text-oro transition-colors">Collaborazione</Link>
                                <Link href="/supporto" className="hover:text-oro transition-colors">FAQ & Supporto</Link>
                            </nav>
                        </div>
                    </div>

                    {/* Technical & Contact */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-end space-y-10 pt-2">
                        <div className="text-center lg:text-right space-y-4">
                            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-40">Hai bisogno di aiuto?</h4>
                            <div className="space-y-1">
                                <a href="mailto:associazione.morgana@gmail.com" className="block text-oro font-black hover:underline text-xs tracking-tighter">associazione.morgana@gmail.com</a>
                                <a href="mailto:orum.unime@gmail.com" className="block text-oro font-black hover:underline text-xs tracking-tighter">orum.unime@gmail.com</a>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center lg:items-end gap-2">
                            <div className="flex items-center gap-3">
                                <FiCode className="text-gray-500" />
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Built by Massimo Mantineo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-medium">
                        &copy; {new Date().getFullYear()} <span className="text-gray-400">FantArte</span>. Piazza dell&apos;Arte Messina.
                    </p>
                    
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">System Operational</span>
                    </div>

                    <div className="flex gap-6">
                         <div className="flex items-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            <span>Morgana</span>
                            <span className="w-1 h-1 bg-gray-800 rounded-full" />
                            <span>O.R.U.M.</span>
                         </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
