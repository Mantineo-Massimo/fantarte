import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as jose from "jose";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return new NextResponse("Dati mancanti", { status: 400 });
        }

        if (password.length < 8) {
            return new NextResponse("La password deve avere almeno 8 caratteri", { status: 400 });
        }

        // Verifica il JWT token
        let userId: string;
        try {
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);
            userId = payload.userId as string;
        } catch (err) {
            console.error("JWT_VERIFY_ERROR", err);
            return new NextResponse("Token scaduto o non valido", { status: 400 });
        }

        // Cripta la nuova password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Aggiorna l'utente
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return new NextResponse("Password aggiornata con successo", { status: 200 });
    } catch (error) {
        console.error("RESET_PASSWORD_ERROR", error);
        return new NextResponse("Errore del server", { status: 500 });
    }
}
