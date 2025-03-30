import Image from "next/image";
import styles from "./page.module.css";
import bg from "@/public/backgrounds/j2j-bg.png"
import bgm from "@/public/backgrounds/j2j-bg-m.png"

import arrow from "@/public/icons/home/arrow.svg"
import Link from "next/link";

export default function Home() {
  return (
      <div className={styles.page}>
          <Image src={bg} alt={"Background"} fill={true} style={{
              objectFit: "cover",
              objectPosition: "right",
          }} className={styles.desktop} quality={100}/>
          <Image src={bgm} alt={"Background"} fill={true} style={{
              objectFit: "cover",
              objectPosition: "bottom",
          }} className={styles.mobile} quality={100}/>
          <div className={styles.content}>
              <div className={styles.contentContainer}>
                  <h1 className={styles.header}>
                      <span className={styles.animation}>
                          The no-bullshit tool
                      </span>
                      <br />
                      <span className={styles.animation2}>
                          for JAC counselling
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
          </div>
      </div>
  );
}
