"use client";

import BottomNav from "@/components/bottom-nav/bottom-nav.tsx";
import { useParams } from "next/navigation";
import UpperNav from "@/components/upper-nav/upper-nav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams() as {
    counselling: string;
    uni: string;
  };

  return (
    <div style={{ padding: "0 18px" }}>
      <div style={{ marginTop: "140px" }}>
        <UpperNav params={params} />
      </div>
      <div>{children}</div>
      <BottomNav />
    </div>
  );
}
