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
    description: "The no-bullshit tool for JEE counselling"
};


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
