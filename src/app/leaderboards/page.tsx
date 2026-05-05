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
            
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-viola opacity-[0.05] rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-oro opacity-[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div initial="initial" animate="animate" variants={fadeIn} className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Classifiche <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Globali</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Piazza dell&apos;Arte • FantArte 2026</p>
                </motion.div>

                {/* Switcher Revolution */}
                <div className="flex justify-center mb-20">
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
            <h3 className={`text-2xl font-black mb-2 ${rank === 1 ? "text-oro" : "text-white"}`}>{name}</h3>
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
                <h4 className="font-black text-xl group-hover:text-oro transition-colors">{name}</h4>
            </div>
            <div className="text-right">
                <p className="font-black text-2xl tracking-tighter">{score}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Punteggio Totale</p>
            </div>
        </motion.div>
    );
}

function TeamModal({ teamResult, onClose, onArtistClick }: { teamResult: TeamResult, onClose: () => void, onArtistClick: (a: Artist) => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-xl glass p-12 rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-oro opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex justify-between items-start mb-12">
                    <div className="flex gap-6 items-center">
                         <div className="w-24 h-24 rounded-[30px] bg-black border-2 border-oro/30 overflow-hidden">
                            {teamResult.team.image ? <img src={teamResult.team.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-gray-800">T</div>}
                         </div>
                         <div>
                            <h2 className="text-4xl font-black text-oro mb-2">{teamResult.team.name}</h2>
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                               <FiTrendingUp className="text-oro" /> Rank #{teamResult.score > 0 ? "Competitor" : "New Entry"}
                            </div>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all"><FiX size={24} /></button>
                </div>

                <div className="space-y-4 mb-12">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Membri della Squadra</p>
                    <div className="grid grid-cols-1 gap-3">
                        {teamResult.team.artists.map(a => (
                            <div 
                                key={a.id} 
                                onClick={() => onArtistClick(a)}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-oro/30 cursor-pointer transition-all group/art"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 overflow-hidden">
                                        {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm group-hover/art:text-oro transition-colors">{a.name}</p>
                                        <div className="flex gap-2">
                                            {teamResult.team.captainId === a.id && <span className="text-[8px] bg-oro text-blunotte font-black px-1.5 py-0.5 rounded-md uppercase">Capitano</span>}
                                        </div>
                                    </div>
                                </div>
                                <span className="font-black text-xl text-oro/60">{a.totalScore}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Punteggio Totale</p>
                        <p className="text-4xl font-black tracking-tighter text-oro">{teamResult.score}</p>
                    </div>
                    <div className="flex gap-4">
                         <SocialShare url={`${window.location.origin}/leaderboards`} title={`La squadra ${teamResult.team.name} spacca su FantArte! 🎠`} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ArtistModal({ artist, onClose, loading }: { artist: Artist, onClose: () => void, loading: boolean }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }} 
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="relative w-full max-w-md glass p-12 rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden"
            >
                <div className="flex justify-between items-start mb-12">
                    <div className="flex gap-6 items-center">
                         <div className="w-20 h-20 rounded-[25px] bg-black border-2 border-oro/30 overflow-hidden">
                            {artist.image ? <img src={artist.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-gray-800">A</div>}
                         </div>
                         <div>
                            <h2 className="text-3xl font-black text-oro mb-1">{artist.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cronologia Eventi</p>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all"><FiX size={24} /></button>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar mb-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <FiZap className="animate-bounce text-oro mb-4" size={32} />
                            <p className="text-xs font-black uppercase tracking-widest">Sincronizzando Punti...</p>
                        </div>
                    ) : artist.events && artist.events.length > 0 ? (
                        artist.events.map(ev => (
                            <div key={ev.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white/80 mb-1">{ev.description}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{new Date(ev.createdAt).toLocaleDateString('it-IT')}</p>
                                </div>
                                <span className={`text-xl font-black ${ev.points >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {ev.points > 0 ? `+${ev.points}` : ev.points}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-20 text-gray-600 italic">Nessun evento registrato.</p>
                    )}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bilancio Finale</p>
                    <p className="text-4xl font-black tracking-tighter text-oro">{artist.totalScore} pt</p>
                </div>
            </motion.div>
        </div>
    );
}
