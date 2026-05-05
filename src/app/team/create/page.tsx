"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import { FiUsers, FiStar, FiTrendingUp, FiHelpCircle, FiSearch, FiCheck, FiX, FiShield, FiPlus } from "react-icons/fi";
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
            
            {/* Background Orbs (Style Home) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -left-64 w-[500px] h-[500px] bg-oro opacity-5 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-viola opacity-[0.03] rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-ocra opacity-[0.04] rounded-full blur-[90px] mix-blend-screen" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">
                
                {/* Hero Section Style Home */}
                <motion.header 
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center mb-20 space-y-8"
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-oro/10 border border-oro/30 text-oro text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        Area Giocatore
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                        {isEditing ? (
                            <>La tua <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">Squadra</span></>
                        ) : (
                            <>Crea il tuo <span className="text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">Destino</span></>
                        )}
                    </h1>

                    <div className="max-w-xl mx-auto space-y-4">
                        <input
                            type="text"
                            value={teamName}
                            onChange={e => setTeamName(e.target.value)}
                            placeholder="Inserisci il nome epico della tua squadra..."
                            disabled={isExpired}
                            className="w-full bg-white/5 border border-gray-800 rounded-3xl px-8 py-5 text-center text-xl font-bold focus:border-oro transition-all outline-none shadow-2xl"
                        />
                        <div className="flex justify-center gap-4">
                            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-gray-800 backdrop-blur-md">
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Punti Totali</p>
                                <p className="text-2xl font-black text-oro">{teamScore}</p>
                            </div>
                        </div>
                    </div>

                    {deadline && (
                        <div className="flex justify-center pt-8">
                            <CountdownTimer targetDate={deadline} />
                        </div>
                    )}
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Artist Market (Grid) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                            <div className="relative w-full md:w-96">
                                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Cerca il tuo talento..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-oro outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                                {["ALL", "PRESENTATORE", "OSPITE", "ARTISTA"].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f as any)}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${activeFilter === f ? "bg-oro text-blunotte border-oro" : "bg-white/5 text-gray-500 border-gray-800 hover:border-gray-600"}`}
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
                                            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                                            onClick={() => !isDisabled && toggleArtist(artist)}
                                            className={`group relative rounded-[2.5rem] border-2 transition-all p-5 overflow-hidden cursor-pointer
                                                ${isSelected 
                                                    ? "bg-[#131d36] border-oro shadow-[0_0_20px_rgba(255,215,0,0.2)]" 
                                                    : isDisabled ? "bg-gray-900/50 border-gray-800 opacity-30 cursor-not-allowed" : "bg-[#131d36]/40 border-gray-800 hover:border-gray-700"
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col h-full space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-black text-lg leading-tight">{artist.name}</h3>
                                                        <span className="text-[9px] font-black text-oro uppercase tracking-widest">{artist.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black">{artist.cost}</p>
                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Armoni</p>
                                                    </div>
                                                </div>

                                                <div className="aspect-square w-full rounded-3xl bg-black overflow-hidden border border-white/5">
                                                    {artist.image ? (
                                                        <img src={artist.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-3xl font-black opacity-10">{artist.name.charAt(0)}</div>
                                                    )}
                                                </div>

                                                {isSelected && (
                                                    <div className="flex justify-between items-center pt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCaptainId(artist.id);
                                                            }}
                                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${captainId === artist.id ? "bg-oro text-blunotte" : "bg-white/10 text-white hover:bg-white/20"}`}
                                                        >
                                                            {captainId === artist.id ? "★ Capitano" : "Fai Capitano"}
                                                        </button>
                                                        <FiCheck className="text-oro" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-[#131d36]/80 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-800 shadow-3xl">
                                <h2 className="text-3xl font-black tracking-tighter mb-8 pb-4 border-b border-gray-800">
                                    Il tuo <span className="text-oro">Roster</span>
                                </h2>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-end">
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Budget Disponibile</p>
                                        <p className={`text-4xl font-black tracking-tighter ${remainingBudget < 0 ? "text-red-500" : "text-green-400"}`}>
                                            {remainingBudget}<span className="text-lg opacity-40 ml-1">/ 100</span>
                                        </p>
                                    </div>
                                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(0, Math.min(100, (spentBudget / 100) * 100))}%` }}
                                            className={`h-full ${remainingBudget < 0 ? "bg-red-500" : "bg-oro"}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 min-h-[300px]">
                                    {selectedArtists.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-800 rounded-3xl opacity-30">
                                            <FiPlus size={32} className="mb-2" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Seleziona 5 Talenti</p>
                                        </div>
                                    ) : (
                                        selectedArtists.map(a => (
                                            <div key={a.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-gray-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-black overflow-hidden border border-white/5">
                                                        {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm leading-none">{a.name}</p>
                                                        <span className="text-[8px] font-black text-oro uppercase tracking-widest">{a.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {captainId === a.id && <FiStar className="text-oro" />}
                                                    <span className="font-black text-lg">{a.cost}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {error && <p className="mt-6 text-red-500 text-center font-bold text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20">{error}</p>}

                                <button
                                    onClick={saveTeam}
                                    disabled={loading || isExpired || selectedArtists.length !== 5 || !teamName.trim() || !captainId || remainingBudget < 0}
                                    className="w-full mt-10 py-6 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-3xl shadow-[0_0_30px_rgba(255,215,0,0.2)] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale uppercase tracking-widest"
                                >
                                    {loading ? "Salvataggio..." : isEditing ? "Aggiorna Squadra" : "Fonda Squadra"}
                                </button>
                            </div>

                            <Link href="/supporto" className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-gray-800 transition-all text-sm font-bold text-gray-400 hover:text-white">
                                <FiHelpCircle /> Hai bisogno di aiuto? FAQ
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
