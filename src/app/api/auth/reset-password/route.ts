import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json({ error: "Token e password obbligatori" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { resetToken: token }
        });

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ message: "Password aggiornata con successo" });

    } catch (error: any) {
        console.error("RESET_PASSWORD_ERROR", error);
        return NextResponse.json({ 
            error: "Errore durante il reset della password",
            details: error.message 
        }, { status: 500 });
    }
}
