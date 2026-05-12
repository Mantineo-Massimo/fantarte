"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiAlertCircle } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APPLICATION_ERROR:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-6 relative overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 text-center space-y-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mb-8 border border-red-500/30">
            <FiAlertCircle size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Ops! Qualcosa è <span className="text-red-500">Andato Storto</span></h2>
          <p className="text-gray-400 text-lg">
            Si è verificato un errore imprevisto durante lo spettacolo. Non preoccuparti, i nostri tecnici sono già al lavoro.
          </p>
        </motion.div>

        <div className="pt-8">
            <button
                onClick={() => reset()}
                className="w-full sm:w-auto px-10 py-5 bg-white text-blunotte font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-oro transition-all shadow-2xl"
            >
                <FiRefreshCw size={20} />
                Ricarica la Scena
            </button>
        </div>
        
        {error.digest && (
            <p className="text-[10px] font-mono text-gray-700 tracking-widest uppercase">ID Errore: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
