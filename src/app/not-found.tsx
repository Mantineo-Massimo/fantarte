"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-oro/10 blur-[120px] rounded-full" />
            
            <div className="relative z-10 text-center space-y-8 max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[12rem] font-black leading-none tracking-tighter text-white/5 select-none">404</h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Pagina <span className="text-oro">Smarrita</span></h2>
                    </div>
                </motion.div>

                <p className="text-gray-400 text-lg">
                    L&apos;artista che stai cercando è uscito di scena o non è mai salito sul palco. Torna alla Piazza dell&apos;Arte per continuare lo spettacolo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link 
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-oro text-blunotte font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                    >
                        <FiHome size={20} />
                        Torna in Home
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                    >
                        <FiArrowLeft size={20} />
                        Pagina Precedente
                    </button>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-12 left-0 w-full text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">FantArte • 2026</p>
            </div>
        </main>
    );
}
