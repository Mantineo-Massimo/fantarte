import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isProfane } from "@/lib/blacklist";

// Helper to calculate score based on captain bonus (double SPECIALE only)
async function calculateTeamScore(artistIds: string[], captainId: string | null) {
    const events = await prisma.bonusMalusEvent.findMany({
        where: { artistId: { in: artistIds } }
    });
    
    let total = 0;
    for (const event of events) {
        const isCaptain = event.artistId === captainId;
        const multiplier = (isCaptain && event.category === "SPECIALE") ? 2 : 1;
        total += event.points * multiplier;
    }
    return total;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const body = await req.json();
        const { teamName, artistIds, image, captainId } = body;

        // Base Validation
        if (!teamName || !artistIds || artistIds.length !== 5 || !captainId) {
            return new NextResponse("Dati non validi. Nome squadra, 5 membri e un Capitano sono obbligatori.", { status: 400 });
        }

        if (isProfane(teamName)) {
            return new NextResponse("Il nome della squadra contiene parole non consentite.", { status: 400 });
        }

        // --- Deadline Check ---
        const settings = await prisma.systemSettings.findFirst();
        if (settings?.draftDeadline && new Date() > settings.draftDeadline) {
            return new NextResponse("Le iscrizioni sono chiuse.", { status: 403 });
        }

        const artists = await prisma.artist.findMany({
            where: { id: { in: artistIds } }
        });

        if (artists.length !== 5) {
            return new NextResponse("Alcuni artisti non sono stati trovati.", { status: 400 });
        }

        // ROLE VALIDATION: 1 Presentatore, 1 Ospite, 3 Artisti
        const counts = {
            PRESENTATORE: artists.filter((a: any) => a.type === "PRESENTATORE").length,
            OSPITE: artists.filter((a: any) => a.type === "OSPITE").length,
            ARTISTA: artists.filter((a: any) => a.type === "ARTISTA").length,
        };

        if (counts.PRESENTATORE !== 1 || counts.OSPITE !== 1 || counts.ARTISTA !== 3) {
            return new NextResponse("Composizione squadra non valida: servono 1 presentatore, 1 ospite e 3 artisti.", { status: 400 });
        }

        const totalCost = artists.reduce((sum: number, artist: any) => sum + artist.cost, 0);
        if (totalCost > 100) {
            return new NextResponse("Budget superato (max 100 Armoni).", { status: 400 });
        }

        if (captainId && !artistIds.includes(captainId)) {
            return new NextResponse("Il capitano deve essere uno dei membri della squadra.", { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { userId: user.id }
        });

        if (existingTeam) {
            return new NextResponse("Hai già una squadra.", { status: 409 });
        }

        const nameInUse = await prisma.team.findUnique({
            where: { name: teamName }
        });

        if (nameInUse) {
            return new NextResponse("Nome squadra già in uso.", { status: 409 });
        }

        const leagues = await prisma.league.findMany();

        // Calculate initial score correctly
        const initialScore = await calculateTeamScore(artistIds, captainId);

        const team = await prisma.$transaction(async (tx: any) => {
            const newTeam = await tx.team.create({
                data: {
                    name: teamName,
                    image: image || null,
                    userId: user.id,
                    captainId: captainId || null,
                    artists: {
                        connect: artists.map((a: any) => ({ id: a.id }))
                    }
                }
            });

            const teamLeaguesData = leagues.map((league: any) => ({
                teamId: newTeam.id,
                leagueId: league.id,
                score: initialScore
            }));

            await tx.teamLeague.createMany({
                data: teamLeaguesData
            });

            return newTeam;
        });

        return NextResponse.json(team);

    } catch (error) {
        console.error("CREATE_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const team = await prisma.team.findUnique({
            where: { userId: user.id },
            include: { artists: true }
        });

        return NextResponse.json(team || null);
    } catch (error) {
        console.error("GET_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const body = await req.json();
        const { teamName, artistIds, image, captainId } = body;

        if (!teamName || !artistIds || artistIds.length !== 5 || !captainId) {
            return new NextResponse("Dati non validi.", { status: 400 });
        }

        if (isProfane(teamName)) {
            return new NextResponse("Il nome della squadra contiene parole non consentite.", { status: 400 });
        }

        const settings = await prisma.systemSettings.findFirst();
        if (settings?.draftDeadline && new Date() > settings.draftDeadline) {
            return new NextResponse("Le iscrizioni sono chiuse.", { status: 403 });
        }

        const artists = await prisma.artist.findMany({
            where: { id: { in: artistIds } }
        });

        if (artists.length !== 5) {
            return new NextResponse("Alcuni artisti non sono stati trovati.", { status: 400 });
        }

        // ROLE VALIDATION
        const counts = {
            PRESENTATORE: artists.filter((a: any) => a.type === "PRESENTATORE").length,
            OSPITE: artists.filter((a: any) => a.type === "OSPITE").length,
            ARTISTA: artists.filter((a: any) => a.type === "ARTISTA").length,
        };

        if (counts.PRESENTATORE !== 1 || counts.OSPITE !== 1 || counts.ARTISTA !== 3) {
            return new NextResponse("Composizione squadra non valida.", { status: 400 });
        }

        const totalCost = artists.reduce((sum: number, artist: any) => sum + artist.cost, 0);
        if (totalCost > 100) {
            return new NextResponse("Budget superato.", { status: 400 });
        }

        if (captainId && !artistIds.includes(captainId)) {
            return new NextResponse("Il capitano deve essere in squadra.", { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { userId: user.id },
            include: { artists: true }
        });

        if (!existingTeam) {
            return new NextResponse("Squadra non trovata.", { status: 404 });
        }

        const nameInUse = await prisma.team.findUnique({
            where: { name: teamName }
        });
        if (nameInUse && nameInUse.id !== existingTeam.id) {
            return new NextResponse("Nome squadra già in uso.", { status: 409 });
        }

        const updatedScore = await calculateTeamScore(artistIds, captainId);

        const updatedTeam = await prisma.$transaction(async (tx: any) => {
            const team = await tx.team.update({
                where: { id: existingTeam.id },
                data: {
                    name: teamName,
                    image: image || null,
                    captainId: captainId || null,
                    artists: {
                        set: artistIds.map((id: string) => ({ id }))
                    }
                }
            });

            await tx.teamLeague.updateMany({
                where: { teamId: existingTeam.id },
                data: {
                    score: updatedScore
                }
            });

            return team;
        });

        return NextResponse.json(updatedTeam);

    } catch (error) {
        console.error("UPDATE_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
