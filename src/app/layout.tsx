import type { Metadata } from "next";
import { Roboto, M_PLUS_Rounded_1c } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import NavBar from "@/components/app/nav-bar/nav-bar.tsx";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/footer/footer.tsx";
import FooterWrapper from "@/components/footer/footer-wrapper.tsx";

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
    url: process.env.NEXT_PUBLIC_API_URL || 'https://jeepedia.in', //  Issue #19: URL is now loaded from an environment variable
    siteName: 'JEEPedia',
    images: [
      {
        url: 'https://7rfkcr7r-3000.inc1.devtunnels.ms/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'Social image alt text',
      },
    ],
    locale: 'en_US',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Your Twitter Title',
    description: 'Your Twitter Description',
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
        <script async={true} defer={true} src="https://cloud.umami.is/script.js"
                data-website-id="0a1d5446-18c9-41be-a368-21c9eb0ddee9"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6258466000437582"
     crossOrigin="anonymous"></script>
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
        <FooterWrapper>
            <Footer />
        </FooterWrapper>
      </body>
    </html>
  );
}
