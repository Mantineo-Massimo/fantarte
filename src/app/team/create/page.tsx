"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiUsers, FiStar, FiTrendingUp, FiSearch, FiCheck, FiX, FiShield, FiArrowRight, FiArrowLeft, FiCamera, FiAward } from "react-icons/fi";
import Link from "next/link";
import { isProfane } from "@/lib/blacklist";

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

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);


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
            if (isProfane(teamName)) {
                setError("Il nome contiene parole non consentite.");
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
                router.push("/");
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
        { title: "Pres.", icon: FiUsers },
        { title: "Ospite", icon: FiStar },
        { title: "Artisti", icon: FiTrendingUp },
        { title: "Cap.", icon: FiAward },
        { title: "Riep.", icon: FiCheck },
    ];

    return (
        <main className="min-h-screen bg-blunotte text-white pt-40 md:pt-44 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.06),transparent_70%)] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                
                {/* Stepper Header (Compact) */}
                <div className="flex justify-between items-center mb-8 px-2 md:px-16">
                    {steps.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center relative group">
                            {i < steps.length - 1 && (
                                <div className={`absolute top-4 md:top-5 left-[50%] w-full h-[1px] ${i < step ? "bg-oro" : "bg-white/5"} z-0`} />
                            )}
                            
                            <div 
                                className={`relative z-10 w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center border transition-all duration-500 
                                ${i === step ? "bg-oro border-oro text-blunotte shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110" : i < step ? "bg-oro/10 border-oro/30 text-oro" : "bg-blunotte border-white/5 text-gray-700"}`}
                            >
                                <s.icon size={i === step ? 16 : 14} />
                            </div>
                            <span className={`mt-2 text-[6px] md:text-[8px] font-black uppercase tracking-widest text-center transition-colors ${i === step ? "text-oro" : "text-gray-700"}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Selection Container */}
                <div className="glass rounded-[2rem] md:rounded-[3rem] border border-white/5 flex flex-col bg-white/[0.01] backdrop-blur-3xl relative">
                    
                    {/* Step Content Area */}
                    <div className="p-5 md:p-10 min-h-[400px]">
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
                                    <div className="max-w-2xl mx-auto text-center space-y-8">
                                        <header>
                                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 uppercase">Crea la tua <span className="text-oro text-glow">Squadra</span></h1>
                                            <p className="text-gray-500 text-xs md:text-sm font-medium italic">Scegli un nome e un&apos;immagine per il tuo team.</p>
                                        </header>

                                        <div className="space-y-8">
                                            <div className="relative group px-4">
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={e => setTeamName(e.target.value)}
                                                    maxLength={30}
                                                    placeholder="Nome del Team (max 30 car.)..."
                                                    className="relative w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 md:px-10 md:py-8 text-lg md:text-2xl font-black text-center focus:border-oro/50 outline-none transition-all placeholder:opacity-20 shadow-xl"
                                                />
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-dashed border-white/10 group hover:border-oro/30 transition-all flex items-center justify-center cursor-pointer shadow-2xl">
                                                    {teamImage ? (
                                                        <>
                                                            <img src={teamImage} alt="Preview" className="w-full h-full object-cover" />
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setTeamImage(null); }}
                                                                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-20 shadow-lg"
                                                                title="Rimuovi immagine"
                                                            >
                                                                <FiX size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-gray-600 group-hover:text-oro transition-colors">
                                                            <FiCamera size={28} className="mb-3" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-center px-6">Carica Foto</span>
                                                        </div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEPS 1, 2, 3: ARTIST SELECTION */}
                                {(step === 1 || step === 2 || step === 3) && (
                                    <div className="space-y-8">
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                                                {step === 1 && <>Scegli il <span className="text-oro">Presentatore</span></>}
                                                {step === 2 && <>Scegli l&apos;<span className="text-viola">Ospite</span></>}
                                                {step === 3 && <>Scegli i tuoi <span className="text-ocra">3 Artisti</span></>}
                                            </h2>
                                            <p className="text-gray-500 text-xs md:text-sm font-medium italic">
                                                {step === 1 && "La voce della tua Piazza."}
                                                {step === 2 && "Il tocco di classe."}
                                                {step === 3 && "Il cuore del quintetto."}
                                            </p>
                                        </div>

                                        <div className="relative max-w-lg mx-auto mb-8 group px-4">
                                            <FiSearch className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-700" />
                                            <input 
                                                type="text" 
                                                placeholder="Cerca un artista..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-full py-3.5 pl-14 pr-8 focus:border-oro/30 outline-none transition-all shadow-lg text-xs"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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
                                    <div className="max-w-3xl mx-auto space-y-8 text-center">
                                        <header>
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">Nomina il <span className="text-oro">Capitano</span></h2>
                                            <p className="text-gray-500 text-xs md:text-sm font-medium italic">Punti raddoppiati per il leader!</p>
                                        </header>

                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pt-6 px-2">
                                            {selectedArtists.map(artist => (
                                                <div 
                                                    key={artist.id}
                                                    onClick={() => setCaptainId(artist.id)}
                                                    className={`relative cursor-pointer rounded-2xl md:rounded-[2rem] p-2 md:p-3 transition-all duration-500 group border ${captainId === artist.id ? "bg-oro/[0.03] border-oro/50 shadow-xl scale-105" : "bg-white/[0.01] border-white/5"}`}
                                                >
                                                    <div className="aspect-square rounded-xl md:rounded-[1.5rem] overflow-hidden mb-2 border border-white/5 shadow-lg">
                                                        {artist.image ? (
                                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-black flex items-center justify-center text-xl font-black opacity-10">{artist.name.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-black text-[8px] md:text-[11px] leading-tight mb-1 truncate px-1">{artist.name}</h3>
                                                    {captainId === artist.id && <div className="text-oro text-[6px] font-black uppercase tracking-widest">★ Capitano</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: REVIEW */}
                                {step === 5 && (
                                    <div className="max-w-3xl mx-auto space-y-8 px-2">
                                        <header className="text-center">
                                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">Ultimo <span className="text-oro">Riepilogo</span></h2>
                                            <p className="text-gray-500 text-xs md:text-sm font-medium italic">Pronto per la sfida?</p>
                                        </header>

                                        <div className="bg-white/[0.02] p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
                                                <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] overflow-hidden border border-oro/30 shadow-2xl shrink-0 group">
                                                    {teamImage ? (
                                                        <>
                                                            <img src={teamImage} className="w-full h-full object-cover" />
                                                            <button 
                                                                onClick={() => setTeamImage(null)}
                                                                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[10px] uppercase"
                                                            >
                                                                Rimuovi
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full bg-black flex items-center justify-center text-3xl font-black text-oro opacity-20">F</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-2xl md:text-4xl font-black mb-1 tracking-tighter uppercase whitespace-normal leading-tight">{teamName}</h3>
                                                    <p className="text-oro font-black text-[8px] md:text-[9px] uppercase tracking-[0.3em]">La tua squadra è pronta.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                                                {selectedArtists.map(a => (
                                                    <div key={a.id} className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden mb-2 border border-white/5">
                                                            {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <p className="font-black text-[7px] md:text-[9px] whitespace-normal leading-tight w-full mb-1">{a.name}</p>
                                                        {captainId === a.id && <FiStar className="text-oro" size={8} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div className="p-3 md:p-8 border-t border-white/5 bg-white/[0.02]">
                        <div className="flex justify-between items-center gap-2 md:gap-4">
                            <button
                                onClick={prevStep}
                                disabled={step === 0 || loading}
                                className={`flex items-center gap-1.5 px-3 md:px-6 py-3 md:py-4 rounded-xl font-black text-[7px] md:text-[10px] uppercase tracking-widest transition-all ${step === 0 ? "opacity-0 invisible" : "text-gray-600 hover:text-white"}`}
                            >
                                <FiArrowLeft /> Indietro
                            </button>

                            <div className="flex gap-2 md:gap-8 items-center bg-black/30 px-3 py-2 md:px-8 md:py-4 rounded-full border border-white/5">
                                <div className="flex flex-col items-center">
                                    <span className="text-[6px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Budget</span>
                                    <span className={`text-sm md:text-lg font-black ${remainingBudget < 0 ? "text-red-500" : "text-white"}`}>{remainingBudget}</span>
                                </div>
                                <div className="w-[1px] h-5 bg-white/10" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[6px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Team</span>
                                    <span className="text-sm md:text-lg font-black text-white">{selectedArtists.length}/5</span>
                                </div>
                            </div>

                            {step === 5 ? (
                                <button
                                    onClick={saveTeam}
                                    disabled={loading || isExpired}
                                    className="flex items-center justify-center gap-1.5 px-4 py-3 md:px-10 md:py-5 bg-gradient-to-r from-oro to-ocra text-blunotte rounded-xl font-black text-[7px] md:text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    {loading ? "..." : "Conferma"} <FiCheck />
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-1.5 px-4 py-3 md:px-10 md:py-5 bg-oro text-blunotte rounded-xl font-black text-[7px] md:text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Prosegui <FiArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xs px-4">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500 text-white px-6 py-4 rounded-2xl font-black text-[8px] uppercase tracking-widest shadow-2xl flex items-center gap-3"
                        >
                            <FiX size={16} />
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
            className={`group relative rounded-2xl md:rounded-[2.5rem] border transition-all p-3 md:p-4 cursor-pointer flex flex-col h-full
                ${isSelected 
                    ? "bg-oro/[0.03] border-oro/50 shadow-lg scale-105 z-10" 
                    : isDisabled ? "bg-gray-900/50 border-white/5 opacity-10 grayscale cursor-not-allowed" : "bg-white/[0.01] border-white/5 hover:border-oro/20"
                }
            `}
        >
            <div className="flex flex-col h-full space-y-3">
                <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                        <h3 className="font-black text-[9px] md:text-sm leading-tight mb-1 whitespace-normal">{artist.name}</h3>
                        <span className="text-[6px] md:text-[8px] font-black uppercase text-oro/60 tracking-widest">
                            {artist.cost} Arm.
                        </span>
                    </div>
                    {isSelected && <FiCheck className="text-oro" size={14} />}
                </div>

                <div className="aspect-[4/5] w-full rounded-xl md:rounded-2xl bg-black overflow-hidden border border-white/5 shadow-lg relative">
                    {artist.image ? (
                        <img src={artist.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black opacity-[0.03]">{artist.name.charAt(0)}</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
