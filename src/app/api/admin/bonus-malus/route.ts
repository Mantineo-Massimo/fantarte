import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { sendEmail, sendBatch } from "@/lib/email";
import { artistPointsEmail } from "@/lib/email-templates";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const events = await prisma.bonusMalusEvent.findMany({
            include: {
                artist: true,
                createdBy: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("GET_EVENTS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { artistId, points, description, ruleId, category } = body;

        if (!artistId || points === undefined || !description) {
            return new NextResponse("Invalid request data.", { status: 400 });
        }

        const pointVal = parseInt(points);
        const pointCategory = category || "BONUS"; // Default to BONUS

        const { event, artistName, usersToNotify } = await prisma.$transaction(async (tx: any) => {
            const event = await tx.bonusMalusEvent.create({
                data: {
                    artistId,
                    points: pointVal,
                    category: pointCategory,
                    description,
                    createdById: user.id,
                    ruleId: ruleId || null
                }
            });

            // Update artist's absolute score
            const artist = await tx.artist.update({
                where: { id: artistId },
                data: { totalScore: { increment: pointVal } }
            });

            // Find all teams that have this artist to get user emails
            const teamsWithArtist = await tx.team.findMany({
                where: { artists: { some: { id: artistId } } },
                select: { 
                    id: true, 
                    captainId: true,
                    user: {
                        select: { email: true }
                    }
                }
            });

            const normalTeamIds = teamsWithArtist
                .filter((t: any) => t.captainId !== artistId)
                .map((t: any) => t.id);

            const captainTeamIds = teamsWithArtist
                .filter((t: any) => t.captainId === artistId)
                .map((t: any) => t.id);

            // Update scores in leagues
            const isSpecial = pointCategory === "SPECIALE";

            if (normalTeamIds.length > 0) {
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: normalTeamIds } },
                    data: { score: { increment: pointVal } }
                });
            }

            if (captainTeamIds.length > 0) {
                const captainIncrement = isSpecial ? pointVal * 2 : pointVal;
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: captainTeamIds } },
                    data: { score: { increment: captainIncrement } }
                });
            }

            const usersToNotify = teamsWithArtist
                .map((t: any) => t.user?.email)
                .filter((email: string | null) => !!email);

            return { event, artistName: artist.name, usersToNotify };
        });

        // Async Notify Users (Batch)
        try {
            const emailBody = artistPointsEmail(artistName, pointVal, description);
            const batchEmails = usersToNotify.map((email: string) => ({
                to: email,
                subject: `Punti per ${artistName}! ⚡ FantArte`,
                body: emailBody
            }));

            if (batchEmails.length > 0) {
                // We don't await here to respond faster to the admin.
                // Using a try-catch inside the background promise is good practice.
                const sendEmails = async () => {
                    try {
                        await sendBatch(batchEmails);
                    } catch (e) {
                        console.error("BACKGROUND_EMAIL_SEND_ERROR", e);
                    }
                };
                
                // On Vercel, this ensures the function doesn't terminate until the promise resolves
                // Note: waitUntil is available in Next.js 15+
                if (typeof (global as any).waitUntil === 'function') {
                    (global as any).waitUntil(sendEmails());
                } else {
                    // Fallback for environments without waitUntil - though it might get cut off
                    sendEmails();
                }
            }
        } catch (err) {
            console.error("NOTIFY_USERS_POINTS_ERROR", err);
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("ADMIN_EVENT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing event ID", { status: 400 });

        const event = await prisma.bonusMalusEvent.findUnique({ where: { id } });
        if (!event) return new NextResponse("Event not found", { status: 404 });

        const { artistId, points, category } = event;

        await prisma.$transaction(async (tx: any) => {
            // 1. Delete event
            await tx.bonusMalusEvent.delete({ where: { id } });

            // 2. Subtract points from artist
            await tx.artist.update({
                where: { id: artistId },
                data: { totalScore: { decrement: points } }
            });

            // 3. Subtract points from teams
            const teamsWithArtist = await tx.team.findMany({
                where: { artists: { some: { id: artistId } } },
                select: { id: true, captainId: true }
            });

            const normalTeamIds = teamsWithArtist
                .filter((t: any) => t.captainId !== artistId)
                .map((t: any) => t.id);

            const captainTeamIds = teamsWithArtist
                .filter((t: any) => t.captainId === artistId)
                .map((t: any) => t.id);

            const isSpecial = category === "SPECIALE";

            if (normalTeamIds.length > 0) {
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: normalTeamIds } },
                    data: { score: { decrement: points } }
                });
            }

            if (captainTeamIds.length > 0) {
                const captainDecrement = isSpecial ? points * 2 : points;
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: captainTeamIds } },
                    data: { score: { decrement: captainDecrement } }
                });
            }
        });

        return new NextResponse("Deleted and scores reconciled", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_EVENT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
