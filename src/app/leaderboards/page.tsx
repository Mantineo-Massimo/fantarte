"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiStar, FiTrendingUp, FiAward, FiX, FiCheck, FiShare2, FiZap } from "react-icons/fi";
import SocialShare from "@/components/SocialShare";
import LeaderboardSkeleton from "./Skeleton";

type ArtistEvent = {
    id: string;
    points: number;
    description: string;
    createdAt: string;
};

type Artist = {
    id: string;
    name: string;
    totalScore: number;
    image?: string;
    events?: ArtistEvent[];
};

type TeamResult = {
    score: number;
    team: {
        id: string;
        name: string;
        image?: string | null;
        artists: Artist[];
        captainId?: string | null;
    };
};

type League = {
    id: string;
    name: string;
    teams: TeamResult[];
};

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
    animate: { transition: { staggerChildren: 0.05 } }
};

export default function LeaderboardsPage() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [artistsRanking, setArtistsRanking] = useState<Artist[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [viewMode, setViewMode] = useState<"teams" | "artists">("teams");
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<TeamResult | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const handleArtistClick = async (artist: Artist) => {
        setDetailLoading(true);
        setSelectedArtist(artist);
        try {
            const res = await fetch(`/api/artists/${artist.id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedArtist(data);
            }
        } catch (err) {
            console.error("Error fetching artist details:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        Promise.all([
            fetch("/api/leaderboards").then(res => res.json()),
            fetch("/api/artists/leaderboard").then(res => res.json())
        ])
            .then(([leaguesData, artistsData]) => {
                setLeagues(leaguesData);
                setArtistsRanking(artistsData);
                if (leaguesData.length > 0) {
                    const defaultTab = leaguesData.find((l: any) => l.name === "Generale")?.name || leaguesData[0].name;
                    setActiveTab(defaultTab);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <LeaderboardSkeleton />
        </main>
    );

    const currentLeague = leagues.find(l => l.name === activeTab);
    const top3 = viewMode === "teams" ? currentLeague?.teams.slice(0, 3) || [] : artistsRanking.slice(0, 3);
    const rest = viewMode === "teams" ? currentLeague?.teams.slice(3) || [] : artistsRanking.slice(3);

    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div initial="initial" animate="animate" variants={fadeIn} className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Classifiche <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Globali</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Piazza dell&apos;Arte • FantArte 2026</p>
                </motion.div>

                {/* Switcher Revolution */}
                <div className="flex justify-center mb-32">
                    <div className="glass p-2 rounded-3xl border border-white/5 flex gap-2">
                        <button
                            onClick={() => setViewMode("teams")}
                            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === "teams" ? "bg-oro text-blunotte shadow-2xl" : "text-gray-500 hover:text-white"}`}
                        >
                            Podio Squadre
                        </button>
                        <button
                            onClick={() => setViewMode("artists")}
                            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === "artists" ? "bg-oro text-blunotte shadow-2xl" : "text-gray-500 hover:text-white"}`}
                        >
                            Top Armoni
                        </button>
                    </div>
                </div>

                {/* Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
                    {/* Rank 1 (Center on MD, First on Mobile) */}
                    {top3[0] && (
                        <div className="order-1 md:order-2">
                            <PodiumCard 
                                rank={1} 
                                data={top3[0]} 
                                type={viewMode} 
                                featured
                                onClick={() => viewMode === "teams" ? setSelectedTeam(top3[0] as TeamResult) : handleArtistClick(top3[0] as Artist)} 
                            />
                        </div>
                    )}
                    {/* Rank 2 (Left on MD, Second on Mobile) */}
                    {top3[1] && (
                        <div className="order-2 md:order-1">
                            <PodiumCard 
                                rank={2} 
                                data={top3[1]} 
                                type={viewMode} 
                                onClick={() => viewMode === "teams" ? setSelectedTeam(top3[1] as TeamResult) : handleArtistClick(top3[1] as Artist)} 
                            />
                        </div>
                    )}
                    {/* Rank 3 (Right on MD, Third on Mobile) */}
                    {top3[2] && (
                        <div className="order-3 md:order-3">
                            <PodiumCard 
                                rank={3} 
                                data={top3[2]} 
                                type={viewMode} 
                                onClick={() => viewMode === "teams" ? setSelectedTeam(top3[2] as TeamResult) : handleArtistClick(top3[2] as Artist)} 
                            />
                        </div>
                    )}
                </div>

                {/* Neo-Table Section */}
                <motion.div 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="glass rounded-[3rem] border border-white/5 overflow-hidden"
                >
                    <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Resto della Classifica</p>
                        <div className="flex gap-4">
                             <div className="w-3 h-3 rounded-full bg-oro/20" />
                             <div className="w-3 h-3 rounded-full bg-viola/20" />
                        </div>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                        {rest.map((item, index) => (
                            <RankRow 
                                key={index}
                                index={index + 4}
                                data={item}
                                type={viewMode}
                                onClick={() => viewMode === "teams" ? setSelectedTeam(item as TeamResult) : handleArtistClick(item as Artist)}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Modals are revolutionized too (via glassmorphism) */}
                <AnimatePresence>
                    {selectedTeam && (
                        <TeamModal 
                            teamResult={selectedTeam} 
                            onClose={() => setSelectedTeam(null)} 
                            onArtistClick={handleArtistClick}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedArtist && (
                        <ArtistModal 
                            artist={selectedArtist} 
                            onClose={() => setSelectedArtist(null)} 
                            loading={detailLoading}
                        />
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}

function PodiumCard({ rank, data, type, featured, onClick }: { rank: number, data: any, type: string, featured?: boolean, onClick: () => void }) {
    const isTeam = type === "teams";
    const name = isTeam ? data.team.name : data.name;
    const score = isTeam ? data.score : data.totalScore;
    const image = isTeam ? data.team.image : data.image;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            onClick={onClick}
            className={`relative glass p-10 rounded-[3.5rem] border border-white/10 flex flex-col items-center text-center cursor-pointer group hover:bg-white/5 transition-all
                ${featured ? "md:scale-110 md:-translate-y-12 z-20 shadow-[0_30px_100px_rgba(0,0,0,0.5)]" : "z-10"}
            `}
        >
            <div className={`absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center font-black shadow-2xl border-2
                ${rank === 1 ? "bg-oro text-blunotte border-oro scale-125" : "bg-white/5 text-gray-400 border-white/10"}
            `}>
                {rank}
            </div>
            <div className={`w-32 h-32 rounded-[30px] bg-black mb-6 overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105
                ${rank === 1 ? "border-oro shadow-[0_0_30px_rgba(255,215,0,0.3)]" : "border-white/10"}
            `}>
                {image ? (
                    <img src={image} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-800">{name.charAt(0)}</div>
                )}
            </div>
            <h3 className={`text-xl md:text-2xl font-black mb-2 whitespace-normal leading-tight ${rank === 1 ? "text-oro" : "text-white"}`}>{name}</h3>
            <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black tracking-tighter">{score}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Punti</span>
            </div>
        </motion.div>
    );
}

function RankRow({ index, data, type, onClick }: { index: number, data: any, type: string, onClick: () => void }) {
    const isTeam = type === "teams";
    const name = isTeam ? data.team.name : data.name;
    const score = isTeam ? data.score : data.totalScore;
    const image = isTeam ? data.team.image : data.image;

    return (
        <motion.div 
            variants={fadeIn}
            onClick={onClick}
            className="flex items-center justify-between px-10 py-6 hover:bg-white/5 transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-8">
                <span className="font-black text-gray-700 w-6">{index}</span>
                <div className="w-12 h-12 rounded-2xl bg-black overflow-hidden border border-white/10 group-hover:border-oro/40 transition-colors">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-gray-800">{name.charAt(0)}</div>
                    )}
                </div>
                <h4 className="font-black text-xl group-hover:text-oro transition-colors whitespace-normal leading-tight">{name}</h4>
            </div>
            <div className="text-right">
                <p className="font-black text-2xl tracking-tighter">{score}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Punteggio Totale</p>
            </div>
        </motion.div>
    );
}

function TeamModal({ teamResult, onClose, onArtistClick }: { teamResult: TeamResult, onClose: () => void, onArtistClick: (a: Artist) => void }) {
    const topArtist = [...teamResult.team.artists].sort((a, b) => b.totalScore - a.totalScore)[0];
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose} 
                className="absolute inset-0 bg-[#0a0f1c]/95 backdrop-blur-2xl" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 100 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 100 }}
                className="relative w-full max-w-2xl glass rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Dynamic Background Glow */}
                <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-oro/10 to-transparent pointer-events-none" />
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-oro/20 blur-[100px] rounded-full pointer-events-none" />
                
                {/* Header Section */}
                <div className="relative p-8 md:p-12 pb-6 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-oro blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-black border-2 border-oro/30 overflow-hidden relative z-10">
                            {teamResult.team.image ? (
                                <img src={teamResult.team.image} alt={teamResult.team.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-6xl text-gray-800">
                                    {teamResult.team.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-oro rounded-2xl flex items-center justify-center text-blunotte shadow-xl z-20 border-4 border-blunotte">
                            <FiAward size={24} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <p className="text-oro font-black uppercase tracking-[0.4em] text-[10px]">Squadra Ufficiale</p>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none">
                                {teamResult.team.name}
                            </h2>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <FiTrendingUp className="text-oro" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Score: <span className="text-white">{teamResult.score}</span>
                                </span>
                            </div>
                            <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <FiUsers className="text-viola" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    5 Artisti
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-3xl transition-all group"
                    >
                        <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Artists List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 pt-6 custom-scrollbar">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 ml-2">La Formazione</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {teamResult.team.artists.map((artist, idx) => {
                                    const isTop = artist.id === topArtist.id;
                                    const isCaptain = teamResult.team.captainId === artist.id;

                                    return (
                                        <motion.div 
                                            key={artist.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => onArtistClick(artist)}
                                            className={`group/art relative flex items-center justify-between p-6 rounded-[2.5rem] border transition-all cursor-pointer overflow-hidden
                                                ${isTop ? "bg-oro/5 border-oro/20" : "bg-white/5 border-white/5 hover:border-white/10"}
                                            `}
                                        >
                                            {/* Highlight Background */}
                                            {isTop && (
                                                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-oro/10 to-transparent pointer-events-none" />
                                            )}

                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="relative">
                                                    <div className={`w-16 h-16 rounded-2xl bg-black border overflow-hidden transition-transform group-hover/art:scale-110 duration-500
                                                        ${isTop ? "border-oro/50" : "border-white/10"}
                                                    `}>
                                                        {artist.image ? (
                                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-black text-2xl text-gray-800">
                                                                {artist.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isCaptain && (
                                                        <div className="absolute -top-2 -left-2 bg-oro text-blunotte text-[8px] font-black px-2 py-0.5 rounded-lg shadow-lg border-2 border-blunotte uppercase tracking-tighter">
                                                            Cap
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="min-w-0">
                                                    <h4 className={`text-xl font-black transition-colors truncate ${isTop ? "text-oro" : "text-white group-hover/art:text-oro"}`}>
                                                        {artist.name}
                                                    </h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                        Performance Artistica
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right relative z-10 shrink-0">
                                                <span className={`text-3xl font-black tracking-tighter ${isTop ? "text-oro drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "text-white/60"}`}>
                                                    {artist.totalScore}
                                                </span>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-700">Punti Accumulati</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 md:p-12 pt-8 bg-white/5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-20">
                    <div className="flex items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Top Performer</p>
                            <p className="text-white font-bold text-sm truncate max-w-[150px]">{topArtist.name}</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status Squadra</p>
                            <p className="text-green-500 font-black text-[10px] uppercase tracking-tighter italic">Verified Talent</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none">
                             <SocialShare 
                                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/leaderboards`} 
                                title={`Guarda la formazione di ${teamResult.team.name} su FantArte! 🎠`} 
                            />
                        </div>
                        <button 
                            onClick={onClose}
                            className="flex-1 md:flex-none px-8 py-4 bg-white text-blunotte font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-oro transition-all"
                        >
                            Chiudi Vista
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ArtistModal({ artist, onClose, loading }: { artist: Artist, onClose: () => void, loading: boolean }) {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose} 
                className="absolute inset-0 bg-[#0a0f1c]/90 backdrop-blur-xl" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 50 }}
                className="relative w-full max-w-md glass rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-oro/10 to-transparent pointer-events-none" />
                
                <div className="p-10 pb-6 flex justify-between items-start relative z-10">
                    <div className="flex gap-6 items-center">
                         <div className="relative group">
                             <div className="absolute inset-0 bg-oro blur-xl opacity-20" />
                             <div className="w-20 h-20 rounded-[22px] bg-black border-2 border-oro/30 overflow-hidden relative z-10">
                                {artist.image ? (
                                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-3xl text-gray-800">
                                        {artist.name.charAt(0)}
                                    </div>
                                )}
                             </div>
                         </div>
                         <div>
                            <h2 className="text-3xl font-black text-white mb-1">{artist.name}</h2>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-oro">Cronologia Eventi</p>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-3 px-10 pb-10 max-h-[400px] overflow-y-auto custom-scrollbar relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 opacity-50">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mb-6"
                            >
                                <FiZap className="text-oro" size={40} />
                            </motion.div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-oro">Sincronizzando Punti...</p>
                        </div>
                    ) : artist.events && artist.events.length > 0 ? (
                        artist.events.map((ev, idx) => (
                            <motion.div 
                                key={ev.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-5 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center gap-6 group hover:bg-white/10 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-white mb-1 group-hover:text-oro transition-colors leading-tight">{ev.description}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                                        {new Date(ev.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                                <div className={`text-xl font-black tracking-tighter shrink-0 ${ev.points >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {ev.points > 0 ? `+${ev.points}` : ev.points}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <FiStar size={48} className="mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Nessun evento registrato</p>
                        </div>
                    )}
                </div>

                <div className="p-10 pt-8 bg-white/5 border-t border-white/10 flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Bilancio Finale</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                {artist.totalScore}
                            </span>
                            <span className="text-xs font-black text-gray-600 uppercase tracking-widest">PT</span>
                        </div>
                    </div>
                    <div className="h-full">
                         <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Perform. Rate: <span className="text-white">Elite</span>
                         </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
