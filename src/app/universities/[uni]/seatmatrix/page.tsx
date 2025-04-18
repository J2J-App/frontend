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

    const uniSeatMatrixData = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix")

    const categoryFullForm = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix/categorydescription")

    const uniTotalSeats = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix/totalseats")

    if (!uniSeatMatrixData.ok) {
        throw new Error("Failed to fetch data");
    }

    if (!uniDataRes.ok) {
        throw new Error("Failed to fetch data");
    }

    if (!categoryFullForm.ok) {
        throw new Error("Failed to fetch data");
    }

    if (!uniTotalSeats.ok) {
        throw new Error("Failed to fetch data");
    }

    const { data } = await uniDataRes.json();
    const { data:seatData } = await uniSeatMatrixData.json();
    const { data:categoryData } = await categoryFullForm.json();
    const { data:totalSeatsData } = await uniTotalSeats.json();

    const currentUniData = data[uni];
    const currentUniSeatData = seatData[uni.toUpperCase()];
    const currentTotalSeatsData = totalSeatsData[uni.toUpperCase()];
    const categoryFullFormData = categoryData.category_descriptions;

    console.log(currentUniSeatData);
    console.log(currentTotalSeatsData);
    console.log(categoryFullFormData);

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
        margin: "10px 0",
        padding: "0 20px",
        marginTop: "120px",
        marginBottom: "90px"
    }}>
        <div className={styles.headContainer}>
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Seat Matrix
                    </h2>
                    {currentUniSeatData === null ? <>null</> : <>
                        {Object.entries(currentUniSeatData).map(([key, value]: [string,any]) => (
                            <div 
                            className={styles.catg} 
                            key={key}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginBottom: 20,
                            }}>
                            <span>
                                {key}
                            </span>
                            <div
                                style={{
                                    marginBottom: 8,
                                    padding: "8px 0",
                                }}
                            >
                                <div>
                                    {Object.entries(value).map(([subKey, subValue]: [string,any]) => (
                                        <div 
                                        key={subKey}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                            padding: "8px 0",
                                            borderBottom: "1px solid #000000"
                                        }}
                                        >
                                            <span style={{ fontWeight: 500 }}>
                                                {`${categoryFullFormData[subKey]}`}
                                            </span>
                                            <span>{subValue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                        ))}
                    </> }
                </div>
            </div>
        </div>
    </div>
}