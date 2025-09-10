"use client";
import Loader from "@/components/loader/loader.tsx";
import {useEffect} from "react";

export default function Loading() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return <div style={{
        width: "100%",
        height: "calc(100vh - 400px)",
        display: "flex",
    }}>
        <Loader  />
    </div>
}