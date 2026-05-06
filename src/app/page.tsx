import { prisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";

export const revalidate = 60; // Cache the whole home page for 60 seconds

export default async function Page() {
    const sponsors = await prisma.sponsor.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });

    const settings = await prisma.systemSettings.findFirst();
    const deadline = settings?.draftDeadline ? settings.draftDeadline.toISOString() : null;

    return <HomeContent initialSponsors={sponsors} initialDeadline={deadline} />;
}
