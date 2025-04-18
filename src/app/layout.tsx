import type { Metadata } from "next";
import { Roboto, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/app/nav-bar/nav-bar.tsx";


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

export const metadata: Metadata = {
    title: "J2J",
    description: "The no-bullshit tool for JAC counselling"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className + " " + round.className}>
        <NavBar />
        <div>
            {children}
        </div>
      </body>
    </html>
  );
}
