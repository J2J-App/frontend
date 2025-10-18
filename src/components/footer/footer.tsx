import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

export default function Footer() {
  const uniformLinkStyle = {
    fontFamily: '"Roboto", sans-serif',
    fontSize: "16px",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    textDecoration: "none",
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <div className={styles.footerContainer}>
      <h3 className={styles.footerHead}>JEEPEDIA.IN</h3>

      <div className={styles.footerContent}>
        {/* About Section */}
        <div className={styles.gridCon}>
          <h4
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            About JEEPedia
          </h4>
          <p
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              fontWeight: "400",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "250px",
              lineHeight: "1.5",
            }}
          >
            JEEPedia is an Open Source tool designed to help students with the
            complex process of selecting the right university.
          </p>
        </div>

        {/* Tools Section */}
        <div className={styles.gridCon}>
          <h4
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "16px",
              fontWeight: "400",
              marginBottom: "8px",
            }}
          >
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

        {/* Your Data Section */}
        <div className={styles.gridCon}>
          <h4
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "16px",
              fontWeight: "400",
              marginBottom: "8px",
            }}
          >
            Your Data
          </h4>
          <Link href={"/privacy"} style={uniformLinkStyle}>
            Privacy Policy
          </Link>
          <Link href={"/tos"} style={uniformLinkStyle}>
            Terms of Service
          </Link>
        </div>

        {/* This Project Section */}
        <div className={styles.gridCon}>
          <h4
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "16px",
              fontWeight: "400",
              marginBottom: "8px",
            }}
          >
            This Project
          </h4>
          <a
            href="mailto:jeepedia.in@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={uniformLinkStyle}
          >
            <AiOutlineMail size={20} /> Mail
          </a>
          <a
            href="https://discord.gg/Z8s9JECw4C"
            target="_blank"
            rel="noopener noreferrer"
            style={uniformLinkStyle}
          >
            <FaDiscord size={20} /> Discord
          </a>
          <a
            href="https://github.com/J2J-App"
            target="_blank"
            rel="noopener noreferrer"
            style={uniformLinkStyle}
          >
            <FaGithub size={20} /> Github
          </a>
        </div>

        {/* Stay Updated Section */}
        <div className={styles.gridCon}>
          <h4
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "16px",
              fontWeight: "800",
              marginBottom: "8px",
            }}
          >
            Stay Updated
          </h4>
          <p
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "15px",
              fontWeight: "400",
              color: "rgba(255,255,255,0.8)",
              lineHeight: "1.5",
              marginBottom: "10px",
              maxWidth: "250px",
            }}
          >
            Subscribe to our newsletter for updates, tips, and new features.
          </p>
          <div className={styles.newsletter}>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className={styles.lowerCon}>
        <p
          style={{
            margin: "0",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "12px",
            fontWeight: "300",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          © 2025 JEEPedia. All rights reserved.
        </p>
        <div className={styles.footerLogo}>
          <Image
            src="/icons/navbar/j2jicon.png"
            alt="JEEPedia logo"
            fill
            style={{
              objectFit: "contain",
              borderRadius: "5px",
              filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
