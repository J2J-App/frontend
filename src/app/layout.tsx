import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/app/nav-bar/nav-bar.tsx";


const roboto = Roboto({
    subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["italic","normal"]
});

export const metadata: Metadata = {
  title: "J2J",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <NavBar />
        <div>
            {children}
        </div>
      </body>
    </html>
  );
}
