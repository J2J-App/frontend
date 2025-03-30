"use client"
import styles from "./data-table.module.css"
import Combobox from "@/components/combobox/combobox.tsx";
import { useEffect, useState } from "react";
import Image from "next/image";

import dtu_icon from "@/public/icons/uni/dtu_icon.png";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";
import iiitd_icon from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw_icon from "@/public/icons/uni/igdtuw_icon.png";
import RangeSelector from "@/components/rank-selector/rank-selector.tsx";

type UniData = {
    college: string,
    branch: string,
    jee_rank: number,
    round: string
};

type DataTable = {
    data: UniData[]
};

export default function DataTable({ data }: DataTable) {
    const [uniList, setUniList] = useState<string[]>([]);
    const [branchList, setBranchList] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<UniData[]>(data);
    const [range, setRange] = useState<{
        max: number | null;
        min: number | null;
    }>({
        max: null,
        min: null
    });

    const icons = [
        { college: "nsut", src: nsut_icon.src },
        { college: "iiit-d", src: iiitd_icon.src },
        { college: "igdtuw", src: igdtuw_icon.src },
        { college: "dtu", src: dtu_icon.src }
    ];

    useEffect(() => {
        let filtered = data;

        if (uniList.length > 0) {
            filtered = filtered.filter(item => uniList.includes(item.college.toLowerCase().replace(/\s+/g, "-")));
        }

        if (branchList.length > 0) {
            filtered = filtered.filter(item => branchList.includes(item.branch.toLowerCase().replace(/\s+/g, "-")));
        }

        if (range.min !== null || range.max !== null) {
            filtered = filtered.filter(item => {
                if (range.min !== null && range.max !== null) {
                    return item.jee_rank >= range.min && item.jee_rank <= range.max;
                }
                if (range.min !== null && range.max === null) {
                    return item.jee_rank >= range.min;
                }
                if (range.min === null && range.max !== null) {
                    return item.jee_rank <= range.max;
                }
                return true;
            });
        }

        setFilterData(filtered);
    }, [uniList, branchList, range, data]);

    function getUniqueUniversities(data: UniData[]) {
        const uniqueUnis = Array.from(new Set(data.map(entry => entry.college)));
        return uniqueUnis.map(uni => ({ value: uni.toLowerCase().replace(/\s+/g, "-"), label: uni }));
    }

    function getUniqueBranches(data: UniData[]) {
        const uniqueBranches = Array.from(new Set(data.map(entry => entry.branch)));
        return uniqueBranches.map(branch => ({ value: branch.toLowerCase().replace(/\s+/g, "-"), label: branch }));
    }

    const uniOptions = getUniqueUniversities(data);
    const branchOptions = getUniqueBranches(data);


    console.log(range)

    return (
        <div className={styles.dataTable}>
            <div className={styles.header}>
                <div className={styles.hash}>#</div>
                <div>
                    <Combobox onChange={setUniList} options={uniOptions} multiSelect={true} placeholder="University" />
                </div>
                <div>
                    <Combobox onChange={setBranchList} options={branchOptions} multiSelect={true} placeholder="Branch" />
                </div>
                <div>
                    <RangeSelector onChange={(val) => setRange(val)} />
                </div>
            </div>
            <div className={styles.content}>
                {filterData.map((item, index) => (
                    <div className={styles.dataCard} key={index}>
                        <div className={styles.index}>{index + 1}</div>
                        <div className={styles.clgData}>
                            <div className={styles.iconHolder}>
                                <div className={styles.icon}>
                                    <Image
                                        style={{ objectFit: "contain", objectPosition: "center" }}
                                        quality={100}
                                        src={icons.find(i => i.college === item.college.toLowerCase())?.src || ""}
                                        alt={item.college}
                                        fill={true}
                                    />
                                </div>
                                {item.college}
                            </div>
                            <div className={styles.branchHolder}>{item.branch}</div>
                            <div className={styles.rankHolder}>{item.jee_rank}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
