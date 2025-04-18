import styles from "./page.module.css";
import Image from "next/image";

//import bgs
import dtu_bg from "@/public/backgrounds/colleges/dtu.jpg";
import nsut_bg from "@/public/backgrounds/colleges/nsut.jpg";
import iiitd_bg from "@/public/backgrounds/colleges/iiitd.jpg";
import igdtuw_bg from "@/public/backgrounds/colleges/igdtuw.jpg";
import nsutw_bg from "@/public/backgrounds/colleges/nsutw.jpg";
import nsute_bg from "@/public/backgrounds/colleges/nsute.jpg";

//icon
import nsut from "@/public/icons/uni/nsut_icon.png";
import dtu from "@/public/icons/uni/dtu_icon.png";
import iiitd from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw from "@/public/icons/uni/igdtuw_icon.png";

export default async function Page({
    params,
}: {
    params: Promise<{ uni: string }>
}) {
    const { uni } = await params;

    //fetch uni data
    const uniDataRes = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getCollegeData")

    if (!uniDataRes.ok) {
        throw new Error("Failed to fetch data");
    }

    const { data } = await uniDataRes.json();

    const currentUniData = data[uni];

    const iconMap: { [key: string]: string } = {
        "nsut": nsut.src,
        "nsutw": nsut.src,
        "nsute": nsut.src,
        "dtu": dtu.src,
        "igdtuw": igdtuw.src,
        "iiitd": iiitd.src,
    };

    const bgMap: { [key: string]: string } = {
        "nsut": nsut_bg.src,
        "nsutw": nsutw_bg.src,
        "nsute": nsute_bg.src,
        "dtu": dtu_bg.src,
        "igdtuw": igdtuw_bg.src,
        "iiitd": iiitd_bg.src,
    };

    const nameMap: { [key: string]: string }  = {
        "nsut": "NSUT",
        "nsutw": "NSUT WEST",
        "nsute": "NSUT EAST",
        "dtu": "DTU",
        "igdtuw": "IGDTUW",
        "iiitd": "IIIT-D",
    }

    const formatLabel = (key: string): string => {
        let label = key.replace(/_/g, ' ');

        if (label.includes('seater')) {
            const seatCount = label.charAt(0);
            if (label.includes('ac')) {
                return `${seatCount} Seater (${label.includes('non') ? 'Non-AC' : 'AC'})`;
            }
            return `${seatCount} Seater`;
        }
        return label.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return <div style={{
        margin: "120px 0",
        padding: "0 20px",
    }}>
        <div className={styles.headContainer}>
            <div className={styles.background}>
                <Image style={{
                    objectFit: "cover",
                    objectPosition: "bottom",
                    borderRadius: "18px",
                    filter: "blur(25px)",
                    transform: "scale(1, 1)",
                }} fill={true} src={bgMap[uni]} alt={uni} />
                <Image style={{
                    objectFit: "cover",
                    objectPosition: "bottom",
                    borderRadius: "18px",
                }} fill={true} src={bgMap[uni]} alt={uni} />
            </div>
            <div className={styles.headText}>
                <div className={styles.icon}>
                    <Image fill={true} src={iconMap[uni]} alt={uni} />
                </div>
                <h1 style={{
                    display: "flex",
                    flexDirection: "column",
                    fontWeight: "900",
                    fontSize: "24px",
                    fontFamily: "'Roboto', sans-serif",
                }}>
                    {nameMap[uni]}
                    <span style={{
                        fontWeight: "300",
                        fontSize: "16px",
                        fontFamily: "'Roboto', sans-serif",
                        color: "#989898",
                    }}>
                        {currentUniData.full_name}
                    </span>
                </h1>
            </div>
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Mode of Admission
                    </h2>
                    <p>
                        {currentUniData.mode_of_admission}
                    </p>
                </div>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Eligibility Criteria
                    </h2>
                    <div className={styles.grid}>
                        <div className={styles.catg}>
                            <span>
                                General
                            </span>
                            <p>
                                {currentUniData.eligibility.general}
                            </p>
                        </div>
                        {uni !== "iiitd" ? <div className={styles.catg}>
                            <span>
                                SC/ST/PWD
                            </span>
                            <p>
                                {currentUniData.eligibility.sc_st_pwd}
                            </p>
                        </div> : <div className={styles.catg}>
                            <span>
                                SC/ST
                            </span>
                            <p>
                                {currentUniData.eligibility.sc_st}
                            </p>
                        </div>}
                        <div className={styles.catg}>
                            <span>
                                OBC NCL
                            </span>
                            <p>
                                {currentUniData.eligibility.obc_ncl}
                            </p>
                        </div>
                        {uni !== "iiitd" ? <div className={styles.catg}>
                            <span>
                                Defence
                            </span>
                            <p>
                                {currentUniData.eligibility.defence}
                            </p>
                        </div> : <div className={styles.catg}>
                            <span>
                                Defence/PWD
                            </span>
                            <p>
                                {currentUniData.eligibility.defence_pwd}
                            </p>
                        </div>}
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Fee Structure
                    </h2>
                    <div style={{
                        marginBottom: "12px",
                    }} className={styles.catg}>
                            <span>
                                Fees (Per Semester)
                            </span>
                        <p>
                            ₹{currentUniData.fees.toLocaleString()}
                        </p>
                    </div>
                    <div className={styles.catg}>
                        <span>
                            Hostel Fees (Per Semester)
                        </span>
                        <p>
                            {currentUniData.hostel_fees === null ? "No Hostel Available" : typeof currentUniData.hostel_fees === "number" ? currentUniData.hostel_fees + " INR" : <>
                                {Object.entries(currentUniData.hostel_fees).map(([key, value]: [string,any]) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                            padding: "8px 0",
                                            borderBottom: "1px solid #000000"
                                        }}
                                    >
                                        <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                                        <span>₹{value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </> }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}