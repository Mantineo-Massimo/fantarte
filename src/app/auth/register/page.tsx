"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "" });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!acceptTerms) {
            setError("Devi accettare i termini e la privacy policy.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    acceptMarketing
                }),
            });

            if (response.ok) {
                router.push("/auth/login?registered=true");
            } else {
                const msg = await response.text();
                setError(msg || "Errore durante la registrazione.");
            }
        } catch (err) {
            setError("Errore di connessione. Riprova.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.1),transparent_50%)] pointer-events-none" />
            
            <Link 
                href="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest z-20 group"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Torna alla Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass rounded-[2.5rem] p-10 border border-white/10 shadow-3xl relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src="/fanta-logo.png"
                            alt="FantArte"
                            width={180}
                            height={70}
                            className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                        />
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-display text-4xl font-black tracking-tighter uppercase mb-3">Registrati</h1>
                    <p className="text-gray-500 font-medium">Unisciti alle leghe di Morgana e Orum.</p>
                </div>

                <form onSubmit={registerUser} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="tua@email.it"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <label className="flex items-start gap-3 group cursor-pointer">
                            <div className="relative flex items-center justify-center shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="peer appearance-none w-5 h-5 border border-white/10 rounded-md bg-white/5 checked:bg-oro checked:border-oro transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-blunotte opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-500 leading-tight group-hover:text-gray-400 transition-colors">
                                Accetto il <Link href="/regole" className="text-oro hover:underline">Regolamento</Link> e confermo di aver letto la <Link href="/privacy" className="text-oro hover:underline">Privacy Policy</Link> *
                            </span>
                        </label>

                        <label className="flex items-start gap-3 group cursor-pointer">
                            <div className="relative flex items-center justify-center shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptMarketing}
                                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                                    className="peer appearance-none w-5 h-5 border border-white/10 rounded-md bg-white/5 checked:bg-oro checked:border-oro transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-blunotte opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-500 leading-tight group-hover:text-gray-400 transition-colors">
                                Desidero ricevere aggiornamenti sulle attività delle associazioni Morgana e O.R.U.M. (Facoltativo)
                            </span>
                        </label>
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-oro text-blunotte font-display font-black text-lg uppercase tracking-wider hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
                    >
                        {loading ? "Creazione in corso..." : "Crea Account"}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-10 text-sm font-medium">
                    Hai già un account?{" "}
                    <Link href="/auth/login" className="text-oro font-bold hover:underline transition-all">
                        Accedi
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}


