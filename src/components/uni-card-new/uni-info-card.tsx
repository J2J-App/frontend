import styles from "./uni-info-card.module.css";
import Image from "next/image";
import { MdArrowRight } from "react-icons/md";

export default function UniInfoCard({
  name,
  logo,
  banner,
  nirf,
}: {
  name: string;
  logo: string;
  banner: string;
  nirf: string;
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.bannerContainer}>
        <Image
          src={banner}
          alt=""
          fill={true}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            overflow: "hidden",
            borderRadius: "10px",
            filter: "blur(10px)",
          }}
        />
        <Image
          src={banner}
          alt={`${name} university campus`}
          fill={true}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            overflow: "hidden",
            borderRadius: "10px",
          }}
        />
      </div>
      <div className={styles.info}>
        <div
          style={{
            height: 35,
            width: 35,
            position: "relative",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          <Image
            src={logo}
            alt={`${name} university logo`}
            fill={true}
            style={{
              objectFit: "contain",
              objectPosition: "center",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          />
        </div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 600,
            margin: "0",
            textAlign: "left",
            color: "#ffffff",
            width: "fit-content",
          }}
        >
          {name}
        </p>
        <div className={styles.link}>
          <MdArrowRight />
        </div>
      </div>
    </div>
  );
}
