// app/sitemap.ts

import { MetadataRoute } from "next";
import { SITE_URL } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/predictor` },
    { url: `${baseUrl}/predictor/josaa` },
    { url: `${baseUrl}/predictor/jac` },
    { url: `${baseUrl}/universities` },
    { url: `${baseUrl}/universities/josaa` },
    { url: `${baseUrl}/universities/jac` },
    { url: `${baseUrl}/compare` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/tos` },
  ];
}
