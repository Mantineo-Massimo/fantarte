import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://fantarte.it';

    const staticRoutes = [
        '',
        '/artisti',
        '/leaderboards',
        '/regole',
        '/supporto',
        '/privacy',
        '/termini',
        '/accordo',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes];
}
