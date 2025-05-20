"use client";

import styles from "./page.module.css";
import React, { useEffect } from "react";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import DataTable from "@/components/data-table/data-table.tsx";
import Loader from "@/components/loader/loader.tsx";
import Tabs from "@/components/tabs/tabs.tsx";
import { SelectOption } from "@/components/select-menus/select-menu.tsx";
import { useParams } from "next/navigation";
import { counsellings } from "@/app/predictor/counsellings.ts";
import getCollegeType from "@/lib/get-college-type.ts";

function transformData(input: any[], year: string) {
    const normalizedRounds: any = {
        "U1": "Upgradation 1",
        "U2": "Upgradation 2",
        "S": "Spot Round 1",
        "s2": "Spot Round 2",
        "S-1": "Spot Round 1",
        "S-2": "Spot Round 2",
    };

    const result: any = {};

    if (input[0].rank) {
        input.forEach((entry) => {
            if (!entry) return;
            const { round, college, branch, rank, icon,  is_bonus } = entry;

            // Skip invalid entries
            if (!round || !college || !branch || !rank) return;

            if (!result[year]) result[year] = {};

            const roundLabel =  normalizedRounds[round] || `Round ${round}`;

            if (!result[year][roundLabel]) {
                result[year][roundLabel] = [];
            }

            result[year][roundLabel].push({
                uni: college,
                branch,
                rank,
                icon,
                is_bonus: is_bonus || false,
            });
        });
    } else if(input[0].opening) {
        input.forEach((entry) => {
            if (!entry) return;
            const { round, college, branch, opening, closing, icon } = entry;

            // Skip invalid entries
            if (!round || !college || !branch || opening === undefined || closing === undefined) return;

            if (!result[year]) result[year] = {};

            const roundLabel =  normalizedRounds[round] || `Round ${round}`;

            if (!result[year][roundLabel]) {
                result[year][roundLabel] = [];
            }

            result[year][roundLabel].push({
                uni: college,
                branch,
                opening,
                closing,
                icon,
            });
        });
    }

    return Object.entries(result)
        .map(([yearKey, roundsObj]: any) => ({
            year: parseInt(yearKey),
            ranks: Object.entries(roundsObj).map(([round, data]) => ({
                round,
                data,
            }))
        }))
        .sort((a, b) => b.year - a.year);
}

