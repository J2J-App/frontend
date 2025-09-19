import styles from "./placement.module.css";
import Image from "next/image";
import circle from "@/public/circle.svg"

export default function PlacementCard({ name, course, background, icon, max, avg, median, min }: {
    background: string;
    name: string;
    icon: string;
    course: string;
    max: string;
    avg: string;
    median: string;
    min: string;
}) {
    return <div className={styles.placementCardContainer}>
        <div className={styles.topBar} >
            <div className={styles.branchBar}>
                <Image style={{
                    borderRadius: "10px",
                }} src={icon} alt={`${name} ${course} department logo`} width={40} height={40}/>
                <span style={{
                    fontWeight: "900",
                }}>
                    {name}
                </span>
                -
                <span style={{
                    fontWeight: "100",
                }}>
                    {course}
                </span>
            </div>
            <Image style={{
                objectFit: "cover",
            }}  src={background} alt="" fill={true} />
        </div>
        <div className={styles.bottomBar}>
            <span style={{
                fontWeight: "900",
                fontFamily: "Impact, serif",
                color: "white",
                position: "absolute",
                fontSize: "14px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999
            }}>
                PACKAGES
            </span>
            <Image src={circle} className={styles.circle} alt="" width={150} height={150} />
            <Image style={{
                filter: "blur(30px)",
            }} src={circle} className={styles.circle} alt="" width={150} height={150} />
            <div className={styles.content}>
                <div className={styles.tile1}>
                    <div className={styles.tileContent}>
                        <span className={styles.top}>
                            MAX
                        </span>
                        <span className={styles.bottom}>
                            {max}
                        </span>
                    </div>
                </div>
                <div className={styles.tile2}>
                    <div className={styles.tileContent}>
                        <span className={styles.top}>
                            AVG
                        </span>
                        <span className={styles.bottom}>
                            {avg}
                        </span>
                    </div>
                </div>
                <div className={styles.tile3}>
                    <div className={styles.tileContent}>
                        <span className={styles.top}>
                            MEDIAN
                        </span>
                        <span className={styles.bottom}>
                            {median}
                        </span>
                    </div>
                </div>
                <div className={styles.tile4}>
                    <div className={styles.tileContent}>
                        <span className={styles.top}>
                            MIN
                        </span>
                        <span className={styles.bottom}>
                            {min}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}