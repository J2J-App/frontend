import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";
import { FaDiscord, FaGithub } from 'react-icons/fa'; 
import { AiOutlineMail } from 'react-icons/ai'; 


export default function Footer() {
    const uniformLinkStyle = {
    fontFamily: '"Roboto", sans-serif',
    fontSize: "18px", // Uniform size
    fontWeight: "700", // Uniform light weight (similar to 'Mail' text)
    color: "rgba(255, 255, 255, 0.9)", // Uniform color
    textDecoration: 'none', 
    margin: '5px 0', // Vertical spacing between links
    };

    const iconLinkStyle = { ...uniformLinkStyle, display: 'flex', alignItems: 'center', gap: '8px', margin: '5px 0' };
    const headerStyle = {
        color: "rgba(255,255,255,0.7)",
        fontFamily: '"Roboto", sans-serif',
        fontSize: "16px",
        fontWeight: "300",
    };
    //TODO:
    // 1. Fix on mobile
    return (
        <div className={styles.footerContainer}>
            <h3 className={styles.footerHead}>
                JEEPEDIA.IN
            </h3>
            <div className={styles.footerContent}>
                <div className={styles.grid} style={{ marginLeft: '150px', justifyContent: 'space-between' }}>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "16px",
                            fontWeight: "300",
                        }}>
                            Tools
                        </h4>
                        <Link href={"/predictor"} style={uniformLinkStyle}>
                            Predictor
                        </Link>
                        <Link href={"/universities"} style={uniformLinkStyle}>
                            Universities
                        </Link>
                        <Link href={"/compare"} style={uniformLinkStyle}>
                            Compare
                        </Link>
                    </div>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "16px",
                            fontWeight: "300",
                        }}>
                            Your Data
                        </h4>
                        <Link href={"/privacy"} style={uniformLinkStyle}>
                            Privacy Policy
                        </Link>
                        <Link href={"/tos"} style={uniformLinkStyle}>
                            Terms of Service
                        </Link>
                    </div>
                    <div className={styles.gridCon}>
                        <h4 style={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "16px",
                            fontWeight: "300",
                        }}>
                            This Project
                        </h4>
                        <div style={{  display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                            <a href={"mailto:jeepedia.in@gmail.com"} target={"_blank"} rel="noopener noreferrer" title="Email"
                                className="text-neutral-300 hover:text-cyan-400"
                                style={iconLinkStyle}>
                                <AiOutlineMail size={22} style={{ color: 'currentColor' }}  />
                                Mail
                            </a>
                            <a href={"https://discord.gg/Z8s9JECw4C"} target={"_blank"} rel="noopener noreferrer" title="Discord"
                                className="text-neutral-300 hover:text-cyan-400"
                                style={iconLinkStyle}>
                                <FaDiscord size={22} style={{ color: 'currentColor' }} />
                                Discord
                            </a>
                            <a href={"https://github.com/J2J-App"} target={"_blank"} rel="noopener noreferrer" title="GitHub"
                                className="text-neutral-300 hover:text-cyan-400"
                                style={iconLinkStyle}>
                                <FaGithub size={22} style={{ color: 'currentColor' }}  />
                                Github
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.lowerCon}>
                    <p style={{
                        margin: "0",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "12px",
                        textAlign: "right",
                        fontWeight: "300",
                        color: "rgba(255,255,255,0.65)",
                    }}>
                        Copyright © 2025 JEEPedia. All rights reserved.
                    </p>
                    <div style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        margin: "0",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        <Image style={{
                            objectFit: "contain",
                            borderRadius: "5px",
                            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
                        }} src="/icons/navbar/j2jicon.png" alt="JEEPedia logo" fill={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}