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
      
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-viola opacity-[0.08] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-oro opacity-[0.05] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 pb-20">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="w-full max-w-7xl flex flex-col items-center text-center"
          >
            <motion.div variants={fadeIn} className="mb-8 relative">
              <div className="absolute inset-0 bg-oro blur-3xl opacity-20 scale-150" />
              <Image 
                src="/fanta-logo.png" 
                alt="FantArte Logo" 
                width={380} 
                height={150} 
                className="relative drop-shadow-2xl animate-float"
                priority
              />
            </motion.div>

            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-oro/20 text-oro text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <span className="w-2 h-2 rounded-full bg-oro animate-pulse" />
              L&apos;Arte ha un nuovo Campo da Gioco
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12">
              Domina la <br />
              <span className="text-oro drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">Piazza.</span>
            </motion.h1>

            <motion.div variants={fadeIn} className="w-full max-w-3xl glass-oro p-12 rounded-[3rem] border border-oro/10 shadow-3xl mb-16 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-oro opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
               <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs mb-8">Inizio della Gara</p>
               <CountdownTimer targetDate="2026-05-18T18:00:00" />
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6">
              <Link href="/team/create" className="px-12 py-6 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-2xl text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all">
                Crea la tua Squadra
              </Link>
              <Link href="/supporto" className="px-12 py-6 glass hover:bg-white/5 rounded-2xl text-xl font-bold uppercase tracking-widest transition-all">
                Come si Gioca
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento Revolution Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Box 1: Stats */}
            <motion.div variants={fadeIn} className="md:col-span-2 glass p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
              <FiTrendingUp className="text-oro text-5xl mb-8 group-hover:scale-110 transition-transform" />
              <h2 className="text-4xl font-black tracking-tight mb-4">Scali la <span className="text-oro">Gloria.</span></h2>
              <p className="text-gray-400 text-lg max-w-md">Accumula punti in base alle performance degli artisti sul palco. Bonus speciali per i Capitani e Malus inaspettati rendono ogni serata un&apos;incognita.</p>
              <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                 <FiAward size={300} />
              </div>
            </motion.div>

            {/* Box 2: Team */}
            <motion.div variants={fadeIn} className="glass p-12 rounded-[3.5rem] border border-white/5 flex flex-col justify-between group">
              <div>
                <FiUsers className="text-viola text-5xl mb-8 group-hover:scale-110 transition-transform" />
                <h2 className="text-4xl font-black tracking-tight mb-4">Il tuo <br />Quintetto.</h2>
              </div>
              <Link href="/team/create" className="flex items-center gap-3 text-oro font-black uppercase tracking-widest group/link">
                Fonda il Team <FiArrowRight className="group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </motion.div>

            {/* Box 3: Social/Community */}
            <motion.div variants={fadeIn} className="glass p-12 rounded-[3.5rem] border border-white/5 group relative overflow-hidden">
               <FiMessageCircle className="text-ocra text-5xl mb-8 group-hover:scale-110 transition-transform" />
               <h2 className="text-4xl font-black tracking-tight mb-4">Unisciti alla <span className="text-ocra">Piazza.</span></h2>
               <p className="text-gray-400">Segui le associazioni Morgana e Orume per aggiornamenti in tempo reale sui punteggi.</p>
               <div className="flex gap-4 mt-8">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">IG</div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">FB</div>
               </div>
            </motion.div>

            {/* Box 4: FAQ */}
            <motion.div variants={fadeIn} className="md:col-span-2 glass p-12 rounded-[3.5rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
               <div className="flex items-center gap-8">
                  <FiInfo className="text-oro text-5xl" />
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Hai domande?</h2>
                    <p className="text-gray-400">Abbiamo preparato una guida completa per te.</p>
                  </div>
               </div>
               <Link href="/supporto" className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-oro group-hover:text-blunotte transition-all">
                  <FiArrowRight size={24} />
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
                    {sponsors.map((p) => (
                      <div 
                        key={`s-${setIndex}-${p.id}`}
                        className="glass w-72 h-32 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 grayscale hover:grayscale-0 transition-all cursor-pointer hover:border-oro/20 shrink-0"
                      >
                        <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
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
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Official Partner</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlays per sfumare i lati */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blunotte to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blunotte to-transparent z-10 pointer-events-none" />
          </section>
        )}

        {/* Marquee Revolution */}
        <section className="py-20 bg-oro/5 border-y border-oro/10 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-6xl md:text-8xl font-black uppercase tracking-tighter mx-10 text-white/10">
                Piazza dell&apos;Arte <span className="text-oro/20">•</span> FantArte <span className="text-oro/20">•</span>
              </span>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
