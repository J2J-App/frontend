"use client";
import styles from "./bottom-nav.module.css";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {MdArrowBack, MdAutoGraph, MdChair, MdHome, MdMoney,} from "react-icons/md";

export default function BottomNav() {
    const pathname = usePathname();
    const path: string[] = pathname.split("/")
    function ButtonLink({link, text, icon}: {
        link: string,
        text: string,
        icon: any
    }) {
        const href = `/${path[1]}/${path[2]}/${path[3]}${link}`
        console.log(href)
        return <Link href={href}
                     scroll={false}>
            <div className={pathname === href ? styles.active + " " + styles.link : styles.link}>
                <div style={{
                    fontSize: "22px",
                }}>
                    {icon}
                </div>
                <span>{text}</span>
            </div>
        </Link>
    }

    return <div className={styles.bottomNavContainer}>
        <div className={styles.links}>
            <Link style={{
                width: "40px"
            }} className={styles.link} href={`/${path[1]}/${path[2]}`}
                  scroll={false}>
                <div>
                    <div style={{
                        fontSize: "22px",
                    }}>
                        <MdArrowBack />
                    </div>
                </div>
            </Link>
            <ButtonLink link={""} text={"Home"} icon={<MdHome />} />
            <ButtonLink link={"/cutoff"} text={"Cut Offs"} icon={<MdAutoGraph />} />
            <ButtonLink link={"/placement"} text={"Placement"} icon={<MdMoney />} />
            <ButtonLink link={"/seatmatrix"} text={"Seat Matrix"} icon={<MdChair />} />
        </div>
    </div>
}