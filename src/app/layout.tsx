import type { Metadata } from "next";
import { Roboto, M_PLUS_Rounded_1c } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import NavBar from "@/components/app/nav-bar/nav-bar.tsx";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/footer/footer.tsx";
import FooterWrapper from "@/components/footer/footer-wrapper.tsx";

import { SITE_URL, CONTACT_EMAIL, DEV_TUNNEL_URL, ANALYTICS, FEATURES } from "@/config";

import ScrollButton from "@/components/scroll-btn/scroll-button";


const roboto = Roboto({
    subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["italic","normal"]
});

const round = M_PLUS_Rounded_1c({
    subsets: ["latin"],
    weight: ["100","300","400","500","700","800","900"],
    style: ["normal"]
});

const impact = localFont({
    src: '../public/fonts/impact.ttf',
})

export const metadata: Metadata = {
    title: "JEEPedia",
    description: "The no-bullshit tool for JEE counselling",
    openGraph: {
    title: 'The no-bullshit tool for JEE counselling',
    description: 'JEE Pedia is your ultimate guide to cracking Counselling – get real cutoffs, accurate placement data and branch comparisons all in one place.',
    url: SITE_URL,
    siteName: 'JEEPedia',
    images: [
      {
        url: `${DEV_TUNNEL_URL || SITE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: 'JEEPedia - JEE College Predictor and Counselling Guide',
      },
    ],
    locale: 'en_US',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'JEEPedia - JEE College Predictor',
    description: 'The no-bullshit tool for JEE counselling - get real cutoffs, accurate placement data and branch comparisons',
    images: ['/og-image.png'], 
  },
  keywords: [
    "JEE College Predictor",
    "JoSAA Predictor",
    "JAC Delhi",
    "JEE Mains 2025",
    "Engineering Cutoffs",
    "College Comparison",
    "JEE Rank Predictor"
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        {FEATURES.enableAnalytics && ANALYTICS.umamiWebsiteId && (
          <script 
            async={true} 
            defer={true} 
            src={ANALYTICS.umamiScriptUrl}
            data-website-id={ANALYTICS.umamiWebsiteId}
          />
        )}
        {FEATURES.enableAnalytics && ANALYTICS.googleAdsenseId && (
          <script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ANALYTICS.googleAdsenseId}`}
            crossOrigin="anonymous"
          />
        )}
    </head>
    <body className={roboto.className + " " + round.className}>
    <Analytics/>
    <SpeedInsights/>
    <NavBar />
        <div style={{
            minHeight: "calc(100vh - 120px)",
        }}>
            {children}
        </div>
        <ScrollButton/>
        <FooterWrapper>
            <Footer />
        </FooterWrapper>
      </body>
    </html>
  );
}
