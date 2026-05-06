"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiStar, FiTrendingUp, FiAward, FiArrowLeft, FiSearch, FiPlus } from "react-icons/fi";
import Link from "next/link";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    type: "ARTISTA" | "PRESENTATORE" | "OSPITE";
    totalScore: number;
};

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

export default function ArtistsPage() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredArtists = artists.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    const presentatori = filteredArtists.filter(a => a.type === "PRESENTATORE");
    const ospiti = filteredArtists.filter(a => a.type === "OSPITE");
    const concorrenti = filteredArtists.filter(a => a.type === "ARTISTA");

    return (
        <main className="min-h-screen text-white pb-32">

            <div className="relative z-10 pt-32 px-6">
                {/* Header Section */}
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

                        {/* Search Bar */}
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

                {loading ? (
                    <div className="max-w-7xl mx-auto flex items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-oro/20 border-t-oro rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-32">
                        
                        {/* PRESENTATORI */}
                        {presentatori.length > 0 && (
                            <section>
                                <div className="flex items-end justify-between mb-12 px-2">
                                    <div>
                                        <p className="text-oro text-[10px] font-black uppercase tracking-[0.4em] mb-4">La Voce della Piazza</p>
                                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Presentatori</h2>
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-oro/50 to-transparent mx-12 hidden md:block" />
                                    <div className="text-gray-600 font-mono text-sm hidden md:block">0{presentatori.length}</div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                                    {presentatori.map((a, idx) => (
                                        <ArtistCard key={a.id} artist={a} index={idx} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* OSPITI */}
                        {ospiti.length > 0 && (
                            <section>
                                <div className="flex items-end justify-between mb-12 px-2">
                                    <div>
                                        <p className="text-viola text-[10px] font-black uppercase tracking-[0.4em] mb-4">Special Guest</p>
                                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Ospiti</h2>
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-viola/50 to-transparent mx-12 hidden md:block" />
                                    <div className="text-gray-600 font-mono text-sm hidden md:block">0{ospiti.length}</div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                                    {ospiti.map((a, idx) => (
                                        <ArtistCard key={a.id} artist={a} index={idx} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ARTISTI */}
                        {concorrenti.length > 0 && (
                            <section>
                                <div className="flex items-end justify-between mb-12 px-2">
                                    <div>
                                        <p className="text-ocra text-[10px] font-black uppercase tracking-[0.4em] mb-4">Cuore della Gara</p>
                                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Artisti in Gara</h2>
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-ocra/50 to-transparent mx-12 hidden md:block" />
                                    <div className="text-gray-600 font-mono text-sm hidden md:block">{concorrenti.length}</div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                                    {concorrenti.map((a, idx) => (
                                        <ArtistCard key={a.id} artist={a} index={idx} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {filteredArtists.length === 0 && (
                            <div className="text-center py-40">
                                <p className="text-gray-500 font-black uppercase tracking-widest italic">Nessun artista trovato con questo nome.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
    return (
        <div className="group relative">
            <div className="glass rounded-3xl md:rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-oro/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden">
                    {artist.image ? (
                        <img 
                            src={artist.image} 
                            alt={artist.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#0a0f1c] flex items-center justify-center text-gray-800">
                            <FiUsers size={64} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-blunotte via-transparent to-transparent opacity-60" />
                    
                    {/* Floating Stats */}
                    <div className="absolute top-3 right-3 md:top-6 md:right-6 flex flex-col gap-2">
                        <div className="bg-oro px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 shadow-xl">
                            <span className="text-[8px] md:text-[10px] font-black text-blunotte uppercase tracking-widest">{artist.cost}</span>
                            <span className="text-[6px] md:text-[8px] font-bold text-blunotte/70 uppercase tracking-widest">Armoni</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                        <h3 className="text-xl md:text-2xl font-black mb-6 group-hover:text-oro transition-colors whitespace-normal leading-tight">
                            {artist.name}
                        </h3>
                    </div>
                </div>

                {/* Info Section */}
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
        </div>
    );
}
