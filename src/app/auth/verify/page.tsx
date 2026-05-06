"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token di verifica mancante.");
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify?token=${token}`);
                if (response.ok) {
                    setStatus("success");
                } else {
                    const text = await response.text();
                    setStatus("error");
                    setMessage(text || "Il token non è valido o è già stato utilizzato.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Si è verificato un errore durante la verifica.");
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-10 rounded-[3rem] border border-white/10 text-center relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000 ${
                    status === "loading" ? "bg-oro" : status === "success" ? "bg-green-500" : "bg-red-500"
                }`} />

                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-center">
                                <FiLoader className="text-oro animate-spin" size={64} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Verifica in corso...</h2>
                            <p className="text-gray-500 text-sm">Stiamo confermando la tua identità artistica.</p>
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-center">
                                <FiCheckCircle className="text-green-500" size={80} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-3">Email Verificata!</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Complimenti, ora sei un membro ufficiale di <span className="text-white">FantArte</span>. 
                                    La tua avventura nella Piazza inizia ora.
                                </p>
                            </div>
                            <Link 
                                href="/auth/login" 
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blunotte font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-oro transition-all"
                            >
                                Accedi al Profilo <FiArrowRight />
                            </Link>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-center">
                                <FiXCircle className="text-red-500" size={80} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-3">Ops! Qualcosa è andato storto</h2>
                                <p className="text-red-400/60 text-sm font-medium">{message}</p>
                            </div>
                            <div className="pt-4 flex flex-col gap-3">
                                <Link 
                                    href="/auth/register" 
                                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Riprova Registrazione
                                </Link>
                                <Link href="/supporto" className="text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">
                                    Contatta il Supporto
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="text-oro animate-spin" size={40} />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
