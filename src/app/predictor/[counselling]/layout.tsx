"use client";
import styles from "./layout.module.css";
import { useParams } from "next/navigation";
import { counsellings } from "@/app/predictor/counsellings.ts";
import Link from "next/link";
import Image from "next/image";
function TabUI({
  params,
}: {
  params: {
    counselling: string;
  };
}) {
  return (
    <div className={styles.tabUI}>
      {counsellings
        .map((counselling) => (
          <Link
            href={`/predictor/${counselling.link}`}
            key={counselling.name}
            className={`${styles.tab} ${
              params.counselling === counselling.link ? styles.active : ""
            }`}
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
              <h5 className={styles.head}>{counselling.name}</h5>
            </div>
          </Link>
        ))
        .reverse()}
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const params: {
    counselling: string;
  } = useParams();

  return (
    <div className={styles.container}>
      <TabUI params={params} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
