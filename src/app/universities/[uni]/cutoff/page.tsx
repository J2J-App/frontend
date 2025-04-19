"use client";

import styles from "./page.module.css";
import React, { useEffect } from "react";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import DataTable from "@/components/data-table/data-table.tsx";
import Loader from "@/components/loader/loader.tsx";
import Tabs from "@/components/tabs/tabs.tsx";
import { SelectOption } from "@/components/select-menus/select-menu.tsx";
import {usePathname} from "next/navigation";

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
        is_bonus?: boolean
    }) => {
        const { year, round, college, branch, jee_rank, is_bonus } = entry;

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
            is_bonus: is_bonus || false,
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


const CutoffPage = () => {
    const uni = usePathname().split("/")[2]
    const [region, setRegion] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [subCategory, setSubCategory] = React.useState("");
    const [result, setResult] = React.useState([]);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchCutoffData = async () => {
        setIsLoading(true);
        setApiError(null);

        const uniMap: any = {
            "nsut": "NSUT",
            "iiitd": "IIITD",
            "dtu": "DTU",
            "nsutw": "NSUT West Campus",
            "nsute": "NSUT East Campus",
            "igdtuw": "IGDTUW",
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(
                "https://api.anmolcreates.tech/api/v1/getBranches",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rank: 1, // Fixed rank value
                        domicile: region,
                        category: `${category} ${subCategory?.trim()}`.trim(),
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data.data.filter((d: any) => { return  d.college === uniMap[uni] }) || []);

        } catch (err: any) {
            setApiError(err.message || "Failed to fetch cutoff data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setRegion("Delhi");
        setCategory("General");
    }, [])

    // Trigger fetch when filters change
    useEffect(() => {
        if (region && category) {
            fetchCutoffData();
        }
    }, [region, category, subCategory]);

    return (
        <div className={styles.mainContainer}>
            <h1 style={{
                color: "white",
                fontWeight: 900
            }}>Cutoff Analyzer</h1>
            <p style={{
                color: "white",
                fontWeight: 300,
                marginBottom: 12,
                textAlign: "center"
            }}>View historical cutoff trends across different categories</p>


            <div style={{
                width: "100%",
                maxWidth: "820px",
                zIndex: "500"
            }}>
                <SelectMenu
                    placeholder="Region"
                    options={[
                        {value: "Delhi", label: "Delhi"},
                        {value: "Outside Delhi", label: "Outside Delhi"},
                    ]}
                    onChange={setRegion}
                    defaultValue={"Delhi"}
                />

                <SelectMenu
                    placeholder="Category"
                    options={[
                        {value: "General", label: "General"},
                        {value: "OBC", label: "OBC"},
                        {value: "SC", label: "SC"},
                        {value: "ST", label: "ST"},
                    ]} // Add your category options
                    onChange={setCategory}
                    defaultValue={"General"}
                />

                <SelectMenu
                    placeholder="Sub-Category"
                    options={[
                        {value: " ", label: "None"},
                        {value: "PWD", label: "PWD"},
                        {value: "Girl Candidate", label: "Single Girl Candidate"},
                        {value: "SGC", label: "Single Girl Child"},
                        {value: "Defence", label: "Defence"}
                    ]} // Add your sub-category options
                    onChange={setSubCategory}
                    defaultValue={" "}
                />
            </div>
            <div style={{
                margin: "35px 0",
                width: "100%",
                height: "1px",
                maxWidth: "820px",
                borderBottom: "1px solid #1c1c1c",
            }} />

            {isLoading && <Loader height={200} />}

            {apiError && (
                <div className="error-message">
                    {apiError}
                </div>
            )}

            {result.length > 0 && !isLoading && (
                <SortedTable data={result}/>
            )}
        </div>
    );
};

// Reuse existing SortedTable component with minor adjustments
const SortedTable = ({data}: { data: any[] }) => {
    const transformed = transformData(data);
    const [selectedYear, setSelectedYear] = React.useState(transformed[0]?.year);
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
                    content: <DataTable pgup={true} data={d.data.map(({ uni, ...rest }: {
                        [x: string]: any;
                        uni: string;
                    }) => ({ college: uni, ...rest }))} />
                }
            }) ?? []} />
        </div>
    </div>
};

export default CutoffPage;
