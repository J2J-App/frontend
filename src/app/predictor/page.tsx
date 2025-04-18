"use client";
import React from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput";
import Styles from "./styles.module.css";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import Button from "@/components/buttons/button.tsx";
import DataTable from "@/components/data-table/data-table.tsx";
import Image from "next/image";

import headingbg from "@/public/backgrounds/predictor/bgheading.jpg"
import Tabs from "@/components/tabs/tabs.tsx";

import {SelectOption} from "@/components/select-menus/select-menu.tsx";
import Loader from "@/components/loader/loader.tsx";

function transformData(input: any[]) {
    const normalizedRounds: any = {
        "U1": "Upgradation 1",
        "U2": "Upgradation 2",
        "S": "Spot Round 1",
        "s2": "Spot Round 2",
    };

    const result: any = {};

    input.forEach((entry: {
        year: number;
        round: string;
        college: string;
        branch: string;
        jee_rank: number;
    }) => {
        const { year, round, college, branch, jee_rank } = entry;

        // Skip invalid entries
        if (!year || !round || !college || !branch || !jee_rank) return;

        if (!result[year]) result[year] = {};

        const roundLabel = normalizedRounds[round] || `Round ${round}`;

        if (!result[year][roundLabel]) {
            result[year][roundLabel] = [];
        }

        result[year][roundLabel].push({
            uni: college,
            branch,
            jee_rank,
        });
    });

    // Format final structure
    return Object.entries(result)
        .map(([year, roundsObj]) => {
            // @ts-ignore
            const ranks = Object.entries(roundsObj).map(([round, data]) => ({
                round,
                data,
            }));

            return {
                year: parseInt(year),
                ranks,
            };
        })
        .sort((a, b) => b.year - a.year); // Descending by year
}

function SortedTable({ data }: { data: any[] }) {
    const res = transformData(data);
    const [tab, setTab] = React.useState<number>(0);
    const [year, setYear] = React.useState<number>(2024);
    console.log(res)
    const handleYearChange = (year: string) => {
        const selectedYear = res.find((item) => item.year.toString() === year);
        if (selectedYear) {
            setYear(selectedYear.year);
            setTab(0)
        }
    }

    return <div style={{
        width: "100%",
        maxWidth: "820px",
    }}>
        <div style={{
            zIndex: 20,
            position: "relative",
        }}>
            <SelectMenu options={res.map((r):SelectOption => {
                return {
                    value: r.year.toString().toLowerCase(),
                    label: r.year.toString()
                }
            })} onChange={handleYearChange} defaultValue={"2024"} />
        </div>
        <div style={{
            zIndex: -1
        }}>
            <Tabs setActiveIndex={setTab} activeIndex={tab} tabs={res.filter(r => r.year === year).pop()?.ranks.sort((a, b) => {
                // Extract the prefix and number from the round name
                const getRoundPriority = (round: string) => {
                    if (round.startsWith("Round")) return { type: "R", number: parseInt(round.split(" ")[1], 10) };
                    if (round.startsWith("Upgradation")) return { type: "U", number: parseInt(round.split(" ")[1], 10) };
                    if (round.startsWith("Spot Round")) return { type: "S", number: parseInt(round.split(" ")[2], 10) };
                    return { type: "", number: 0 }; // Default case for unknown rounds
                };

                const priorityMap: {
                    [key: string]: number;
                } = { R: 1, U: 2, S: 3 }; // Define the priority order

                const roundA = getRoundPriority(a.round);
                const roundB = getRoundPriority(b.round);

                // Compare by type priority first
                if (priorityMap[roundA.type] !== priorityMap[roundB.type]) {
                    return priorityMap[roundA.type] - priorityMap[roundB.type];
                }

                return roundA.number - roundB.number;
            }).map((d: any) => {
                return {
                    label: d.round,
                    content: <DataTable data={d.data.map(({ uni, ...rest }: {
                        [x: string]: any;
                        uni: string;
                    }) => ({ college: uni, ...rest }))} />
                }
            }) ?? []} />
        </div>
    </div>
}

