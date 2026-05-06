"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiUsers, FiStar, FiTrendingUp, FiSearch, FiCheck, FiX, FiShield, FiArrowRight, FiArrowLeft, FiCamera, FiAward } from "react-icons/fi";
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

    const [step, setStep] = useState(0);
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
    const [isExpired, setIsExpired] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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
                    if (new Date() > new Date(data.draftDeadline)) {
                        setIsExpired(true);
                    }
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setTeamImage(data.url);
        } catch (err) {
            setError("Errore nel caricamento immagine.");
        } finally {
            setIsUploading(false);
        }
    };

    const nextStep = () => {
        setError("");
        if (step === 0) {
            if (!teamName.trim()) {
                setError("Inserisci un nome per la tua squadra.");
                return;
            }
            setStep(1);
        } else if (step === 1) {
            if (counts.PRESENTATORE !== 1) {
                setError("Scegli un Presentatore per proseguire.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (counts.OSPITE !== 1) {
                setError("Scegli un Ospite per proseguire.");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (counts.ARTISTA !== 3) {
                setError(`Scegli ancora ${3 - counts.ARTISTA} artisti.`);
                return;
            }
            setStep(4);
        } else if (step === 4) {
            if (!captainId) {
                setError("Nomina un Capitano per guidare la squadra.");
                return;
            }
            setStep(5);
        }
    };

    const prevStep = () => {
        setError("");
        setStep(prev => Math.max(0, prev - 1));
    };

    const saveTeam = async () => {
        if (isExpired) return;
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
                router.refresh();
                router.push("/leaderboards");
            }
        } catch {
            setError("Errore di rete.");
        } finally {
            setLoading(false);
        }
    };

    const filteredArtists = useMemo(() => {
        let typeToFilter: ArtistType | null = null;
        if (step === 1) typeToFilter = "PRESENTATORE";
        if (step === 2) typeToFilter = "OSPITE";
        if (step === 3) typeToFilter = "ARTISTA";

        return artists.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeToFilter ? a.type === typeToFilter : true;
            return matchesSearch && matchesType;
        });
    }, [artists, searchTerm, step]);

    if (status === "loading" || !initialFetchDone) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white font-black tracking-[0.2em] uppercase text-xs">Inizializzazione...</div>;

    const steps = [
        { title: "Identità", icon: FiShield },
        { title: "Presentatore", icon: FiUsers },
        { title: "Ospite", icon: FiStar },
        { title: "Artisti", icon: FiTrendingUp },
        { title: "Capitano", icon: FiAward },
        { title: "Riepilogo", icon: FiCheck },
    ];

    return (
        <main className="min-h-screen bg-blunotte text-white pt-56 md:pt-48 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.08),transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                
                {/* Main Selection Container - REMOVED overflow-hidden to allow glows to breathe */}
                <div className="glass rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-3xl flex flex-col bg-white/[0.02] backdrop-blur-3xl relative">
                    
                    {/* Stepper Header (Inside Container) */}
                    <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-center overflow-x-auto py-6 gap-4 no-scrollbar">
                            {steps.map((s, i) => (
                                <div key={i} className={`flex flex-col items-center min-w-fit transition-all duration-500 ${i === step ? "scale-110" : i < step ? "opacity-50" : "opacity-20"}`}>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-2 mb-3 transition-all ${i === step ? "bg-oro border-oro text-blunotte shadow-[0_0_30px_rgba(255,215,0,0.6)]" : "border-white/10"}`}>
                                        <s.icon size={i === step ? 20 : 16} />
                                    </div>
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content Area */}
                    <div className="p-8 md:p-16 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* STEP 0: IDENTITY */}
                                {step === 0 && (
                                    <div className="max-w-3xl mx-auto text-center space-y-12">
                                        <header>
                                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 uppercase">Fonda il tuo <span className="text-oro text-glow">Impero</span></h1>
                                            <p className="text-gray-500 font-medium italic">Scegli un nome epico e un&apos;immagine 1:1 per la tua squadra.</p>
                                        </header>

                                        <div className="space-y-10">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-oro to-ocra rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={e => setTeamName(e.target.value)}
                                                    placeholder="Nome della tua Squadra..."
                                                    className="relative w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] px-8 py-8 md:px-12 md:py-10 text-2xl md:text-4xl font-black text-center focus:border-oro outline-none transition-all placeholder:opacity-20 shadow-2xl"
                                                />
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-[3.5rem] overflow-hidden bg-white/[0.03] border-2 border-dashed border-white/10 group hover:border-oro/50 transition-all flex items-center justify-center cursor-pointer shadow-2xl">
                                                    {teamImage ? (
                                                        <img src={teamImage} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-gray-500 group-hover:text-oro transition-colors">
                                                            <FiCamera size={40} className="mb-4" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-center px-8">Carica Foto <br/> (1:1 consigliata)</span>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-blunotte/80 flex items-center justify-center">
                                                            <div className="w-8 h-8 border-4 border-oro/20 border-t-oro rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEPS 1, 2, 3: ARTIST SELECTION */}
                                {(step === 1 || step === 2 || step === 3) && (
                                    <div className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-2">
                                                {step === 1 && <>Scegli il <span className="text-oro text-glow">Presentatore</span></>}
                                                {step === 2 && <>Scegli l&apos;<span className="text-viola text-glow">Ospite</span></>}
                                                {step === 3 && <>Scegli i tuoi <span className="text-ocra text-glow">3 Artisti</span></>}
                                            </h2>
                                            <p className="text-gray-500 font-medium italic">
                                                {step === 1 && "La voce che guiderà la tua Piazza."}
                                                {step === 2 && "Il tocco di classe della tua formazione."}
                                                {step === 3 && "Il cuore pulsante del tuo quintetto."}
                                            </p>
                                        </div>

                                        <div className="relative max-w-xl mx-auto mb-16 group">
                                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-oro transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="Cerca un artista..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-full py-5 pl-14 pr-8 focus:border-oro/40 outline-none transition-all shadow-xl"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                                            {filteredArtists.map(artist => (
                                                <SelectionArtistCard 
                                                    key={artist.id} 
                                                    artist={artist} 
                                                    isSelected={selectedArtists.some(a => a.id === artist.id)}
                                                    isDisabled={isExpired || (remainingBudget < artist.cost && !selectedArtists.some(a => a.id === artist.id))}
                                                    toggleArtist={toggleArtist}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: CAPTAIN */}
                                {step === 4 && (
                                    <div className="max-w-4xl mx-auto space-y-12 text-center">
                                        <header>
                                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">Nomina il <span className="text-oro text-glow">Capitano</span></h2>
                                            <p className="text-gray-500 font-medium italic">Il capitano raddoppia i suoi punti! Scegli la tua punta di diamante.</p>
                                        </header>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-10">
                                            {selectedArtists.map(artist => (
                                                <div 
                                                    key={artist.id}
                                                    onClick={() => setCaptainId(artist.id)}
                                                    className={`relative cursor-pointer rounded-[3rem] p-4 transition-all duration-500 group border-2 ${captainId === artist.id ? "bg-oro/[0.05] border-oro shadow-[0_0_50px_rgba(255,215,0,0.3)] scale-110 z-10" : "bg-white/[0.03] border-white/5 hover:border-white/20"}`}
                                                >
                                                    <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 border border-white/10 shadow-lg">
                                                        {artist.image ? (
                                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-black flex items-center justify-center text-4xl font-black opacity-10">{artist.name.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-black text-xs md:text-sm leading-tight mb-2 truncate px-2">{artist.name}</h3>
                                                    {captainId === artist.id && (
                                                        <div className="flex justify-center">
                                                            <div className="bg-oro text-blunotte text-[7px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Capitano ★</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: REVIEW */}
                                {step === 5 && (
                                    <div className="max-w-4xl mx-auto space-y-12">
                                        <header className="text-center">
                                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">Ultimo <span className="text-oro text-glow">Riepilogo</span></h2>
                                            <p className="text-gray-500 font-medium italic">Tutto pronto per dominare la Piazza?</p>
                                        </header>

                                        <div className="bg-white/[0.03] p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-3xl space-y-12 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-oro opacity-5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                            
                                            <div className="flex flex-col md:flex-row items-center gap-10">
                                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] overflow-hidden border-2 border-oro shadow-2xl shrink-0">
                                                    {teamImage ? <img src={teamImage} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black flex items-center justify-center text-5xl font-black text-oro opacity-20">F</div>}
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase">{teamName}</h3>
                                                    <p className="text-oro font-black text-[10px] uppercase tracking-[0.4em]">Il tuo Impero è pronto.</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Budget</p>
                                                    <p className="text-5xl font-black text-oro">{remainingBudget}<span className="text-sm opacity-20 ml-1">/100</span></p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {selectedArtists.map(a => (
                                                    <div key={a.id} className="bg-white/[0.05] p-5 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-md">
                                                            {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <p className="font-black text-[10px] truncate w-full mb-1">{a.name}</p>
                                                        <span className="text-[7px] font-black uppercase text-gray-600 tracking-widest">{a.type}</span>
                                                        {captainId === a.id && <FiStar className="absolute top-3 right-3 text-oro animate-pulse" size={14} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer (Anchored to Container) */}
                    <div className="p-8 md:p-12 border-t border-white/5 bg-white/[0.03]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <button
                                onClick={prevStep}
                                disabled={step === 0 || loading}
                                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 0 ? "opacity-0 invisible" : "hover:bg-white/5 text-gray-500 hover:text-white"}`}
                            >
                                <FiArrowLeft /> Indietro
                            </button>

                            <div className="flex gap-10 items-center bg-black/20 px-10 py-6 rounded-full border border-white/5">
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">Armoni Disp.</span>
                                    <span className={`text-2xl font-black ${remainingBudget < 0 ? "text-red-500" : "text-white"}`}>{remainingBudget}</span>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">Status Team</span>
                                    <span className="text-2xl font-black text-white">{selectedArtists.length}<span className="text-xs opacity-20 ml-1">/5</span></span>
                                </div>
                            </div>

                            {step === 5 ? (
                                <button
                                    onClick={saveTeam}
                                    disabled={loading || isExpired}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-14 py-6 bg-gradient-to-r from-oro to-ocra text-blunotte rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    {loading ? "Fondazione..." : "Conferma Impero"} <FiCheck />
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    disabled={loading}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-14 py-6 bg-oro text-blunotte rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    Prosegui <FiArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="fixed top-40 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-6">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-3xl flex items-center gap-4"
                        >
                            <FiX size={20} />
                            {error}
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    );
}

function SelectionArtistCard({ 
    artist, 
    isSelected, 
    isDisabled, 
    toggleArtist 
}: { 
    artist: Artist; 
    isSelected: boolean; 
    isDisabled: boolean; 
    toggleArtist: (a: Artist) => void; 
}) {
    return (
        <motion.div
            layout
            onClick={() => !isDisabled && toggleArtist(artist)}
            className={`group relative rounded-[2.5rem] md:rounded-[3.5rem] border-2 transition-all p-4 md:p-6 cursor-pointer flex flex-col h-full
                ${isSelected 
                    ? "bg-oro/[0.05] border-oro shadow-[0_10px_40px_rgba(255,215,0,0.15)] scale-105 z-10" 
                    : isDisabled ? "bg-gray-900/50 border-white/5 opacity-20 grayscale cursor-not-allowed" : "bg-white/[0.03] border-white/5 hover:border-oro/30"
                }
            `}
        >
            <div className="flex flex-col h-full space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                        <h3 className="font-black text-[10px] md:text-lg leading-[0.9] mb-1 truncate">{artist.name}</h3>
                        <div className="bg-oro/10 px-2 py-1 rounded-md inline-block mt-1">
                             <span className="text-[7px] md:text-[9px] font-black uppercase text-oro tracking-widest">
                                {artist.cost} Armoni
                            </span>
                        </div>
                    </div>
                    {isSelected && <FiCheck className="text-oro" size={24} />}
                </div>

                <div className="aspect-[4/5] w-full rounded-[2rem] bg-black overflow-hidden border border-white/10 shadow-2xl relative">
                    {artist.image ? (
                        <img src={artist.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-5xl font-black opacity-[0.03]">{artist.name.charAt(0)}</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
