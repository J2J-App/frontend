import Link from "next/link";
import styles from "./footer.module.css";
import Image from "next/image";
import icon from "@/public/icons/navbar/j2jicon.png";
import { SOCIAL_LINKS, CONTACT_EMAIL } from "@/config";

export default function Footer() {
  //TODO:
  // 1. Fix on mobile
  return (
    <div className={styles.footerContainer}>
      <h3 className={styles.footerHead}>JEEPEDIA.IN</h3>
      <div className={styles.footerContent}>
        <div className={styles.grid}>
          <div className={styles.gridCon}>
            <h4
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "16px",
                fontWeight: "300",
              }}
            >
              Tools
            </h4>
            <Link className={styles.link} href={"/predictor"}>
              Predictor
            </Link>
            <Link className={styles.link} href={"/universities"}>
              Universities
            </Link>
            <Link className={styles.link} href={"/compare"}>
              Compare
            </Link>
          </div>
          <div className={styles.gridCon}>
            <h4
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "16px",
                fontWeight: "300",
              }}
            >
              Your Data
            </h4>
            <Link className={styles.link} href={"/privacy"}>
              Privacy Policy
            </Link>
            <Link className={styles.link} href={"/tos"}>
              Terms of Service
            </Link>
          </div>
          <div className={styles.gridCon}>
            <h4
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: '"Roboto", sans-serif',

                fontSize: "16px",
                fontWeight: "300",
              }}
            >
              This Project
            </h4>
            <a
              className={styles.link}
              href={`mailto:${CONTACT_EMAIL}`}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              Mail
            </a>
            <a
              className={styles.link}
              href={SOCIAL_LINKS.discord}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              Discord
            </a>
            <a
              className={styles.link}
              href={SOCIAL_LINKS.github}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className={styles.lowerCon}>
          <p
            style={{
              margin: "0",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "12px",
              textAlign: "right",
              fontWeight: "300",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Copyright © 2025 JEEPedia. All rights reserved.
          </p>
          <div
            style={{
              position: "relative",
              width: "50px",
              height: "50px",
              margin: "0",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Image
              style={{
                objectFit: "contain",
                borderRadius: "5px",
                filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
              }}
              src={icon}
              alt={"JEEPedia App Icon"}
              fill={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
