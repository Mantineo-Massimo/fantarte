"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUsers, FiStar, FiTrendingUp, FiAward, FiArrowRight, FiInfo, FiMessageCircle } from "react-icons/fi";
import CountdownTimer from "@/components/CountdownTimer";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sponsors")
      .then(res => res.json())
      .then(data => setSponsors(data))
      .catch(err => console.error("Failed to load sponsors", err));
  }, []);

  return (
    <main className="min-h-screen text-white overflow-hidden">


      <div className="relative z-10">

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 pb-20 relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-oro/5 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="w-full max-w-7xl flex flex-col items-center text-center relative z-10"
          >
            <motion.div variants={fadeIn} className="mb-10 relative">
              <div className="absolute inset-0 bg-oro blur-[100px] opacity-10 scale-150 animate-pulse-soft" />
              <Image
                src="/fanta-logo.png"
                alt="FantArte Logo"
                width={320}
                height={120}
                className="relative drop-shadow-2xl animate-float"
                priority
              />
            </motion.div>

            <motion.div variants={fadeIn} className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/10 text-oro text-[11px] font-bold uppercase tracking-[0.4em] mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-oro shadow-[0_0_10px_#FFD700] animate-pulse" />
              L&apos;Arte ha un nuovo Campo da Gioco
            </motion.div>

            <motion.h1 variants={fadeIn} className="font-display text-4xl sm:text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-14 uppercase text-center">
              Domina la <br />
              <span className="text-oro text-glow">Piazza</span>
            </motion.h1>

            <motion.div variants={fadeIn} className="w-full max-w-2xl glass-oro p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-3xl mb-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-oro opacity-[0.02] blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-5 transition-opacity" />
              <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-10">Inizio della Gara</p>
              <CountdownTimer targetDate="2026-05-18T18:00:00" />
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4 sm:px-0">
              <Link href="/team/create" className="px-10 md:px-14 py-5 md:py-6 bg-oro text-blunotte font-extrabold rounded-2xl text-lg uppercase tracking-wider shadow-[0_20px_50px_rgba(255,215,0,0.2)] hover:scale-105 hover:bg-white active:scale-95 transition-all text-center">
                Crea la tua Squadra
              </Link>
              <Link href="/regole" className="px-10 md:px-14 py-5 md:py-6 glass hover:bg-white/5 border border-white/10 rounded-2xl text-lg font-bold uppercase tracking-wider transition-all text-center">
                Come si Gioca
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Grid Section */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Box 1: Glory */}
            <motion.div variants={fadeIn} className="md:col-span-2 bento-card group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-oro/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <FiTrendingUp className="text-oro text-5xl mb-10 group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase">Scali la <span className="text-oro">Gloria.</span></h2>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">Accumula punti in base alle performance degli artisti sul palco. Bonus speciali per i Capitani e Malus inaspettati rendono ogni serata un&apos;incognita elettrizzante.</p>
              <div className="absolute -bottom-20 -right-20 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                <FiAward size={400} />
              </div>
            </motion.div>

            {/* Box 2: Team */}
            <motion.div variants={fadeIn} className="bento-card group flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-viola/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <FiUsers className="text-viola text-5xl mb-10 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase">Il tuo <br />Quintetto.</h2>
              </div>
              <Link href="/team/create" className="flex items-center gap-4 text-oro font-bold uppercase tracking-[0.2em] text-xs group/link relative z-10">
                Fonda il Team <FiArrowRight className="group-hover/link:translate-x-3 transition-transform" />
              </Link>
            </motion.div>

            {/* Box 3: Social */}
            <motion.div variants={fadeIn} className="bento-card group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ocra/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <FiMessageCircle className="text-ocra text-5xl mb-10 group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase">Unisciti alla <span className="text-ocra">Piazza</span></h2>
              <p className="text-gray-400 leading-relaxed mb-10">Segui le associazioni per aggiornamenti in tempo reale sui punteggi.</p>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-oro hover:text-blunotte hover:border-oro cursor-pointer transition-all duration-300">IG</div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-oro hover:text-blunotte hover:border-oro cursor-pointer transition-all duration-300">FB</div>
              </div>
            </motion.div>

            {/* Box 4: FAQ */}
            <motion.div variants={fadeIn} className="md:col-span-2 bento-card flex flex-col md:flex-row items-center justify-between gap-10 group cursor-pointer hover:bg-white/[0.05]">
              <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                <div className="w-20 h-20 rounded-3xl bg-oro/10 flex items-center justify-center border border-oro/20 shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <FiInfo className="text-oro text-4xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Hai domande?</h2>
                  <p className="text-gray-500 font-medium">Abbiamo preparato una guida completa per te.</p>
                </div>
              </div>
              <Link href="/regole" className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-oro group-hover:text-blunotte group-hover:border-oro transition-all duration-500 shrink-0">
                <FiArrowRight size={32} />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Sponsors & Partners Marquee */}
        {sponsors.length > 0 && (
          <section className="py-24 relative overflow-hidden group">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
              <p className="text-oro text-[10px] font-black uppercase tracking-[0.4em] mb-4">In Collaborazione Con</p>
              <h2 className="text-4xl font-black tracking-tighter">Partner & <span className="text-oro">Sponsor</span></h2>
            </div>

            <div className="flex overflow-hidden relative">
              <div className="flex animate-marquee whitespace-nowrap gap-12 py-4">
                {/* Ripetiamo la lista più volte per assicurarci che non ci siano mai buchi, anche con pochi sponsor */}
                {[...Array(6)].map((_, setIndex) => (
                  <div key={`set-${setIndex}`} className="flex gap-12">
                    {sponsors.map((p) => {
                      const SponsorContent = (
                        <div 
                          className="glass w-64 md:w-72 h-32 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 grayscale hover:grayscale-0 transition-all cursor-pointer hover:border-oro/20 shrink-0 group/sponsor"
                        >
                          <div className="w-20 h-20 relative flex items-center justify-center shrink-0 group-hover/sponsor:scale-110 transition-transform">
                            {p.logoUrl ? (
                              <img src={p.logoUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <div className="w-full h-full rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <span className="text-xl font-black text-gray-500">{p.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-black text-[11px] uppercase tracking-widest truncate text-white">{p.name}</p>
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{p.role || "Official Partner"}</p>
                          </div>
                        </div>
                      );

                      return p.linkUrl ? (
                        <a key={`s-${setIndex}-${p.id}`} href={p.linkUrl} target="_blank" rel="noopener noreferrer">
                          {SponsorContent}
                        </a>
                      ) : (
                        <div key={`s-${setIndex}-${p.id}`}>
                          {SponsorContent}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlays per sfumare i lati */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blunotte to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blunotte to-transparent z-10 pointer-events-none" />
          </section>
        )}

        {/* Decorative Marquee */}
        <section className="py-24 bg-white/[0.02] border-y border-white/5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="font-display text-7xl md:text-[10rem] font-black uppercase tracking-tighter mx-12 text-white/[0.03] select-none">
                Piazza dell&apos;Arte <span className="text-oro/10">•</span> FantArte <span className="text-oro/10">•</span>
              </span>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
