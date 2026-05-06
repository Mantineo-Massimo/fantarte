"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-blunotte flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-oro/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative flex flex-col items-center">
        {/* Pulsing Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1, 0.98]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-12"
        >
          <Image
            src="/fanta-logo.png"
            alt="FantArte Loading"
            width={240}
            height={90}
            className="h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          />
        </motion.div>

        {/* Elegant Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-oro border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]"
          />
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-oro text-[10px] font-black uppercase tracking-[0.5em] animate-pulse"
        >
          Sincronizzazione Cast...
        </motion.p>
      </div>

      {/* Decorative CRT-like scanlines (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
