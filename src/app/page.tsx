import Image from "next/image";
import styles from "./page.module.css";
import bg from "@/public/backgrounds/j2j-bg.png"
import bgm from "@/public/backgrounds/j2j-bg-m.png"

import jac from "@/public/icons/counsellings/jac.jpg"
import josaa from "@/public/icons/counsellings/josaa.png"

import counsellingBg from "@/public/backgrounds/counsellings/bg1.png"

import predictor from "@/public/backgrounds/tools/predictor.png"
import uni from "@/public/backgrounds/tools/uni.png"
import placements from "@/public/backgrounds/tools/placements.png"
import contact from "@/public/backgrounds/tools/contact.png"

import feathead from "@/public/backgrounds/tools/featcomp.png";


import arrow from "@/public/icons/home/arrow.svg"
import Link from "next/link";
import {TbBrandDiscordFilled} from "react-icons/tb";
import {IoLogoDiscord} from "react-icons/io5";
import {AiFillDiscord} from "react-icons/ai";
import {SiDiscord, SiGithub} from "react-icons/si";
import {DiGithub} from "react-icons/di";
import Accordion from "@/components/accordion/accordion.tsx";
import {MdMail} from "react-icons/md";
import Footer from "@/components/footer/footer.tsx";

export default function Home() {
    const counsellings = [{
        "name": "JAC",
        "icon": jac,
        "description": "Joint Admission Counselling",
    }, {
        "name": "JoSAA",
        "icon": josaa,
        "description": "Joint Seat Allocation Authority",
    }]
    return (
    <article className={styles.page}>
        <Image src={bg} alt={"Background"} fill={true} style={{
            objectFit: "cover",
            objectPosition: "right",
        }} className={styles.desktop} quality={100}/>
        <Image src={bgm} alt={"Background"} fill={true} style={{
            objectFit: "cover",
            objectPosition: "bottom",
        }} className={styles.mobile} quality={100}/>
        <main className={styles.content}>
            <div className={styles.contentContainer}>
                <h1 className={styles.header}>
                    <span className={styles.animation}>
                        The no-bullshit tool
                    </span>
                    <br />
                    <span className={styles.animation2}>
                        for JEE counselling
                    </span>
                </h1>
                <p className={styles.lower}>
                    Unlike your ex, we do give you clarity
                </p>
                <Link href={"/predictor"} className={styles.link}>
                    <p className={styles.text}>
                        Launch
                    </p>
                    <div className={styles.linkImage}>
                      <Image src={arrow} alt={"Arrow"} width={30} height={30} />
                    </div>
                </Link>
            </div>
        </main>
        <section className={styles.extraContent}>
            <div className={styles.sepLine}>

            </div>
            <h2 className={styles.toolHeader}>
                The Only Tool<br/>You Need
            </h2>
            <div className={styles.toolContainer}>
                <div className={styles.leftContainer}>

                    <Image style={{
                        objectFit: "cover",
                        objectPosition: "left",
                    }} src={predictor} alt={"Predictor"} fill={true}/>
                    <h3 style={{
                        top: "10px",
                        left: "10px",
                    }} className={styles.toolName}>
                        Predictor
                    </h3>

                </div>
                <div className={styles.rightContainer}>

                    <div className={styles.topTool }>
                        <Image style={{
                            objectFit: "cover",
                            objectPosition: "bottom right",
                        }} src={placements} alt={"Predictor"} fill={true}/>
                        <h3 style={{
                            bottom: "10px",
                            right: "10px",
                        }} className={styles.toolName1}>
                            Placements
                        </h3>
                    </div>
                    <div className={styles.topTool}>
                        <Image style={{
                            objectFit: "cover",
                            objectPosition: "top",
                        }} src={uni} alt={"Universities"} fill={true}/>
                        <h3 style={{
                            top: "10px",
                            right:  "10px",
                        }} className={styles.toolName}>
                            Universities
                        </h3>
                    </div>
                </div>
            </div>
            <div className={styles.conContainer}>
                <div className={styles.heading}>
                    <h3 style={{
                        fontFamily: "Roboto",
                        color: "rgba(255,255,255,0.66)",
                        fontWeight: "900",
                        fontSize: "38px",
                    }}>
                        Counsellings
                    </h3>
                    <Image src={counsellingBg} alt={"Counselling Background"} fill={true} style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        overflow: "hidden",
                        zIndex: "-1"
                    }}/>
                </div>
                <div className={styles.counsellingGrid}>
                    {
                        counsellings.map((counselling) => (
                            <div key={counselling.name} className={styles.counselling}>
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
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.comparisonHead}>
                <h2 style={{
                    marginTop: "-50px",
                }}>
                    What Makes Us Different?
                </h2>
                <Image src={feathead} alt={"Feature Head"} fill={true} style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    overflow: "hidden",
                    transform: "scale(1.1)",
                    filter: "blur(30px)",
                }}/>
                <Image src={feathead} alt={"Feature Head"} fill={true} style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    overflow: "hidden",
                }}/>
            </div>
            <div className={styles.compTable}>
                <div className={styles.head}>
                    Parameter
                </div>
                <div className={styles.head}>
                    JEEPedia
                </div>
                <div className={styles.head}>
                    Others
                </div>
                <div className={styles.param}>
                    Friction
                </div>
                <div className={styles.nm}>
                    One Click Away
                </div>
                <div className={styles.nm}>
                    Require Signup
                </div>
                <div className={styles.param}>
                    Speed
                </div>
                <div className={styles.nm}>
                    Almost Instant
                </div>
                <div className={styles.nm}>
                    Slow and Laggy
                </div>
                <div className={styles.param}>
                    Accuracy
                </div>
                <div className={styles.nm}>
                    Verified Data
                </div>
                <div className={styles.nm}>
                    Unreliable
                </div>
                <div className={styles.param}>
                    Simplicity
                </div>
                <div className={styles.nm}>
                    Well Thought Out
                </div>
                <div className={styles.nm}>
                    Confusing UI
                </div>
                <div className={styles.param}>
                    Tools
                </div>
                <div className={styles.nm}>
                    Useful and Unique
                </div>
                <div className={styles.nm}>
                    Comparatively Less
                </div>
                <div className={styles.param}>
                    Paywall
                </div>
                <div className={styles.nm}>
                    Completely Free
                </div>
                <div className={styles.nm}>
                    Some features are paid
                </div>
            </div>
            <div className={styles.aboutTop}>
                <div className={styles.leftC}>
                    <p>
                        <b>JEEPedia</b> is an Open Source tool designed to help students with the complex process around selecting the right university.<br/>
                    </p>
                    <p>
                        Our goal was to create something that's accurate while also being, as some distinguished individuals might say - "sexy".
                    </p>
                    <p>
                        Contributions are always welcome! As is engagement with our community.
                    </p>
                    <div style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 16,
                    }}>
                        <a style={{
                            color: "#5865F2",
                        }} className={styles.linkOut} target="_blank" href="https://discord.gg/Z8s9JECw4C">
                            <SiDiscord/> Discord
                        </a>
                        <a style={{
                            color: "#ffffff",
                        }} className={styles.linkOut} target="_blank" href="https://github.com/J2J-App">
                            <SiGithub/> GitHub
                        </a>
                    </div>

                </div>
                <div className={styles.rightC}>
                    About<br/>
                    This Project
                </div>
            </div>
            <div className={styles.faqs}>
                <Accordion title={"How much can I trust the data?"} content={"We run thorough checks on the data we provide and keep our databases updated regularly. If you are still doubtful, we recommend that you double-check the data with official sources."} width={"100%"}/>
                <Accordion title={"Do you cover all the engineering universities?"} content={"We try to cover each and every university possible, we do cover all IITs, NITs, GFTIs, IIITs, Universities under state counselling boards, and even a decent number of Private Universities. However, there might be something that we still missed."} width={"100%"}/>
                <Accordion title={"How accurate is the predictor?"} content={"The predictor on our site uses previous year data to give you an estimate on what all branches you might get based on your rank, category, sub-category, etc. So, it can be safely said that it's fairly accurate. However, it, or for that matter any predictor should not be trusted blindly - At the end of the day, it comes down to yearly variations which cannot be predicted."} width={"100%"}/>
                <Accordion title={"Why does the placement data on this site show lower numbers for a large number of universities?"} content={"We want to make sure that any data we provide is accurate. In an effort to achieve this, we have tried to compile our data from RTI records only and not use publicly available figures. This can explain the lower numbers as compared to other sources."} width={"100%"}/>
                <Accordion title={"Who's behind this project?"} content={"We are a small group of engineering students from many different universities across the nation."} width={"100%"}/>
            </div>
            <div className={styles.contactHead}>
                <Image src={contact} alt={"contact"} fill={true} style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    zIndex: "1"
                }} />
                <div className={styles.contactText}>
                    <h2 className={styles.head1}>
                        But Maybe You've<br />Still Got Questions
                    </h2>
                    <a href="mailto:admin@jeepedia.in" className={styles.contactLink}>
                        <MdMail /> Mail Us
                    </a>
                </div>

            </div>
            <Footer />

        </section>

    </article>

    );
}
