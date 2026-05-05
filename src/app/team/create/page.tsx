"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import { FiUsers, FiStar, FiTrendingUp, FiHelpCircle, FiSearch, FiCheck, FiX, FiShield, FiPlus, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

type ArtistType = "ARTISTA" | "PRESENTATORE" | "OSPITE";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    type: ArtistType;
    totalScore: number;
};

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export default function CreateTeamPage() {
    const router = useRouter();
    const { status } = useSession();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
    const [teamName, setTeamName] = useState("");
    const [teamImage, setTeamImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [captainId, setCaptainId] = useState<string | null>(null);
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [teamScore, setTeamScore] = useState<number>(0);

    const [deadline, setDeadline] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    // Filter/Search
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<ArtistType | "ALL">("ALL");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error("Failed to load artists", err));

        fetch("/api/team")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.id) {
                    setIsEditing(true);
                    setTeamId(data.id);
                    setCaptainId(data.captainId || null);
                    setTeamName(data.name);
                    setTeamImage(data.image || null);
                    setSelectedArtists(data.artists || []);
                    const generale = data.leagues?.find((l: any) => l.league.name === "Generale");
                    if (generale) setTeamScore(generale.score);
                }
                setInitialFetchDone(true);
            })
            .catch(err => {
                console.error("Failed to load team", err);
                setInitialFetchDone(true);
            });

        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data?.draftDeadline) {
                    setDeadline(data.draftDeadline);
                    if (new Date() > new Date(data.draftDeadline)) {
                        setIsExpired(true);
                    }
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    useEffect(() => {
        if (!deadline) return;
        const interval = setInterval(() => {
            if (new Date() > new Date(deadline)) {
                setIsExpired(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    const spentBudget = selectedArtists.reduce((acc, curr) => acc + curr.cost, 0);
    const remainingBudget = 100 - spentBudget;

    const counts = {
        ARTISTA: selectedArtists.filter(a => a.type === "ARTISTA").length,
        PRESENTATORE: selectedArtists.filter(a => a.type === "PRESENTATORE").length,
        OSPITE: selectedArtists.filter(a => a.type === "OSPITE").length,
    };

    const toggleArtist = (artist: Artist) => {
        if (isExpired) return;

        if (selectedArtists.some(a => a.id === artist.id)) {
            setSelectedArtists(selectedArtists.filter(a => a.id !== artist.id));
            if (captainId === artist.id) setCaptainId(null);
        } else {
            if (artist.type === "PRESENTATORE" && counts.PRESENTATORE >= 1) {
                setError("Hai già un Presentatore.");
                return;
            }
            if (artist.type === "OSPITE" && counts.OSPITE >= 1) {
                setError("Hai già un Ospite.");
                return;
            }
            if (artist.type === "ARTISTA" && counts.ARTISTA >= 3) {
                setError("Massimo 3 Artisti.");
                return;
            }
            if (selectedArtists.length >= 5) {
                setError("Squadra completa.");
                return;
            }
            if (remainingBudget - artist.cost < 0) {
                setError("Armoni insufficienti.");
                return;
            }
            setError("");
            setSelectedArtists([...selectedArtists, artist]);
        }
    };

    const saveTeam = async () => {
        if (isExpired) return;
        if (counts.ARTISTA !== 3 || counts.PRESENTATORE !== 1 || counts.OSPITE !== 1) {
            setError("Composizione non valida (1-1-3).");
            return;
        }
        if (!teamName.trim()) {
            setError("Inserisci il nome del team.");
            return;
        }
        if (!captainId) {
            setError("Scegli un Capitano!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const method = isEditing ? "PUT" : "POST";
            const res = await fetch("/api/team", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName,
                    image: teamImage,
                    artistIds: selectedArtists.map(a => a.id),
                    captainId
                })
            });

            if (!res.ok) {
                setError(await res.text() || "Errore nel salvataggio.");
            } else {
                router.push("/leaderboards");
            }
        } catch {
            setError("Errore di rete.");
        } finally {
            setLoading(false);
        }
    };

    const filteredArtists = useMemo(() => {
        return artists.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === "ALL" || a.type === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [artists, searchTerm, activeFilter]);

    if (status === "loading" || !initialFetchDone) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Caricamento...</div>;

    return (
        <main className="min-h-screen text-white flex flex-col items-center pt-56 md:pt-44 pb-32 overflow-x-hidden">
            
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-viola opacity-[0.06] rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-oro opacity-[0.04] rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">
                
                {/* Hero Section Revolution */}
                <motion.header 
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center mb-24 space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-oro/20 text-oro text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        <span className="w-2 h-2 rounded-full bg-oro animate-pulse" />
                        Area Gestione Squadra
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        {isEditing ? (
                            <>Il tuo <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">Impero.</span></>
                        ) : (
                            <>Crea il tuo <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">Destino.</span></>
                        )}
                    </h1>

                    <div className="max-w-2xl mx-auto space-y-6">
                        <input
                            type="text"
                            value={teamName}
                            onChange={e => setTeamName(e.target.value)}
                            placeholder="Nome della tua Squadra..."
                            disabled={isExpired}
                            className="w-full glass border border-white/5 rounded-[2.5rem] px-10 py-6 text-center text-2xl font-black focus:border-oro transition-all outline-none shadow-3xl placeholder:opacity-30"
                        />
                        <div className="flex justify-center gap-4">
                            <div className="glass px-8 py-4 rounded-3xl border border-white/5">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Punteggio Attuale</p>
                                <p className="text-3xl font-black text-oro tracking-tighter">{teamScore}</p>
                            </div>
                        </div>
                    </div>

                    {deadline && (
                        <div className="flex justify-center pt-8">
                            <div className="glass-oro p-10 rounded-[3rem] border border-oro/10 shadow-3xl">
                                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Chiusura Mercato</p>
                                <CountdownTimer targetDate={deadline} />
                            </div>
                        </div>
                    )}
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Artist Market (Neo-Grid) */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                            <div className="relative w-full md:w-96">
                                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Cerca un talento..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold focus:border-oro outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                                {["ALL", "PRESENTATORE", "OSPITE", "ARTISTA"].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f as any)}
                                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeFilter === f ? "bg-oro text-blunotte border-oro shadow-xl" : "bg-white/5 text-gray-500 border-white/10 hover:border-gray-600"}`}
                                    >
                                        {f === "ALL" ? "TUTTI" : f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredArtists.map((artist) => {
                                    const isSelected = selectedArtists.some(a => a.id === artist.id);
                                    const canAfford = remainingBudget >= artist.cost || isSelected;
                                    const isDisabled = isExpired || (!canAfford && !isSelected);

                                    return (
                                        <motion.div
                                            key={artist.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                                            onClick={() => !isDisabled && toggleArtist(artist)}
                                            className={`group relative rounded-[3rem] border-2 transition-all p-6 overflow-hidden cursor-pointer
                                                ${isSelected 
                                                    ? "glass-oro border-oro shadow-[0_20px_50px_rgba(255,215,0,0.15)]" 
                                                    : isDisabled ? "bg-gray-900/50 border-white/5 opacity-20 grayscale" : "glass border-white/10 hover:border-oro/30"
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col h-full space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-black text-xl leading-[0.9] mb-1">{artist.name}</h3>
                                                        <span className="text-[9px] font-black text-oro uppercase tracking-[0.2em] opacity-60">{artist.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black tracking-tighter leading-none">{artist.cost}</p>
                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Armoni</p>
                                                    </div>
                                                </div>

                                                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black overflow-hidden border border-white/10 shadow-2xl relative">
                                                    {artist.image ? (
                                                        <img src={artist.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-5xl font-black opacity-[0.03]">{artist.name.charAt(0)}</div>
                                                    )}
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-oro/10 backdrop-blur-[2px] flex items-center justify-center">
                                                            <div className="bg-oro text-blunotte p-3 rounded-2xl shadow-2xl scale-125">
                                                                <FiCheck size={20} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {isSelected && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center pt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCaptainId(artist.id);
                                                            }}
                                                            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${captainId === artist.id ? "bg-oro text-blunotte shadow-xl" : "bg-white/10 text-white hover:bg-white/20 border border-white/10"}`}
                                                        >
                                                            {captainId === artist.id ? "★ Capitano" : "Eleggi Capitano"}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Summary Sidebar Revolution */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <div className="glass p-12 rounded-[4rem] border border-white/5 shadow-3xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-oro opacity-[0.02] blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <h2 className="text-4xl font-black tracking-tighter mb-10">
                                    Il tuo <span className="text-oro">Roster.</span>
                                </h2>

                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-end">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Risorse Rimaste</p>
                                        <p className={`text-5xl font-black tracking-tighter ${remainingBudget < 0 ? "text-red-500" : "text-green-400"}`}>
                                            {remainingBudget}<span className="text-lg opacity-20 ml-1">/ 100</span>
                                        </p>
                                    </div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(0, Math.min(100, (spentBudget / 100) * 100))}%` }}
                                            transition={{ duration: 1, ease: "circOut" }}
                                            className={`h-full ${remainingBudget < 0 ? "bg-red-500" : "bg-gradient-to-r from-oro to-ocra"} shadow-[0_0_20px_rgba(255,215,0,0.3)]`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 min-h-[350px]">
                                    {selectedArtists.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 glass border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
                                            <FiPlus size={48} className="mb-4 text-oro" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Componi il Quintetto</p>
                                        </div>
                                    ) : (
                                        selectedArtists.map((a, i) => (
                                            <motion.div 
                                                key={a.id} 
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex justify-between items-center glass p-5 rounded-3xl border border-white/5 group"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-black overflow-hidden border border-white/10 group-hover:border-oro/40 transition-colors">
                                                        {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg leading-none mb-1 group-hover:text-oro transition-colors">{a.name}</p>
                                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{a.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {captainId === a.id && <FiStar className="text-oro animate-pulse" size={20} />}
                                                    <span className="font-black text-2xl tracking-tighter">{a.cost}</span>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {error && <p className="mt-8 text-red-500 text-center font-black text-xs uppercase tracking-widest bg-red-500/10 p-6 rounded-3xl border border-red-500/20 animate-pulse">{error}</p>}

                                <button
                                    onClick={saveTeam}
                                    disabled={loading || isExpired || selectedArtists.length !== 5 || !teamName.trim() || !captainId || remainingBudget < 0}
                                    className="w-full mt-12 py-8 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,215,0,0.25)] transform hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-10 disabled:grayscale uppercase tracking-[0.3em] text-sm"
                                >
                                    {loading ? "Sincronizzando..." : isEditing ? "Aggiorna Impero" : "Fonda Impero"}
                                </button>
                            </div>

                            <Link href="/supporto" className="flex items-center justify-between glass hover:bg-white/5 p-8 rounded-[2.5rem] border border-white/5 transition-all group">
                                <div className="flex items-center gap-4">
                                   <FiHelpCircle className="text-oro text-2xl" />
                                   <span className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Dubbi sulla Strategia?</span>
                                </div>
                                <FiArrowRight className="group-hover:translate-x-2 transition-transform text-oro" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
