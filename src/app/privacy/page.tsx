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

export default function PrivacyPage() {
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
                            Informativa sulla <span className="text-oro">Privacy</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Ai sensi degli artt. 13 e 14 del{" "}
                            <strong className="text-gray-300">Regolamento (UE) 2016/679 (GDPR)</strong>
                        </p>
                    </div>

                    {/* Card container */}
                    <motion.div
                        variants={sectionVariants}
                        transition={{ delay: 0.1 }}
                        className="bg-[#131d36] p-8 md:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-10"
                    >
                        {/* Sezione 1 - Contitolari */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">1</span>
                                Contitolari del Trattamento
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                                I dati personali sono trattati in regime di <strong className="text-white">contitolarità</strong>, ai sensi dell&apos;art. 26 del GDPR, da:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-5 border border-gray-700">
                                    <p className="text-white font-bold text-sm mb-1">Associazione Morgana</p>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        Via Del Vespro n°57, 98123 Messina<br />
                                        C.F. 97103490831<br />
                                        Presidente: Giuseppe Di Giorgio<br />
                                        <a href="mailto:associazione.morgana@gmail.com" className="text-oro hover:underline">associazione.morgana@gmail.com</a>
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-gray-700">
                                    <p className="text-white font-bold text-sm mb-1">Associazione O.R.U.M.</p>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        Contrada Petraro Top Residence Ganzirri, 98165 Messina<br />
                                        C.F. 27068650833<br />
                                        Presidente: Luigi Grillo<br />
                                        <a href="mailto:orum.unime@gmail.com" className="text-oro hover:underline">orum.unime@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                                I Contitolari hanno stipulato un apposito accordo interno, ai sensi dell&apos;art. 26 del GDPR, con cui hanno definito le rispettive responsabilità.{" "}
                                <Link href="/accordo" className="text-oro hover:underline">Consulta l&apos;Accordo di Collaborazione →</Link>
                            </p>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 2 - Data Processor */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">2</span>
                                Responsabile del Trattamento (Data Processor)
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Il sig. <strong className="text-white">Massimo Mantineo</strong> (C.F. MNTMSM03S10F158Y) è designato quale <strong className="text-white">Responsabile Tecnico</strong> (Data Processor), incaricato della gestione, manutenzione e sicurezza dell&apos;infrastruttura informatica e del database degli utenti.
                            </p>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 3 - Dati Raccolti */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">3</span>
                                Tipologia di Dati Raccolti
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Il portale raccoglie i seguenti dati forniti volontariamente dall&apos;utente in fase di registrazione:
                            </p>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { label: "Dati identificativi e anagrafici", value: "Nome, Cognome, Data di Nascita" },
                                    { label: "Dati di contatto", value: "Indirizzo Email (utilizzato anche come credenziale di accesso)" },
                                    { label: "Dati accademici", value: "Numero di Matricola, Dipartimento e Corso di Laurea" },
                                    { label: "Dati logistici", value: "Status di studente residente o fuorisede" },
                                    { label: "Dati tecnici", value: "Indirizzi IP, log di accesso, cookie tecnici e statistici" },
                                ].map((item) => (
                                    <li key={item.label} className="flex gap-3 items-start bg-white/[0.03] rounded-xl px-4 py-3 border border-gray-800">
                                        <span className="w-2 h-2 rounded-full bg-oro mt-1.5 shrink-0" />
                                        <span>
                                            <strong className="text-white">{item.label}:</strong>{" "}
                                            <span className="text-gray-400">{item.value}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 4 - Finalità */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">4</span>
                                Finalità e Base Giuridica del Trattamento
                            </h2>
                            <div className="space-y-4 text-sm">
                                {[
                                    {
                                        title: "Esecuzione del Servizio",
                                        desc: "Creazione dell'area riservata, gestione delle prenotazioni agli eventi studenteschi, scarico degli attestati e verifica dello status di studente UniMe.",
                                        base: "Art. 6, par. 1, lett. b) GDPR — conferimento obbligatorio per usufruire dei servizi.",
                                    },
                                    {
                                        title: "Marketing Diretto e Comunicazioni",
                                        desc: "Invio di newsletter informative, comunicazioni relative a convenzioni e news universitarie. I consensi sono richiesti separatamente per ORUM e Morgana.",
                                        base: "Art. 6, par. 1, lett. a) GDPR — consenso esplicito, facoltativo.",
                                    },
                                    {
                                        title: "Legittimo Interesse",
                                        desc: "Analisi statistiche aggregate per il miglioramento dei servizi, valutazione degli eventi e sicurezza informatica della piattaforma.",
                                        base: "Art. 6, par. 1, lett. f) GDPR.",
                                    },
                                    {
                                        title: "Adempimento di Obblighi di Legge",
                                        desc: "Corretta tenuta di registri o rendicontazioni richieste da normative vigenti o bandi di ateneo (es. liste dei partecipanti).",
                                        base: "Art. 6, par. 1, lett. c) GDPR.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                        <p className="text-white font-bold mb-1">{item.title}</p>
                                        <p className="text-gray-400 mb-2 leading-relaxed">{item.desc}</p>
                                        <p className="text-gray-600 text-xs italic">{item.base}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 5 - Destinatari */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">5</span>
                                Destinatari dei Dati e Trasferimento all&apos;Estero
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-3">
                                I dati personali <strong className="text-white">non saranno mai ceduti a terzi per scopi commerciali</strong>. Potranno essere comunicati, nei limiti strettamente necessari, a soggetti terzi che forniscono servizi essenziali per il funzionamento del portale (hosting, database, email), debitamente nominati Responsabili Esterni del Trattamento.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Qualora fossero utilizzati servizi basati al di fuori dello Spazio Europeo, il trasferimento avverrà nel pieno rispetto del Capo V del GDPR, previa verifica di adeguate garanzie (Clausole Contrattuali Standard o accordi di adeguatezza).
                            </p>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 6 - Conservazione */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">6</span>
                                Periodo di Conservazione
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                    <p className="text-white font-bold mb-1">Dati di account</p>
                                    <p className="text-gray-400">Mantenuti fino a esplicita richiesta di cancellazione, oppure per un massimo di <strong className="text-white">24 mesi di inattività assoluta</strong>.</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                    <p className="text-white font-bold mb-1">Dati relativi agli eventi</p>
                                    <p className="text-gray-400">Conservati per i <strong className="text-white">10 anni successivi all&apos;evento</strong>, ove necessario per fini di rendicontazione amministrativa o tutela legale.</p>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 7 - Diritti */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">7</span>
                                Diritti dell&apos;Interessato
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                L&apos;utente può esercitare in ogni momento i diritti previsti dal GDPR (artt. 15–22), rivolgendosi <strong className="text-white">indifferentemente a una delle due associazioni</strong>:
                            </p>
                            <div className="grid md:grid-cols-3 gap-3 mb-6 text-xs">
                                {["Accesso ai propri dati", "Rettifica o cancellazione (diritto all'oblio)", "Limitazione del trattamento", "Opposizione al trattamento", "Portabilità dei dati", "Revoca del consenso marketing"].map((diritto) => (
                                    <div key={diritto} className="bg-oro/5 border border-oro/20 rounded-xl px-4 py-3 text-gray-300 text-center">
                                        {diritto}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 text-sm">
                                <a href="mailto:orum.unime@gmail.com" className="flex-1 bg-white/5 hover:bg-oro/10 transition-colors border border-gray-700 hover:border-oro/40 rounded-2xl px-5 py-3 text-center">
                                    <span className="text-gray-400 block text-xs mb-1">Scrivi a ORUM</span>
                                    <span className="text-oro text-xs font-bold">orum.unime@gmail.com</span>
                                </a>
                                <a href="mailto:associazione.morgana@gmail.com" className="flex-1 bg-white/5 hover:bg-oro/10 transition-colors border border-gray-700 hover:border-oro/40 rounded-2xl px-5 py-3 text-center">
                                    <span className="text-gray-400 block text-xs mb-1">Scrivi a Morgana</span>
                                    <span className="text-oro text-xs font-bold">associazione.morgana@gmail.com</span>
                                </a>
                            </div>
                            <p className="text-gray-500 text-xs mt-4">
                                Hai inoltre il diritto di proporre reclamo all&apos;Autorità Garante:{" "}
                                <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-oro hover:underline">www.garanteprivacy.it</a>
                            </p>
                        </section>

                        <div className="border-t border-gray-800/60" />

                        {/* Sezione 8 - Sicurezza */}
                        <section>
                            <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">8</span>
                                Sicurezza dei Dati
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                I dati sono protetti tramite adeguate misure tecniche (connessioni <strong className="text-white">HTTPS cifrate</strong> e crittografia forte delle password tramite <strong className="text-white">hashing</strong>) e organizzative, al fine di garantire un livello di sicurezza commisurato al rischio, prevenendo accessi non autorizzati, divulgazione, modifica o distruzione non autorizzata dei dati.
                            </p>
                        </section>

                        {/* Footer del documento */}
                        <div className="mt-4 pt-8 border-t border-gray-800 text-center space-y-2">
                            <p className="text-gray-500 text-xs">
                                Documento redatto a <strong className="text-gray-400">Messina</strong> il <strong className="text-gray-400">29 Aprile 2026</strong>
                            </p>
                            <p className="text-gray-600 text-[10px] italic">
                                Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
                            </p>
                            <Link href="/accordo" className="inline-block mt-4 text-oro text-xs hover:underline">
                                Consulta anche l&apos;Accordo di Collaborazione Morgana–ORUM →
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
