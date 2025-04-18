"use client";
import { useEffect, useState } from "react";
import styles from "./upper-nav.module.css";
import Image from "next/image";

// background images
import dtu_bg from "@/public/backgrounds/colleges/dtu.jpg";
import nsut_bg from "@/public/backgrounds/colleges/nsut.jpg";
import iiitd_bg from "@/public/backgrounds/colleges/iiitd.jpg";
import igdtuw_bg from "@/public/backgrounds/colleges/igdtuw.jpg";
import nsutw_bg from "@/public/backgrounds/colleges/nsutw.jpg";
import nsute_bg from "@/public/backgrounds/colleges/nsute.jpg";

// icons
import nsut from "@/public/icons/uni/nsut_icon.png";
import dtu from "@/public/icons/uni/dtu_icon.png";
import iiitd from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw from "@/public/icons/uni/igdtuw_icon.png";

export default function UpperNav({ params }: { params: { uni: string } }) {
    const { uni } = params;

    const [currentUniData, setCurrentUniData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getCollegeData");
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setCurrentUniData(json.data[uni]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [uni]);

    const iconMap: { [key: string]: string } = {
        nsut: nsut.src,
        nsutw: nsut.src,
        nsute: nsut.src,
        dtu: dtu.src,
        igdtuw: igdtuw.src,
        iiitd: iiitd.src,
    };

    const bgMap: { [key: string]: string } = {
        nsut: nsut_bg.src,
        nsutw: nsutw_bg.src,
        nsute: nsute_bg.src,
        dtu: dtu_bg.src,
        igdtuw: igdtuw_bg.src,
        iiitd: iiitd_bg.src,
    };

    const nameMap: { [key: string]: string } = {
        nsut: "NSUT",
        nsutw: "NSUT WEST",
        nsute: "NSUT EAST",
        dtu: "DTU",
        igdtuw: "IGDTUW",
        iiitd: "IIIT-D",
    };

    if (!currentUniData) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.headContainer}>
            <div className={styles.background}>
                <Image
                    style={{
                        objectFit: "cover",
                        objectPosition: "bottom",
                        borderRadius: "18px",
                        filter: "blur(25px)",
                        transform: "scale(1, 1)",
                    }}
                    fill
                    src={bgMap[uni]}
                    alt={uni}
                />
                <Image
                    style={{
                        objectFit: "cover",
                        objectPosition: "bottom",
                        borderRadius: "18px",
                    }}
                    fill
                    src={bgMap[uni]}
                    alt={uni}
                />
            </div>

            <div className={styles.headText}>
                <div className={styles.icon}>
                    <Image fill src={iconMap[uni]} alt={uni} />
                </div>
                <h1
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontWeight: "900",
                        fontSize: "24px",
                        fontFamily: "'Roboto', sans-serif",
                    }}
                >
                    {nameMap[uni]}
                    <span
                        style={{
                            fontWeight: "300",
                            fontSize: "16px",
                            fontFamily: "'Roboto', sans-serif",
                            color: "#989898",
                        }}
                    >
                        {currentUniData.full_name}
                    </span>
                </h1>
            </div>
        </div>
    );
}
