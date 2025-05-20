import styles from "./page.module.css";
import jac from "@/public/icons/counsellings/jac.jpg";
import josaa from "@/public/icons/counsellings/josaa.png";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
    const counsellings = [{
        "name": "JAC",
        "icon": jac,
        "link": "jac",
        "description": "Joint Admission Counselling",
    }, {
        "name": "JoSAA",
        "icon": josaa,
        "link": "josaa",
        "description": "Joint Seat Allocation Authority",
    }]

    return <main className={styles.counsellingsContainer}>
        <div className={styles.content}>
            <h1 className={styles.head}>
                Select a Counselling
            </h1>
            <p className={styles.desc}>
                You can always switch to other counsellings from the navbar, your data gets synced.
            </p>
            <div className={styles.counsellingGrid}>
                {
                    counsellings.map((counselling) => (
                        <Link href={`/predictor/${counselling.link}`} key={counselling.name} className={styles.counselling}>
                            <div className={styles.icons}>
                                <Image style={{
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    overflow: "hidden"
                                }} src={counselling.icon} alt={counselling.name} fill={true}/>
                            </div>

                            <div>
                                <h5 style={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    margin: "0",
                                    textAlign: "left",
                                    color: "#ffffff",
                                }}>
                                    {counselling.name}
                                </h5>
                                <p style={{
                                    fontSize: 16,
                                    fontWeight: 300,
                                    margin: "0",
                                    color: "rgba(255,255,255,0.64)",
                                }}>
                                    {counselling.description}
                                </p>
                            </div>
                        </Link>
                    )).reverse()
                }
            </div>
        </div>
    </main>
}