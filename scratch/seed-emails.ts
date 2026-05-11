import 'dotenv/config'
import { Client } from 'pg'

const client = new Client({
    connectionString: process.env.DATABASE_URL
})

async function main() {
    console.log('Seeding Email Templates (Direct SQL)...')
    await client.connect()

    const templates = [
        {
            type: 'WELCOME',
            subject: 'Benvenuto su FantArte! 🎨 Verifica la tua email',
            content: '<h2>Ciao {nome}!</h2><p>Grazie per esserti registrato su <b>FantArte</b>, il fantagioco ufficiale della Piazza dell\'Arte.</p><p>Per iniziare la tua avventura e creare la tua squadra, devi prima verificare il tuo account cliccando sul pulsante qui sotto:</p><p>{link}</p><p>Se il pulsante non funziona, copia questo link nel tuo browser.</p>'
        },
        {
            type: 'TEAM_CREATION',
            subject: 'Squadra Creata con Successo! ✨',
            content: '<h2>Ottimo lavoro, {nome}!</h2><p>La tua squadra <b>{squadra}</b> è stata registrata correttamente.</p><p>Ora non ti resta che attendere l\'inizio dell\'evento e scalare le classifiche!</p><p>Puoi visualizzare la tua squadra in ogni momento nell\'area riservata.</p>'
        },
        {
            type: 'POINTS_ASSIGNED',
            subject: 'Nuovo Punteggio per la tua Squadra! 🏆',
            content: '<h2>Ehi {nome}!</h2><p>Ci sono novità per la tua squadra <b>{squadra}</b>.</p><p>Uno dei tuoi artisti ha appena ricevuto un aggiornamento di punteggio: <b>{punti} punti!</b></p><p>Controlla subito la classifica aggiornata per vedere la tua posizione.</p>'
        }
    ]

    for (const t of templates) {
        const query = `
            INSERT INTO "EmailSetting" (id, type, enabled, subject, content, "updatedAt")
            VALUES (gen_random_uuid(), $1, true, $2, $3, NOW())
            ON CONFLICT (type) DO UPDATE 
            SET subject = EXCLUDED.subject, content = EXCLUDED.content, "updatedAt" = NOW()
        `;
        await client.query(query, [t.type, t.subject, t.content])
        console.log(`Upserted: ${t.type}`)
    }

    console.log('Email Seeding finished (Direct SQL).')
}

main()
    .catch(console.error)
    .finally(() => client.end())
