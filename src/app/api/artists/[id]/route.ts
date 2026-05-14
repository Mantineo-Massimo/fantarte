import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 1 minute

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const artist = await prisma.artist.findUnique({
            where: { id }
        });

        if (!artist) {
            return new NextResponse("Artist not found", { status: 404 });
        }

        const events = await prisma.bonusMalusEvent.findMany({
            where: {
                OR: [
                    { artistId: id },
                    { artistId: null }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ ...artist, events });
    } catch (error) {
        console.error("GET_ARTIST_DETAIL_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
