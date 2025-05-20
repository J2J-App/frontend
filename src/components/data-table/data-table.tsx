"use client"
import styles from "./data-table.module.css"
import Combobox from "@/components/combobox/combobox.tsx";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import RangeSelector from "@/components/rank-selector/rank-selector.tsx";
import Pagination from "@/components/pagination/pagination.tsx";
import Button from "@/components/buttons/button.tsx";
import Dialog from "@/components/dialog-box/dialog-box.tsx";

type UniData = {
    college: string,
    branch: string,
    icon: string,
    rank: number,
    opening: number,
    closing: number,
    is_bonus?: boolean,
};

type DataTable = {
    data: UniData[],
    pgup?: boolean,
};

function normalizeString(str: string) {
    const withSpaces = str.replace(/-/g, " ");

    const words = withSpaces.split(" ");

    if (words.length === 0) {
        return "";
    }

    const firstWord = words[0].toUpperCase();

    const restWords = words.slice(1).map(word => {
        if (word.length === 0) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return [firstWord, ...restWords].join(" ");
}

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
                    return (item.rank || item.closing) >= range.min && (item.rank || item.closing) <= range.max;
                }
                if (range.min !== null && range.max === null) {
                    return (item.rank || item.closing) >= range.min;
                }
                if (range.min === null && range.max !== null) {
                    return (item.rank || item.closing) <= range.max;
                }
                return true;
            });
        }
        setFilterData(filtered);
    }, [uniList, branchList, range, data]);

    function getUniqueUniversities(data: UniData[]) {
        const uniqueUnis = Array.from(new Set(data.map(entry => entry.college)));
        return uniqueUnis.map(uni => ({ value: uni.toLowerCase().replace(/\s+/g, "-"), label: normalizeString(uni) }));
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
    console.log(currentComponents)
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
                                            src={item.icon}
                                            alt={item.college}
                                            fill={true}
                                        />
                                    </div>
                                    {normalizeString(item.college)}
                                </div>
                                <div className={styles.branchHolder}>
                                    {item.branch}
                                </div>
                                <div className={styles.rankHolder}>
                                    {item.rank || item.closing} {item.is_bonus === true ? <span style={{
                                        backgroundImage: "linear-gradient(90deg, rgba(195, 84, 255, 1) -14.93%, rgba(106, 127, 246, 1) 50%, rgba(92, 255, 192, 1) 92.16%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: "600",
                                    fontSize: "11px",
                                   marginLeft: "15px",
                                }}>Bonus</span> : null}
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
                                        {item.rank || item.closing} 
                                    {item.is_bonus ? <span style={{
                                        backgroundImage: "linear-gradient(90deg, rgba(195, 84, 255, 1) -14.93%, rgba(106, 127, 246, 1) 50%, rgba(92, 255, 192, 1) 92.16%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: "600",
                                        fontSize: "11px",
                                        marginLeft: "15px",
                                    }}>Bonus</span> : null}
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
                zIndex: "1200",
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
