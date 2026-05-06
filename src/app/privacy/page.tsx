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

const Section = ({ num, title, children }: { num: number | string; title: string; children: React.ReactNode }) => (
    <section>
        <h2 className="text-oro font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-oro/20 flex items-center justify-center text-oro font-black text-[10px]">
                {num}
            </span>
            {title}
        </h2>
        {children}
    </section>
);

const Divider = () => <div className="border-t border-gray-800/60" />;

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
                        <p className="text-gray-500 text-xs mt-2">
                            Piattaforma <strong className="text-gray-400">FantArte</strong> — il fantagioco ufficiale dell&apos;evento Piazza dell&apos;Arte
                        </p>
                    </div>

                    {/* Card container */}

                    <motion.div
                        variants={sectionVariants}
                        transition={{ delay: 0.1 }}
                        className="bg-[#131d36] p-8 md:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-10"
                    >
                        {/* Sezione 1 - Contitolari */}
                        <Section num={1} title="Contitolari del Trattamento">
                            <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                                I dati personali degli utenti della piattaforma <strong className="text-white">FantArte</strong> sono trattati in regime di{" "}
                                <strong className="text-white">contitolarità</strong>, ai sensi dell&apos;art. 26 del GDPR, dalle seguenti associazioni organizzatrici dell&apos;evento Piazza dell&apos;Arte:
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
                                I Contitolari hanno definito le rispettive responsabilità mediante apposito accordo interno ai sensi dell&apos;art. 26 del GDPR.{" "}
                                <Link href="/accordo" className="text-oro hover:underline">Consulta l&apos;Accordo di Collaborazione →</Link>
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 2 - Data Processor */}
                        <Section num={2} title="Responsabile del Trattamento (Data Processor)">
                            <p className="text-gray-300 leading-relaxed text-sm">
                                Il sig. <strong className="text-white">Massimo Mantineo</strong> (C.F. MNTMSM03S10F158Y) è designato quale{" "}
                                <strong className="text-white">Responsabile Tecnico</strong> (Data Processor) da entrambe le associazioni contitolari, incaricato in via esclusiva dello sviluppo, della manutenzione e della sicurezza dell&apos;infrastruttura informatica della piattaforma FantArte.
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 3 - Dati Raccolti */}
                        <Section num={3} title="Tipologia di Dati Raccolti">
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                La piattaforma FantArte raccoglie esclusivamente i dati strettamente necessari alla fruizione del servizio di fantagioco, forniti volontariamente dall&apos;utente in fase di registrazione:
                            </p>
                            <ul className="space-y-3 text-sm">
                                {[
                                    {
                                        label: "Dati di accesso",
                                        value: "Indirizzo email (utilizzato come credenziale di accesso) e password (conservata in forma crittografata e non leggibile)"
                                    },
                                    {
                                        label: "Dati del giocatore",
                                        value: "Nome del team/squadra creata dall'utente all'interno del gioco"
                                    },
                                    {
                                        label: "Dati tecnici",
                                        value: "Indirizzi IP, log di accesso e cookie tecnici essenziali al funzionamento della piattaforma"
                                    },
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
                            <p className="text-gray-500 text-xs mt-4">
                                FantArte <strong className="text-gray-400">non raccoglie</strong> dati particolari ai sensi dell&apos;art. 9 GDPR, né dati relativi a matricola, dipartimento, o altri dati accademici.
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 4 - Finalità */}
                        <Section num={4} title="Finalità e Base Giuridica del Trattamento">
                            <div className="space-y-4 text-sm">
                                {[
                                    {
                                        title: "Erogazione del Servizio di Fantagioco",
                                        desc: "Gestione dell'account utente, creazione e gestione della squadra, partecipazione alle classifiche e alla competizione di FantArte legata all'evento Piazza dell'Arte.",
                                        base: "Art. 6, par. 1, lett. b) GDPR — necessario per l'esecuzione del contratto. Il conferimento è obbligatorio per accedere al servizio.",
                                    },
                                    {
                                        title: "Verifica dell'Identità e Sicurezza dell'Account",
                                        desc: "Invio di email di verifica dell'indirizzo al momento della registrazione, al fine di garantire l'autenticità dell'account e la sicurezza del servizio.",
                                        base: "Art. 6, par. 1, lett. f) GDPR — legittimo interesse dei Contitolari a prevenire account fraudolenti.",
                                    },
                                    {
                                        title: "Comunicazioni Relative all'Evento",
                                        desc: "Invio di aggiornamenti e notifiche strettamente connesse alla competizione FantArte e all'evento Piazza dell'Arte (es. inizio gara, risultati, vincitori).",
                                        base: "Art. 6, par. 1, lett. b) GDPR — esecuzione del servizio.",
                                    },
                                    {
                                        title: "Adempimento di Obblighi di Legge",
                                        desc: "Conservazione dei dati nei limiti e nei termini previsti dalla normativa vigente.",
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
                        </Section>

                        <Divider />

                        {/* Sezione 5 - Destinatari */}
                        <Section num={5} title="Destinatari dei Dati e Trasferimento all'Estero">
                            <p className="text-gray-300 leading-relaxed text-sm mb-3">
                                I dati personali <strong className="text-white">non saranno mai ceduti a terzi per scopi commerciali o promozionali</strong>. Potranno essere comunicati, nei limiti strettamente necessari, a soggetti terzi che forniscono servizi tecnici essenziali per il funzionamento della piattaforma (hosting, database, servizio email di verifica account), debitamente nominati Responsabili Esterni del Trattamento.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Qualora fossero utilizzati servizi basati al di fuori dello Spazio Economico Europeo, il trasferimento avverrà nel pieno rispetto del Capo V del GDPR, previa verifica di adeguate garanzie (Clausole Contrattuali Standard o decisioni di adeguatezza della Commissione Europea).
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 6 - Conservazione */}
                        <Section num={6} title="Periodo di Conservazione">
                            <div className="space-y-3 text-sm">
                                <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                    <p className="text-white font-bold mb-1">Dati dell&apos;account</p>
                                    <p className="text-gray-400">
                                        Conservati per tutta la durata del servizio FantArte e fino a esplicita richiesta di cancellazione da parte dell&apos;utente, oppure per un massimo di{" "}
                                        <strong className="text-white">12 mesi di inattività assoluta</strong> successivi alla conclusione dell&apos;edizione dell&apos;evento.
                                    </p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                    <p className="text-white font-bold mb-1">Dati relativi alle classifiche</p>
                                    <p className="text-gray-400">
                                        I risultati aggregati e le classifiche (senza dati personali identificativi) potranno essere conservati dai Contitolari a fini storici e promozionali per le edizioni future dell&apos;evento.
                                    </p>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-5 border border-gray-800">
                                    <p className="text-white font-bold mb-1">Log tecnici e di accesso</p>
                                    <p className="text-gray-400">
                                        Conservati per un massimo di <strong className="text-white">90 giorni</strong>, salvo necessità di conservazione più lunga per accertamento o esercizio di diritti in sede giudiziaria.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        <Divider />

                        {/* Sezione 7 - Diritti */}
                        <Section num={7} title="Diritti dell'Interessato">
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                L&apos;utente può esercitare in ogni momento i diritti previsti dagli artt. 15–22 del GDPR, rivolgendosi <strong className="text-white">indifferentemente a una delle due associazioni contitolari</strong>:
                            </p>
                            <div className="grid md:grid-cols-3 gap-3 mb-6 text-xs">
                                {[
                                    "Accesso ai propri dati",
                                    "Rettifica o aggiornamento",
                                    "Cancellazione (diritto all'oblio)",
                                    "Limitazione del trattamento",
                                    "Opposizione al trattamento",
                                    "Portabilità dei dati",
                                ].map((diritto) => (
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
                                Hai inoltre il diritto di proporre reclamo all&apos;Autorità Garante per la protezione dei dati personali:{" "}
                                <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-oro hover:underline">www.garanteprivacy.it</a>
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 8 - Sicurezza */}
                        <Section num={8} title="Sicurezza dei Dati">
                            <p className="text-gray-300 leading-relaxed text-sm">
                                La piattaforma adotta adeguate misure tecniche e organizzative per garantire la sicurezza dei dati personali, tra cui: connessioni{" "}
                                <strong className="text-white">HTTPS cifrate</strong>, archiviazione delle password tramite{" "}
                                <strong className="text-white">algoritmi di hashing crittografici</strong> (le password non sono mai leggibili in chiaro), e controllo degli accessi riservato al solo Responsabile Tecnico.
                            </p>
                        </Section>

                        <Divider />

                        {/* Sezione 9 - Cookie */}
                        <Section num={9} title="Cookie e Tecnologie di Tracciamento">
                            <p className="text-gray-300 leading-relaxed text-sm mb-3">
                                FantArte utilizza esclusivamente <strong className="text-white">cookie tecnici e di sessione</strong>, strettamente necessari al funzionamento dell&apos;autenticazione (NextAuth) e alla memorizzazione delle tue preferenze di consenso. 
                            </p>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                Utilizziamo inoltre strumenti di analisi anonimizzati forniti da <strong className="text-white">Vercel (Analytics & Speed Insights)</strong> per monitorare le performance della piattaforma senza raccogliere dati personali identificativi degli utenti.
                            </p>
                            <div className="bg-white/[0.03] rounded-2xl p-4 border border-gray-800 text-xs text-gray-400">
                                I cookie tecnici non richiedono il consenso preventivo dell&apos;utente, tuttavia mettiamo a disposizione un banner informativo per garantirti la massima trasparenza sulla gestione della tua sessione.
                            </div>
                        </Section>

                        {/* Footer del documento */}
                        <div className="mt-4 pt-8 border-t border-gray-800 text-center space-y-2">
                            <p className="text-gray-500 text-xs">
                                Documento redatto a <strong className="text-gray-400">Messina</strong> il <strong className="text-gray-400">5 Maggio 2026</strong>
                            </p>
                            <p className="text-gray-600 text-[10px] italic">
                                Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
                            </p>
                            <Link href="/accordo" className="inline-block mt-4 text-oro text-xs hover:underline">
                                Consulta l&apos;Accordo di Collaborazione Morgana–ORUM →
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
