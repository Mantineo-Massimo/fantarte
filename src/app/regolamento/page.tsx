"use client";

import { useState, useEffect } from "react";
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiFilter, FiActivity, FiStar, FiSlash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type RuleCategory = "Tutte" | "Canto" | "Danza" | "Tematici" | "Piazza" | "Malus" | "Finale";

type Rule = {
    id: string;
    category: RuleCategory;
    title: string;
    description: string;
    points: number;
};

const categories: RuleCategory[] = ["Tutte", "Canto", "Danza", "Tematici", "Piazza", "Malus", "Finale"];

export default function RegolamentoPage() {
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

    const getRulePointsStyle = (points: number) => {
        if (points >= 50) return "text-oro border-oro/30 bg-oro/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]";
        if (points > 0) return "text-green-400 border-green-400/20 bg-green-400/5";
        return "text-red-400 border-red-400/20 bg-red-400/5";
    };

    const getIconForCategory = (category: string) => {
        if (category === "Malus") return <FiSlash className="text-red-500" size={24} />;
        if (category === "Finale") return <FiStar className="text-oro" size={24} />;
        return <FiActivity className="text-oro" size={24} />;
    };

    return (
        <main className="min-h-screen pt-44 pb-32 selection:bg-oro/30">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <header className="text-center mb-24 space-y-6">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-oro font-black uppercase tracking-[0.5em] text-[10px]"
                    >
                        Manuale d&apos;Istruzioni
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter"
                    >
                        Il <span className="text-gradient-oro">Codice</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                        Scopri le dinamiche che regolano la Piazza dell&apos;Arte. Dalla creazione del team al calcolo dei bonus: tutto l&apos;occorrente per la vittoria.
                    </p>
                </header>

                {/* Info Card - Come Funziona */}
                <section className="mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass p-10 md:p-16 rounded-[4rem] border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-oro/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-oro/10 transition-colors"></div>
                        
                        <div className="flex flex-col md:flex-row gap-16 relative z-10">
                            <div className="md:w-1/3 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-oro/10 flex items-center justify-center text-oro border border-oro/20 shadow-lg">
                                    <FiInfo size={32} />
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Linee <br /> <span className="text-oro">Guida</span></h2>
                                <div className="h-1 w-20 bg-oro/20"></div>
                            </div>

                            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-oro uppercase tracking-widest">Entry</span>
                                    <p className="text-gray-300 font-light leading-relaxed">
                                        Ogni partecipante inizia con un capitale di <strong>100 Armoni</strong> per ingaggiare il proprio quintetto d&apos;elite.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-oro uppercase tracking-widest">Strategy</span>
                                    <p className="text-gray-300 font-light leading-relaxed">
                                        Il punteggio finale della squadra è il riflesso delle performance reali degli artisti durante ogni evento live.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-oro uppercase tracking-widest">Flexibility</span>
                                    <p className="text-gray-300 font-light leading-relaxed">
                                        Libera modifica del team fino al gong finale delle iscrizioni. Sperimenta tattiche diverse.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-oro uppercase tracking-widest">Culture</span>
                                    <p className="text-gray-300 font-light leading-relaxed">
                                        Partecipazione totalmente gratuita. I premi celebrano il merito artistico e la cultura universitaria.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Rules Section */}
                <section className="space-y-16">
                    <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <span className="text-oro font-black uppercase tracking-[0.4em] text-[10px]">Database Eventi</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Legenda <span className="text-gradient-oro">Bonus & Malus</span></h2>
                        </div>
                        
                        {/* Categories Filter */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                                        activeFilter === cat 
                                        ? "bg-oro text-blunotte border-oro shadow-[0_10px_20px_rgba(255,215,0,0.2)]" 
                                        : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="w-12 h-12 border-t-2 border-oro rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Accesso alla pergamena...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredRules.map((rule, idx) => (
                                    <motion.div
                                        key={rule.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="glass p-8 rounded-[2.5rem] border-white/5 flex items-start gap-6 hover:border-white/20 transition-all hover:-translate-y-1 group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-oro/10 group-hover:border-oro/20 transition-colors">
                                            {getIconForCategory(rule.category)}
                                        </div>
                                        
                                        <div className="flex-grow space-y-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-black group-hover:text-oro transition-colors leading-tight">{rule.title}</h3>
                                                <span className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-white/5 rounded-md text-white/30">{rule.category}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm font-light leading-relaxed">{rule.description}</p>
                                        </div>

                                        <div className={`px-4 py-2 rounded-xl text-xl font-black border flex items-center justify-center shrink-0 ${getRulePointsStyle(rule.points)}`}>
                                            {rule.points > 0 ? `+${rule.points}` : rule.points}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>

                {/* Legal Footer Section */}
                <footer className="mt-44 pt-24 border-t border-white/5">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="glass bg-white/[0.01] p-12 md:p-20 rounded-[3.5rem] border-white/5 flex flex-col md:flex-row gap-20 items-start shadow-3xl"
                    >
                        <div className="md:w-1/3">
                            <span className="text-oro font-black uppercase tracking-[0.5em] text-[10px] block mb-4">Legal Framework</span>
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Note <br /> <span className="text-white/40">Istituzionali</span></h3>
                            <div className="w-12 h-1 bg-oro/20"></div>
                        </div>

                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm font-light text-gray-500 leading-relaxed">
                            <div className="space-y-4">
                                <p>
                                    L&apos;iniziativa Fantarte è ufficialmente promossa dall&apos;<strong>Associazione Universitaria MORGANA</strong> (C.F. 97103490831), con radici profonde nell&apos;Ateneo messinese.
                                </p>
                                <p>
                                    Basata sull&apos; <strong>Art. 6, comma 1, lett. d) del DPR 430/2001</strong>, la competizione punta esclusivamente alla valorizzazione del merito artistico e culturale.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p>
                                    Ogni riconoscimento è fornito da partner etici ed esterni sotto forma di esperienze educative e culturali, prive di valore monetario diretto. 
                                </p>
                                <p className="text-[10px] uppercase font-black tracking-widest pt-4">
                                    Release 2.0 Fortress &bull; {new Date().toLocaleDateString('it-IT')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </footer>
            </div>
        </main>
    );
}
