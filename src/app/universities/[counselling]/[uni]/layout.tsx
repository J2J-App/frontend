import { Metadata } from "next";
import ClientLayout from "./clientLayout.tsx";

export const generateMetadata = ({ params }: { params: { counselling: string; uni: string } }): Metadata => {
  const { counselling, uni } = params;

  return {
    title: `${uni.toUpperCase()} Cutoff 2024 | Jeepedia`,
    description: `Explore ${uni.toUpperCase()}'s 2024 cutoff trends and counselling updates for ${counselling.toUpperCase()}.`,
    keywords: [
      `${uni} cutoff 2024`,
      `${uni} counselling cutoff`,
      `${counselling} ${uni} cutoff`,
    ],
    openGraph: {
      title: `${uni.toUpperCase()} Cutoff 2024 | Jeepedia`,
      description: `Explore ${uni.toUpperCase()}'s 2024 cutoff trends and counselling updates for ${counselling.toUpperCase()}.`,
      url: `https://www.jeepedia.in/universities/${counselling}/${uni}/cutoff`,
      siteName: "Jeepedia",
    },
  };
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
