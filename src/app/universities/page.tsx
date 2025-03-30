import UniCard from "@/components/Cards/Uni/uni-card";
import PlacementCard from "@/components/Cards/Placement/Placement";
import nsut from "@/public/nsut.jpg";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";
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
                            <UniCard name="NSUT" description="An absolute shithole of incompetant admins, fuckall teachers and perverted students." background={nsut.src} icon={nsut_icon.src} location={"Dwarka Mor"} nirf="57" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="CSE" background={nsut.src} name={"NSUT"} icon={nsut_icon.src} max="62 LPA" min="7 LPA" avg="14 LPA" median="21 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
            {/*More card add yaha se kar */}
            <div className={Styles.container}>
                <Link href={"/nsut"}>
                    <div className={Styles.cardContainer}>
                        <div className={Styles.front}>
                            <UniCard name="NSUT" description="An absolute shithole of incompetant admins, fuckall teachers and perverted students." background={nsut.src} icon={nsut_icon.src} location={"Dwarka Mor"} nirf="57" />
                        </div>
                        <div className={Styles.back}>
                            <PlacementCard course="CSE" background={nsut.src} name={"NSUT"} icon={nsut_icon.src} max="62 LPA" min="7 LPA" avg="14 LPA" median="21 LPA" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}