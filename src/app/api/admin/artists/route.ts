import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { newArtistEmail } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { name, cost, image, type } = body;

        if (!name || cost === undefined || cost === "") {
            return new NextResponse("Missing name or cost", { status: 400 });
        }

        const newArtist = await prisma.artist.create({
            data: {
                name,
                cost: parseInt(cost.toString()),
                image: image || null,
                type: type || "ARTISTA",
                totalScore: 0
            }
        });

        // Notify Users
        try {
            const users = await prisma.user.findMany({ select: { email: true } });
            for (const u of users) {
                if (u.email) {
                    await sendEmail({
                        to: u.email,
                        subject: `Nuovo Artista su FantArte: ${name}`,
                        body: newArtistEmail(name, parseInt(cost.toString()))
                    });
                }
            }
        } catch (err) {
            console.error("NOTIFY_USERS_ERROR", err);
        }

        return NextResponse.json(newArtist);
    } catch (error) {
        console.error("ADMIN_CREATE_ARTIST_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, name, cost, image, type } = body;

        if (!id || !name || cost === undefined || cost === "") {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const updatedArtist = await prisma.artist.update({
            where: { id },
            data: {
                name,
                cost: parseInt(cost.toString()),
                image: image || null,
                type: type || "ARTISTA"
            }
        });

        return NextResponse.json(updatedArtist);
    } catch (error: any) {
        console.error("ADMIN_UPDATE_ARTIST_ERROR", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing artist ID", { status: 400 });

        await prisma.artist.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error: any) {
        console.error("ADMIN_DELETE_ARTIST_ERROR", error);
        if (error.code === 'P2003') {
            return new NextResponse("Impossibile eliminare l'artista: è già collegato a dei punteggi o fa parte di alcune squadre.", { status: 400 });
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}