export default function Page() {
    const [rank, setRank] = React.useState<number | string | null>("");
    const [region, setRegion] = React.useState<string | null>(localStorage.getItem("region"));
    const [category, setCategory] = React.useState<string | null>(localStorage.getItem("category"));
    const [subCategory, setSubCategory] = React.useState<string | null>(localStorage.getItem("subCategory"));
    const [result, setResult] = React.useState<any[]>([]);

    const [errors, setErrors] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    // Only run this on the client
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const savedRank = localStorage.getItem("rank");
            const savedRegion = localStorage.getItem("region");
            const savedCategory = localStorage.getItem("category");
            const savedSubCategory = localStorage.getItem("subCategory");
            const savedResult = localStorage.getItem("result");

            if (savedRank) setRank(savedRank);
            if (savedRegion) setRegion(savedRegion);
            if (savedCategory) setCategory(savedCategory);
            if (savedSubCategory) setSubCategory(savedSubCategory);
            if (savedResult) setResult(JSON.parse(savedResult));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setErrors([]);
        setApiError(null);

        if (!isNaN(Number(value)) && !value.includes(" ")) {
            setRank(value ? parseInt(value) : "");
            localStorage.setItem("rank", value);
        }
        setResult([]);
    };

    const handleOnChangeOfRegion = (value: string) => {
        setRegion(value);
        localStorage.setItem("region", value);
        setResult([]);
        setErrors([]);
        setApiError(null);
    };

    const handleOnChangeOfCategory = (value: string) => {
        setCategory(value);
        localStorage.setItem("category", value);
        setResult([]);
        setErrors([]);
        setApiError(null);
    };

    function handleChangeSubCategory(value: string) {
        setSubCategory(value);
        localStorage.setItem("subCategory", value);
        setResult([]);
        setErrors([]);
        setApiError(null);
    }

    function handleClear() {
        setResult([]);
        setRank("");
        localStorage.removeItem("rank");
        localStorage.removeItem("region");
        localStorage.removeItem("category");
        localStorage.removeItem("subCategory");
        localStorage.removeItem("result");
        setErrors([]);
        setApiError(null);
    }

    // Validate form before submission
    const validateForm = (): boolean => {
        const newErrors: string[] = [];

        // Validate rank
        if (rank === "" || rank === null) {
            newErrors.push("Please enter a valid rank");
        } else if (Number(rank) <= 0) {
            newErrors.push("Rank must be greater than 0");
        } else if (Number(rank) > 3000000) { // Assuming a reasonable max rank
            newErrors.push("Rank seems too high. Please verify your input");
        }

        // Add any other field validations if needed in the future

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async () => {
        // Reset previous results and errors
        setResult([]);
        setApiError(null);

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if(rank && region && category) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                const response = await fetch(
                    "https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getBranches",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            rank: rank,
                            domicile: region,
                            category: `${category} ${subCategory?.trim()}`.trim(),
                        }),
                        signal: controller.signal
                    }
                );

                await fetch(
                    "https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/postRank",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            rank: rank,
                        }),
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    // Handle different HTTP error codes
                    if (response.status === 404) {
                        throw new Error("Resource not found. The API endpoint may have changed.");
                    } else if (response.status === 400) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Invalid request data");
                    } else if (response.status === 429) {
                        throw new Error("Too many requests. Please try again later.");
                    } else if (response.status >= 500) {
                        throw new Error("Server error. Please try again later.");
                    } else {
                        throw new Error(`Server responded with status ${response.status}`);
                    }
                }

                const dataObtained = await response.json();

                // Handle empty results
                if (dataObtained.data && dataObtained.data.length === 0) {
                    setApiError("No branches found matching your criteria");
                } else if (!dataObtained.data) {
                    setApiError("Unexpected data format received from server");
                } else {
                    setResult(dataObtained.data);
                    localStorage.setItem("result", JSON.stringify(dataObtained.data));
                }
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);

            // Handle specific error types
            if (err.name === 'AbortError') {
                setApiError("Request timed out. Please check your internet connection and try again.");
            } else if (err.message === 'Failed to fetch') {
                setApiError("Network error. Please check your internet connection.");
            } else {
                setApiError(err.message || "An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Error message display component
    const ErrorMessages = () => {
        if (errors.length === 0 && !apiError) return null;

        return (
            <div style={{
                backgroundColor: "#382e2e",
                border: "1px solid #FFCCC7",
                borderRadius: "4px",
                padding: "12px 16px",
                marginTop: "16px",
                width: "100%",
                maxWidth: "820px"
            }}>
                {errors.map((error, index) => (
                    <p key={index} style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}>
                        • {error}
                    </p>
                ))}
                {apiError && (
                    <p style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}>
                        • {apiError}
                    </p>
                )}
            </div>
        );
    };

    return (
    <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            padding: "0 20px",
            marginTop:"80px",
            gap: "18px",
            minHeight: "calc(100vh - 80px)",
            overflow: "visible"
        }}>
            <div className={Styles.headContainer}>
                <div className={Styles.heading}>
                    <Image style={{
                        objectFit: "cover",
                        objectPosition: "center",
                    }} fill src={headingbg} alt={"Heading Background"}/>
                    <div className={Styles.textContainer}>
                        <span style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "28px",
                        }}>
                            Predictor
                        </span>
                        <br />
                        <span style={{
                            color: "white",
                            fontWeight: "200",
                            fontSize: "16px",
                        }}>
                            Enter your rank and category to predict what branch you might get based on last year's data.
                        </span>
                    </div>

                </div>
                <div className={Styles.container}>
                    <div style={{
                        width: "100%",
                    }}>
                        <SingleInput
                            value={`${rank}`}
                            holder="Rank"
                            type="number"
                            onChange={handleChange}
                        />
                        <div className={Styles.inputContainer}>
                            <SelectMenu
                                options={[
                                    {value: "Delhi", label: "Delhi"},
                                    {value: "Outside Delhi", label: "Outside Delhi"},
                                ]}
                                defaultValue={region}
                                onChange={handleOnChangeOfRegion}
                                placeholder="Region"
                            />
                            <SelectMenu
                                options={[
                                    {value: "General", label: "General"},
                                    {value: "OBC", label: "OBC"},
                                    {value: "SC", label: "SC"},
                                    {value: "ST", label: "ST"},
                                ]}
                                onChange={handleOnChangeOfCategory}
                                defaultValue={category}
                                placeholder="Category"
                            />

                            <SelectMenu
                                options={[
                                    {value: " ", label: "None"},
                                    {value: "PWD", label: "PWD"},
                                    {value: "Girl Candidate", label: "Single Girl Candidate"},
                                    {value: "Defence", label: "Defence"}
                                ]}
                                onChange={handleChangeSubCategory}
                                defaultValue={subCategory}
                                placeholder="Sub Category"
                            />
                        </div>


                        <div style={{
                            zIndex: 2,
                            position: "relative",
                            marginTop: "10px",
                            display: "flex",
                            gap: "15px",
                        }}>
                            <Button
                                text={"Submit"}
                                onClick={handleSubmit}
                                variant="Primary"
                                height={38}
                                disabled={isLoading}
                            />
                            <Button
                                text={"Clear"}
                                onClick={handleClear}
                                variant="Outline"
                                height={38}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ErrorMessages />

            {isLoading && <Loader/>}
            {result.length > 0 && <SortedTable data={result} />}
        </div>
    );
}