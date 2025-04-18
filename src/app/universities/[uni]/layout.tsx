"use client";
import BottomNav from "@/components/bottom-nav/bottom-nav.tsx";
import Link from "next/link";
import Button from "@/components/buttons/button.tsx";
import {useRouter} from "next/navigation";

export default function Layout({children}: {
    children: React.ReactNode;
}   ) {
    const router = useRouter();

    return <div>
        {children}
        <BottomNav />
    </div>
}