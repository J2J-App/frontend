import UniCard from "@/components/cards/Uni/uni-card.tsx";
import PlacementCard from "@/components/cards/placement/placement.tsx";
import nsut from "@/public/backgrounds/colleges/nsut.jpg";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";
import dtu from "@/public/backgrounds/colleges/dtu.jpg";
import dtu_icon from "@/public/icons/uni/dtu_icon.png";
import iiid from "@/public/backgrounds/colleges/iiitd.jpg";
import iiid_icon from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw from "@/public/backgrounds/colleges/igdtuw.jpg";
import igdtuw_icon from "@/public/icons/uni/igdtuw_icon.png";
import nsutw from "@/public/backgrounds/colleges/nsutw.jpg";
import nsute from "@/public/backgrounds/colleges/nsute.jpg";
import Styles from "./styles.module.css";
import Link from "next/link";
import UniInfoCard from "@/components/uni-card-new/uni-info-card.tsx";

export default function Page() {
    return (
        <>
            <div style={{
                marginTop: "140px",
                width: "100%",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <h1 className={Styles.header}>
                    Universities
                </h1>
            </div>
            <div style={{
                marginTop: "10px",
            }} className={Styles.page}>
                <div className={Styles.container}>
                    <Link href={"/universities/nsut-delhi"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="NSUT" logo={nsut_icon.src} nirf={"57"} banner={nsut.src}/>
                        </div>
                    </Link>
                </div>
                <div className={Styles.container}>
                    <Link href={"/universities/dtu-delhi"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="DTU" logo={dtu_icon.src} nirf="27" banner={dtu.src}/>
                        </div>
                    </Link>
                </div>

                <div className={Styles.container}>
                    <Link href={"/universities/iiit-delhi"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="IIIT-D" logo={iiid_icon.src} nirf="87" banner={iiid.src}/>
                        </div>
                    </Link>
                </div>

                <div className={Styles.container}>
                    <Link href={"/universities/igdtuw-delhi"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="IGDTU" logo={igdtuw_icon.src} nirf=">150" banner={igdtuw.src}/>
                        </div>
                    </Link>
                </div>

                <div className={Styles.container}>
                    <Link href={"/universities/nsut-delhi-west-campus"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="NSUTW" logo={nsut_icon.src} nirf="57" banner={nsutw.src}/>
                        </div>
                    </Link>
                </div>
                <div className={Styles.container}>
                    <Link href={"/universities/nsut-delhi-east-campus"}>
                        <div className={Styles.cardContainer}>
                            <UniInfoCard name="NSUTE" logo={nsut_icon.src} nirf="57" banner={nsute.src}/>
                        </div>
                    </Link>
                </div>

            </div>
        </>
    );
}