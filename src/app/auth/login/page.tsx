"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { searchParams } = new URL(typeof window !== "undefined" ? window.location.href : "http://localhost");
    const isVerified = searchParams.get("verified") === "true";

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

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
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-oro opacity-10 rounded-full blur-3xl"></div>

                <div className="flex justify-center mb-6">
                    <Image
                        src="/fanta-logo.png"
                        alt="FantaPiazza Logo"
                        width={200}
                        height={80}
                        className="h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Accedi</h1>
                    <p className="text-gray-400">Bentornato nella Piazza dell&apos;Arte.</p>
                </div>

                {isVerified && !error && (
                    <div className="mb-6 p-4 bg-green-900/40 border border-green-500/50 text-green-100 rounded-2xl text-center text-sm font-bold animate-pulse">
                        ✨ Email verificata! Ora puoi accedere.
                    </div>
                )}

                <form onSubmit={loginUser} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro focus:ring-1 focus:ring-oro transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro focus:ring-1 focus:ring-oro transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-center space-y-2">
                            <p className="text-red-500 text-sm">{error}</p>
                            {error === "Email non verificata. Controlla la tua casella di posta." && (
                                <button
                                    type="button"
                                    onClick={resendVerification}
                                    disabled={isLoading}
                                    className="text-oro text-xs font-bold hover:underline disabled:opacity-50"
                                >
                                    {isLoading ? "Invio in corso..." : "Rinvia email di verifica"}
                                </button>
                            )}
                        </div>
                    )}

                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ocra to-oro text-blunotte font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(204,119,34,0.3)] mt-4"
                    >
                        Entra
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-8 text-sm">
                    Non hai ancora una squadra?{" "}
                    <Link href="/auth/register" className="text-oro font-semibold hover:underline">
                        Registrati qui
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
