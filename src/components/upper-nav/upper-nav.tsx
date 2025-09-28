"use client";
import { useEffect, useState } from "react";
import styles from "./upper-nav.module.css";
import Image from "next/image";
import { API_URL } from "@/config";

export default function UpperNav({
  params,
}: {
  params: { uni: string; counselling: string };
}) {
  const { uni, counselling } = params;

  const [currentUniData, setCurrentUniData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/v2/about`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            college: uni,
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setCurrentUniData(json.data[uni]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [uni]);

  const nameMap: { [key: string]: string } = {
    "nsut-delhi": "NSUT",
    nsutw: "NSUT WEST",
    nsute: "NSUT EAST",
    dtu: "DTU",
    igdtuw: "IGDTUW",
    iiitd: "IIIT-D",
  };

  if (!currentUniData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.headContainer}>
      <div className={styles.background}>
        <Image
          style={{
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "18px",
            filter: "blur(30px)",
            transform: "scale(1, 1)",
          }}
          fill
          src={currentUniData.photos["college-pic"]}
          alt={uni}
        />
        <Image
          style={{
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "18px",
          }}
          fill
          src={currentUniData.photos["college-pic"]}
          alt={uni}
        />
      </div>

      <div className={styles.headText}>
        <div
          className={styles.icon}
          style={{
            backgroundColor: "White",
          }}
        >
          <Image fill src={currentUniData.photos["logo"]} alt={uni} />
        </div>
        <h1
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "900",
            fontSize: "24px",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {nameMap[uni]}
          <span
            style={{
              fontWeight: "300",
              fontSize: "20px",
              fontFamily: "'Roboto', sans-serif",
              color: "#ffffff",
            }}
          >
            {currentUniData.overview["Institute Name"]}
          </span>
          <span
            style={{
              fontWeight: "300",
              fontSize: "16px",
              fontFamily: "'Roboto', sans-serif",
              color: "#989898",
            }}
          >
            Established in {currentUniData.overview["Established"]}
          </span>
        </h1>
      </div>
    </div>
  );
}
