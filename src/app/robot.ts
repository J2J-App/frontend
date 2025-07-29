import { Metadata, MetadataRoute } from "next";

export default function robot() : MetadataRoute.Robots {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://www.jeepedia.in"; // Fallback URL if environment variable is not found
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: "/api/",
            },
        ],
        sitemap: `${apiUrl}/sitemap.xml` // Issue #19: URL is now loaded from an environment variable
    };
}