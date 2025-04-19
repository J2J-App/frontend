"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Button from "@/components/buttons/button.tsx";
import Loader from "@/components/loader/loader.tsx";
type DataType = {
    data: {
        year: number;
        data: {
            uni: string;
            branches: string[];
        }[];
    }[]
}

export default function Page() {
    const [data, setData] = useState<DataType | null>(null);
    const [year, setYear] = useState<string>("2024");
    const [firstBranch, setFirstBranch] = useState<string | null>(null);
    const [firstUni, setFirstUni] = useState<string | null>(null);
    const [secondBranch, setSecondBranch] = useState<string | null>(null);
    const [secondUni, setSecondUni] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.anmolcreates.tech/api/v1/getCollegeBranches");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result: DataType = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    function DataCard({ data }: { data: any }) {
        console.log(data)
        return (
            <>
                <div style={{
                    backgroundColor: "#131313",
                    borderRadius: "10px",
                    width: "100%",
                    border: "1px solid rgba(161, 161, 161, 0.12)"

                }}>
                    <div className={styles.headerCard}>
                        <h3>{data.name}</h3>
                        •
                        <p style={{
                            padding: "5px 10px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            background: "#131313",
                        }}>{data.branch}</p>
                    </div>
                    <div className={styles.contentCard}>
                        <div className={styles.regPlaced}>
                            <div className={styles.left}>
                                <div className={styles.node}>
                                    <h4 className={styles.nodeHead}>
                                        Registered
                                    </h4>
                                    <p className={styles.nodeData}>
                                        {data.data[0].reg}
                                    </p>
                                </div>
                                <div className={styles.node}>
                                    <h4 className={styles.nodeHead}>
                                        Placed
                                    </h4>
                                    <p className={styles.nodeData}>
                                        {data.data[0].placed}
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
                                    {data.data[0].percent.toString().slice(0, 4)}%
                                </p>
                            </div>
                        </div>
                        <div className={styles.packages}>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>
                                    Average
                                </h4>
                                <p className={styles.nodeData}>
                                    {data.data[0].avg ? `${data.data[0].avg} LPA` : "NA"}
                                </p>
                            </div>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>
                                    Median
                                </h4>
                                <p className={styles.nodeData}>
                                    {data.data[0].mid ? `${data.data[0].mid} LPA` : "NA"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    function handleYearChange(e: string) {
        setYear(e)
    }


    async function handleClick() {
        // Clear previous errors and results
        setErrors([]);
        setResults(null);

        // Validate inputs
        if (!firstUni || !firstBranch || !secondUni || !secondBranch) {
            setErrors(["Please select all options"]);
            return;
        }

        setIsLoading(true);

        try {
            // First college/branch fetch
            let response1, data1;
            try {
                response1 = await fetch("https://api.anmolcreates.tech/api/v1/getPlacementByBranch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "year": Number(year),
                        "branch": firstBranch,
                        "college": firstUni,
                    }),
                });

                if (!response1.ok) {
                    throw new Error(`Failed to fetch data for ${firstUni}: ${response1.status} ${response1.statusText}`);
                }

                data1 = await response1.json();
                if (!data1.data) {
                    throw new Error(`No data available for ${firstUni} - ${firstBranch}`);
                }
            } catch (error: any) {
                throw new Error(`Error fetching data for ${firstUni}: ${error.message}`);
            }

            // Second college/branch fetch
            let response2, data2;
            try {
                response2 = await fetch("https://api.anmolcreates.tech/api/v1/getPlacementByBranch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "year": Number(year),
                        "branch": secondBranch,
                        "college": secondUni,
                    }),
                });

                if (!response2.ok) {
                    throw new Error(`Failed to fetch data for ${secondUni}: ${response2.status} ${response2.statusText}`);
                }

                data2 = await response2.json();
                if (!data2.data) {
                    throw new Error(`No data available for ${secondUni} - ${secondBranch}`);
                }
            } catch (error: any) {
                throw new Error(`Error fetching data for ${secondUni}: ${error.message}`);
            }

            // Construct result object
            const data = {
                first: {
                    name: firstUni,
                    branch: firstBranch,
                    data: data1.data,
                },
                second: {
                    name: secondUni,
                    branch: secondBranch,
                    data: data2.data,
                }
            };

            setResults(data);
        } catch (error: any) {
            setErrors([error.message || "An unexpected error occurred"]);
            console.error("Compare error:", error);
        } finally {
            setIsLoading(false);
        }
    }
    function compareAgainClick() {
        setFirstBranch(null);
        setFirstUni(null);
        setSecondBranch(null);
        setSecondUni(null);
        setIsLoading(false);
        setResults(null);
        setYear("2024")
    }
    return <div style={{
        marginTop: "100px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <div style={{
            position: "relative",
            width: "100%",
            height: "120px",
        }}>
            <h1 className={styles.header}>
                Compare
            </h1>
            <h1 style={{
                backgroundImage: "linear-gradient(90deg, rgba(195, 84, 255, 1) -14.93%, rgba(106, 127, 246, 1) 50%, rgba(92, 255, 192, 1) 92.16%)",
                filter: "blur(20px)",
                fontSize: "42px",
            }} className={styles.header}>
                Compare
            </h1>
        </div>
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 19px",
        }} >
            <p style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "15px",
                maxWidth: "600px",
                textAlign: "center",
                fontWeight: 200,
                color: "#ffffff"
            }}>
                Compare branches and colleges based on your preferences. This tool will help you make an informed decision about your future.
            </p>
        </div>
        {!isLoading && !results && <div className={styles.compareContainer}>
            <SelectMenu options={[
                {
                    value: "2024",
                    label: "2024",
                },
                {
                    value: "2023",
                    label: "2023",
                },
                {
                    value: "2022",
                    label: "2022",
                },
            ]} defaultValue={"2024"} placeholder={"Year..."} onChange={handleYearChange}/>
            <div className={styles.compareConts}>
                <div className={styles.cont}>
                    <h4 style={{
                        width: "100%",
                        textAlign: "right",
                    }} className={styles.head}>
                        Left
                    </h4>
                    <SelectMenu options={data?.data.find((d) => d.year.toString() === year)?.data.map((d) => ({
                        value: d.uni,
                        label: d.uni,
                    })) ?? []} placeholder={"University..."} onChange={(v) => setFirstUni(v)}/>
                    {firstUni && (
                        <SelectMenu
                            options={data?.data.find((d) => d.year.toString() === year)?.data.find((d) => d.uni === firstUni)?.branches.map((d) => ({
                                value: d,
                                label: d,
                            })) ?? []} placeholder={"Branch..."} onChange={(v) => setFirstBranch(v)}/>
                    )}
                </div>
                <div className={styles.cont}>
                    <h4 style={{
                        width: "100%",
                    }} className={styles.head}>
                        Right
                    </h4>
                    <SelectMenu options={data?.data.find((d) => d.year.toString() === year)?.data.map((d) => ({
                        value: d.uni,
                        label: d.uni,
                    })) ?? []} placeholder={"University..."} onChange={(v) => setSecondUni(v)}/>
                    {secondUni && (
                        <SelectMenu
                            options={data?.data.find((d) => d.year.toString() === year)?.data.find((d) => d.uni === secondUni)?.branches.map((d) => ({
                                value: d,
                                label: d,
                            })) ?? []} placeholder={"Branch..."} onChange={(v) => setSecondBranch(v)}/>
                    )}
                </div>
            </div>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
            }}>
                <Button text={"Compare"} onClick={handleClick} variant={"Outline"}/>
            </div>
        </div>}
        {isLoading && <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Loader height={400}/>
        </div>}
        {!isLoading && results && <>
            <div className={styles.resultsContainer}>
                <div className={styles.resultsContainers}>
                    <div className={styles.result}>
                        <DataCard data={results.first}/>
                    </div>
                    <div className={styles.result}>
                        <DataCard data={results.second}/>
                    </div>
                </div>

                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}>
                    <Button width={150} text={"Compare Again"} onClick={compareAgainClick} variant={"Danger"}/>
                </div>
            </div>

        </>}
    </div>
}