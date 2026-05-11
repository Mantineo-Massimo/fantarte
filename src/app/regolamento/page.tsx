import { prisma } from "@/lib/prisma";
import RegolamentoContent from "./RegolamentoContent";

export const revalidate = 300; // Cache for 5 minutes (it changes rarely)

export default async function RegolamentoPage() {
    const rulesData = await prisma.ruleDefinition.findMany({
        orderBy: {
            points: 'desc'
        }
    });

    return <RegolamentoContent initialRules={JSON.parse(JSON.stringify(rulesData))} />;
}
