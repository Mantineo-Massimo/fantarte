import { prisma } from "@/lib/prisma";
import ArtistsContent from "./ArtistsContent";

export const revalidate = 120; // Cache for 2 minutes

export default async function ArtistsPage() {
    const artists = await prisma.artist.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return <ArtistsContent initialArtists={JSON.parse(JSON.stringify(artists))} />;
}
