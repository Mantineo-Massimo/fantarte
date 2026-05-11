"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiSearch, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    type: "ARTISTA" | "PRESENTATORE" | "OSPITE";
    totalScore: number;
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export default function ArtistsContent({ initialArtists }: { initialArtists: Artist[] }) {
    const [search, setSearch] = useState("");

    const filteredArtists = initialArtists.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    const presentatori = filteredArtists.filter(a => a.type === "PRESENTATORE");
    const ospiti = filteredArtists.filter(a => a.type === "OSPITE");
    const concorrenti = filteredArtists.filter(a => a.type === "ARTISTA");

    return (
        <main className="min-h-screen text-white pb-32">
            <div className="relative z-10 pt-32 px-6">
                <header className="max-w-7xl mx-auto mb-20">
                    <motion.div initial="initial" animate="animate" variants={stagger} className="flex flex-col items-center text-center">
                        <div className="mb-6">
                            <Link href="/" className="inline-flex items-center gap-2 text-oro hover:text-white transition-colors font-black uppercase tracking-[0.3em] text-[10px]">
                                <FiArrowLeft /> Torna alla Home
                            </Link>
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                            Il Cast <br />
                            <span className="text-oro drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">Rivoluzionario</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium mb-12">
                            Scopri i protagonisti della Piazza dell&apos;Arte. Scegli saggiamente il tuo quintetto per dominare la classifica.
                        </p>

                        <div className="w-full max-w-xl relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-oro transition-colors">
                                <FiSearch size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cerca un artista..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-oro/50 transition-all backdrop-blur-xl shadow-2xl group-hover:bg-white/10"
                            />
                        </div>
                    </motion.div>
                </header>

                <div className="max-w-7xl mx-auto space-y-32">
                    {presentatori.length > 0 && (
                        <section>
                            <div className="flex items-end justify-between mb-12 px-2">
                                <div>
                                    <p className="text-oro text-[10px] font-black uppercase tracking-[0.4em] mb-4">La Voce della Piazza</p>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Presentatori</h2>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-oro/50 to-transparent mx-12 hidden md:block" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
                                {presentatori.map((a, idx) => (
                                    <ArtistCard key={a.id} artist={a} index={idx} />
                                ))}
                            </div>
                        </section>
                    )}

                    {ospiti.length > 0 && (
                        <section>
                            <div className="flex items-end justify-between mb-12 px-2">
                                <div>
                                    <p className="text-viola text-[10px] font-black uppercase tracking-[0.4em] mb-4">Special Guest</p>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Ospiti</h2>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-viola/50 to-transparent mx-12 hidden md:block" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
                                {ospiti.map((a, idx) => (
                                    <ArtistCard key={a.id} artist={a} index={idx} />
                                ))}
                            </div>
                        </section>
                    )}

                    {concorrenti.length > 0 && (
                        <section>
                            <div className="flex items-end justify-between mb-12 px-2">
                                <div>
                                    <p className="text-ocra text-[10px] font-black uppercase tracking-[0.4em] mb-4">Cuore della Gara</p>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Artisti</h2>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-ocra/50 to-transparent mx-12 hidden md:block" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
                                {concorrenti.map((a, idx) => (
                                    <ArtistCard key={a.id} artist={a} index={idx} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 4) * 0.05 }}
            className="group relative"
        >
            <div className="bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-oro/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full flex flex-col backdrop-blur-sm">
                <div className="relative aspect-square overflow-hidden bg-black">
                    {artist.image ? (
                        <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-800">
                            <FiUsers size={64} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-blunotte via-transparent to-transparent opacity-60" />

                    <div className="absolute top-3 right-3 md:top-6 md:right-6">
                        <div className="bg-oro px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                            <span className="text-[8px] md:text-[10px] font-black text-blunotte uppercase tracking-widest">{artist.cost}</span>
                            <span className="text-[6px] md:text-[8px] font-bold text-blunotte/70 uppercase tracking-widest">Armoni</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                        <h3 className="text-xl md:text-2xl font-black mb-1 group-hover:text-oro transition-colors leading-tight">
                            {artist.name}
                        </h3>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex flex-col justify-between flex-1">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Ruolo</span>
                            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">{artist.type}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Score</span>
                            <span className="text-lg md:text-xl font-black text-oro font-mono">{artist.totalScore}</span>
                        </div>
                    </div>

                    <Link
                        href={`/team/create`}
                        className="w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-oro group-hover:text-blunotte transition-all"
                    >
                        Aggiungi al Team
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
