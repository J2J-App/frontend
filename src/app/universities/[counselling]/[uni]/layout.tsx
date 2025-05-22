import { Metadata } from "next";
import ClientLayout from "./clientLayout.tsx";
import Head from "next/head";

export const generateMetadata = ({
  params,
}: {
  params: { counselling: string; uni: string };
}): Metadata => {
  const { counselling, uni } = params;

  return {
    title: `${uni.toUpperCase()} Cutoff 2024 | Jeepedia`,
    description: `Explore ${uni.toUpperCase()}'s 2024 cutoff trends and counselling updates for ${counselling.toUpperCase()}.`,
    keywords: [
      `${uni} cutoff 2024`,
      `${uni} counselling cutoff`,
      `${counselling} ${uni} cutoff`,
      `${uni} cutoff 2025`,
      `about ${uni} `,
      `seats in ${uni}`,
      `branches in ${uni}`,
      `placement in ${uni}`,
      `placement in ${uni} 2024`,
      `placement in ${uni} 2025`,
      `seats in ${uni} 2024`,
      `seats in ${uni} 2025`,
      `seat matrix of ${uni}`,
      `seat matrix of ${uni} 2024`,
      `seat matrix of ${uni} 2025`,
    ],
    openGraph: {
      title: `${uni.toUpperCase()} Cutoff 2024 | Jeepedia`,
      description: `Explore ${uni.toUpperCase()}'s 2024 cutoff trends and counselling updates for ${counselling.toUpperCase()}.`,
      url: `https://www.jeepedia.in/universities/${counselling}/${uni}/cutoff`,
      siteName: "Jeepedia",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
