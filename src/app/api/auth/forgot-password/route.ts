import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { forgotPasswordEmail } from "@/lib/email-templates";
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

        await sendEmail({
            to: email,
            subject: "Recupero Password - FantArte 🗝️",
            body: forgotPasswordEmail(token),
        });

        return new NextResponse("Se l'email è registrata, riceverai un link di ripristino.", { status: 200 });
    } catch (error) {
        console.error("FORGOT_PASSWORD_ERROR", error);
        return new NextResponse("Errore del server", { status: 500 });
    }
}
