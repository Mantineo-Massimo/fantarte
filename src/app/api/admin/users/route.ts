import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                emailVerified: true,
                verificationToken: true,
                createdAt: true,
                team: {
                    include: {
                        artists: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("ADMIN_GET_USERS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!admin || admin.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, name, role, teamName, artistIds, captainId, verifyManually, resendVerification } = body;

        if (!id) return new NextResponse("Missing user ID", { status: 400 });

        if (resendVerification) {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) return new NextResponse("User not found", { status: 404 });
            
            const verificationToken = user.verificationToken || Math.random().toString(36).substring(2, 15);
            if (!user.verificationToken) {
                await prisma.user.update({ where: { id }, data: { verificationToken } });
            }

            const { triggerEmail } = await import("@/lib/email-service");
            const verificationUrl = `${process.env.NEXTAUTH_URL || 'https://fantarte.it'}/auth/verify?token=${verificationToken}`;
            
            await triggerEmail("VERIFICATION", user.email, {
                nome: user.name || 'Utente',
                link: `<a href="${verificationUrl}" style="color: #FFD700; font-weight: bold;">Verifica Account</a>`
            });

            return NextResponse.json({ message: "Verification email resent" });
        }

        const updateData: any = {
            name: name !== undefined ? name : undefined,
            role: role !== undefined ? role : undefined,
            emailVerified: verifyManually ? new Date() : undefined
        };

        if (teamName !== undefined || artistIds !== undefined || captainId !== undefined) {
            const teamUpdateData: any = {};
            
            if (teamName !== undefined) teamUpdateData.name = teamName;
            if (captainId !== undefined) teamUpdateData.captainId = captainId;
            if (artistIds !== undefined) {
                teamUpdateData.artists = {
                    set: artistIds.map((aid: string) => ({ id: aid }))
                };
            }

            updateData.team = {
                update: teamUpdateData
            };
        }

        let oldTeam: any = null;
        if (artistIds !== undefined) {
            oldTeam = await prisma.team.findUnique({
                where: { userId: id }
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                team: {
                    select: { id: true, name: true }
                }
            }
        });

        // Recalculate score if artists changed
        if (artistIds !== undefined && oldTeam) {
            const newScore = await calculateTeamScore(artistIds, captainId || oldTeam.captainId);
            await prisma.teamLeague.updateMany({
                where: { teamId: oldTeam.id },
                data: { score: newScore }
            });

            // Flush cache
            revalidatePath("/");
            revalidatePath("/leaderboards");
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("ADMIN_UPDATE_USER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!admin || admin.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing user ID", { status: 400 });

        // Don't allow deleting yourself
        if (id === session.user.id) {
            return new NextResponse("Cannot delete yourself", { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return new NextResponse("User deleted", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_USER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
