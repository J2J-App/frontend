"use client";

import { useState } from "react";
import Tabs from "@/components/tabs/tabs.tsx";
import styles from "@/app/universities/[uni]/placement/page.module.css";

function PlacementCard({
    branch,
    reg,
    placed,
    avg,
    mid,
    percent,
}: {
    branch: string;
    reg: string;
    placed: number;
    avg: number | undefined;
    mid: number | undefined;
    percent: number;
}) {
    console.log("Branch:", branch);
    console.log("Registered:", reg);
    console.log("Placed:", placed);
    console.log("Average:", avg);
    console.log("Median:", mid);
    console.log("Percent:", percent);

    return (
        <div
            style={{
                backgroundColor: "#131313",
                borderRadius: "10px",
                width: "100%",
                border: "1px solid rgba(161, 161, 161, 0.12)",
            }}
        >
            <div className={styles.headerCard}>
                <p
                    style={{
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        background: "#131313",
                    }}
                >
                    {branch}
                </p>
            </div>
            <div className={styles.contentCard}>
                <div className={styles.regPlaced}>
                    <div className={styles.left}>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>Registered</h4>
                            <p className={styles.nodeData}>{
                            reg ? reg : "NA"}</p>
                        </div>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>Placed</h4>
                            <p className={styles.nodeData}>{
                            placed ? placed : "NA"}
                            </p>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                color: "#ffffff",
                                padding: "5px 10px",
                                borderRadius: "4px",
                            }}
                        >
                            {percent
                                ? `${percent.toString().slice(0, 4)}%`
                                : "NA"}
                        </p>
                    </div>
                </div>
                <div className={styles.packages}>
                    <div className={styles.node}>
                        <h4 className={styles.nodeHead}>Average</h4>
                        <p className={styles.nodeData}>
                            {avg ? `${avg} LPA` : "NA"}
                        </p>
                    </div>
                    <div className={styles.node}>
                        <h4 className={styles.nodeHead}>Median</h4>
                        <p className={styles.nodeData}>
                            {mid ? `${mid} LPA` : "NA"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TabsPlacement({ data }: { data: any }) {
    const [tabs, setTabs] = useState<number>(2);

    const years = ["2022", "2023", "2024"];

    const tabContent = years.map((year: string) => {
        const yearData = Array.isArray(data[year]) ? data[year] : [];

        return {
            label: year,
            content: yearData.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {yearData.map((item: any, index: number) => (
                        <div key={index}>
                            <PlacementCard
                                avg={item.avg}
                                branch={item.branch}
                                mid={item.medium}
                                percent={item.percent_placed}
                                placed={item.placed}
                                reg={item.registered}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: "#aaa", padding: "1rem", textAlign: "center" }}>
                    No placement data available for {year}
                </p>
            ),
        };
    });

    return (
        <Tabs
            tabs={tabContent}
            activeIndex={tabs}
            setActiveIndex={setTabs}
        />
    );
}
