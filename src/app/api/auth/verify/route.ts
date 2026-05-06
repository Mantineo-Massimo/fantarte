import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new NextResponse("Token mancante", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return new NextResponse("Token non valido o scaduto", { status: 400 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: "Email già verificata" }, { status: 200 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null // Clear token after use
            }
        });

        // Send Welcome Email
        try {
            await sendEmail({
                to: user.email!,
                subject: "Benvenuto in Piazza dell'Arte! 🎠",
                body: welcomeEmail(user.name || "Partecipante")
            });
        } catch (err) {
            console.error("WELCOME_EMAIL_ERROR", err);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("VERIFY_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
