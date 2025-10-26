"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Combobox from "@/components/combobox/combobox";
import Button from "@/components/buttons/button.tsx";
import Loader from "@/components/loader/loader.tsx";
import API_URL from "@/config";

type DataType = any

export default function Page() {
    const [data01, setData01] = useState<DataType | null>(null);
    const [data02, setData02] = useState<DataType | null>(null);
    const [year, setYear] = useState<string>("2024");
    const [firstBranch, setFirstBranch] = useState<string | null>(null);
    const [firstUni, setFirstUni] = useState<string | null>(null);
    const [secondBranch, setSecondBranch] = useState<string | null>(null);
    const [secondUni, setSecondUni] = useState<string | null>(null);
    
    // 🔑 State for form validation errors and API/network errors
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [apiError, setApiError] = useState<string | null>(null); 
    
    const [isLoading, setIsLoading] = useState<boolean>(false); // 🔑 Loading State
    const [results, setResults] = useState<any>(null);

    const collegeMap: { [key: string]: string } = {
        "nit-jalandhar": "NIT Jalandhar",
        "nit-allahabad": "MNNIT Allahabad",
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
        "nit-silchar": "NIT Silchar",
        "nit-srinagar": "NIT Srinagar",
        "nit-trichy": "NIT Trichy",
        "nit-uttarakhand": "NIT Uttarakhand",
        "nit-warangal": "NIT Warangal",
        "nit-surat": "SVNIT Surat",
        "nit-nagpur": "VNIT Nagpur",
        "iit-bombay": "IIT Bombay",
        "iit-mandi": "IIT Mandi",
        "iit-delhi": "IIT Delhi",
        "iit-indore": "IIT Indore",
        "iit-kharagpur": "IIT Kharagpur",
        "iit-hyderabad": "IIT Hyderabad",
        "iit-jodhpur": "IIT Jodhpur",
        "iit-kanpur": "IIT Kanpur",
        "iit-gandhinagar": "IIT Gandhinagar",
        "iit-patna": "IIT Patna",
        "iit-roorkee": "IIT Roorkee",
        "iit-ism-dhanbad": "IIT (ISM) Dhanbad",
        "iit-ropar": "IIT Ropar",
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
        "bit-mesra": "BIT Mesra",
        "bit-patna": "BIT Patna",
        "pec-chandigarh": "PEC Chandigarh",
        "iiest-shibpur": "IIEST Shibpur",
        "tssot-silchar": "TSSOT Silchar",
        "soe-tezpur": "SoE Tezpur University",
        "dtu-delhi": "DTU Delhi",
        "nsut-delhi-west-campus": "NSUT Delhi (West Campus)",
        "nsut-delhi-east-campus": "NSUT Delhi (East Campus)",
        "nsut-delhi": "NSUT Delhi",
        "igdtuw-delhi": "IGDTUW Delhi",
        "iiit-delhi": "IIIT Delhi"
    };

    let option01 = data01?.data[year]?.map((branch: string) => ({
        value: branch,
        label: branch,
    })) ?? []

    let option02 = data02?.data[year]?.map((branch: string) => ({
        value: branch,
        label: branch,
    })) ?? []

    if (option01.length === 0) {
        option01 = [{ value: `No Placement for this year`, label: `No Placement for this year` }]
    }

    if (option02.length === 0) {
        option02 = [{ value: `No Placement for this year`, label: `No Placement for this year` }]
    }

    // Branch data fetch for college options (runs on firstUni/secondUni change)
    const fetchBranchData = useCallback(async (college: string, setter: (data: DataType) => void) => {
        try {
            const response = await fetch(
                `${API_URL}/v2/about/placement-branches`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ college }),
                }
            );
            
            // Note: This fetch only populates the SelectMenu options, so failing silently is okay.
            if (!response.ok) {
                console.error(`Failed to fetch branches for ${college}. Status: ${response.status}`);
                setter({ data: {} }); 
                return;
            }
            
            const result: DataType = await response.json();
            setter(result);
        } catch (error) {
            console.error(`Error fetching data for ${college}:`, error);
            setter({ data: {} }); 
        }
    }, []);

    useEffect(() => {
        if (firstUni) fetchBranchData(firstUni, setData01);
        else setData01(null);
    }, [firstUni, fetchBranchData]);

    useEffect(() => {
        if (secondUni) fetchBranchData(secondUni, setData02);
        else setData02(null);
    }, [secondUni, fetchBranchData]);


    function DataCard({ data }: { data: any }) {
        // console.log(data);
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

    // 🔑 MODIFIED: Refactored fetch with centralized try/catch
    async function handleClick() {
        // 🔑 Reset errors and start loading
        setValidationErrors([]);
        setApiError(null);
        setResults(null);

        // Client-side validation
        if (!firstUni || !firstBranch || !secondUni || !secondBranch) {
            setValidationErrors(["Please select all options for both University/College slots."]);
            return;
        }

        setIsLoading(true);

        try {
            const fetchSinglePlacement = async (uni: string, branch: string) => {
                const response = await fetch(
                    `${API_URL}/v2/placement/getPlacement`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            year: Number(year),
                            branch,
                            college: uni,
                        }),
                    }
                );

                if (!response.ok) {
                    // 🔑 Specific API Error Message
                    const statusText = response.statusText || "Server Error";
                    let message = `Request failed for ${collegeMap[uni] || uni}. Status: ${response.status}.`;

                    if (response.status === 404) {
                        message = `No placement record found for ${collegeMap[uni] || uni} in ${year}.`;
                    } else if (response.status >= 500) {
                        message = `Server is unavailable. Please retry.`;
                    }
                    throw new Error(message);
                }

                const data = await response.json();
                if (!data.data) {
                    // 🔑 No Data Error Message
                    throw new Error(`No data available for ${collegeMap[uni] || uni} - ${branch} in ${year}.`);
                }
                return data.data;
            };

            // Execute both fetches concurrently using Promise.all
            const [data1, data2] = await Promise.all([
                fetchSinglePlacement(firstUni!, firstBranch!),
                fetchSinglePlacement(secondUni!, secondBranch!),
            ]);

            // Construct result object
            const data = {
                first: {
                    name: collegeMap[firstUni!] || firstUni,
                    branch: firstBranch,
                    data: data1,
                },
                second: {
                    name: collegeMap[secondUni!] || secondUni,
                    branch: secondBranch,
                    data: data2,
                },
            };

            setResults(data);

        } catch (error: any) {
            // 🔑 Catch all network/custom API errors
            console.error("Compare fetch error:", error);
            
            // Set user-friendly error messages
            if (error.message.includes("Failed to fetch")) {
                setApiError("A network connection error occurred. Please check your internet connection and try the retry button.");
            } else {
                setApiError(error.message || "An unexpected error occurred during comparison.");
            }

        } finally {
            // 🔑 Stop loading
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
        setValidationErrors([]);
        setApiError(null); // Clear API error on 'Compare Again'
        setYear("2024");
    }

    // 🔑 NEW COMPONENT: Unified Error Display and Retry Button
    function ErrorDisplay() {
        // Only show if there are form errors OR an API error
        if (validationErrors.length === 0 && !apiError) return null;

        return (
            <div 
                className={styles.errorContainer}
                style={{
                    backgroundColor: "#131313",
                    border: "1px solid #FFCCC7",
                    borderRadius: "8px",
                    padding: "15px 20px",
                    marginTop: "20px",
                    width: "100%",
                    maxWidth: "600px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    color: '#FF6347'
                }}
            >
                {/* Display Validation Errors */}
                {validationErrors.map((error, index) => (
                    <p key={index} style={{ margin: "4px 0", fontSize: "14px" }}>
                        • {error}
                    </p>
                ))}

                {/* Display API/Network Error */}
                {apiError && (
                    <>
                        <p style={{ margin: "4px 0", fontSize: "16px", fontWeight: 'bold' }}>
                            Error: {apiError}
                        </p>
                        
                        {/* 🔑 RETRY MECHANISM: Button calls handleClick */}
                        <button
                            onClick={handleClick}
                            style={{
                                marginTop: '15px',
                                padding: '8px 16px',
                                backgroundColor: isLoading ? '#5a6268' : '#32CD32', // Use a friendly color
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: isLoading ? 'default' : 'pointer',
                                fontSize: '15px',
                                fontWeight: '600',
                                transition: 'background-color 0.2s',
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Retrying...' : 'Click to Retry Comparison'}
                        </button>
                    </>
                )}
            </div>
        );
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
            
            {/* 🔑 INTEGRATE ERROR DISPLAY HERE */}
            <ErrorDisplay />

            {/* 🔑 MAIN INPUT FORM */}
            {!isLoading && !results && (
                <div className={styles.compareContainer}>
                    <SelectMenu
                        key="year-select"
                        options={[
                            { value: "2024", label: "2024" },
                            { value: "2023", label: "2023" },
                            { value: "2022", label: "2022" },
                        ]}
                        defaultValue={"2024"}
                        placeholder={"Year..."}
                        onChange={handleYearChange}
                    />
                    <div className={styles.compareConts}>
                        <div className={styles.cont}>
                            <h4
                                style={{ width: "100%", textAlign: "right" }}
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
                                    { value: "iiit-hyderabad", label: "IIIT Hyderabad" },
                                    { value: "iiit-bangalore", label: "IIIT Bangalore" },
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
                                    options={option01}
                                    placeholder={"Branch..."}
                                    onChange={(v) => setFirstBranch(v)}
                                />
                            )}
                        </div>
                        <div className={styles.cont}>
                            <h4
                                style={{ width: "100%" }}
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
                                    { value: "iiit-hyderabad", label: "IIIT Hyderabad" },
                                    { value: "iiit-banglore", label: "IIIT Bangalore" },
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
                                    options={option02}
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
                        {/* 🔑 Submit button calls the handler */}
                        <Button text={"Compare"} onClick={handleClick} variant={"Outline"} disabled={isLoading} />
                    </div>
                </div>
            )}
            
            {/* 🔑 LOADING STATE DISPLAY */}
            {isLoading && !results && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: '20px'
                    }}
                >
                    <Loader height={400} />
                </div>
            )}
            
            {/* RESULTS DISPLAY */}
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
