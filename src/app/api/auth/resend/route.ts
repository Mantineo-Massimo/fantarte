import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { verificationEmail } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return new NextResponse("Email richiesta", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Per sicurezza, non riveliamo se l'utente esiste o meno
            return NextResponse.json({ message: "Se l'account esiste e non è verificato, riceverai un'email." });
        }

        if (user.emailVerified) {
            return new NextResponse("Email già verificata", { status: 400 });
        }

        // Generate a new token if one doesn't exist, or reuse existing
        const verificationToken = user.verificationToken || crypto.randomUUID();

        if (!user.verificationToken) {
            await prisma.user.update({
                where: { id: user.id },
                data: { verificationToken }
            });
        }

        // Send Verification Email
        const emailSent = await sendEmail({
            to: email,
            subject: "Verifica il tuo account FantArte 🎠",
            body: verificationEmail(verificationToken)
        });

        if (!emailSent.success) {
            console.error("RESEND_EMAIL_ERROR", emailSent.error);
            return new NextResponse("Errore nell'invio dell'email", { status: 500 });
        }

        return NextResponse.json({ message: "Email di verifica inviata con successo." });
    } catch (error) {
        console.error("RESEND_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
