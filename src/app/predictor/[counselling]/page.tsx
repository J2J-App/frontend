"use client";
import React, {useReducer} from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput.tsx";
import Styles from "./styles.module.css";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import Button from "@/components/buttons/button.tsx";
import DataTable from "@/components/data-table/data-table.tsx";
import Image from "next/image";

import headingbg from "@/public/backgrounds/predictor/bgheading.jpg"
import Tabs from "@/components/tabs/tabs.tsx";

import {SelectOption} from "@/components/select-menus/select-menu.tsx";
import Loader from "@/components/loader/loader.tsx";
import {useParams, useRouter} from "next/navigation";
import {counsellings} from "@/app/predictor/counsellings.ts";
import Switch from "@/components/switch/switch.tsx";
import Checkbox from "@/components/check-boxes/check-boxes.tsx";

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

function SortedTable({ data }: { data: any[] }) {
    const res = transformData(data);
    const [tab, setTab] = React.useState<number>(0);
    const [year, setYear] = React.useState<number>(2024);
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
                    const getRoundPriority = (round: any) => {
                        // Handle Round 1-5 with priorities 1-5
                        if (round.startsWith("Round")) {
                            const number = parseInt(round.split(" ")[1], 10);
                            if (number >= 1 && number <= 5) {
                                return { type: "R", number: number, priority: number };
                            }
                        }
                        
                        // Handle specific cases with explicit priorities
                        if (round === "Upgradation 1") return { type: "U", number: 1, priority: 6 };
                        if (round === "Spot Round 1") return { type: "S", number: 1, priority: 7 };
                        if (round === "Upgradation 2") return { type: "U", number: 2, priority: 8 };
                        
                        // Default case for any unknown rounds
                        return { type: "", number: 0, priority: 100 };
                    };
                
                    const roundA = getRoundPriority(a.round);
                    const roundB = getRoundPriority(b.round);
                
                    // Compare by explicit priority first
                    if (roundA.priority !== roundB.priority) {
                        return roundA.priority - roundB.priority;
                    }
                
                    // If same priority, compare by number
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
    const {counselling}: {
        counselling: string
    } = useParams();
    const currentCounselling = counsellings.filter(e => e.link == counselling).pop();
    const ranks: string[] | undefined = currentCounselling?.ranks;
    const [resetKey, setResetKey] = React.useState(0);
    const [mainsCRLRank, setMainsCRLRank] = React.useState<number | string | null>("");
    const [mainsCATRank, setMainsCATRank] = React.useState<number | string | null>("");
    const [advCATRank, setAdvCATRank] = React.useState<number | string | null>("");

    const [advEnabled, setAdvEnabled] = React.useState<boolean>(false);

    const [region, setRegion] = React.useState<string | null>(null);
    const [category, setCategory] = React.useState<string | null>(null);
    const [subCategory, setSubCategory] = React.useState<string | null>(null);
    const [sepCategory, setSepCategory] = React.useState<boolean>(false);

    const [gender, setGender] = React.useState<string | null>(null);

    const [result, setResult] = React.useState<any[]>([]);

    const [errors, setErrors] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [apiError, setApiError] = React.useState<string | null>(null);



    // Only run this on the client
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const savedMARank = localStorage.getItem("mains_crl_rank");
            const savedMCRank = localStorage.getItem("mains_cat_rank");
            const savedACRank = localStorage.getItem("adv_cat_rank");
            const enabledAdv = localStorage.getItem("adv_enabled");

            const savedRegion = localStorage.getItem("region");
            const savedCategory = localStorage.getItem("category");
            const savedSubCategory = localStorage.getItem("subCategory");
            const savedResult = localStorage.getItem("result");

            const savedGender = localStorage.getItem("gender");

            const savedSepCategory = localStorage.getItem(counselling+"_sepcat");

            if (savedMARank) setMainsCRLRank(savedMARank);
            if (savedMCRank) setMainsCATRank(savedMCRank);
            if (savedACRank) setAdvCATRank(savedACRank);
            if (enabledAdv) setAdvEnabled(enabledAdv === "true");
            if (savedRegion) setRegion(savedRegion);
            if (savedCategory) setCategory(savedCategory == "OBC-NCL" && counselling=="jac" ? "OBC" : savedCategory);
            if (savedSubCategory) setSubCategory(savedSubCategory);
            if (savedResult) setResult(JSON.parse(savedResult));
            if (savedGender) setGender(savedGender);
            if (savedSepCategory) setSepCategory(savedSepCategory == "true");

            if (savedSepCategory=="true") {
                const currentCategory = localStorage.getItem(counselling+"_category");
                const currentSubCategory = localStorage.getItem(counselling+"_subCategory");
                if (currentCategory) setCategory(currentCategory == "OBC-NCL" && counselling=="jac" ? "OBC" : currentCategory);
                if (currentSubCategory) setSubCategory(currentSubCategory);
            }
        }
    }, []);

    const handleMAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setErrors([]);
        setApiError(null);

        if (!isNaN(Number(value)) && !value.includes(" ")) {
            setMainsCRLRank(value ? parseInt(value) : "");
            localStorage.setItem("mains_crl_rank", value);
        }
        setResult([]);
    };
    const handleMCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setErrors([]);
        setApiError(null);

        if (!isNaN(Number(value)) && !value.includes(" ")) {
            setMainsCATRank(value ? parseInt(value) : "");
            localStorage.setItem("mains_cat_rank", value);
        }
        setResult([]);
    };
    const handleACChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setErrors([]);
        setApiError(null);

        if (!isNaN(Number(value)) && !value.includes(" ")) {
            setAdvCATRank(value ? parseInt(value) : "");
            localStorage.setItem("adv_cat_rank", value);
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
        if (sepCategory) {
            setCategory(value);
            localStorage.setItem(counselling+"_category", value);
        } else {
            localStorage.setItem("category", value);
        }
        setResult([]);
        setErrors([]);
        setApiError(null);
    };

    function handleChangeSubCategory(value: string) {
        if (sepCategory) {
            setSubCategory(value);
            localStorage.setItem(counselling+"_subCategory", value);
        } else {
            localStorage.setItem("subCategory", value);
        }
        setResult([]);
        setErrors([]);
        setApiError(null);
    }

    function handleGenderChange(value: string) {
        setSubCategory(value);
        localStorage.setItem("gender", value);
        setResult([]);
        setErrors([]);
        setApiError(null);
    }

    function handleClear() {
        setResult([]);
        setAdvCATRank("");
        setMainsCATRank("");
        setMainsCRLRank("");
        setAdvEnabled(false);
        setRegion(null);
        setSepCategory(false);
        setCategory(null);
        setSubCategory(null);
        setGender(null);
        setErrors([]);
        setApiError(null);
        setResetKey(prev => prev + 1);

        localStorage.removeItem("mains_crl_rank");
        localStorage.removeItem("mains_cat_rank");
        localStorage.removeItem("adv_cat_rank");
        localStorage.removeItem("adv_enabled");
        localStorage.removeItem("region");
        localStorage.removeItem("category");
        localStorage.removeItem("subCategory");
        localStorage.removeItem("result");
        localStorage.removeItem("gender");
        localStorage.removeItem(counselling+"_sepcat");
        localStorage.removeItem(counselling+"_category");
        localStorage.removeItem(counselling+"_subCategory");
    }

    // Validate form before submission
    const validateForm = (rankVal: string): boolean => {
        const newErrors: string[] = [];

        // Validate rank
        if (rankVal === "" || rankVal === null) {
            newErrors.push("Please enter a valid rank");
        } else if (Number(rankVal) <= 0) {
            newErrors.push("Rank must be greater than 0");
        } else if (Number(rankVal) > 3000000) { // Assuming a reasonable max rank
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
                    "https://api.anmolcreates.tech/api/v1/getBranches",
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
                    "https://api.anmolcreates.tech/api/v1/postRank",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            rank: mainsCRLRank,
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
                        throw new Error("Fill all the fields correctly");
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

    const rankInputsMap: {
        [key: string]: {
            value: number | string | null;
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
            placeholder: string;
        };
    } = {
        "MA": {
            value: mainsCRLRank,
            onChange: handleMAChange,
            placeholder: "Mains CRL Rank",
        },
        "MC": {
            value: mainsCATRank,
            onChange: handleMCChange,
            placeholder: "Mains Category Rank",
        },
        "AC": {
            value: advCATRank,
            onChange: handleACChange,
            placeholder: "Advanced Category Rank",
        }
    }
    return (
    <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            padding: "0 20px",
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
                        <p className={Styles.headers}>
                            Ranks
                        </p>
                        <div className={Styles.rankInputs}>
                            {
                            ranks && ranks.map((rank, index) => {
                                    const r = rankInputsMap[rank];
                                    if (rank == "AC"){
                                        return (<div key={index} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}>
                                            {<SingleInput
                                                enabled={advEnabled}
                                                holder={r.placeholder}
                                                value={r.value || ""}
                                                onChange={r.onChange}
                                                type={"number"}
                                            />}
                                            <Checkbox  checked={advEnabled} onChange={(c) => {
                                                setAdvEnabled(c)
                                                localStorage.setItem("adv_enabled", c.toString());
                                            }} />

                                        </div>)
                                    } else {
                                        return (
                                            <SingleInput
                                                key={index}
                                                holder={r.placeholder}
                                                value={r.value || ""}
                                                onChange={r.onChange}
                                                type={"number"}
                                            />
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className={Styles.inputContainer}>
                            <p className={Styles.headers}>
                                Domicile
                            </p>
                            <SelectMenu
                                key={`region-${resetKey}`}
                                options={currentCounselling?.regions || []}
                                defaultValue={(currentCounselling?.regions.some(e => e.value == region) || region == null) ? region : "ox"}
                                onChange={handleOnChangeOfRegion}
                                placeholder="Domicile"
                            />
                            <p className={Styles.headers}>
                                Categories
                            </p>
                            <SelectMenu
                                key={`category-${resetKey}`}
                                options={currentCounselling?.categories || []}
                                onChange={handleOnChangeOfCategory}
                                defaultValue={category}
                                placeholder="Category"
                            />

                            <SelectMenu
                                key={`subcat-${resetKey}`}

                                options={currentCounselling?.subCategories || []}
                                onChange={handleChangeSubCategory}
                                defaultValue={currentCounselling?.subCategories.some(e => e.value == subCategory) ? subCategory : " "}
                                placeholder="Sub Category"
                            />

                            <Checkbox label={"Use unique categories for this counselling "} checked={sepCategory} onChange={(c) => {
                                if (c) {
                                    const currentCategory = localStorage.getItem(counselling+"_category");
                                    const currentSubCategory = localStorage.getItem(counselling+"_subCategory");
                                    if (currentCategory) setCategory(currentCategory == "OBC-NCL" && counselling=="jac" ? "OBC" : currentCategory);
                                    if (currentSubCategory) setSubCategory(currentSubCategory);
                                } else {
                                    const savedCategory = localStorage.getItem("category");
                                    const savedSubCategory = localStorage.getItem("subCategory");

                                    if (savedCategory) setCategory(savedCategory == "OBC-NCL" && counselling=="jac" ? "OBC" : savedCategory);
                                    if (savedSubCategory) setSubCategory(savedSubCategory);
                                }

                                setSepCategory(c)
                                localStorage.setItem(counselling+"_sepcat", c.toString());
                            }} />
                            <div style={{
                                marginTop: 5
                            }}></div>
                            <p className={Styles.headers}>
                                Gender
                            </p>
                            <SelectMenu
                                key={`gender-${resetKey}`}

                                options={[
                                    {
                                        value: "M",
                                        label: "Male"
                                    },
                                    {
                                        value: "F",
                                        label: "Female"
                                    }
                                ]}
                                onChange={handleGenderChange}
                                defaultValue={gender}
                                placeholder="Gender"
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
