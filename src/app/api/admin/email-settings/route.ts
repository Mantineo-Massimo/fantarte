import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

        const settings = await prisma.emailSetting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return new NextResponse("Error fetching email settings", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

        const { type, enabled, subject, content } = await req.json();

        const setting = await prisma.emailSetting.upsert({
            where: { type },
            update: { enabled, subject, content },
            create: { type, enabled, subject, content }
        });

        return NextResponse.json(setting);
    } catch (error) {
        return new NextResponse("Error updating email settings", { status: 500 });
    }
}
