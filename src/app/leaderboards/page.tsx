import { prisma } from "@/lib/prisma";
import LeaderboardsPage from "./LeaderboardContent";

export const revalidate = 30; // Cache for 30 seconds

export default async function Page() {
    const leagues = await prisma.league.findMany({
        where: {
            name: "Generale"
        },
        include: {
            teams: {
                include: {
                    team: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            captainId: true,
                            artists: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                    totalScore: true
                                }
                            }
                        }
                    },
                },
                orderBy: {
                    score: 'desc'
                },
                take: 150
            }
        }
    });

    const artists = await prisma.artist.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            totalScore: true,
        },
        orderBy: {
            totalScore: 'desc'
        }
    });

    // Adapt structure to match the expected types in LeaderboardContent
    const formattedLeagues = leagues.map(l => ({
        id: l.id,
        name: l.name,
        teams: l.teams.map(t => ({
            score: t.score,
            team: t.team
        }))
    }));

    return <LeaderboardsPage initialLeagues={formattedLeagues as any} initialArtists={artists as any} />;
}
