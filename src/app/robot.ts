import { Metadata, MetadataRoute } from "next";
import { SITE_URL } from "@/config";

export default function robot(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
