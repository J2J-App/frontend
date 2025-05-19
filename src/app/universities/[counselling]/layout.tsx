"use client"
import styles from "./layout.module.css"
import {useParams, usePathname} from "next/navigation";
import {counsellings} from "@/app/predictor/counsellings.ts";
import Link from "next/link";

export default function Layout({children}: {
    children: React.ReactNode,
}) {
    const pathname = usePathname()
    console.log(pathname.split("/"))
    const {counselling}: {
        counselling: string
    } = useParams()

    const counsellingNames = counsellings.map((counselling) => counselling.name)

    if (pathname.split("/").length >= 4) return (<>{
        children
    }</>);
    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        }}>
            <div
                style={{
                    marginTop: "140px",
                    width: "100%",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h1 className={styles.header}>Universities</h1>
            </div>
            <div style={{
                backgroundColor: "rgba(0,0,0,0)",
                marginTop: "20px",
                marginBottom: "0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}>
                {counsellingNames.map((name: string) => {
                    return (
                        <Link key={name} href={`/universities/${name.toLowerCase()}`}>
                            <div className={name.toLowerCase() == counselling ? styles.tab + " " + styles.active : styles.tab}>
                                {name}
                            </div>
                        </Link>
                    )
                })}
            </div>
            {children}
        </main>
    )
}