"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Combobox from "@/components/combobox/combobox";
import Button from "@/components/buttons/button.tsx";
import Loader from "@/components/loader/loader.tsx";
<<<<<<< ours
type DataType = any
||||||| ancestor
type DataType = {
    data: {
        year: string;
        data: {
            uni: string;
            branches: string[];
        }[];
    }[];
};
=======

type DataType = any;
>>>>>>> theirs

export default function Page() {
    const [data01, setData01] = useState<DataType | null>(null);
    const [data02, setData02] = useState<DataType | null>(null);
    // const [data, setData] = useState<DataType | null>(null);
    const [year, setYear] = useState<string>("2024");
    const [firstBranch, setFirstBranch] = useState<string | null>(null);
    const [firstUni, setFirstUni] = useState<string | null>(null);
    const [secondBranch, setSecondBranch] = useState<string | null>(null);
    const [secondUni, setSecondUni] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [results, setResults] = useState<any>(null);

    const handleChange01 = (value: string) => {
        setFirstUni(value);
        setFirstBranch(null);
    }

    const handleChange02 = (value: string) => {
        setSecondUni(value);
        setSecondBranch(null);
    }

    useEffect(() => {
        if (!firstUni) return;

        const fetchData01 = async () => {
            try {
                const response = await fetch(
                    "https://api.anmolcreates.tech/api/v2/about/placement-branches",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ college: firstUni }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result: DataType = await response.json();
                setData01(result);
            } catch (error) {
                console.error("Error fetching data01:", error);
            }
        };

        fetchData01();
    }, [firstUni]);

    useEffect(() => {
        const fetchBranchData = async (college: string, setter: (data: DataType) => void) => {
            try {
                const response = await fetch(
                    "https://api.anmolcreates.tech/api/v2/about/placement-branches",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ college }),
                    }
                );
                if (!response.ok) throw new Error("Network error");
                const result: DataType = await response.json();
                setter(result);
            } catch (error) {
                console.error(`Error fetching data for ${college}:`, error);
            }
        };

        if (firstUni) fetchBranchData(firstUni, setData01);
        if (secondUni) fetchBranchData(secondUni, setData02);
    }, [firstUni, secondUni]);


    function DataCard({ data }: { data: any }) {
        console.log(data);
        return (
            <div
                style={{
                    backgroundColor: "#131313",
                    borderRadius: "10px",
                    width: "100%",
                    border: "1px solid rgba(161, 161, 161, 0.12)",
                }}
            >
                <div className={styles.headerCard}>
                    <h3>{data.name}</h3>•{" "}
                    <p
                        style={{
                            padding: "5px 10px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            background: "#131313",
                        }}
                    >
                        {data.branch}
                    </p>
                </div>
                <div className={styles.contentCard}>
                    <div className={styles.regPlaced}>
                        <div className={styles.left}>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>Registered</h4>
                                <p className={styles.nodeData}>
                                    {data.data.registered ? data.data.registered : "NA"}
                                </p>
                            </div>
                            <div className={styles.node}>
                                <h4 className={styles.nodeHead}>Placed</h4>
                                <p className={styles.nodeData}>
                                    {data.data.placed ? data.data.placed : "NA"}
                                </p>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "600",
                                    color: "#ffffff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                }}
                            >
                                {data.data.percent_placed
                                    ? `${data.data.percent_placed.toString().slice(0, 4)}%`
                                    : "NA"}
                            </p>
                        </div>
                    </div>
                    <div className={styles.packages}>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>Average</h4>
                            <p className={styles.nodeData}>
                                {data.data.avg ? `₹${data.data.avg} LPA` : "NA"}
                            </p>
                        </div>
                        <div className={styles.node}>
                            <h4 className={styles.nodeHead}>Median</h4>
                            <p className={styles.nodeData}>
                                {data.data.medium ? `₹${data.data.medium} LPA` : "NA"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function handleYearChange(e: string) {
        setYear(e);
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
                response1 = await fetch(
                    "https://api.anmolcreates.tech/api/v2/placement/getPlacement",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            year: Number(year),
                            branch: firstBranch,
                            college: firstUni,
                        }),
                    }
                );

                if (!response1.ok) {
                    throw new Error(
                        `Failed to fetch data for ${firstUni}: ${response1.status} ${response1.statusText}`
                    );
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
                response2 = await fetch(
                    "https://api.anmolcreates.tech/api/v2/placement/getPlacement",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            year: Number(year),
                            branch: secondBranch,
                            college: secondUni,
                        }),
                    }
                );

                if (!response2.ok) {
                    throw new Error(
                        `Failed to fetch data for ${secondUni}: ${response2.status} ${response2.statusText}`
                    );
                }

                data2 = await response2.json();
                if (!data2.data) {
                    throw new Error(
                        `No data available for ${secondUni} - ${secondBranch}`
                    );
                }
            } catch (error: any) {
                throw new Error(
                    `Error fetching data for ${secondUni}: ${error.message}`
                );
            }

            // Construct result object
            const data = {
                first: {
                    name: collegeMap[firstUni] || firstUni,
                    branch: firstBranch,
                    data: data1.data,
                },
                second: {
                    name: collegeMap[secondUni] || secondUni,
                    branch: secondBranch,
                    data: data2.data,
                },
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
        setYear("2024");
    }

    return (
        <div
            style={{
                marginTop: "100px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "120px",
                }}
            >
                <h1 className={styles.header}>Compare</h1>
                <h1
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, rgba(195, 84, 255, 1) -14.93%, rgba(106, 127, 246, 1) 50%, rgba(92, 255, 192, 1) 92.16%)",
                        filter: "blur(20px)",
                        fontSize: "42px",
                    }}
                    className={styles.header}
                >
                    Compare
                </h1>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 19px",
                }}
            >
                <p
                    style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "15px",
                        maxWidth: "600px",
                        textAlign: "center",
                        fontWeight: 200,
                        color: "#ffffff",
                    }}
                >
                    Compare branches and colleges based on your preferences. This tool will
                    help you make an informed decision about your future.
                </p>
            </div>
            {!isLoading && !results && (
                <div className={styles.compareContainer}>
                    <SelectMenu
                        key="year-select"
                        options={[
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
                        ]}
                        defaultValue={"2024"}
                        placeholder={"Year..."}
                        onChange={handleYearChange}
                    />
                    <div className={styles.compareConts}>
                        <div className={styles.cont}>
                            <h4
                                style={{
                                    width: "100%",
                                    textAlign: "right",
                                }}
                                className={styles.head}
                            >
                                Left
                            </h4>
                            <Combobox
                                multiSelect={false}
                                key="first-uni-select"
                               options={[
                                    // Popular IITs
                                    { value: "iit-bombay", label: "IIT Bombay" },
                                    { value: "iit-delhi", label: "IIT Delhi" },
                                    { value: "iit-kanpur", label: "IIT Kanpur" },
                                    { value: "iit-kharagpur", label: "IIT Kharagpur" },
                                    { value: "iit-roorkee", label: "IIT Roorkee" },
                                    { value: "iit-guwahati", label: "IIT Guwahati" },
                                    { value: "iit-hyderabad", label: "IIT Hyderabad" },

                                    // Top NITs
                                    { value: "nit-trichy", label: "NIT Trichy" },
                                    { value: "nit-surathkal", label: "NIT Surathkal" },
                                    { value: "nit-warangal", label: "NIT Warangal" },
                                    { value: "nit-calicut", label: "NIT Calicut" },
                                    { value: "nit-allahabad", label: "MNNIT Allahabad" },
                                    { value: "nit-jamshedpur", label: "NIT Jamshedpur" },
                                    { value: "nit-kurukshetra", label: "NIT Kurukshetra" },
                                    { value: "nit-delhi", label: "NIT Delhi" },

                                    // Top IIITs
                                    { value: "iiit-hyderabad", label: "IIIT Hyderabad" }, // Add if missing
                                    {value:  "iiit-bangalore", label: "IIIT Bangalore"},
                                    { value: "iiit-delhi", label: "IIIT Delhi" },
                                    { value: "iiit-allahabad", label: "IIIT Allahabad" },
                                    { value: "iiitm-gwalior", label: "IIITM Gwalior" },

                                    // DTU/NSUT/Other popular
                                    { value: "dtu-delhi", label: "DTU Delhi" },
                                    { value: "nsut-delhi", label: "NSUT Delhi" },
                                    { value: "nsut-delhi-west-campus", label: "NSUT Delhi (West Campus)" },
                                    { value: "nsut-delhi-east-campus", label: "NSUT Delhi (East Campus)" },
                                    { value: "pec-chandigarh", label: "PEC Chandigarh" },
                                    { value: "iiest-shibpur", label: "IIEST Shibpur" },
                                    { value: "bit-mesra", label: "BIT Mesra" },

                                    // --- Remaining in alphabetical order ---
                                    { value: "bit-patna", label: "BIT Patna" },
                                    { value: "iit-bhilai", label: "IIT Bhilai" },
                                    { value: "iit-dharwad", label: "IIT Dharwad" },
                                    { value: "iit-gandhinagar", label: "IIT Gandhinagar" },
                                    { value: "iit-goa", label: "IIT Goa" },
                                    { value: "iit-indore", label: "IIT Indore" },
                                    { value: "iit-jammu", label: "IIT Jammu" },
                                    { value: "iit-jodhpur", label: "IIT Jodhpur" },
                                    { value: "iit-mandi", label: "IIT Mandi" },
                                    { value: "iit-palakkad", label: "IIT Palakkad" },
                                    { value: "iit-patna", label: "IIT Patna" },
                                    { value: "iit-ropar", label: "IIT Ropar" },
                                    { value: "iit-tirupati", label: "IIT Tirupati" },
                                    { value: "iit-ism-dhanbad", label: "IIT (ISM) Dhanbad" },
                                    { value: "igdtuw-delhi", label: "IGDTUW Delhi" },
                                    { value: "iiit-guwahati", label: "IIIT Guwahati" },
                                    { value: "iiit-kalyani", label: "IIIT Kalyani" },
                                    { value: "iiit-kota", label: "IIIT Kota" },
                                    { value: "iiit-manipur", label: "IIIT Manipur" },
                                    { value: "iiit-nagpur", label: "IIIT Nagpur" },
                                    { value: "iiit-pune", label: "IIIT Pune" },
                                    { value: "iiit-ranchi", label: "IIIT Ranchi" },
                                    { value: "iiit-sonepat", label: "IIIT Sonepat" },
                                    { value: "iiit-sri-city", label: "IIIT Sri City" },
                                    { value: "iiit-surat", label: "IIIT Surat" },
                                    { value: "iiit-trichy", label: "IIIT Trichy" },
                                    { value: "iiit-una", label: "IIIT Una" },
                                    { value: "iiitdm-jabalpur", label: "IIITDM Jabalpur" },
                                    { value: "iiitdm-kancheepuram", label: "IIITDM Kancheepuram" },
                                    { value: "iiitdm-kurnool", label: "IIITDM Kurnool" },
                                    { value: "nit-arunachal-pradesh", label: "NIT Arunachal Pradesh" },
                                    { value: "nit-durgapur", label: "NIT Durgapur" },
                                    { value: "nit-goa", label: "NIT Goa" },
                                    { value: "nit-hamirpur", label: "NIT Hamirpur" },
                                    { value: "nit-jalandhar", label: "NIT Jalandhar" },
                                    { value: "nit-meghalaya", label: "NIT Meghalaya" },
                                    { value: "nit-mizoram", label: "NIT Mizoram" },
                                    { value: "nit-nagpur", label: "VNIT Nagpur" },
                                    { value: "nit-patna", label: "NIT Patna" },
                                    { value: "nit-puducherry", label: "NIT Puducherry" },
                                    { value: "nit-raipur", label: "NIT Raipur" },
                                    { value: "nit-sikkim", label: "NIT Sikkim" },
                                    { value: "nit-silchar", label: "NIT Silchar" },
                                    { value: "nit-srinagar", label: "NIT Srinagar" },
                                    { value: "nit-surat", label: "SVNIT Surat" },
                                    { value: "nit-uttarakhand", label: "NIT Uttarakhand" },
                                    { value: "soe-tezpur", label: "SoE Tezpur University" },
                                    { value: "tssot-silchar", label: "TSSOT Silchar" }
                                    ]}

                                placeholder={"University..."}
                                onChange={(v) => setFirstUni(Array.isArray(v) ? v[0] : v)}
                            />
                            {firstUni && (
                                <SelectMenu
                                    key={`first-branch-select-${firstUni}-${year}`}
                                    options={
                                        data01?.data[year]?.map((branch: string) => ({
                                            value: branch,
                                            label: branch,
                                        })) ?? []
                                    }
                                    placeholder={"Branch..."}
                                    onChange={(v) => setFirstBranch(v)}
                                />
                            )}
                        </div>
                        <div className={styles.cont}>
                            <h4
                                style={{
                                    width: "100%",
                                }}
                                className={styles.head}
                            >
                                Right
                            </h4>
                            <Combobox
                                multiSelect={false}
                                key="second-uni-select"
                                    options={[
                                    // Popular IITs
                                    { value: "iit-bombay", label: "IIT Bombay" },
                                    { value: "iit-delhi", label: "IIT Delhi" },
                                    { value: "iit-kanpur", label: "IIT Kanpur" },
                                    { value: "iit-kharagpur", label: "IIT Kharagpur" },
                                    { value: "iit-roorkee", label: "IIT Roorkee" },
                                    { value: "iit-guwahati", label: "IIT Guwahati" },
                                    { value: "iit-hyderabad", label: "IIT Hyderabad" },

                                    // Top NITs
                                    { value: "nit-trichy", label: "NIT Trichy" },
                                    { value: "nit-surathkal", label: "NIT Surathkal" },
                                    { value: "nit-warangal", label: "NIT Warangal" },
                                    { value: "nit-calicut", label: "NIT Calicut" },
                                    { value: "nit-allahabad", label: "MNNIT Allahabad" },
                                    { value: "nit-jamshedpur", label: "NIT Jamshedpur" },
                                    { value: "nit-kurukshetra", label: "NIT Kurukshetra" },
                                    { value: "nit-delhi", label: "NIT Delhi" },

                                    // Top IIITs
                                    { value: "iiit-hyderabad", label: "IIIT Hyderabad" }, // Add if missing
                                    {value:  "iiit-banglore", label: "IIIT Bangalore"},
                                    { value: "iiit-delhi", label: "IIIT Delhi" },
                                    { value: "iiit-allahabad", label: "IIIT Allahabad" },
                                    { value: "iiitm-gwalior", label: "IIITM Gwalior" },

                                    // DTU/NSUT/Other popular
                                    { value: "dtu-delhi", label: "DTU Delhi" },
                                    { value: "nsut-delhi", label: "NSUT Delhi" },
                                    { value: "nsut-delhi-west-campus", label: "NSUT Delhi (West Campus)" },
                                    { value: "nsut-delhi-east-campus", label: "NSUT Delhi (East Campus)" },
                                    { value: "pec-chandigarh", label: "PEC Chandigarh" },
                                    { value: "iiest-shibpur", label: "IIEST Shibpur" },
                                    { value: "bit-mesra", label: "BIT Mesra" },

                                    // --- Remaining in alphabetical order ---
                                    { value: "bit-patna", label: "BIT Patna" },
                                    { value: "iit-bhilai", label: "IIT Bhilai" },
                                    { value: "iit-dharwad", label: "IIT Dharwad" },
                                    { value: "iit-gandhinagar", label: "IIT Gandhinagar" },
                                    { value: "iit-goa", label: "IIT Goa" },
                                    { value: "iit-indore", label: "IIT Indore" },
                                    { value: "iit-jammu", label: "IIT Jammu" },
                                    { value: "iit-jodhpur", label: "IIT Jodhpur" },
                                    { value: "iit-mandi", label: "IIT Mandi" },
                                    { value: "iit-palakkad", label: "IIT Palakkad" },
                                    { value: "iit-patna", label: "IIT Patna" },
                                    { value: "iit-ropar", label: "IIT Ropar" },
                                    { value: "iit-tirupati", label: "IIT Tirupati" },
                                    { value: "iit-ism-dhanbad", label: "IIT (ISM) Dhanbad" },
                                    { value: "igdtuw-delhi", label: "IGDTUW Delhi" },
                                    { value: "iiit-guwahati", label: "IIIT Guwahati" },
                                    { value: "iiit-kalyani", label: "IIIT Kalyani" },
                                    { value: "iiit-kota", label: "IIIT Kota" },
                                    { value: "iiit-manipur", label: "IIIT Manipur" },
                                    { value: "iiit-nagpur", label: "IIIT Nagpur" },
                                    { value: "iiit-pune", label: "IIIT Pune" },
                                    { value: "iiit-ranchi", label: "IIIT Ranchi" },
                                    { value: "iiit-sonepat", label: "IIIT Sonepat" },
                                    { value: "iiit-sri-city", label: "IIIT Sri City" },
                                    { value: "iiit-surat", label: "IIIT Surat" },
                                    { value: "iiit-trichy", label: "IIIT Trichy" },
                                    { value: "iiit-una", label: "IIIT Una" },
                                    { value: "iiitdm-jabalpur", label: "IIITDM Jabalpur" },
                                    { value: "iiitdm-kancheepuram", label: "IIITDM Kancheepuram" },
                                    { value: "iiitdm-kurnool", label: "IIITDM Kurnool" },
                                    { value: "nit-arunachal-pradesh", label: "NIT Arunachal Pradesh" },
                                    { value: "nit-durgapur", label: "NIT Durgapur" },
                                    { value: "nit-goa", label: "NIT Goa" },
                                    { value: "nit-hamirpur", label: "NIT Hamirpur" },
                                    { value: "nit-jalandhar", label: "NIT Jalandhar" },
                                    { value: "nit-meghalaya", label: "NIT Meghalaya" },
                                    { value: "nit-mizoram", label: "NIT Mizoram" },
                                    { value: "nit-nagpur", label: "VNIT Nagpur" },
                                    { value: "nit-patna", label: "NIT Patna" },
                                    { value: "nit-puducherry", label: "NIT Puducherry" },
                                    { value: "nit-raipur", label: "NIT Raipur" },
                                    { value: "nit-sikkim", label: "NIT Sikkim" },
                                    { value: "nit-silchar", label: "NIT Silchar" },
                                    { value: "nit-srinagar", label: "NIT Srinagar" },
                                    { value: "nit-surat", label: "SVNIT Surat" },
                                    { value: "nit-uttarakhand", label: "NIT Uttarakhand" },
                                    { value: "soe-tezpur", label: "SoE Tezpur University" },
                                    { value: "tssot-silchar", label: "TSSOT Silchar" }
                                ]}
                                placeholder={"University..."}
                                onChange={(v) => setSecondUni(Array.isArray(v) ? v[0] : v)}
                            />
                            {secondUni && (
                                <SelectMenu
                                    key={`second-branch-select-${secondUni}-${year}`}
                                    options={
                                        data02?.data[year]?.map((branch: string) => ({
                                            value: branch,
                                            label: branch,
                                        })) ?? []
                                    }
                                    placeholder={"Branch..."}
                                    onChange={(v) => setSecondBranch(v)}
                                />
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                        }}
                    >
                        <Button text={"Compare"} onClick={handleClick} variant={"Outline"} />
                    </div>
                </div>
            )}
            {isLoading && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Loader height={400} />
                </div>
            )}
            {!isLoading && results && (
                <>
                    <div className={styles.resultsContainer}>
                        <div className={styles.resultsContainers}>
                            <div className={styles.result}>
                                <DataCard data={results.first} />
                            </div>
                            <div className={styles.result}>
                                <DataCard data={results.second} />
                            </div>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10px",
                            }}
                        >
                            <Button
                                width={150}
                                text={"Compare Again"}
                                onClick={compareAgainClick}
                                variant={"Danger"}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
