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

const Divider = () => <div className="border-t border-gray-800/60" />;

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
                            Accordo di Collaborazione e Contitolarità Dati per la piattaforma{" "}
                            <strong className="text-gray-300">FantArte</strong> — <strong className="text-gray-300">5 Maggio 2026</strong>
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
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Le associazioni Morgana e O.R.U.M. concordano la realizzazione e gestione comune della piattaforma web{" "}
                                <strong className="text-white">FantArte</strong>, il fantagioco ufficiale dell&apos;evento{" "}
                                <strong className="text-white">Piazza dell&apos;Arte</strong>. La piattaforma permette ai partecipanti di creare squadre di artisti, competere in classifiche e seguire in tempo reale i punteggi legati alle performance degli artisti durante l&apos;evento.
                            </p>
                            <div className="mt-4 bg-oro/5 border border-oro/20 rounded-2xl px-5 py-4 text-sm text-gray-300">
                                Il dominio web e l&apos;infrastruttura tecnica sono acquistati e formalmente intestati all&apos;<strong className="text-white">Associazione Morgana</strong>. L&apos;utilizzo operativo, i contenuti, il branding e la gestione del gioco sono condivisi <strong className="text-white">pariteticamente</strong> tra le due associazioni.
                            </div>
                        </section>

                        <Divider />

                        {/* Art. 2 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">2</span>
                                Art. 2 — Durata e Recesso
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Il presente accordo ha validità per l&apos;intera durata dell&apos;edizione corrente dell&apos;evento{" "}
                                <strong className="text-white">Piazza dell&apos;Arte</strong> e della relativa competizione FantArte (<strong className="text-white">Anno 2026</strong>). Le parti potranno concordare il rinnovo per le edizioni future mediante accordo scritto.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Ciascuna associazione può recedere anticipatamente con comunicazione scritta tramite email certificata o raccomandata A/R, con un{" "}
                                <strong className="text-white">preavviso minimo di 30 giorni</strong>.
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dominio e infrastruttura</span> — In caso di recesso, rimarranno in capo all&apos;Associazione Morgana.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dati degli utenti</span> — Gestiti in conformità al GDPR: agli utenti sarà garantito il diritto di cancellazione o portabilità prima di qualsiasi scissione operativa.</p>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Art. 3 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">3</span>
                                Art. 3 — Gestione Tecnica e Sviluppo
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Le parti nominano congiuntamente il Sig. <strong className="text-white">Massimo Mantineo</strong> (C.F. MNTMSM03S10F158Y) quale{" "}
                                <strong className="text-white">Responsabile Tecnico</strong> (e Data Processor ai fini Privacy), incaricato in via esclusiva dello sviluppo, aggiornamento, manutenzione ordinaria e straordinaria e sicurezza informatica della piattaforma FantArte e dei database ad essa collegati.
                            </p>
                            <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800 text-sm">
                                <p className="text-white font-bold mb-2">Assunzione di responsabilità e manleva</p>
                                <p className="text-gray-400 leading-relaxed">
                                    Il Responsabile Tecnico assume l&apos;intera ed esclusiva responsabilità per qualsiasi malfunzionamento, disservizio, vulnerabilità informatica o compromissione dell&apos;infrastruttura. I legali rappresentanti delle Associazioni O.R.U.M. e Morgana sono espressamente esonerati (manlevati) da qualsiasi responsabilità civile, penale o economica derivante da difetti tecnici o attacchi informatici imputabili alla piattaforma.
                                </p>
                            </div>
                        </section>

                        <Divider />

                        {/* Art. 4 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">4</span>
                                Art. 4 — Oneri e Costi
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Dominio</span> — Acquisto e mantenimento annuale a carico dell&apos;<strong className="text-white">Associazione Morgana</strong>.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Hosting, SSL e infrastruttura</span> — Ripartiti al <strong className="text-white">50%</strong> tra le due associazioni, salvo diverso accordo scritto per singola edizione.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800">
                                    <p className="text-gray-400"><span className="text-white font-bold">Compenso del Responsabile Tecnico</span> — Definito separatamente per iscritto tra le parti e il Responsabile Tecnico.</p>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Art. 5 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">5</span>
                                Art. 5 — Contitolarità dei Dati Personali (GDPR)
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Ai sensi dell&apos;art. 26 del Regolamento UE 2016/679 (GDPR), le associazioni O.R.U.M. e Morgana assumono il ruolo di{" "}
                                <strong className="text-white">Contitolari del Trattamento</strong> per i dati personali raccolti attraverso la piattaforma FantArte, e si impegnano a:
                            </p>
                            <div className="space-y-3 text-sm">
                                {[
                                    {
                                        title: "Trasparenza",
                                        desc: "Garantire agli utenti una chiara informativa privacy, accessibile in ogni momento dalla piattaforma, sulle finalità, le basi giuridiche e le modalità del trattamento dei dati."
                                    },
                                    {
                                        title: "Gestione delle Istanze degli Interessati",
                                        desc: "Rispondere tempestivamente alle richieste degli utenti (accesso, rettifica, cancellazione, ecc.). La parte che riceve una richiesta informa l'altra entro 48 ore lavorative."
                                    },
                                    {
                                        title: "Notifica di Data Breach",
                                        desc: "In caso di violazione dei dati personali, collaborare e darsi reciproca comunicazione scritta entro 24 ore dalla scoperta, per consentire la notifica al Garante nei termini previsti dall'art. 33 GDPR (72 ore)."
                                    },
                                    {
                                        title: "Responsabilità per Violazioni Tecniche",
                                        desc: "Il Responsabile Tecnico si assume l'intera responsabilità per violazioni GDPR o data breach imputabili a difetti dell'infrastruttura tecnica, tenendo indenni entrambe le associazioni."
                                    },
                                    {
                                        title: "Minimizzazione dei Dati",
                                        desc: "Raccogliere esclusivamente i dati strettamente necessari alla fruizione del servizio FantArte, in conformità al principio di minimizzazione di cui all'art. 5, par. 1, lett. c) GDPR."
                                    },
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

                        <Divider />

                        {/* Art. 6 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">6</span>
                                Art. 6 — Regole del Gioco e Contenuti
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-3">
                                Le regole della competizione FantArte, i criteri di assegnazione dei punteggi agli artisti, la composizione delle squadre e ogni altra modalità di gioco sono definiti{" "}
                                <strong className="text-white">congiuntamente</strong> dalle due associazioni prima dell&apos;apertura delle registrazioni e pubblicati nella pagina Regolamento della piattaforma.
                            </p>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Qualsiasi modifica sostanziale alle regole in corso di competizione dovrà essere concordata per iscritto da entrambe le parti e comunicata agli utenti con adeguato anticipo.
                            </p>
                        </section>

                        <Divider />

                        {/* Art. 7 */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">7</span>
                                Art. 7 — Tutela del Brand e dell&apos;Immagine
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Le associazioni sono autorizzate all&apos;utilizzo reciproco di loghi e marchi{" "}
                                <strong className="text-white">esclusivamente nel contesto della piattaforma FantArte e dell&apos;evento Piazza dell&apos;Arte</strong> (es. materiali promozionali congiunti, comunicati stampa, locandine dell&apos;evento).
                            </p>
                            <p className="text-gray-400 leading-relaxed text-sm mt-3">
                                Qualsiasi utilizzo del nome o dell&apos;immagine dell&apos;altra associazione per iniziative separate o esterne a FantArte dovrà essere{" "}
                                <strong className="text-white">autorizzato preventivamente per iscritto</strong>.
                            </p>
                        </section>

                        {/* Link a privacy */}
                        <div className="pt-8 text-center">
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
