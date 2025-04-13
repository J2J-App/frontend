import UniCard from "@/components/cards/Uni/uni-card.tsx";
import PlacementCard from "@/components/cards/placement/placement.tsx";
import nsut from "@/public/nsut.jpg";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";
import dtu from "@/public/dtu.jpg";
import dtu_icon from "@/public/icons/uni/dtu_icon.png";
import iiid from "@/public/iiitd.jpeg";
import iiid_icon from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw from "@/public/igdtuw.jpg";
import igdtuw_icon from "@/public/icons/uni/igdtuw_icon.png";
import nsutw from "@/public/nsutw.png";
import nsute from "@/public/nsute.png";
import Styles from "./styles.module.css";
import Link from "next/link";

export default function Page() {
    return (
        <div style={{
            marginTop: "120px",
        }} className={Styles.page}>
            <div className={Styles.container}>
                <Link href={"/nsut"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="NSUT" description="Premier tech university known for innovation and strong alumni network." background={nsut.src} icon={nsut_icon.src} location={"Dwarka, Delhi"} nirf="57" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={nsut.src} name={"NSUT"} icon={nsut_icon.src} max="106 LPA" min="6 LPA" avg="13.11 LPA" median="14.17 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={Styles.container}>
                <Link href={"/dtu"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="DTU" description="One of India's top engineering colleges with a legacy of excellence." background={dtu.src} icon={dtu_icon.src} location={"Rohini, Delhi"} nirf="27" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={dtu.src} name={"DTU"} icon={dtu_icon.src} max="62 LPA" min="7 LPA" avg="14 LPA" median="21 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={Styles.container}>
                <Link href={"/iiitd"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="IIIT-D" description="Known for cutting-edge research and tech-focused programs." background={iiid.src} icon={iiid_icon.src} location={"Okhla, Delhi"} nirf="87" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={iiid.src} name={"IIIT-D"} icon={iiid_icon.src} max="40 LPA" min="3.36 LPA" avg="15.93 LPA" median="15.5 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={Styles.container}>
                <Link href={"/igdtuw"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="IGDTU" description="Premier women's engineering university in Delhi." background={igdtuw.src} icon={igdtuw_icon.src} location={"Kashmere Gate, Delhi"} nirf=">150" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={igdtuw.src} name={"IGDTUW"} icon={igdtuw_icon.src} max="56 LPA" min="3.5 LPA" avg="19.84 LPA" median="20.50 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={Styles.container}>
                <Link href={"/nsutw"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="NSUTW" description="NSUT's West campus focused on tech and innovation." background={nsutw.src} icon={nsut_icon.src} location={"Jaffarpur, Delhi"} nirf="57" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={nsutw.src} name={"NSUT West"} icon={nsut_icon.src} max="NA" min="NA" avg="NA" median="NA" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={Styles.container}>
                <Link href={"/nsute"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="NSUTE" description="Expanding NSUT's excellence in engineering education." background={nsute.src} icon={nsut_icon.src} location={"Geeta Colony, Delhi"} nirf="57" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="Over All" background={nsute.src} name={"NSUT East"} icon={nsut_icon.src} max="NA" min="NA" avg="NA" median="NA" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}