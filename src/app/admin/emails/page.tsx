"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiEdit3, FiToggleLeft, FiToggleRight, FiSave, FiCheck, FiInfo, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface EmailSetting {
    id: string;
    type: string;
    subject: string;
    content: string;
    enabled: boolean;
}

export default function AdminEmailsPage() {
    const [settings, setSettings] = useState<EmailSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const res = await fetch("/api/admin/emails");
        if (res.ok) {
            const data = await res.json();
            setSettings(data);
        }
        setLoading(false);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const res = await fetch("/api/admin/emails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, enabled: !currentStatus })
        });
        if (res.ok) {
            setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !currentStatus } : s));
            showSuccess("Stato aggiornato!");
        }
    };

    const handleSave = async (setting: EmailSetting) => {
        setSaving(true);
        const res = await fetch("/api/admin/emails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: setting.id,
                subject: setting.subject,
                content: setting.content
            })
        });
        if (res.ok) {
            setEditingId(null);
            showSuccess("Template salvato con successo!");
        }
        setSaving(false);
    };

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-blunotte flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-oro/20 border-t-oro rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-blunotte text-white p-6 md:p-12 pt-32">
            <div className="max-w-5xl mx-auto">
                
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/admin" className="inline-flex items-center gap-2 text-oro hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] mb-4">
                            <FiArrowLeft /> Dashboard Admin
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            Gestione <span className="text-oro">Email</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">Configura le notifiche automatiche e i template delle email.</p>
                    </div>

                    <AnimatePresence>
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm"
                            >
                                <FiCheck /> {success}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <div className="grid gap-6">
                    {settings.map((setting) => (
                        <motion.div 
                            key={setting.id}
                            layout
                            className={`glass rounded-[2.5rem] border ${editingId === setting.id ? 'border-oro/40' : 'border-white/5'} overflow-hidden transition-all`}
                        >
                            <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02]">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${setting.enabled ? 'bg-oro/10 text-oro' : 'bg-gray-800 text-gray-500'}`}>
                                        <FiMail />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight uppercase">{setting.type.replace('_', ' ')}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{setting.subject}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setEditingId(editingId === setting.id ? null : setting.id)}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
                                    >
                                        <FiEdit3 /> {editingId === setting.id ? 'Annulla' : 'Modifica'}
                                    </button>
                                    <button 
                                        onClick={() => handleToggle(setting.id, setting.enabled)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${setting.enabled ? 'bg-oro text-blunotte' : 'bg-gray-800 text-gray-500'}`}
                                    >
                                        {setting.enabled ? <><FiToggleRight size={18} /> Attiva</> : <><FiToggleLeft size={18} /> Disattivata</>}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {editingId === setting.id && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 bg-white/[0.01]"
                                    >
                                        <div className="p-8 space-y-6">
                                            <div className="grid gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Oggetto Email</label>
                                                    <input 
                                                        type="text"
                                                        value={setting.subject}
                                                        onChange={(e) => setSettings(prev => prev.map(s => s.id === setting.id ? { ...s, subject: e.target.value } : s))}
                                                        className="w-full bg-blunotte border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Contenuto (HTML supportato)</label>
                                                    <textarea 
                                                        rows={8}
                                                        value={setting.content}
                                                        onChange={(e) => setSettings(prev => prev.map(s => s.id === setting.id ? { ...s, content: e.target.value } : s))}
                                                        className="w-full bg-blunotte border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all font-medium resize-none leading-relaxed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-oro/5 border border-oro/10 rounded-2xl p-6 flex items-start gap-4">
                                                <FiInfo className="text-oro shrink-0 mt-1" />
                                                <div className="text-xs text-gray-400 leading-relaxed font-medium">
                                                    <p className="text-white font-bold mb-1 uppercase tracking-widest text-[9px]">Variabili Disponibili:</p>
                                                    Puoi usare i placeholder come <code className="text-oro bg-oro/10 px-1.5 py-0.5 rounded-md">{'{nome}'}</code>, <code className="text-oro bg-oro/10 px-1.5 py-0.5 rounded-md">{'{link}'}</code> o <code className="text-oro bg-oro/10 px-1.5 py-0.5 rounded-md">{'{punti}'}</code>. Verranno sostituiti automaticamente al momento dell&apos;invio.
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleSave(setting)}
                                                disabled={saving}
                                                className="w-full py-5 bg-oro text-blunotte font-black rounded-2xl uppercase tracking-widest text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-oro/10"
                                            >
                                                {saving ? 'Salvataggio...' : <><FiSave /> Salva Modifiche</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

            </div>
        </main>
    );
}
