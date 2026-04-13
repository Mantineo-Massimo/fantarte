"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Image from "next/image";

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
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                throw new Error("Errore durante la richiesta");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Qualcosa è andato storto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-oro opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-viola opacity-10 rounded-full blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#131d36]/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <Image
                        src="/fanta-logo.png"
                        alt="FantaPiazza Logo"
                        width={200}
                        height={80}
                        className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    />
                </div>

                {!success ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black tracking-tight mb-2">Recupero Password</h1>
                            <p className="text-gray-400">Inserisci la tua email e ti invieremo un link per resettare la password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-oro uppercase tracking-widest ml-1">Email di registrazione</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-oro transition-all"
                                        placeholder="mario.rossi@esempio.it"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-900/20 py-2 rounded-xl border border-red-500/30">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-oro to-ocra text-blunotte font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest"
                            >
                                {loading ? "Invio in corso..." : "Invia Link di Reset"}
                            </button>
                        </form>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-20 h-20 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Email Inviata!</h2>
                        <p className="text-gray-400 mb-8">
                            Se l&apos;email è presente nei nostri sistemi, troverai le istruzioni per il reset nella tua casella di posta.
                        </p>
                        <Link 
                            href="/auth/login"
                            className="text-oro font-bold hover:underline inline-flex items-center gap-2"
                        >
                            Torna al Login
                        </Link>
                    </motion.div>
                )}

                {!success && (
                    <div className="mt-10 pt-8 border-t border-gray-800/50 text-center">
                        <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2">
                            <FiArrowLeft /> Torna al Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
