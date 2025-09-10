import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JEEPedia",
    description: "The no-bullshit tool for JEE counselling",
    openGraph: {
    title: 'The no-bullshit tool for JEE counselling',
    description: 'JEE Pedia is your ultimate guide to cracking Counselling – get real cutoffs, accurate placement data and branch comparisons all in one place.',
    url: 'https://jeepedia.in',
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
    "Placement Data",
    "compare placement",
  ],
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {children}
    </div>
  );
}
