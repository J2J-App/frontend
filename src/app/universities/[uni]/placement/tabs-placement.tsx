"use client";

import {useState} from "react";
import Tabs from "@/components/tabs/tabs.tsx";
import styles from "@/app/universities/[uni]/placement/page.module.css";

function PlacementCard({branch, reg, placed,avg,mid,percent}:{
    branch: string,
    reg: string,
    placed: number,
    avg: number | undefined,
    mid: number | undefined,
    percent: number,
}) {
    return (
        <>
            <div style={{
                backgroundColor: "#131313",
                borderRadius: "10px",
                width: "100%",
                border: "1px solid rgba(161, 161, 161, 0.12)"

            }}>
                <div className={styles.headerCard}>
                    <p style={{
                        padding: "5px 10px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        background: "#131313",
                    }}>{branch}</p>
                </div>
                <div className={styles.contentCard}>
                    <div className={styles.regPlaced}>
                        <div className={styles.left}>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>
                                    Registered
                                </h4>
                                <p className={styles.nodeData}>
                                    {reg}
                                </p>
                            </div>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>
                                    Placed
                                </h4>
                                <p className={styles.nodeData}>
                                    {placed}
                                </p>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <p style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                color: "#ffffff",
                                padding: "5px 10px",
                                borderRadius: "4px",
                            }}>
                                {percent.toString().slice(0, 4)}%
                            </p>
                        </div>
                    </div>
                    <div className={styles.packages}>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>
                                Average
                            </h4>
                            <p className={styles.nodeData}>
                                {avg ? `${avg} LPA` : "NA"}
                            </p>
                        </div>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>
                                Median
                            </h4>
                            <p className={styles.nodeData}>
                                {mid ? `${mid} LPA` : "NA"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function TabsPlacement({data}: {data: any}) {
    const [tabs, setTabs] = useState<number>(2);
    console.log(data)
    return <Tabs tabs={["2022","2023","2024"].map((l: string) => {
        return {
            label: l,
            content: <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
            }}>{
                data[l].map((item: any) => (
                    <div key={item.id}>
                        <PlacementCard
                            avg={item.avg}
                            branch={item.branch}
                            mid={item.mid}
                            percent={item.percent}
                            placed={item.placed}
                            reg={item.reg}
                        />
                    </div>
                ))
            }
            </div>
        }
    })} activeIndex={tabs} setActiveIndex={setTabs} />
}