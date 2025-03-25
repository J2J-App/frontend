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
    uni: string,
    course: string,
    rank: number,
    round: string
};

type DataTable = {
    data: UniData[]
};

export default function DataTable({ data }: DataTable) {
    const [uniList, setUniList] = useState<string[]>([]);
    const [courseList, setCourseList] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<UniData[]>(data);
    const [range, setRange] = useState<{
        max: number | null;
        min: number | null;
    }>({
        max: null,
        min: null
    });

    const icons = [
        { uni: "nsut", src: nsut_icon.src },
        { uni: "iiit-d", src: iiitd_icon.src },
        { uni: "igdtuw", src: igdtuw_icon.src },
        { uni: "dtu", src: dtu_icon.src }
    ];

    useEffect(() => {
        let filtered = data;

        if (uniList.length > 0) {
            filtered = filtered.filter(item => uniList.includes(item.uni.toLowerCase().replace(/\s+/g, "-")));
        }

        if (courseList.length > 0) {
            filtered = filtered.filter(item => courseList.includes(item.course.toLowerCase().replace(/\s+/g, "-")));
        }

        if (range.min !== null || range.max !== null) {
            filtered = filtered.filter(item => {
                if (range.min !== null && range.max !== null) {
                    return item.rank >= range.min && item.rank <= range.max;
                }
                if (range.min !== null && range.max === null) {
                    return item.rank >= range.min;
                }
                if (range.min === null && range.max !== null) {
                    return item.rank <= range.max;
                }
                return true;
            });
        }

        setFilterData(filtered);
    }, [uniList, courseList, range, data]);

    function getUniqueUniversities(data: UniData[]) {
        const uniqueUnis = Array.from(new Set(data.map(entry => entry.uni)));
        return uniqueUnis.map(uni => ({ value: uni.toLowerCase().replace(/\s+/g, "-"), label: uni }));
    }

    function getUniqueCourses(data: UniData[]) {
        const uniqueCourses = Array.from(new Set(data.map(entry => entry.course)));
        return uniqueCourses.map(course => ({ value: course.toLowerCase().replace(/\s+/g, "-"), label: course }));
    }

    const uniOptions = getUniqueUniversities(data);
    const courseOptions = getUniqueCourses(data);


    console.log(range)

    return (
        <div className={styles.dataTable}>
            <div className={styles.header}>
                <div className={styles.hash}>#</div>
                <div>
                    <Combobox onChange={setUniList} options={uniOptions} multiSelect={true} placeholder="University" />
                </div>
                <div>
                    <Combobox onChange={setCourseList} options={courseOptions} multiSelect={true} placeholder="Course" />
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
                                        src={icons.find(i => i.uni === item.uni.toLowerCase())?.src || ""}
                                        alt={item.uni}
                                        fill={true}
                                    />
                                </div>
                                {item.uni}
                            </div>
                            <div className={styles.courseHolder}>{item.course}</div>
                            <div className={styles.rankHolder}>{item.rank}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
