"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import SocialShare from "@/components/SocialShare";
import CountdownTimer from "@/components/CountdownTimer";

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

    const [deadline, setDeadline] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);

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

    // Count by type
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
            // Check limits
            if (artist.type === "PRESENTATORE" && counts.PRESENTATORE >= 1) {
                setError("Puoi selezionare solo 1 presentatore.");
                return;
            }
            if (artist.type === "OSPITE" && counts.OSPITE >= 1) {
                setError("Puoi selezionare solo 1 ospite.");
                return;
            }
            if (artist.type === "ARTISTA" && counts.ARTISTA >= 3) {
                setError("Puoi selezionare massimo 3 artisti.");
                return;
            }
            
            if (selectedArtists.length >= 5) {
                setError("La squadra è già completa (5 membri).");
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Errore durante l'upload");
            }
            const data = await res.json();
            setTeamImage(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const saveTeam = async () => {
        if (isExpired) {
            setError("Le iscrizioni sono chiuse!");
            return;
        }
        if (counts.ARTISTA !== 3 || counts.PRESENTATORE !== 1 || counts.OSPITE !== 1) {
            setError("Composizione squadra non valida: servono 1 presentatore, 1 ospite e 3 artisti.");
            return;
        }
        if (!teamName.trim()) {
            setError("Inserire un nome per la squadra.");
            return;
        }
        if (!captainId) {
            setError("Seleziona un capitano per raddoppiare i punti speciali!");
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

    if (status === "loading" || !initialFetchDone) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Caricamento...</div>;

    const getRoleColor = (type: ArtistType) => {
        switch (type) {
            case "PRESENTATORE": return "bg-viola/20 text-purple-400 border-purple-500/30";
            case "OSPITE": return "bg-green-500/10 text-green-400 border-green-500/30";
            case "ARTISTA": return "bg-oro/10 text-oro border-oro/30";
            default: return "bg-gray-800 text-gray-400 border-gray-700";
        }
    };

    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sinistra: Lista Artisti */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="mb-4">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                            {isEditing ? "Gestisci la tua Squadra" : "Crea la tua Squadra"}
                        </h1>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${counts.PRESENTATORE === 1 ? "bg-purple-500 text-white border-purple-400" : "bg-purple-500/10 text-purple-400 border-purple-500/20"}`}>
                                1 Presentatore ({counts.PRESENTATORE}/1)
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${counts.OSPITE === 1 ? "bg-green-600 text-white border-green-500" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                                1 Ospite ({counts.OSPITE}/1)
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${counts.ARTISTA === 3 ? "bg-oro text-blunotte border-yellow-400" : "bg-oro/10 text-oro border-oro/20"}`}>
                                3 Artisti ({counts.ARTISTA}/3)
                            </span>
                        </div>
                    </div>

                    {deadline && (
                        <div className="mb-8 p-6 bg-[#131d36] rounded-3xl border border-gray-800 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-oro opacity-5 rounded-full blur-3xl"></div>
                            <CountdownTimer targetDate={deadline} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {artists.map((artist) => {
                                const isSelected = selectedArtists.some(a => a.id === artist.id);
                                const canAfford = remainingBudget >= artist.cost || isSelected;
                                const isDisabled = isExpired || (!canAfford && !isSelected);

                                return (
                                    <motion.div
                                        key={artist.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                                        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                                        onClick={() => !isDisabled && toggleArtist(artist)}
                                        className={`rounded-2xl border-2 transition-all p-4 overflow-hidden relative ${isSelected
                                            ? "bg-[#1f2937] border-oro shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer"
                                            : isDisabled
                                                ? "bg-[#0f172a] border-gray-800 opacity-50 cursor-not-allowed"
                                                : "bg-[#131d36] border-gray-800 hover:border-gray-500 cursor-pointer"
                                            }`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="z-10">
                                                    <h3 className="text-xl font-bold truncate pr-2">{artist.name}</h3>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getRoleColor(artist.type)}`}>
                                                        {artist.type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 z-10">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${isSelected ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"}`}>
                                                        {artist.cost} ARMONI
                                                    </span>
                                                    {isSelected && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCaptainId(artist.id);
                                                            }}
                                                            className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${captainId === artist.id
                                                                ? "bg-oro text-blunotte shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                                                : "bg-black/40 text-gray-400 hover:bg-black/60 hover:text-white"
                                                                }`}
                                                        >
                                                            {captainId === artist.id ? "★ Capitano" : "Capitano?"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="h-40 w-full rounded-xl bg-[#0a0f1c] overflow-hidden">
                                                {artist.image ? (
                                                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Destra: Riepilogo */}
                <div className="lg:col-span-1 border-l-0 lg:border-l border-gray-800 pl-0 lg:pl-8">
                    <div className="sticky top-24 bg-[#131d36] rounded-3xl p-6 shadow-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4">Riepilogo Squadra</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest font-bold">Nome Squadra</label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                maxLength={30}
                                disabled={isExpired}
                                placeholder="Es. I Bardi di Piazza"
                                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-400">Budget</span>
                                <span className={`font-mono font-bold text-2xl ${remainingBudget < 0 ? "text-red-500" : "text-green-500"}`}>
                                    {remainingBudget} / 100
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Capitano raddoppia i <strong className="text-oro">Punti Speciali</strong></span>
                            </div>
                        </div>

                        <div className="space-y-3 min-h-[250px]">
                            {selectedArtists.length === 0 ? (
                                <p className="text-gray-500 text-center italic mt-10">Inizia a comporre la tua squadra</p>
                            ) : (
                                selectedArtists.map(a => (
                                    <div key={a.id} className="flex justify-between bg-[#0a0f1c] px-4 py-3 rounded-xl text-sm items-center border border-gray-800 relative">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-200">{a.name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{a.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {captainId === a.id && <span className="text-oro text-xs font-black">★ CAPITANO</span>}
                                            <span className="text-oro font-bold text-lg">{a.cost}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-sm">{error}</div>}

                        <button
                            onClick={saveTeam}
                            disabled={selectedArtists.length !== 5 || !teamName.trim() || !captainId || loading || remainingBudget < 0 || isExpired}
                            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-xl
                                ${isExpired
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                    : "bg-gradient-to-r from-oro to-ocra text-blunotte hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                                }
                            `}
                        >
                            {loading ? "Salvataggio..." : isExpired ? "Iscrizioni Chiuse" : (isEditing ? "Salva Modifiche" : "Fonda Squadra")}
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
