"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowLeft, FiMail, FiCheckCircle } from "react-icons/fi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const msg = await response.text();
                setError(msg || "Errore durante l'invio dell'email.");
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
                href="/auth/login" 
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest z-20 group"
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Torna al Login
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass rounded-[2.5rem] p-10 border border-white/10 shadow-3xl relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src="/fanta-logo.webp"
                            alt="FantArte"
                            width={180}
                            height={70}
                            className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                        />
                    </Link>
                </div>

                {!success ? (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="font-display text-3xl font-black tracking-tighter uppercase mb-3">Recupero Password</h1>
                            <p className="text-gray-500 font-medium text-sm">Inserisci la tua email per ricevere un link di ripristino.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        placeholder="tua@email.it"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro/20 transition-all font-medium"
                                        required
                                    />
                                </div>
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
                                {loading ? "Invio in corso..." : "Invia Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <FiCheckCircle className="text-green-500 text-4xl" />
                            </div>
                        </div>
                        <h2 className="font-display text-2xl font-black tracking-tighter uppercase mb-4">Email Inviata!</h2>
                        <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                            Controlla la tua casella di posta. Abbiamo inviato un link per impostare la tua nuova password.
                        </p>
                        <Link 
                            href="/auth/login"
                            className="inline-block w-full py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                        >
                            Torna al Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
