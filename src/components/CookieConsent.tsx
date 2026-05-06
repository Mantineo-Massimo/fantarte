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
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 right-6 z-[10000] w-[calc(100%-3rem)] max-w-lg"
                >
                    <div className="bg-[#131d36]/95 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-oro/10 flex items-center justify-center shrink-0 border border-oro/20 text-oro">
                            <FiShield size={24} />
                        </div>

                        <div className="flex-1 space-y-1">
                            <h3 className="text-sm font-black tracking-widest text-white uppercase">Cookie</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Utilizziamo i cookie per migliorare la tua esperienza. 
                                <Link href="/privacy" className="text-oro hover:underline font-bold ml-1">Privacy Policy</Link>
                            </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={acceptCookies}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-oro text-blunotte font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg"
                            >
                                Accetta
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
