/**
 * FantArte Email Templates
 * Branded HTML templates for automated communications.
 */

const APP_COLOR_GOLD = "#bc9c5d";
const APP_COLOR_DARK_BLUE = "#0a0f1c";
const APP_COLOR_VIOLA = "#4d2c5e";

const BASE_URL = process.env.NEXTAUTH_URL || "https://fantarte.it";

/**
 * Modern HTML wrapper for all FantArte emails.
 * High-end Dark Theme with Gold accents.
 */
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FantArte</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #05070a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #ffffff;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #05070a;
            padding: 40px 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${APP_COLOR_DARK_BLUE};
            border-radius: 40px;
            overflow: hidden;
            border: 1px solid rgba(188, 156, 93, 0.1);
        }

        .header {
            padding: 60px 40px 40px;
            text-align: center;
            background: linear-gradient(to bottom, rgba(188, 156, 93, 0.05), transparent);
        }

        .logo {
            width: 220px;
            height: auto;
        }

        .content {
            padding: 0 50px 60px;
            text-align: center;
        }

        .h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: -0.04em;
            line-height: 1.1;
        }

        .gold-text {
            color: ${APP_COLOR_GOLD};
        }

        .text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 35px;
            color: #a0aec0;
        }

        .button-container {
            margin: 40px 0;
        }

        .button {
            display: inline-block;
            padding: 20px 45px;
            background-color: ${APP_COLOR_GOLD};
            color: #000000 !important;
            text-decoration: none;
            border-radius: 18px;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        .footer {
            padding: 40px;
            text-align: center;
            font-size: 11px;
            color: #4a5568;
            border-top: 1px solid rgba(255, 255, 255, 0.03);
            background-color: rgba(255, 255, 255, 0.01);
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(188, 156, 93, 0.3), transparent);
            margin: 40px 0;
            border: none;
        }

        .badge {
            display: inline-block;
            padding: 6px 12px;
            background: rgba(188, 156, 93, 0.1);
            color: ${APP_COLOR_GOLD};
            border-radius: 8px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img 
                    src="${BASE_URL}/fanta-logo.webp?v=1" 
                    alt="FantArte" 
                    width="220" 
                    style="display: block; margin: 0 auto; border: 0; width: 220px; height: auto;"
                >
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p style="margin-bottom: 10px; font-weight: bold; color: #718096;">&copy; ${new Date().getFullYear()} FANTARTE • LA PIAZZA DELL'ARTE</p>
                <p>Ricevi questa email perché sei un partecipante ufficiale del gioco.</p>
                <p style="margin-top: 20px;">
                    Associazioni Culturali Morgana & O.R.U.M.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;


export const welcomeEmail = (name: string) => emailWrapper(`
    <div class="badge">Benvenuto in Piazza</div>
    <h1 class="h1">Fondata la tua <span class="gold-text">Leggenda</span> 🎠</h1>
    <p class="text">
        Ciao <strong>${name}</strong>,<br><br>
        La tua iscrizione a <strong>FantArte</strong> è ora ufficiale. Sei pronto a gestire il tuo quintetto e scalare le classifiche della Piazza dell'Arte?
    </p>
    <div class="button-container">
        <a href="${BASE_URL}/team/create" class="button">Crea Squadra</a>
    </div>
    <p class="text" style="font-size: 14px;">
        Ricorda di scegliere con cura il tuo <strong>Capitano</strong> per massimizzare i bonus durante le performance!
    </p>
`);

export const verificationEmail = (token: string) => emailWrapper(`
    <div class="badge">Sicurezza Account</div>
    <h1 class="h1">Verifica la tua <span class="gold-text">Identità</span> 📧</h1>
    <p class="text">
        Grazie per esserti unito alla rivoluzione d'arte di FantArte.<br>
        Per attivare il tuo profilo e iniziare a giocare, clicca sul pulsante qui sotto:
    </p>
    <div class="button-container">
        <a href="${BASE_URL}/auth/verify?token=${token}" class="button">Verifica Account</a>
    </div>
    <hr class="divider">
    <p class="text" style="font-size: 11px; margin-bottom: 0;">
        Se il pulsante non funziona, copia questo link:<br>
        <span style="color: ${APP_COLOR_GOLD}; opacity: 0.7;">${BASE_URL}/auth/verify?token=${token}</span>
    </p>
`);

export const forgotPasswordEmail = (token: string) => emailWrapper(`
    <div class="badge">Recupero Accesso</div>
    <h1 class="h1">Resetta la tua <span class="gold-text">Password</span> 🗝️</h1>
    <p class="text">
        Abbiamo ricevuto una richiesta di ripristino password per il tuo account FantArte.<br>
        Se non sei stato tu, ignora pure questa email. Altrimenti, procedi qui:
    </p>
    <div class="button-container">
        <a href="${BASE_URL}/auth/reset-password?token=${token}" class="button">Resetta Password</a>
    </div>
    <hr class="divider">
    <p class="text" style="font-size: 11px; margin-bottom: 0;">
        Il link scadrà tra un'ora per motivi di sicurezza.
    </p>
`);

export const artistPointsEmail = (artistName: string, points: number, description: string) => emailWrapper(`
    <div class="badge">Aggiornamento Punteggio</div>
    <h1 class="h1">Nuovi Punti per <span class="gold-text">${artistName}</span> ⚡</h1>
    <p class="text">
        C'è stato un aggiornamento in classifica!<br>
        Il tuo artista ha ricevuto un nuovo evento:
    </p>
    <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 24px; border: 1px solid rgba(188,156,93,0.1); margin: 30px 0;">
        <p style="font-size: 14px; color: #718096; margin: 0 0 10px 0; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em;">Descrizione</p>
        <p style="font-size: 18px; color: #ffffff; font-weight: 700; margin: 0 0 20px 0;">"${description}"</p>
        <div style="font-size: 42px; font-weight: 900; color: ${points >= 0 ? '#48bb78' : '#f56565'}; tracking-tighter: -0.05em;">
            ${points > 0 ? '+' : ''}${points} <span style="font-size: 16px; color: #718096; font-weight: 400; letter-spacing: 0;">PT</span>
        </div>
    </div>
    <div class="button-container">
        <a href="${BASE_URL}/leaderboards" class="button">Vedi Classifica</a>
    </div>
`);

export const newArtistEmail = (name: string, cost: number) => emailWrapper(`
    <div class="badge">Nuovo Ingresso</div>
    <h1 class="h1">Un nuovo <span class="gold-text">Protagonista</span> 🎭</h1>
    <p class="text">
        Grandi novità! Un nuovo membro si è appena unito alla competizione di FantArte.
    </p>
    <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 24px; border: 1px solid rgba(188,156,93,0.1); margin: 30px 0;">
        <h2 style="font-size: 24px; color: #ffffff; margin: 0 0 5px 0;">${name}</h2>
        <p style="font-size: 14px; color: ${APP_COLOR_GOLD}; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">VALORE: ${cost} ARMONI</p>
    </div>
    <p class="text">
        Controlla subito se può fare al caso tuo e aggiorna la tua formazione!
    </p>
    <div class="button-container">
        <a href="${BASE_URL}/team/create" class="button">Gestisci Squadra</a>
    </div>
`);

export const ruleNotificationEmail = (title: string, points: number, description: string) => emailWrapper(`
    <div class="badge">Nuova Regola</div>
    <h1 class="h1">Aggiornamento <span class="gold-text">Regolamento</span> 📜</h1>
    <p class="text">
        È stata introdotta una nuova regola ufficiale per FantArte.<br>
        Ecco i dettagli:
    </p>
    <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 24px; border: 1px solid rgba(188,156,93,0.1); margin: 30px 0;">
        <h2 style="font-size: 20px; color: #ffffff; margin: 0 0 10px 0;">${title}</h2>
        <div style="display: inline-block; padding: 4px 10px; background: ${APP_COLOR_GOLD}; color: #000000; border-radius: 6px; font-weight: 900; font-size: 10px; margin-bottom: 15px;">
            VALORE: ${points > 0 ? '+' : ''}${points} PT
        </div>
        <p style="font-size: 14px; color: #a0aec0; margin: 0; line-height: 1.5;">${description}</p>
    </div>
    <div class="button-container">
        <a href="${BASE_URL}/regole" class="button">Vedi Regolamento</a>
    </div>
`);
