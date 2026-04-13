"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus, FiArrowLeft } from "react-icons/fi";

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({ 
        name: "", 
        surname: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
        phone: "",
        phone_confirm: "" 
    });
    const [error, setError] = useState("");

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            router.push("/auth/login");
        } else {
            const msg = await response.text();
            setError(msg || "Errore durante la registrazione.");
        }
    };

    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
             {/* Background Aesthetic */}
             <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-viola/10 rounded-full blur-[120px] pointer-events-none"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-oro/5 rounded-full blur-[120px] pointer-events-none"></div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-oro transition-colors group z-20">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Torna alla Piazza</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-xl glass rounded-[3rem] p-10 border-white/5 shadow-3xl relative z-10"
            >
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                   <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Image
                            src="/fanta-logo.png"
                            alt="FantaPiazza Logo"
                            width={180}
                            height={60}
                            className="h-10 w-auto object-contain glow-oro"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Iscrizione</h1>
                        <p className="text-gray-500 font-light text-sm">Crea il tuo profilo d&apos;artista per iniziare il draft.</p>
                    </div>
                </div>

                <form onSubmit={registerUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                                <FiUser /> Nome
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                                placeholder="Mario"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                                <FiUser /> Cognome
                            </label>
                            <input
                                type="text"
                                value={data.surname}
                                onChange={(e) => setData({ ...data, surname: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                                placeholder="Rossi"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                            <FiMail /> Mail d&apos;Artista
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                            placeholder="mario.rossi@esempio.it"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                            <FiPhone /> Telefono (opzionale)
                        </label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                            placeholder="+39 333 1234567"
                        />
                    </div>

                    {/* Honeypot Field - Hidden for humans */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                        <input
                            type="text"
                            name="phone_confirm"
                            value={data.phone_confirm}
                            onChange={(e) => setData({ ...data, phone_confirm: e.target.value })}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                                <FiLock /> Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                                <FiLock /> Conferma
                            </label>
                            <input
                                type="password"
                                value={data.confirmPassword}
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                className={`w-full bg-white/[0.03] border ${data.confirmPassword && data.password !== data.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {data.confirmPassword && data.password !== data.confirmPassword && (
                        <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-widest">Le password non coincidono</p>
                    )}

                    {error && (
                         <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-xs text-center font-black uppercase tracking-widest bg-red-400/10 py-3 rounded-2xl border border-red-400/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={data.password !== data.confirmPassword || !data.password}
                        className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-viola to-purple-600 text-white font-black text-xl uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiUserPlus /> Crea Profilo
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 font-light text-sm">
                        Hai già un account? <br />
                        <Link href="/auth/login" className="text-oro font-black uppercase tracking-widest text-xs hover:underline mt-2 inline-block">
                            Accedi qui
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
