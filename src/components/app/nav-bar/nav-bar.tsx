"use client"
import styles from "./nav-bar.module.css";
import Image from "next/image";
import icon from "@/public/icons/navbar/j2jicon.png"
import discord from "@/public/icons/navbar/discord.svg"
import Link from "next/link";

import {usePathname} from "next/navigation";
export default function NavBar() {
    const path = usePathname()
    console.log(path)
    function checkUrl(url: string): boolean {
        return path.startsWith(url)
    }
    return (
        <div className={styles.navBar}>
            <Link href={"/"} className={styles.leftBox}>
                <Image src={icon} alt={"Logo"} width={40} height={40} style={{
                    borderRadius: "8px",
                }} />
            </Link>
            <div className={styles.centerBox}>
                <Link className={checkUrl("/predictor") ? `${styles.link} ${styles.active}` : styles.link}  href="/predictor">Predictor</Link>
                <Link className={checkUrl("/universities") ? `${styles.link} ${styles.active}` : styles.link} href="/universities">Universities</Link>
                <Link className={checkUrl("/compare") ? `${styles.link} ${styles.active}` : styles.link} href="/compare">Compare</Link>
            </div>
            <a href="https://discord.gg/Z8s9JECw4C" target="_blank" className={styles.rightBox}>
                <Image style={{
                    opacity: 0.7
                }} src={discord} alt={"Discord"} width={20} height={20} />
            </a>
        </div>
    )
}