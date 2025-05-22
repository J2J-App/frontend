// app/sitemap.ts

import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: "https://www.jeepedia.in/" },
    { url: "https://www.jeepedia.in/predictor" },
    { url: "https://www.jeepedia.in/predictor/josaa" },
    { url: "https://www.jeepedia.in/predictor/jac" },
    { url: "https://www.jeepedia.in/universities" },
    { url: "https://www.jeepedia.in/universities/josaa" },
    { url: "https://www.jeepedia.in/universities/jac" },
    { url: "https://www.jeepedia.in/compare" },
    { url: "https://www.jeepedia.in/privacy" },
    { url: "https://www.jeepedia.in/tos" },
  ];
}
