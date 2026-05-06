import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import * as jose from "jose";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return new NextResponse("Email richiesta", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Per sicurezza, non confermiamo se l'email esiste o meno
            return new NextResponse("Se l'email è registrata, riceverai un link di ripristino.", { status: 200 });
        }

        // Crea un JWT token
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const token = await new jose.SignJWT({ userId: user.id })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secret);

        const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

        const emailBody = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #050811; color: #ffffff; border-radius: 20px;">
                <h1 style="color: #FFD700; text-align: center; font-size: 24px;">Recupero Password - FantArte</h1>
                <p style="font-size: 16px; line-height: 1.5; color: #cccccc;">
                    Hai richiesto di reimpostare la password del tuo account FantArte. 
                    Clicca sul pulsante qui sotto per procedere:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #FFD700; color: #050811; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">Ripristina Password</a>
                </div>
                <p style="font-size: 14px; color: #666666; text-align: center;">
                    Questo link scadrà tra 1 ora. Se non hai richiesto tu il ripristino, ignora questa email.
                </p>
                <hr style="border: 0; border-top: 1px solid #1a1f2e; margin: 30px 0;">
                <p style="font-size: 12px; color: #444444; text-align: center;">
                    © ${new Date().getFullYear()} FantArte. Tutti i diritti riservati.
                </p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "Recupero Password - FantArte",
            body: emailBody,
            text: `Recupero Password - FantArte\n\nHai richiesto di reimpostare la password del tuo account FantArte. Clicca sul link qui sotto per procedere:\n\n${resetLink}\n\nQuesto link scadrà tra 1 ora. Se non hai richiesto tu il ripristino, ignora questa email.`,
        });

        return new NextResponse("Se l'email è registrata, riceverai un link di ripristino.", { status: 200 });
    } catch (error) {
        console.error("FORGOT_PASSWORD_ERROR", error);
        return new NextResponse("Errore del server", { status: 500 });
    }
}
