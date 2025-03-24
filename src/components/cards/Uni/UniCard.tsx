import styles from "./uniCard.module.css";
import Image from "next/image";
import locationIcon from "@/public/locationicon.svg"
import nirficon from "@/public/nirficon.svg"

export default function UniCard({ name, icon, background, description, location, nirf }: {
    name: string;
    icon: string;
    background: string;
    description?: string;
    location: string;
    nirf: string;
}) {
    return <div className={styles.uniCardContainer}>
        <div className={styles.imageContainer} >
            <svg className={styles.image} style={{
                filter: "blur(40px)",
            }} id="Layer_2" viewBox="0 0 232.48 200">
                <defs>
                    <clipPath id="clippath">
                        <path className="cls-1"
                              d="M232.48,0v108.62c-34.26,11.7-73.94,18.38-116.24,18.38S34.26,120.32,0,108.62V0h232.48Z"/>
                    </clipPath>
                </defs>
                <g className={styles.cls2}>
                    <image width="936" height="526" transform="translate(-10.1 -7.5) scale(.27)"
                           href={background}/>
                </g>
            </svg>
            <svg className={styles.image} id="Layer_2" viewBox="0 0 232.48 200">
                <defs>
                    <clipPath id="clippath">
                        <path className="cls-1"
                              d="M232.48,0v108.62c-34.26,11.7-73.94,18.38-116.24,18.38S34.26,120.32,0,108.62V0h232.48Z"/>
                    </clipPath>
                </defs>
                <g className={styles.cls2}>
                    <image width="936" height="526" transform="translate(-10.1 -7.5) scale(.27)"
                           href={background}/>
                </g>
            </svg>
            <Image style={{
                zIndex: "6",
                position: "absolute",
                bottom: "10px",
                left: "50%",
                borderRadius: "10px",
                transform: "translateX(-50%)",
                boxShadow: "0px 0px 40px white",
            }} src={icon} alt={"Uni Icon"} width={68} height={68} quality={100} />
        </div>
        <div className={styles.contentContainer}>
            <span className={styles.name}>
                {name}
            </span>
            <p className={styles.desc}>
                {description}
            </p>
            <div style={{
                width: '45%',
                marginTop: "15px",
                borderTop: '2px dotted #8c8c8c',
                height: '2px',
            }}></div>
            <div className={styles.info}>
                <div className={styles.infoBox}>
                    <Image src={locationIcon} alt={"Location Icon"} width={40} height={40}/>
                    <div className={styles.infoText}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '900',
                        }}>Location</span>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '300',
                        }}
                        >{location}</span>
                    </div>
                </div>

                <div className={styles.infoBox}>
                    <Image src={nirficon} alt={"Location Icon"} width={40} height={40}/>
                    <div className={styles.infoText}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '900',
                        }}>NIRF</span>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '300',
                        }}
                        >{nirf}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

}