"use client";
import BottomNav from "@/components/bottom-nav/bottom-nav.tsx";
import {useParams} from "next/navigation";
import UpperNav from "@/components/upper-nav/upper-nav";

export default function Layout({children}: {
    children: React.ReactNode;
}   ) {
    const params = useParams();

    return <div>
        <div
        style={{
            marginTop: "140px",
        }}>
            <UpperNav params={{uni: params.uni as string}} />
        </div>
        <div>
            {children}
        </div>
        <BottomNav />
    </div>
}