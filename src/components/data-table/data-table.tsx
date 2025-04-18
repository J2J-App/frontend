"use client"
import styles from "./data-table.module.css"
import Combobox from "@/components/combobox/combobox.tsx";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import dtu_icon from "@/public/icons/uni/dtu_icon.png";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";
import iiitd_icon from "@/public/icons/uni/iiitd_icon.jpg";
import igdtuw_icon from "@/public/icons/uni/igdtuw_icon.png";
import RangeSelector from "@/components/rank-selector/rank-selector.tsx";
import Pagination from "@/components/pagination/pagination.tsx";
import Button from "@/components/buttons/button.tsx";
import Dialog from "@/components/dialog-box/dialog-box.tsx";

type UniData = {
    college: string,
    branch: string,
    jee_rank: number,
};

type DataTable = {
    data: UniData[],
    pgup?: boolean,
};

export default function DataTable({ data, pgup = false }: DataTable) {
    const [uniList, setUniList] = useState<string[]>([]);
    const [branchList, setBranchList] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<UniData[]>(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [range, setRange] = useState<{
        max: number | null;
        min: number | null;
    }>({
        max: null,
        min: null
    });

    const icons = [
        { college: "nsut", src: nsut_icon.src },
        { college: "iiitd", src: iiitd_icon.src },
        { college: "igdtuw", src: igdtuw_icon.src },
        { college: "dtu", src: dtu_icon.src },
        { college: "nsut west campus", src: nsut_icon.src },
        { college: "nsut east campus", src: nsut_icon.src },

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

    // Calculate pagination data
    const componentsPerPage = 10 ;
    const totalPages = Math.ceil(filterData.length / componentsPerPage);

    // Get current components
    const indexOfLastComponent = currentPage * componentsPerPage;
    const indexOfFirstComponent = indexOfLastComponent - componentsPerPage;
    const currentComponents = filterData.slice(indexOfFirstComponent, indexOfLastComponent);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log(`Page changed to ${page}`);
    };

    return (
        <>
            <Dialog isOpen={dialogOpen}>
                <h1 style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "24px",
                    fontWeight: "200",
                    margin: "10px 5px",
                    lineHeight: "24px",
                }}>
                    Filter
                </h1>
                <div style={{
                    marginTop: "12px",
                }}>
                    <Combobox onChange={setUniList} options={uniOptions} multiSelect={true}
                              placeholder="University"/>
                </div>
                <div style={{
                    marginTop: "10px",
                }}>
                    <Combobox onChange={setBranchList} options={branchOptions} multiSelect={true}
                              placeholder="Branch"/>
                </div>
                <div style={{
                    marginTop: "10px",
                }}>
                    <RangeSelector onChange={(val) => setRange(val)}/>
                </div>
                <div style={{
                    marginTop: "20px",
                    marginLeft: "auto",
                    width: "fit-content",
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <Button text={"Close"} onClick={() => setDialogOpen(false)} variant={"Danger"} height={42}/>
                </div>
            </Dialog>
            <div className={styles.dataTable}>
                <div className={styles.header}>
                    <div className={styles.hash}>#</div>
                    <div className={styles.controls}>
                        <div style={{
                            marginLeft: "12px",
                        }}>
                            <Combobox onChange={setUniList} options={uniOptions} multiSelect={true}
                                      placeholder="University"/>
                        </div>
                        <div style={{
                            marginLeft: "10px",
                        }}>
                            <Combobox onChange={setBranchList} options={branchOptions} multiSelect={true}
                                      placeholder="Branch"/>
                        </div>
                        <div style={{
                            marginLeft: "10px",
                        }}>
                            <RangeSelector onChange={(val) => setRange(val)}/>
                        </div>
                    </div>
                    <div className={styles.mobileControls}>
                        <Button height={42} text={"Filter"} variant={"Secondary"} onClick={() => setDialogOpen(true)} />
                    </div>
                </div>
                <div className={styles.content}>
                    {currentComponents.map((item, index) => (
                        <div className={styles.dataCard} key={index}>
                            <div className={styles.index}>{index + 1}</div>
                            <div className={styles.clgData}>
                                <div className={styles.iconHolder}>
                                    <div className={styles.icon}>
                                        <Image
                                            style={{objectFit: "contain", objectPosition: "center"}}
                                            quality={100}
                                            src={icons.find(i => i.college === item.college.toLowerCase())?.src || ""}
                                            alt={item.college}
                                            fill={true}
                                        />
                                    </div>
                                    {item.college}
                                </div>
                                <div className={styles.branchHolder}>
                                    {item.branch}
                                </div>
                                <div className={styles.rankHolder}>
                                    {item.jee_rank}
                                </div>
                                <div className={styles.rankHolder + " " + styles.mobile}>
                                    Rank
                                    <span style={{
                                        background: "#0e0e0e",
                                        width: "100%",
                                        height: "100%",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        marginLeft: "5px",
                                        fontWeight: "300",
                                    }}>
                                        {item.jee_rank}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{
                position: "fixed",
                bottom: pgup ? "80px" : "10px",
                width: "100%",
                maxWidth: "368px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "10px",
                backgroundColor: "rgba(3,3,3,0.56)",
                backdropFilter: "blur(10px)",
                zIndex: "120",
                display: "block"
            }}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showEllipsis={true}
                />
            </div>

        </>
    );
}
