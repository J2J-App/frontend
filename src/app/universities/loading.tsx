"use client"
import Loader from "@/components/loader/loader.tsx";

export default function Loading() {
    return <div style={{
        width: "100%",
        height: "calc(100vh - 400px)",
        display: "flex",
    }}>
        <Loader  />
    </div>
}