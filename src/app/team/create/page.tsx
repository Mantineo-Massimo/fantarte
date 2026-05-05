"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import SocialShare from "@/components/SocialShare";
import CountdownTimer from "@/components/CountdownTimer";
import { FiUsers, FiStar, FiShield, FiTrendingUp, FiInfo, FiEdit3, FiSave, FiSearch, FiFilter, FiHelpCircle } from "react-icons/fi";
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
        // Fetch Artists
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error("Failed to load artists", err));

        // Fetch User's Team
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
                    // Get score from Generale league if exists
                    const generale = data.leagues?.find((l: any) => l.league.name === "Generale");
                    if (generale) setTeamScore(generale.score);
                }
                setInitialFetchDone(true);
            })
            .catch(err => {
                console.error("Failed to load team", err);
                setInitialFetchDone(true);
            });

        // Fetch Settings
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
                setError("Massimo 3 Artisti consentiti.");
                return;
            }
            if (selectedArtists.length >= 5) {
                setError("La squadra è completa.");
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
            setError("Composizione squadra non valida.");
            return;
        }
        if (!teamName.trim()) {
            setError("Nome squadra mancante.");
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
                    teamName: teamName,
                    image: teamImage,
                    artistIds: selectedArtists.map(a => a.id),
                    captainId: captainId
                })
            });

            if (!res.ok) {
                const msg = await res.text();
                setError(msg || "Errore durante il salvataggio.");
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
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-gray-800 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                             <div className="w-20 h-20 rounded-3xl bg-oro/10 border border-oro/30 flex items-center justify-center text-oro text-4xl shadow-lg">
                                {isEditing ? <FiTrendingUp /> : <FiUsers />}
                             </div>
                             <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                                    {isEditing ? teamName : "Crea Squadra"}
                                </h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">
                                    {isEditing ? "La tua formazione attuale su FantArte" : "Benvenuto! Inizia a comporre il tuo roster"}
                                </p>
                             </div>
                        </div>
                    </div>
                    
                    {isEditing && (
                        <div className="flex gap-4">
                            <div className="bg-[#131d36] px-6 py-4 rounded-2xl border border-gray-800 text-center shadow-xl">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Punti Totali</p>
                                <p className="text-3xl font-black text-oro">{teamScore}</p>
                            </div>
                            <Link href="/supporto" className="bg-[#131d36] px-6 py-4 rounded-2xl border border-gray-800 flex items-center gap-2 hover:bg-white/5 transition-colors shadow-xl">
                                <FiHelpCircle className="text-oro" />
                                <span className="text-sm font-bold">Supporto</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Visual Formation (Stage) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative bg-gradient-to-b from-[#131d36] to-[#0a0f1c] rounded-[40px] p-8 border border-gray-800 shadow-2xl overflow-hidden aspect-[4/3] md:aspect-[16/9] flex flex-col justify-center">
                            
                            {/* Stage Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-oro rounded-full blur-[120px]"></div>
                            </div>

                            <div className="relative z-10 grid grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                                
                                {/* Row 1: Presenter and Guest */}
                                <div className="col-span-3 flex justify-center gap-8 mb-4">
                                    <StageSlot 
                                        label="PRESENTATORE" 
                                        artist={selectedArtists.find(a => a.type === "PRESENTATORE")}
                                        isCaptain={captainId === selectedArtists.find(a => a.type === "PRESENTATORE")?.id}
                                        onSetCaptain={() => setCaptainId(selectedArtists.find(a => a.type === "PRESENTATORE")?.id || null)}
                                        onRemove={() => toggleArtist(selectedArtists.find(a => a.type === "PRESENTATORE")!)}
                                        isExpired={isExpired}
                                    />
                                    <StageSlot 
                                        label="OSPITE" 
                                        artist={selectedArtists.find(a => a.type === "OSPITE")}
                                        isCaptain={captainId === selectedArtists.find(a => a.type === "OSPITE")?.id}
                                        onSetCaptain={() => setCaptainId(selectedArtists.find(a => a.type === "OSPITE")?.id || null)}
                                        onRemove={() => toggleArtist(selectedArtists.find(a => a.type === "OSPITE")!)}
                                        isExpired={isExpired}
                                    />
                                </div>

                                {/* Row 2: 3 Artists */}
                                <div className="col-span-3 flex justify-center gap-6">
                                    {[0, 1, 2].map(i => (
                                        <StageSlot 
                                            key={i}
                                            label="ARTISTA" 
                                            artist={selectedArtists.filter(a => a.type === "ARTISTA")[i]}
                                            isCaptain={captainId === selectedArtists.filter(a => a.type === "ARTISTA")[i]?.id}
                                            onSetCaptain={() => setCaptainId(selectedArtists.filter(a => a.type === "ARTISTA")[i]?.id || null)}
                                            onRemove={() => toggleArtist(selectedArtists.filter(a => a.type === "ARTISTA")[i]!)}
                                            isExpired={isExpired}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Stage Floor */}
                            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Team Actions & Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#131d36]/50 p-6 rounded-3xl border border-gray-800 space-y-4">
                                <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest">Dati della Squadra</label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="Inserisci nome squadra..."
                                    disabled={isExpired}
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-4 text-white font-bold focus:border-oro transition-all outline-none"
                                />
                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                                    <span className="text-sm text-gray-400">Budget Residuo:</span>
                                    <span className={`text-xl font-black ${remainingBudget < 0 ? "text-red-500" : "text-green-400"}`}>
                                        {remainingBudget} <small className="text-[10px] uppercase">Armoni</small>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-[#131d36]/50 p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
                                <p className="text-sm text-gray-400 italic">
                                    💡 <strong className="text-oro">Consiglio:</strong> Scegli con cura il Capitano. Solo i suoi <strong className="text-white">Punti Speciali</strong> verranno raddoppiati!
                                </p>
                                <button
                                    onClick={saveTeam}
                                    disabled={selectedArtists.length !== 5 || !teamName.trim() || !captainId || loading || isExpired}
                                    className="w-full mt-4 py-5 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-2xl transform active:scale-95 transition-all shadow-xl hover:shadow-oro/30 disabled:opacity-30 disabled:grayscale"
                                >
                                    {loading ? "SALVATAGGIO..." : isEditing ? "AGGIORNA SQUADRA" : "FONDA SQUADRA"}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 font-bold text-center bg-red-500/10 p-4 rounded-xl border border-red-500/30">{error}</p>}
                    </div>

                    {/* Right Column: Artist Market */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#131d36] rounded-[40px] p-8 border border-gray-800 shadow-2xl h-[800px] flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tighter">Mercato <span className="text-oro">Armoni</span></h2>
                                <div className="bg-oro/10 px-3 py-1 rounded-full border border-oro/20 text-[10px] font-black text-oro">DISPONIBILI: {artists.length}</div>
                            </div>

                            {/* Search & Filter */}
                            <div className="space-y-4 mb-8">
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input 
                                        type="text" 
                                        placeholder="Cerca artista..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-oro transition-all outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {["ALL", "PRESENTATORE", "OSPITE", "ARTISTA"].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f as any)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeFilter === f ? "bg-oro text-blunotte border-oro" : "bg-black/40 text-gray-500 border-gray-800 hover:border-gray-600"}`}
                                        >
                                            {f === "ALL" ? "TUTTI" : f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Artist List */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {filteredArtists.map(artist => {
                                    const isSelected = selectedArtists.some(a => a.id === artist.id);
                                    const canAfford = remainingBudget >= artist.cost || isSelected;
                                    return (
                                        <button
                                            key={artist.id}
                                            disabled={isExpired || (!canAfford && !isSelected)}
                                            onClick={() => toggleArtist(artist)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${isSelected ? "bg-oro text-blunotte border-oro" : "bg-black/20 border-gray-800 hover:border-gray-600 disabled:opacity-30 disabled:grayscale"}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden border border-white/10">
                                                    {artist.image ? <img src={artist.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">{artist.name.charAt(0)}</div>}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold leading-tight">{artist.name}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? "text-blunotte/60" : "text-oro"}`}>{artist.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black">{artist.cost}</p>
                                                <p className={`text-[8px] font-bold uppercase ${isSelected ? "text-blunotte/60" : "text-gray-500"}`}>ARMONI</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deadline Footer */}
                {deadline && (
                    <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-full h-full bg-oro/5 pointer-events-none blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                         <div>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Tempo Rimasto per Modifiche</h3>
                            <p className="text-gray-400 text-sm">Al termine del countdown la squadra verrà congelata per l&apos;inizio della Piazza.</p>
                         </div>
                         <div className="w-full md:w-auto">
                            <CountdownTimer targetDate={deadline} />
                         </div>
                    </div>
                )}

            </div>
        </main>
    );
}

function StageSlot({ label, artist, isCaptain, onSetCaptain, onRemove, isExpired }: { 
    label: string, 
    artist?: Artist, 
    isCaptain: boolean, 
    onSetCaptain: () => void,
    onRemove: () => void,
    isExpired: boolean
}) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 transition-all flex items-center justify-center overflow-hidden ${artist ? "border-oro shadow-[0_0_20px_rgba(255,215,0,0.3)] bg-gray-900" : "border-dashed border-gray-700 bg-black/30"}`}>
                {artist ? (
                    <>
                        <img src={artist.image || ""} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end pb-3">
                            <p className="text-[10px] md:text-xs font-black text-white text-center px-2 line-clamp-1">{artist.name}</p>
                        </div>
                        {!isExpired && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                            >
                                ×
                            </button>
                        )}
                        {isCaptain && (
                            <div className="absolute -top-1 -left-1 bg-oro text-blunotte p-1.5 rounded-full shadow-lg border-2 border-blunotte animate-pulse">
                                <FiStar size={12} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center text-gray-700">
                         <FiUsers size={24} />
                    </div>
                )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
                {artist && !isExpired && (
                    <button
                        onClick={onSetCaptain}
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all border ${isCaptain ? "bg-oro text-blunotte border-oro" : "bg-black/40 text-gray-500 border-gray-800 hover:border-oro hover:text-oro"}`}
                    >
                        {isCaptain ? "CAPITANO" : "FARE CAPITANO"}
                    </button>
                )}
            </div>
        </div>
    );
}
