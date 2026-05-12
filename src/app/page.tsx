import { prisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";

export const revalidate = 30; // Cache for 30 seconds for immediate responsiveness

export default async function Page() {
    const sponsors = await prisma.sponsor.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });

    const settings = await prisma.systemSettings.findFirst();
    const deadline = settings?.draftDeadline ? settings.draftDeadline.toISOString() : null;
    const registrationsOpen = settings?.registrationsOpen ?? true;

    return <HomeContent initialSponsors={sponsors} initialDeadline={deadline} registrationsOpen={registrationsOpen} />;
}
