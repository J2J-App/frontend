import { Metadata, MetadataRoute } from "next";

export default function robot() : MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: "/api/",
            },
        ],
        sitemap: "https://www.jeepedia.in/sitemap.xml",
    };
}