"use client";

import { motion } from "framer-motion";
import { FiMail, FiMessageCircle, FiInfo, FiExternalLink, FiChevronDown, FiInstagram, FiFacebook } from "react-icons/fi";
import { useState } from "react";

const faqs = [
    {
        q: "Come si gioca a FantArte?",
        a: "È semplice! Crea la tua squadra scegliendo 5 membri: 1 Presentatore, 1 Ospite e 3 Artisti. Hai a disposizione 100 Armoni. Ogni membro guadagnerà punti in base alle sue performance reali durante l'evento della Piazza dell'Arte."
    },
    {
        q: "Chi raddoppia i punti?",
        a: "Il Capitano della tua squadra raddoppia esclusivamente i 'Punti Speciali'. I Bonus e i Malus standard vengono conteggiati normalmente."
    },
    {
        q: "Posso cambiare squadra dopo l'inizio?",
        a: "No, una volta scaduta la deadline (il conto alla rovescia in home page), le formazioni sono congelate per tutta la durata dell'evento."
    },
    {
        q: "Cosa sono gli Armoni?",
        a: "Gli Armoni sono la valuta virtuale di FantArte. Ogni artista ha un costo in Armoni basato sulla sua popolarità e potenziale performance. Non puoi spendere più di 100 Armoni in totale."
    },
    {
        q: "Chi gestisce il gioco?",
        a: "FantArte è un progetto nato dalla collaborazione tra l'Associazione Morgana e l'Associazione Orume per animare la Piazza dell'Arte."
    }
];

export default function SupportPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-4xl mx-auto">
                
                <header className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                    >
                        FAQ & <span className="text-oro">Supporto</span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg">Hai dubbi o bisogno di aiuto? Siamo qui per te.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* FAQ Section */}
                    <section className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <FiInfo className="text-oro" /> Domande Frequenti
                        </h2>
                        
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="bg-[#131d36] border border-gray-800 rounded-2xl overflow-hidden transition-all"
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold pr-4">{faq.q}</span>
                                    <FiChevronDown className={`shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                                </button>
                                {openIndex === index && (
                                    <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800/50">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* Contact Section */}
                    <aside className="space-y-8">
                        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 rounded-3xl border border-oro/20 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <FiMessageCircle className="text-oro" /> Contattaci
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Associazione Morgana</p>
                                    <a href="mailto:associazione.morgana@gmail.com" className="flex items-center gap-2 text-oro hover:underline truncate">
                                        <FiMail size={14} /> associazione.morgana@gmail.com
                                    </a>
                                </div>
                                
                                <div className="space-y-2 border-t border-gray-800 pt-6">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Associazione Orume</p>
                                    <a href="mailto:orum.unime@gmail.com" className="flex items-center gap-2 text-oro hover:underline truncate">
                                        <FiMail size={14} /> orum.unime@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800">
                            <h2 className="text-xl font-bold mb-6">Social</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Morgana</p>
                                    <div className="flex gap-4">
                                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:text-oro transition-colors"><FiInstagram size={20} /></a>
                                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:text-oro transition-colors"><FiFacebook size={20} /></a>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Orume</p>
                                    <div className="flex gap-4">
                                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:text-oro transition-colors"><FiInstagram size={20} /></a>
                                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:text-oro transition-colors"><FiFacebook size={20} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>
        </main>
    );
}
