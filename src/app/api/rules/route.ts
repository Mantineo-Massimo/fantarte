import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export async function GET() {
    try {
        const rules = await prisma.ruleDefinition.findMany({
            orderBy: [
                { category: 'asc' },
                { points: 'desc' }
            ]
        });
        return NextResponse.json(rules);
    } catch (error) {
        console.error("GET_RULES_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
