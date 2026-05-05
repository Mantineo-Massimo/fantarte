"use client";

import { useState, useEffect } from "react";
import { 
    FiInfo, FiCheckCircle, FiAlertTriangle, FiFilter, 
    FiArrowLeft, FiStar, FiZap, FiTarget, FiHelpCircle, FiUsers
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type RuleCategory = "Tutte" | "BONUS" | "MALUS" | "SPECIALE";

type Rule = {
    id: string;
    category: RuleCategory;
    title: string;
    description: string;
    points: number;
};

const categories: RuleCategory[] = ["Tutte", "BONUS", "SPECIALE", "MALUS"];

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export default function RegolePage() {
    const [rulesData, setRulesData] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<RuleCategory>("Tutte");

    useEffect(() => {
        fetch("/api/rules")
            .then(res => res.json())
            .then(data => {
                setRulesData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredRules = rulesData.filter(rule =>
        activeFilter === "Tutte" ? true : rule.category === activeFilter
    );

    const getRuleColor = (category: string) => {
        if (category === "SPECIALE") return "text-oro bg-oro/10 border-oro/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]";
        if (category === "BONUS") return "text-green-400 bg-green-500/10 border-green-500/20";
        if (category === "MALUS") return "text-red-500 bg-red-500/10 border-red-500/20";
        return "text-gray-400 bg-white/5 border-white/10";
    };

    return (
        <main className="min-h-screen text-white bg-blunotte relative overflow-hidden">
            {/* Background Cinematic Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-viola opacity-[0.05] blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-oro opacity-[0.03] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative z-10 pt-32 md:pt-44 px-6 pb-32">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="text-center mb-24">
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <Link href="/" className="inline-flex items-center gap-2 text-oro hover:text-white transition-colors font-black uppercase tracking-[0.3em] text-[10px]">
                                <FiArrowLeft /> Torna alla Home
                            </Link>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none"
                        >
                            Le <span className="text-oro drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">Regole</span> <br />
                            della Piazza
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                            Tutto quello che devi sapere per scalare la classifica di FantArte e conquistare la gloria.
                        </motion.p>
                    </div>

                    {/* Step by Step Guide */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        <StepCard 
                            icon={FiUsers} 
                            step="01" 
                            title="Iscrizione" 
                            text="Crea il tuo account e ricevi subito 100 Armoni, la valuta ufficiale della Piazza dell'Arte."
                            color="oro"
                        />
                        <StepCard 
                            icon={FiZap} 
                            step="02" 
                            title="Formazione" 
                            text="Scegli i tuoi 5 artisti preferiti. Ogni artista ha un costo: gestisci il tuo budget con saggezza."
                            color="viola"
                        />
                        <StepCard 
                            icon={FiTarget} 
                            step="03" 
                            title="Competizione" 
                            text="Guarda le serate live! I tuoi artisti accumuleranno punti in base a ciò che faranno sul palco."
                            color="ocra"
                        />
                    </div>

                    {/* Rules Grid Section */}
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Bonus & <span className="text-oro">Malus</span></h2>
                            <p className="text-gray-500 font-medium max-w-md">Consulta la legenda ufficiale dei punteggi assegnati durante le performance.</p>
                        </div>
                        
                        {/* Filter Bar */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeFilter === cat 
                                        ? "bg-oro text-blunotte shadow-[0_0_20px_rgba(255,215,0,0.3)]" 
                                        : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {cat === "SPECIALE" ? "Speciali" : cat === "BONUS" ? "Bonus" : cat === "MALUS" ? "Malus" : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rules List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <div className="w-10 h-10 border-4 border-oro/20 border-t-oro rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {filteredRules.map((rule, idx) => (
                                    <motion.div
                                        key={rule.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`glass p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${getRuleColor(rule.category)}`}
                                    >
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5 text-gray-400">
                                                        {rule.category}
                                                    </span>
                                                    <h3 className="text-lg font-black tracking-tight text-white">{rule.title}</h3>
                                                </div>
                                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{rule.description}</p>
                                            </div>
                                            <div className="text-2xl font-black font-mono shrink-0">
                                                {rule.points > 0 ? `+${rule.points}` : rule.points}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* FAQ Quick Link */}
                    <div className="mt-32">
                        <Link href="/supporto" className="group block glass p-12 rounded-[3rem] border border-white/5 hover:border-oro/20 transition-all overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-oro opacity-[0.02] blur-3xl group-hover:opacity-10 transition-opacity" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-3xl bg-oro/10 border border-oro/20 flex items-center justify-center text-oro shrink-0">
                                        <FiHelpCircle size={40} />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl font-black tracking-tighter mb-2">Ancora dubbi?</h3>
                                        <p className="text-gray-500 font-medium">Consulta la nostra area di supporto completa per ogni dettaglio tecnico.</p>
                                    </div>
                                </div>
                                <div className="px-10 py-5 bg-white/5 rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-oro group-hover:text-blunotte transition-all">
                                    Vai al Supporto
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}

function StepCard({ icon: Icon, step, title, text, color }: { icon: any, step: string, title: string, text: string, color: string }) {
    const colorClass = color === "oro" ? "text-oro border-oro/20 bg-oro/5" : color === "viola" ? "text-viola border-viola/20 bg-viola/5" : "text-ocra border-ocra/20 bg-ocra/5";
    
    return (
        <motion.div 
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="glass p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-white/10 transition-all"
        >
            <div className="absolute top-8 right-10 font-mono text-4xl font-black opacity-10 group-hover:opacity-20 transition-opacity">{step}</div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${colorClass}`}>
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-4">{title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
        </motion.div>
    );
}
