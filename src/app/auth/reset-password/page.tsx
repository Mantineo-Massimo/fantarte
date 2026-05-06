"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Token mancante o non valido.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Le password non coincidono.");
            return;
        }

        if (password.length < 8) {
            setError("La password deve avere almeno 8 caratteri.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else {
                const msg = await response.text();
                setError(msg || "Errore durante il ripristino.");
            }
        } catch (err) {
            setError("Errore di connessione. Riprova.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-6">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <FiCheckCircle className="text-green-500 text-4xl" />
                    </div>
                </div>
                <h2 className="font-display text-2xl font-black tracking-tighter uppercase mb-4">Password Aggiornata!</h2>
                <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                    La tua password è stata ripristinata con successo. Verrai reindirizzato al login tra pochi istanti.
                </p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3 }}
                        className="h-full bg-oro"
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-10">
                <h1 className="font-display text-3xl font-black tracking-tighter uppercase mb-3">Nuova Password</h1>
                <p className="text-gray-500 font-medium text-sm">Inserisci una nuova password sicura per il tuo account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Nuova Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Conferma Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 text-red-500 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                    >
                        <FiAlertCircle className="shrink-0" size={18} />
                        <p>{error}</p>
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full py-4 rounded-2xl bg-oro text-blunotte font-display font-black text-lg uppercase tracking-wider hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
                >
                    {loading ? "Aggiornamento..." : "Aggiorna Password"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.1),transparent_50%)] pointer-events-none" />
            
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

                <Suspense fallback={<div className="text-center text-oro animate-pulse font-bold tracking-widest uppercase text-xs">Verifica token...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </main>
    );
}
