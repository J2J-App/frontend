"use client"
import styles from "./nav-bar.module.css";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
export default function NavBar() {
    const path = usePathname()
    const [isOpen, setIsOpen] = useState<boolean>(false);
    function checkUrl(url: string): boolean {
        return path.startsWith(url)
    }
    function handleClick() {
        setIsOpen(false)
    }
    return (<>
            <div className={styles.navBar}>
                <Link href={"/"} className={path === "/" ? styles.leftBox + " " + styles.active : styles.leftBox}>
                    <div style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#333",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px"
                    }}>
                        J2J
                    </div>
                </Link>
                <div className={styles.centerBox}>
                    <Link className={checkUrl("/predictor") ? `${styles.link} ${styles.active}` : styles.link}
                          href="/predictor">Predictor</Link>
                    <Link className={checkUrl("/universities") ? `${styles.link} ${styles.active}` : styles.link}
                          href="/universities">Universities</Link>
                    <Link className={checkUrl("/compare") ? `${styles.link} ${styles.active}` : styles.link}
                          href="/compare">Compare</Link>
                </div>
                <a href="https://discord.gg/Z8s9JECw4C" target="_blank" className={styles.rightBox}>
                    <div style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#5865F2",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: "bold"
                    }}>
                        D
                    </div>
                </a>
                <div onClick={() => {
                    setIsOpen((v) => !v)
                }} className={`${styles.mob} ${styles.rightBox} ${isOpen ? styles.menuActive : ""}`}>
                    <div className={styles.menuIcon} style={{
                        width: 18,
                        height: 18,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center"
                    }}>
                        <div style={{width: "100%", height: "2px", backgroundColor: "white"}}></div>
                        <div style={{width: "100%", height: "2px", backgroundColor: "white"}}></div>
                        <div style={{width: "100%", height: "2px", backgroundColor: "white"}}></div>
                    </div>
                    <div className={styles.crossIcon} style={{
                        width: 18,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}>
                        ×
                    </div>
                </div>
                <div className={isOpen ? `${styles.mobileLinkBox} ${styles.activeMd}` : `${styles.mobileLinkBox}`}>
                    <div className={styles.linkList}>
                        <Link className={checkUrl("/predictor") ? `${styles.link} ${styles.active}` : styles.link}
                              href="/predictor" onClick={handleClick}>Predictor</Link>
                        <Link className={checkUrl("/universities") ? `${styles.link} ${styles.active}` : styles.link}
                              href="/universities" onClick={handleClick}>Universities</Link>
                        <Link className={checkUrl("/compare") ? `${styles.link} ${styles.active}` : styles.link}
                              href="/compare" onClick={handleClick}>Compare</Link>
                    </div>
                    <a href="https://discord.gg/Z8s9JECw4C" target="_blank" className={styles.discordIcon}>
                        <div style={{
                            width: 20,
                            height: 20,
                            backgroundColor: "#5865F2",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "bold"
                        }}>
                            D
                        </div>
                    </a>
                </div>
            </div>
            <div onClick={() => setIsOpen((v) => !v)}
                 className={isOpen ? `${styles.mobileBg} ${styles.open}` : styles.mobileBg}>

            </div>
        </>
    )
}