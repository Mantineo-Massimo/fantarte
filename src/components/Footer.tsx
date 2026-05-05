"use client";

import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail, FiGlobe, FiCode, FiHelpCircle, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0f1c] relative z-20 overflow-hidden border-t border-white/5">
            
            {/* Background Orbs */}
            <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-viola opacity-[0.05] blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[50%] bg-oro opacity-[0.03] blur-[150px] rounded-full" />

            <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative">
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    
                    {/* Brand / Logo Section */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
                            <Image
                                src="/fanta-logo.png"
                                alt="FantArte"
                                width={260}
                                height={100}
                                className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            />
                        </motion.div>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Il fantagioco dove l&apos;arte prende vita. 
                            Creato per celebrare il talento e la strategia 
                            nella <span className="text-white">Piazza dell&apos;Arte</span> di Messina.
                        </p>
                        
                        <div className="flex gap-4">
                            <SocialIcon icon={FiInstagram} href="#" />
                            <SocialIcon icon={FiFacebook} href="#" />
                            <SocialIcon icon={FiMail} href="mailto:associazione.morgana@gmail.com" />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Esplora</h4>
                            <nav className="flex flex-col gap-6">
                                <FooterLink href="/" label="Home" />
                                <FooterLink href="/artisti" label="Artisti" />
                                <FooterLink href="/leaderboards" label="Classifiche" />
                                <FooterLink href="/team/create" label="Mia Squadra" />
                                <FooterLink href="/supporto" label="Supporto" />
                            </nav>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Legale</h4>
                            <nav className="flex flex-col gap-6">
                                <FooterLink href="/privacy" label="Privacy Policy" />
                                <FooterLink href="/accordo" label="Collaborazione" />
                                <FooterLink href="/regolamento" label="Termini" />
                            </nav>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="lg:col-span-3">
                        <div className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                             <h4 className="text-oro text-[10px] font-black uppercase tracking-widest">Ti serve Aiuto?</h4>
                             <div className="space-y-2">
                                <a href="mailto:associazione.morgana@gmail.com" className="block text-white font-black hover:text-oro transition-colors text-sm truncate">associazione.morgana@gmail.com</a>
                                <a href="mailto:orum.unime@gmail.com" className="block text-white font-black hover:text-oro transition-colors text-sm truncate">orum.unime@gmail.com</a>
                             </div>
                             <div className="pt-4 flex items-center gap-3 opacity-30">
                                <FiGlobe />
                                <span className="text-[10px] font-black uppercase tracking-widest">Messina, Italia</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar Revolution */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">
                            &copy; {new Date().getFullYear()} <span className="text-white">FantArte</span>
                        </p>
                        <div className="flex items-center gap-4 text-gray-800 text-[9px] font-black uppercase tracking-widest">
                            <span>Morgana</span>
                            <span className="w-1 h-1 bg-gray-900 rounded-full" />
                            <span>O.R.U.M.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors cursor-pointer group">
                             <FiCode size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Dev: Massimo Mantineo</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: any, href: string }) {
    return (
        <a 
            href={href} 
            className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-gray-400 hover:text-oro hover:border-oro/30 hover:scale-110 transition-all"
        >
            <Icon size={24} />
        </a>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
    return (
        <Link 
            href={href} 
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest"
        >
            <FiChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-oro" />
            {label}
        </Link>
    );
}
