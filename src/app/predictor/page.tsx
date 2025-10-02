import { Metadata } from "next";
import styles from "./page.module.css";
import jac from "@/public/icons/counsellings/jac.jpg";
import josaa from "@/public/icons/counsellings/josaa.png";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export const metadata: Metadata = {
  title: "JEE Pedia | College Predictor",
  description:
    "Find the best colleges for your JEE rank. Supports JoSAA, JAC, and more. Accurate cutoffs, branch predictions, and personalized insights.",
  keywords: [
    "JEE College Predictor",
    "JoSAA Predictor",
    "JAC Delhi",
    "JEE Mains 2025",
    "JEE Mains 2026",
    "college predictor",
    "Engineering Cutoffs",
    "College Comparison",
    "JEE Rank Predictor",
  ],
  metadataBase: new URL("https://www.jeepedia.in/"),
  openGraph: {
    title: "JEE Pedia | Accurate College Predictor for JEE Mains",
    description:
      "Predict your college using your JEE rank. Real-time cutoffs, branch-wise trends, and tools for JoSAA, JAC and more.",
    url: "https://www.jeepedia.in/predictor",
    siteName: "JEEPedia",
  },
};

export default function Page() {
  const counsellings = [
    {
      name: "JAC",
      icon: jac,
      link: "jac",
      description: "Joint Admission Counselling",
    },
    {
      name: "JoSAA",
      icon: josaa,
      link: "josaa",
      description: "Joint Seat Allocation Authority",
    },
  ];

  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="JEE College Predictor, JoSAA Predictor, college predictor ,Engineering Cutoffs, College Comparison ,josaa predictor, jac predictor , josaa college predictor, jac college predictor"
        />
      </Head>

      <main className={styles.counsellingsContainer}>
        <div className={styles.content}>
          <h1 className={styles.head}>Select a Counselling</h1>
          <p className={styles.desc}>
            You can always switch to other counsellings from the navbar, your data gets synced.
          </p>
          <div className={styles.counsellingGrid}>
            {counsellings
              .map((counselling) => (
                <Link
                  href={`/predictor/${counselling.link}`}
                  key={counselling.name}
                  className={styles.counselling}
                >
                  <div className={styles.icons}>
                    <Image
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                        overflow: "hidden",
                      }}
                      src={counselling.icon}
                      alt={`${counselling.name} counselling logo`}
                      fill={true}
                    />
                  </div>

                  <div>
                    <h5
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        margin: "0",
                        textAlign: "left",
                        color: "#ffffff",
                      }}
                    >
                      {counselling.name}
                    </h5>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 300,
                        margin: "0",
                        color: "rgba(255,255,255,0.64)",
                      }}
                    >
                      {counselling.description}
                    </p>
                  </div>
                </Link>
              ))
              .reverse()}
          </div>
        </div>
      </main>
    </>
  );
}
