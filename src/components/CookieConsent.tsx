"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiShield, FiX, FiCheck } from "react-icons/fi";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-2xl"
                >
                    <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-oro/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="w-16 h-16 rounded-2xl bg-oro/10 flex items-center justify-center shrink-0 border border-oro/20 text-oro">
                            <FiShield size={32} />
                        </div>

                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-black tracking-tighter text-white uppercase">Esperienza Personalizzata</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Utilizziamo i cookie per migliorare la tua esperienza nella Piazza dell&apos;Arte. 
                                Continuando a navigare, accetti la nostra <Link href="/privacy" className="text-oro hover:underline font-bold">Privacy Policy</Link> e l&apos;uso dei cookie.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={declineCookies}
                                className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Rifiuta
                            </button>
                            <button
                                onClick={acceptCookies}
                                className="px-8 py-4 rounded-2xl bg-oro text-blunotte font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_10px_30px_rgba(255,215,0,0.2)] flex items-center justify-center gap-2"
                            >
                                <FiCheck size={16} />
                                Accetta Tutto
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
