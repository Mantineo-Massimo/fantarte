import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Recupera tutte le impostazioni email
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const settings = await prisma.emailSetting.findMany({
            orderBy: { type: 'asc' }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("ADMIN_GET_EMAILS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PUT: Aggiorna un'impostazione email specifica
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, subject, content, enabled } = body;

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        const updated = await prisma.emailSetting.update({
            where: { id },
            data: {
                subject: subject !== undefined ? subject : undefined,
                content: content !== undefined ? content : undefined,
                enabled: enabled !== undefined ? enabled : undefined
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("ADMIN_UPDATE_EMAIL_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
