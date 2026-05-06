"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiFileText, FiShield, FiLock, FiAlertCircle } from "react-icons/fi";

export default function TerminiPage() {
    return (
        <main className="min-h-screen text-white pt-56 md:pt-44 pb-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-oro/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-oro hover:text-white transition-colors font-black uppercase tracking-[0.3em] text-[10px] mb-8">
                        <FiArrowLeft /> Torna alla Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Termini e <span className="text-oro">Condizioni</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Ultimo aggiornamento: 6 Maggio 2026</p>
                </motion.div>

                <div className="space-y-16">
                    <Section 
                        icon={FiFileText} 
                        title="1. Oggetto del Servizio" 
                        content="FantArte è una piattaforma di fantagioco (gamification) basata sulla Piazza dell'Arte di Messina. Il servizio è offerto a scopo puramente ludico e culturale dalle associazioni Morgana e O.R.U.M. La partecipazione è gratuita e non costituisce in alcun modo gioco d'azzardo."
                    />

                    <Section 
                        icon={FiShield} 
                        title="2. Account e Registrazione" 
                        content="L'utente è responsabile della custodia delle proprie credenziali di accesso. Ogni utente può registrare un solo account. L'uso di bot, script o sistemi automatizzati per alterare il gioco è severamente vietato e comporterà il ban immediato."
                    />

                    <Section 
                        icon={FiLock} 
                        title="3. Proprietà Intellettuale" 
                        content="Tutti i contenuti presenti sulla piattaforma (loghi, grafiche, testi) sono di proprietà esclusiva delle associazioni organizzatrici o dei rispettivi autori. È vietata la riproduzione anche parziale senza autorizzazione scritta."
                    />

                    <Section 
                        icon={FiAlertCircle} 
                        title="4. Limitazione di Responsabilità" 
                        content="Gli organizzatori si riservano il diritto di sospendere o modificare il servizio in qualsiasi momento per motivi tecnici o organizzativi. Non siamo responsabili per malfunzionamenti derivanti dalla connessione internet dell'utente o da problemi di terze parti."
                    />

                    <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter">Contatti Legali</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Per qualsiasi chiarimento in merito ai presenti termini, puoi contattarci ai seguenti indirizzi:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Morgana</p>
                                <p className="text-white font-bold">associazione.morgana@gmail.com</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">O.R.U.M.</p>
                                <p className="text-white font-bold">orum.unime@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Section({ icon: Icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-oro/10 flex items-center justify-center text-oro border border-oro/20">
                    <Icon size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{title}</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed font-medium pl-16">
                {content}
            </p>
        </motion.section>
    );
}
