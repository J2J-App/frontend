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
        "S-1" : "Special Round 1",
        "S-2" : "Special Round 2",
    };

    const result: any = {};

    input.forEach((entry: {
        year: number;
        round: string;
        college: string;
        branch: string;
        rank: number;
        is_bonus?: boolean
    }) => {
        const { year, round, college, branch, rank, is_bonus } = entry;

        // Skip invalid entries
        if (!year || !round || !college || !branch || !rank) return;

        if (!result[year]) result[year] = {};

        const roundLabel = normalizedRounds[round] || `Round ${round}`;

        if (!result[year][roundLabel]) {
            result[year][roundLabel] = [];
        }

        result[year][roundLabel].push({
            uni: college,
            branch,
            rank,
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
    const [counseling, setCounseling] = React.useState("");
    const [collegeType, setCollegeType] = React.useState("");
    const [region, setRegion] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [subCategory, setSubCategory] = React.useState("");
    const [gender, setGender] = React.useState("M");
    const [result, setResult] = React.useState([]);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchCutoffData = async () => {
        setIsLoading(true);
        setApiError(null);

    const map: { [key: string]: string } = {
        "nit-jalandhar": "NIT Jalandhar",
        "nit-jaipur": "MNIT Jaipur",
        "nit-bhopal": "MANIT Bhopal",
        "nit-allahabad": "MNNIT Allahabad",
        "nit-agartala": "NIT Agartala",
        "nit-calicut": "NIT Calicut",
        "nit-delhi": "NIT Delhi",
        "nit-durgapur": "NIT Durgapur",
        "nit-goa": "NIT Goa",
        "nit-hamirpur": "NIT Hamirpur",
        "nit-surathkal": "NIT Surathkal",
        "nit-meghalaya": "NIT Meghalaya",
        "nit-patna": "NIT Patna",
        "nit-puducherry": "NIT Puducherry",
        "nit-raipur": "NIT Raipur",
        "nit-sikkim": "NIT Sikkim",
        "nit-arunachal-pradesh": "NIT Arunachal Pradesh",
        "nit-jamshedpur": "NIT Jamshedpur",
        "nit-kurukshetra": "NIT Kurukshetra",
        "nit-mizoram": "NIT Mizoram",
        "nit-rourkela": "NIT Rourkela",
        "nit-silchar": "NIT Silchar",
        "nit-srinagar": "NIT Srinagar",
        "nit-trichy": "NIT Trichy",
        "nit-uttarakhand": "NIT Uttarakhand",
        "nit-warangal": "NIT Warangal",
        "nit-surat": "SVNIT Surat",
        "nit-nagpur": "VNIT Nagpur",
        "nit-nagaland": "NIT Nagaland",
        "nit-manipur": "NIT Manipur",

        "iit-bhubaneswar": "IIT Bhubaneswar",
        "iit-bombay": "IIT Bombay",
        "iit-mandi": "IIT Mandi",
        "iit-delhi": "IIT Delhi",
        "iit-indore": "IIT Indore",
        "iit-kharagpur": "IIT Kharagpur",
        "iit-hyderabad": "IIT Hyderabad",
        "iit-jodhpur": "IIT Jodhpur",
        "iit-kanpur": "IIT Kanpur",
        "iit-madras": "IIT Madras",
        "iit-gandhinagar": "IIT Gandhinagar",
        "iit-patna": "IIT Patna",
        "iit-roorkee": "IIT Roorkee",
        "iit-ism-dhanbad": "IIT (ISM) Dhanbad",
        "iit-ropar": "IIT Ropar",
        "iit-bhu-varanasi": "IIT BHU Varanasi",
        "iit-guwahati": "IIT Guwahati",
        "iit-bhilai": "IIT Bhilai",
        "iit-goa": "IIT Goa",
        "iit-palakkad": "IIT Palakkad",
        "iit-tirupati": "IIT Tirupati",
        "iit-jammu": "IIT Jammu",
        "iit-dharwad": "IIT Dharwad",

        "iiit-guwahati": "IIIT Guwahati",
        "iiitm-gwalior": "IIITM Gwalior",
        "iiit-kota": "IIIT Kota",
        "iiit-surat": "IIIT Surat",
        "iiit-sonepat": "IIIT Sonepat",
        "iiit-una": "IIIT Una",
        "iiit-sri-city": "IIIT Sri City",
        "iiit-vadodara": "IIIT Vadodara",
        "iiit-allahabad": "IIIT Allahabad",
        "iiitdm-kancheepuram": "IIITDM Kancheepuram",
        "iiitdm-jabalpur": "IIITDM Jabalpur",
        "iiit-manipur": "IIIT Manipur",
        "iiit-trichy": "IIIT Trichy",
        "iiit-dharwad": "IIIT Dharwad",
        "iiitdm-kurnool": "IIITDM Kurnool",
        "iiit-ranchi": "IIIT Ranchi",
        "iiit-nagpur": "IIIT Nagpur",
        "iiit-pune": "IIIT Pune",
        "iiit-kalyani": "IIIT Kalyani",
        "iiit-lucknow": "IIIT Lucknow",
        "iiit-kottayam": "IIIT Kottayam",

        "bit-mesra": "BIT Mesra",
        "bit-patna": "BIT Patna",
        "pec-chandigarh": "PEC Chandigarh",
        "iiest-shibpur": "IIEST Shibpur",
        "uoh-hyderabad": "University of Hyderabad",
        "tssot-silchar": "TSSOT Silchar",
        "spa-bhopal": "SPA Bhopal",
        "spa-delhi": "SPA Delhi",
        "soe-tezpur": "SoE Tezpur University",
        "ptu-puducherry": "PTU Puducherry",
        "niftem-thanjavur": "NIFTEM Thanjavur",
        "niamt-ranchi": "NIAMT Ranchi",
        "jnu-delhi": "JNU Delhi",
        "jkiapt-allahabad": "JKIAPT Allahabad",
        "ict-ioc-bhubaneswar": "ICT-IOC Bhubaneswar",
        "gkv-haridwar": "GKV Haridwar",
        "iitram-ahmedabad": "IITRAM Ahmedabad",
        "gsv-vadodara": "GSV Vadodara",

        "dtu-delhi": "DTU Delhi",
        "nsut-delhi-west-campus": "NSUT Delhi (West Campus)",
        "nsut-delhi-east-campus": "NSUT Delhi (East Campus)",
        "nsut-delhi": "NSUT Delhi",
        "igdtuw-delhi": "IGDTUW Delhi",
        "iiit-delhi": "IIIT Delhi"
    };
    
    const iit = [
        "iit-bhubaneswar", "iit-bombay", "iit-mandi", "iit-delhi", "iit-indore", "iit-kharagpur", "iit-hyderabad",
        "iit-jodhpur", "iit-kanpur", "iit-madras", "iit-gandhinagar", "iit-patna", "iit-roorkee", "iit-ism-dhanbad",
        "iit-ropar", "iit-bhu-varanasi", "iit-guwahati", "iit-bhilai", "iit-goa", "iit-palakkad", "iit-tirupati",
        "iit-jammu", "iit-dharwad",
    ];

    const nit = [
        "nit-jalandhar", "nit-jaipur", "nit-bhopal", "nit-allahabad", "nit-agartala", "nit-calicut", "nit-delhi",
        "nit-durgapur", "nit-goa", "nit-hamirpur", "nit-surathkal", "nit-meghalaya", "nit-patna", "nit-puducherry",
        "nit-raipur", "nit-sikkim", "nit-arunachal-pradesh", "nit-jamshedpur", "nit-kurukshetra", "nit-mizoram",
        "nit-rourkela", "nit-silchar", "nit-srinagar", "nit-trichy", "nit-uttarakhand", "nit-warangal", "nit-surat",
        "nit-nagpur", "nit-nagaland", "nit-manipur",
    ]

    const jac = [
        "dtu-delhi", "nsut-delhi-west-campus", "nsut-delhi-east-campus", "nsut-delhI", "igdtuw-delhi", "iiit-delhi",
    ]

    const iiit = [
        "iiit-guwahati", "iiitm-gwalior", "iiit-kota", "iiit-surat", "iiit-sonepat", "iiit-una", "iiit-sri-city",
        "iiit-vadodara", "iiit-allahabad", "iiitdm-kancheepuram", "iiitdm-jabalpur", "iiit-manipur", "iiit-trichy",
        "iiit-dharwad", "iiitdm-kurnool", "iiit-ranchi", "iiit-nagpur", "iiit-pune", "iiit-kalyani", "iiit-lucknow",
        "iiit-kottayam",
    ]

    const gfti = [
        "bit-mesra", "bit-patna", "pec-chandigarh", "iiest-shibpur", "uoh-hyderabad", "tssot-silchar", "spa-bhopal",
        "spa-delhi", "soe-tezpur", "ptu-puducherry", "niftem-thanjavur", "niamt-ranchi", "jnu-delhi", "jkiapt-allahabad",
        "ict-ioc-bhubaneswar", "gkv-haridwar", "iitram-ahmedabad", "gsv-vadodara",
    ]

    if (iit.includes(uni)) {
        setCounseling("JOSAA");
        setCollegeType("IIT");
    } else if (nit.includes(uni)) {
        setCounseling("JOSAA");
        setCollegeType("NIT");
    } else if (jac.includes(uni)) {
        setCounseling("JAC");
        setCollegeType("JAC");
    }else if (iiit.includes(uni)) {
        setCounseling("JOSAA");
        setCollegeType("IIIT");
    } else if (gfti.includes(uni)) {
        setCounseling("JOSAA");
        setCollegeType("GFTI");
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
            "https://api.anmolcreates.tech/api/v2/cutoff",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    counseling: counseling,
                    collegeType: collegeType,
                    college: uni,
                    domicile: region,
                    category: category,
                    gender: gender,
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
                        {value: "EWS", label: "EWS"},
                    ]} // Add your category options
                    onChange={setCategory}
                    defaultValue={"General"}
                />

                <SelectMenu
                    placeholder="Sub-Category"
                    options={[
                        {value: " ", label: "None"},
                        {value: "PWD", label: "PWD"},
                        {value: "Girl Candidate", label: "Girl Candidate (Only in NSUT)"},
                        {value: "SGC", label: "Single Girl Child (Only in DTU and IGDTUW)"},
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
