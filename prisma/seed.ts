import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding Database...')

    // CREATE LEAGUES
    const leagues = ['Generale']

    for (const leagueName of leagues) {
        await prisma.league.upsert({
            where: { name: leagueName },
            update: {},
            create: { name: leagueName }
        })
        console.log(`Upserted League: ${leagueName}`)
    }

    // CREATE ARTISTS (Dummy Initial Data)
    const artistsData = [
        { name: 'Gaudenzi', cost: 30 },
        { name: 'Manna', cost: 25 },
        { name: 'Trovato', cost: 20 },
        { name: 'De Luca', cost: 15 },
        { name: 'Vitti', cost: 10 },
        { name: 'Bianchi', cost: 30 },
        { name: 'Rossi', cost: 25 },
    ]

    for (const artist of artistsData) {
        // Only insert, maybe we don't have a unique constraint on name, 
        // so let's find first or create
        const existingArtist = await prisma.artist.findFirst({
            where: { name: artist.name }
        })

        if (!existingArtist) {
            await prisma.artist.create({
                data: {
                    name: artist.name,
                    cost: artist.cost,
                }
            })
            console.log(`Created Artist: ${artist.name}`)
        }
    }
    
    // CREATE DEFAULT EMAIL TEMPLATES
    const emailTemplates = [
        {
            type: "WELCOME",
            subject: "Benvenuto su FantArte! 🎨 Verifica la tua email",
            content: "<h2>Ciao {nome}!</h2><p>Grazie per esserti registrato su <b>FantArte</b>, il fantagioco ufficiale della Piazza dell'Arte.</p><p>Per iniziare la tua avventura e creare la tua squadra, devi prima verificare il tuo account cliccando sul pulsante qui sotto:</p><p>{link}</p><p>Se il pulsante non funziona, copia questo link nel tuo browser.</p>"
        },
        {
            type: "TEAM_CREATION",
            subject: "Squadra Creata con Successo! ✨",
            content: "<h2>Ottimo lavoro, {nome}!</h2><p>La tua squadra <b>{squadra}</b> è stata registrata correttamente.</p><p>Ora non ti resta che attendere l'inizio dell'evento e scalare le classifiche!</p><p>Puoi visualizzare la tua squadra in ogni momento nell'area riservata.</p>"
        },
        {
            type: "POINTS_ASSIGNED",
            subject: "Nuovo Punteggio per la tua Squadra! 🏆",
            content: "<h2>Ehi {nome}!</h2><p>Ci sono novità per la tua squadra <b>{squadra}</b>.</p><p>Uno dei tuoi artisti ha appena ricevuto un aggiornamento di punteggio: <b>{punti} punti!</b></p><p>Controlla subito la classifica aggiornata per vedere la tua posizione.</p>"
        }
    ]

    for (const template of emailTemplates) {
        await prisma.emailSetting.upsert({
            where: { type: template.type },
            update: {},
            create: template
        })
        console.log(`Upserted Email Template: ${template.type}`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
