"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const sectionVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

export default function AccordoPage() {
    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <span className="inline-block px-4 py-1 rounded-full bg-oro/10 text-oro text-xs font-bold uppercase tracking-widest border border-oro/20 mb-4">
                            Documento Legale
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                            Accordo di <span className="text-oro">Collaborazione</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Accordo di Collaborazione e Contitolarità Dati — <strong className="text-gray-300">29 Aprile 2026</strong>
                        </p>
                    </div>

                    {/* Parti dell'accordo */}
                    <motion.div
                        variants={sectionVariants}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-5 border border-gray-700">
                                <p className="text-oro text-[10px] font-black uppercase tracking-widest mb-2">Prima Parte</p>
                                <p className="text-white font-bold text-sm mb-1">Associazione Morgana</p>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Via Del Vespro n°57, 98123 Messina<br />
                                    C.F. 97103490831<br />
                                    Presidente: <strong className="text-gray-300">Giuseppe Di Giorgio</strong>
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border border-gray-700">
                                <p className="text-oro text-[10px] font-black uppercase tracking-widest mb-2">Seconda Parte</p>
                                <p className="text-white font-bold text-sm mb-1">Associazione O.R.U.M.</p>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Contrada Petraro Top Residence Ganzirri, 98165 Messina<br />
                                    C.F. 27068650833<br />
                                    Presidente: <strong className="text-gray-300">Luigi Grillo</strong>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card container */}
                    <motion.div
                        variants={sectionVariants}
                        transition={{ delay: 0.15 }}
                        className="bg-[#131d36] p-8 md:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-10"
                    >
                        {/* Art. 1 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">1</span>
                                Art. 1 — Oggetto dell&apos;Accordo
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Le parti concordano la gestione comune di un portale web unico finalizzato alla promozione di eventi studenteschi, alla divulgazione di news universitarie e all&apos;offerta di servizi agli associati.
                            </p>
                            <div className="mt-4 bg-oro/5 border border-oro/20 rounded-2xl px-5 py-4 text-sm text-gray-300">
                                Il dominio web è acquistato e tecnicamente intestato all&apos;<strong className="text-white">Associazione Morgana</strong>. L&apos;utilizzo pratico, i contenuti e il branding del portale sono condivisi <strong className="text-white">pariteticamente</strong> con l&apos;Associazione ORUM.
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Art. 2 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">2</span>
                                Art. 2 — Durata e Recesso
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Il presente accordo ha validità per l&apos;intera durata del mandato di rappresentanza studentesca corrente (<strong className="text-white">Biennio Accademico 2025–2027</strong>) e si intenderà tacitamente rinnovato alla sua scadenza.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Ciascuna associazione ha la facoltà di recedere in qualsiasi momento, previa comunicazione scritta tramite PEC o raccomandata A/R con un <strong className="text-white">preavviso minimo di 30 giorni</strong>.
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dominio e infrastruttura</span> — In caso di recesso, rimarranno in capo all&apos;Associazione Morgana.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dati degli utenti</span> — Gestiti in conformità al GDPR, garantendo il diritto di cancellazione o migrazione prima della scissione dei database.</p>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Art. 3 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">3</span>
                                Art. 3 — Gestione Tecnica e Sviluppo
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Le parti nominano congiuntamente il Sig. <strong className="text-white">Massimo Mantineo</strong> (C.F. MNTMSM03S10F158Y) quale <strong className="text-white">Responsabile Tecnico</strong> (e Data Processor ai fini Privacy), incaricato in via esclusiva dello sviluppo, aggiornamento, manutenzione ordinaria e straordinaria e sicurezza informatica della piattaforma web e dei database ad essa collegati.
                            </p>
                            <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800 text-sm">
                                <p className="text-white font-bold mb-2">Assunzione di responsabilità e manleva</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Il Responsabile Tecnico assume l&apos;intera ed esclusiva responsabilità per qualsiasi malfunzionamento, disservizio, vulnerabilità informatica o compromissione dell&apos;infrastruttura. I legali rappresentanti delle Associazioni ORUM e Morgana sono espressamente esonerati (manlevati) da qualsiasi responsabilità civile, penale o economica derivante da difetti tecnici o attacchi informatici.
                                </p>
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Art. 4 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">4</span>
                                Art. 4 — Oneri e Costi
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dominio</span> — Acquisto e mantenimento annuale a carico di <strong className="text-white">Associazione Morgana</strong>.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Hosting, SSL e infrastruttura</span> — Ripartiti al <strong className="text-white">50%</strong> tra le due associazioni, salvo diversi accordi interni annuali.</p>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Art. 5 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">5</span>
                                Art. 5 — Contitolarità dei Dati Personali (GDPR)
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Ai sensi dell&apos;art. 26 del Regolamento UE 2016/679 (GDPR), le associazioni ORUM e Morgana assumono il ruolo di <strong className="text-white">Contitolari del Trattamento</strong> e si impegnano a:
                            </p>
                            <div className="space-y-3 text-sm">
                                {[
                                    { title: "Trasparenza", desc: "Garantire agli utenti un'informativa chiara sulle finalità e basi giuridiche del trattamento." },
                                    { title: "Gestione delle Istanze", desc: "Rispondere alle richieste degli interessati. La parte che riceve la richiesta informa l'altra entro 48 ore lavorative." },
                                    { title: "Data Breach", desc: "In caso di violazione, collaborare e darsi comunicazione scritta entro 24 ore dalla scoperta per notificare il Garante." },
                                    { title: "Responsabilità e Sanzioni", desc: "Il Responsabile Tecnico si assume l'intera responsabilità per violazioni GDPR o data breach imputabili a difetti strutturali, tenendo indenni le due associazioni." },
                                    { title: "Supporto Operativo", desc: "Il Responsabile Tecnico cura l'attuazione delle misure di sicurezza e la gestione dei database." },
                                ].map((item, i) => (
                                    <div key={item.title} className="flex gap-3 bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                                        <div>
                                            <p className="text-white font-bold mb-1">{item.title}</p>
                                            <p className="text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Art. 6 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">6</span>
                                Art. 6 — Tutela del Brand e dell&apos;Immagine
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Le associazioni sono autorizzate all&apos;utilizzo reciproco dei loghi e dei marchi <strong className="text-white">esclusivamente per la promozione delle attività congiunte</strong> presenti sul portale (es. locandine di eventi co-organizzati, comunicati stampa condivisi).
                            </p>
                            <p className="text-gray-400 leading-relaxed text-sm mt-3">
                                Qualsiasi altro utilizzo del nome o dell&apos;immagine dell&apos;altra associazione per iniziative separate dovrà essere <strong className="text-white">autorizzato preventivamente per iscritto</strong>.
                            </p>
                        </section>

                        {/* Firme */}
                        <div className="border-t border-gray-800/60 pt-8">
                            <p className="text-gray-500 text-xs text-center mb-6 italic">
                                Letto, approvato e sottoscritto in <strong className="text-gray-400">Messina</strong>, lì <strong className="text-gray-400">29 Aprile 2026</strong>
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/[0.03] rounded-2xl p-6 border border-gray-800 text-center">
                                    <p className="text-white font-bold text-sm mb-1">Per Associazione ORUM</p>
                                    <p className="text-gray-400 text-xs italic mb-4">Luigi Grillo (Presidente)</p>
                                    <div className="border-b border-gray-700 w-32 mx-auto" />
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-6 border border-gray-800 text-center">
                                    <p className="text-white font-bold text-sm mb-1">Per Associazione Morgana</p>
                                    <p className="text-gray-400 text-xs italic mb-4">Giuseppe Di Giorgio (Presidente)</p>
                                    <div className="border-b border-gray-700 w-32 mx-auto" />
                                </div>
                            </div>
                            <div className="bg-white/[0.03] rounded-2xl p-6 border border-gray-800 text-center">
                                <p className="text-white font-bold text-sm mb-1">Il Responsabile Tecnico</p>
                                <p className="text-gray-400 text-xs italic mb-1">Massimo Mantineo</p>
                                <p className="text-gray-600 text-[10px] mb-4">Firma per presa visione e accettazione dell&apos;incarico</p>
                                <div className="border-b border-gray-700 w-32 mx-auto" />
                            </div>
                        </div>

                        {/* Link a privacy */}
                        <div className="text-center">
                            <Link href="/privacy" className="inline-block text-oro text-xs hover:underline">
                                ← Torna all&apos;Informativa sulla Privacy
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
