"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isVerified = searchParams.get("verified") === "true";
    const registered = searchParams.get("registered") === "true";

    useEffect(() => {
        if (registered) {
            setSuccess("Registrazione completata! Controlla la tua email per verificare l'account.");
        }
    }, [registered]);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await signIn("credentials", {
                ...data,
                redirect: false,
            });

            if (response?.error) {
                if (response.error === "Email non verificata. Controlla la tua casella di posta.") {
                    setError(response.error);
                } else {
                    setError("Credenziali non valide.");
                }
            } else {
                router.push("/");
            }
        } catch (err) {
            setError("Errore di connessione.");
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerification = async () => {
        if (!data.email) {
            setError("Inserisci la tua email per rinviare la verifica.");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/auth/resend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            if (response.ok) {
                setSuccess("Email di verifica inviata! Controlla la tua posta.");
            } else {
                const msg = await response.text();
                setError(msg || "Errore nel rinvio dell'email.");
            }
        } catch (err) {
            setError("Errore di connessione.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <h1 className="font-display text-4xl font-black tracking-tighter uppercase mb-3">Accedi</h1>
                <p className="text-gray-500 font-medium">Bentornato nella Piazza dell&apos;Arte.</p>
            </div>

            {isVerified && !error && (
                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-center text-xs font-bold">
                    ✨ Email verificata! Ora puoi accedere.
                </div>
            )}

            <form onSubmit={loginUser} className="space-y-6">
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
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Password</label>
                        <Link href="/auth/forgot-password" className="text-[10px] font-bold text-oro/60 hover:text-oro transition-colors uppercase tracking-widest">
                            Dimenticata?
                        </Link>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                        required
                    />
                </div>

                {error && (
                    <div className="text-center space-y-3 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                        <p className="text-red-500 text-xs font-bold leading-tight">{error}</p>
                        {error === "Email non verificata. Controlla la tua casella di posta." && (
                            <button
                                type="button"
                                onClick={resendVerification}
                                disabled={isLoading}
                                className="text-oro text-[10px] font-black uppercase tracking-widest hover:underline disabled:opacity-50"
                            >
                                {isLoading ? "Invio..." : "Rinvia email di verifica"}
                            </button>
                        )}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-oro/10 border border-oro/20 text-oro text-xs font-bold rounded-2xl text-center leading-tight">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-oro text-blunotte font-display font-black text-lg uppercase tracking-wider hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
                >
                    {isLoading ? "Accesso..." : "Entra"}
                </button>
            </form>

            <p className="text-center text-gray-500 mt-10 text-sm font-medium">
                Non hai ancora un account?{" "}
                <Link href="/auth/register" className="text-oro font-bold hover:underline transition-all">
                    Registrati qui
                </Link>
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(204,119,34,0.05),transparent_50%)] pointer-events-none" />
            
            <Link 
                href="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest z-20 group"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Torna alla Home
            </Link>

            <Suspense fallback={<div className="text-oro animate-pulse uppercase tracking-[0.4em] font-bold text-xs">Caricamento...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
