import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 30; // Cache for 30 seconds to handle high traffic

export async function GET() {
    try {
        const leagues = await prisma.league.findMany({
            where: { name: "Generale" },
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
                }
            }
        });

        // Manual sorting for tie-breaks
        if (leagues.length > 0) {
            leagues[0].teams.sort((a: any, b: any) => {
                // 1. Primary Score
                if (b.score !== a.score) return b.score - a.score;

                // 2. Tie-break: Captain's Score
                const captainA = a.team.artists.find((art: any) => art.id === a.team.captainId);
                const captainB = b.team.artists.find((art: any) => art.id === b.team.captainId);
                const scoreCapA = captainA?.totalScore || 0;
                const scoreCapB = captainB?.totalScore || 0;
                if (scoreCapB !== scoreCapA) return scoreCapB - scoreCapA;

                // 3. Tie-break: Highest "Lowest Member Score"
                const minA = Math.min(...a.team.artists.map((art: any) => art.totalScore || 0));
                const minB = Math.min(...b.team.artists.map((art: any) => art.totalScore || 0));
                return minB - minA;
            });
            
            // Limit to top 150 after sorting
            leagues[0].teams = leagues[0].teams.slice(0, 150);
        }

        return NextResponse.json(leagues);
    } catch (error) {
        console.error("GET_LEADERBOARDS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