const CutoffPage = () => {
    const { counselling, uni } = useParams<{
        counselling: string;
        uni: string;
    }>();

    const clgType = getCollegeType(uni)
    const currentCounselling = counsellings.find(c => c.link === counselling);
    const defaultCategory = currentCounselling?.categories?.[0]?.value || "General";
    const defaultSubCategory = currentCounselling?.subCategories?.[0]?.value || " ";
    const defaultYear = "2024";

    const [region, setRegion] = React.useState("false");
    const [category, setCategory] = React.useState(defaultCategory);
    const [subCategory, setSubCategory] = React.useState(defaultSubCategory);
    const [gender, setGender] = React.useState<string | null>("M");
    const [year, setYear] = React.useState(defaultYear);
    const [result, setResult] = React.useState<Record<string, any[]>>({});
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);



    const fetchCutoffData = async (selectedYear: string) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(
                "https://api.anmolcreates.tech/api/v2/cutoff",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        counselling: counselling.toUpperCase(),
                        domicile: region === "true",
                        category: category,
                        subcategory: subCategory.trim(),
                        college_name: uni,
                        gender: gender,
                        college_type: clgType?.toUpperCase(),
                        year: Number(selectedYear)
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(prev => ({
                ...prev,
                [selectedYear]: data.data || []
            }));

        } catch (err: any) {
            setApiError(err.message || "Failed to fetch cutoff data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (region && category) {
            fetchCutoffData(year);
        }
    }, [region, category, subCategory, gender, year]);

    return (
        <div className={styles.mainContainer}>
            <h1 style={{ color: "white", fontWeight: 900 }}>Cutoff Analyzer</h1>
            <p style={{ color: "white", fontWeight: 300, marginBottom: 12, textAlign: "center" }}>
                View historical cutoff trends across different categories
            </p>

            <div style={{ width: "100%", maxWidth: "820px", zIndex: "500" }}>

                <SelectMenu
                    placeholder="Domicile"
                    options={[
                        { value: "true", label: "Home State" },
                        { value: "false", label: "All India" },]}
                    onChange={setRegion}
                    defaultValue={region}
                />

                <SelectMenu
                    placeholder="Category"
                    options={currentCounselling?.categories || []}
                    onChange={setCategory}
                    defaultValue={defaultCategory}
                />

                <SelectMenu
                    placeholder="Sub-Category"
                    options={currentCounselling?.subCategories || []}
                    onChange={setSubCategory}
                    defaultValue={defaultSubCategory}
                />

                {counselling !== "jac" && <SelectMenu
                    placeholder="Gender"
                    options={[
                        {value: "M", label: "Gender Neutral"},
                        {value: "F", label: "Female Only"},
                    ]}
                    onChange={setGender}
                    defaultValue={"M"}
                />}
            </div>

            <div style={{ margin: "35px 0", width: "100%", height: "1px", maxWidth: "820px", borderBottom: "1px solid #1c1c1c" }} />

            {isLoading && <Loader height={200} />}

            {apiError && (
                <div className="error-message">
                    {apiError}
                </div>
            )}

            {result[year]?.length > 0 && !isLoading && (
                <SortedTable
                    data={result}
                    year={year}
                    setYear={setYear}
                    fetchForYear={fetchCutoffData}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

const SortedTable = ({ data, year, setYear, fetchForYear, isLoading }: {
    data: Record<string, any[]>;
    year: string;
    setYear: (year: string) => void;
    fetchForYear: (year: string) => Promise<void>;
    isLoading: boolean;
}) => {
    const [tab, setTab] = React.useState(0);
    console.log("Ingest data:",data)
    const handleYearChange = async (selectedYear: string) => {
        setYear(selectedYear);
        setTab(0);
        if (!data[selectedYear]) {
            await fetchForYear(selectedYear);
        }
    };

    const transformedData = React.useMemo(() => {
        if (!data[year] || !Array.isArray(data[year])) return [];
        return transformData(data[year], year);
    }, [data, year]);
    console.log(transformedData);
    const yearRanks = transformedData.find(r => r.year.toString() === year)?.ranks || [];

    const sortedRanks = yearRanks.sort((a: any, b: any) => {
        const getRoundPriority = (round: string) => {
            if (round.startsWith("Round")) {
                const number = parseInt(round.split(" ")[1], 10);
                return { type: "R", number, priority: number };
            }
            if (round === "Upgradation 1") return { type: "U", number: 1, priority: 6 };
            if (round === "Spot Round 1") return { type: "S", number: 1, priority: 7 };
            if (round === "Upgradation 2") return { type: "U", number: 2, priority: 8 };
            return { type: "", number: 0, priority: 100 };
        };

        const roundA = getRoundPriority(a.round);
        const roundB = getRoundPriority(b.round);
        return roundA.priority - roundB.priority || roundA.number - roundB.number;
    });

    const tabContent = sortedRanks.map((d: any) => ({
        label: d.round,
        content: <DataTable
            pgup={true}
            data={d.data.map(({ uni, ...rest }: any) => ({
                college: uni,
                ...rest
            }))}
        />
    }));

    return (
        <div style={{ width: "100%", maxWidth: "820px" }}>
            <div style={{ zIndex: 20, position: "relative" }}>
                <SelectMenu
                    options={[
                        { value: "2024", label: "2024" },
                        { value: "2023", label: "2023" },
                        { value: "2022", label: "2022" }
                    ]}
                    onChange={handleYearChange}
                    defaultValue={year}
                />
            </div>

            <div style={{ zIndex: -1 }}>
                {isLoading ? (
                    <Loader height={200} />
                ) : (
                    tabContent.length > 0 ? (
                        <Tabs
                            setActiveIndex={setTab}
                            activeIndex={tab}
                            tabs={tabContent}
                        />
                    ) : (
                        <p style={{ color: "white", textAlign: "center" }}>
                            No data available for {year}. Select a different year or check your filters.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default CutoffPage;
