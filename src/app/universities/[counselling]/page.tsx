"use client";

import { useEffect, useState } from "react";
import UniInfoCard from "@/components/uni-card-new/uni-info-card.tsx";
import Styles from "./styles.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import AutocompleteInput from "@/components/autocomplete/AutocompleteInput/AutocompleteInput.tsx";
import { UniversitySuggestion } from "@/lib/autocomplete/types";
import Loader from "@/components/loader/loader.tsx";
import API_URL from "@/config";

import type { CollegeSequence } from "@/lib/autocomplete/types";

const collegeSequence: CollegeSequence = {
    "jac": [
        "iiit-delhi",                 // Known for CS
        "dtu-delhi",
        "nsut-delhi",
        "nsut-delhi-west-campus",
        "nsut-delhi-east-campus",
        "igdtuw-delhi"
    ],
    "josaa": {
        "iit": [
            "iit-bombay",
            "iit-delhi",
            "iit-kanpur",
            "iit-madras",
            "iit-kharagpur",
            "iit-roorkee",
            "iit-bhu-varanasi",
            "iit-guwahati",
            "iit-hyderabad",
            "iit-indore",
            "iit-gandhinagar",
            "iit-jodhpur",
            "iit-mandi",
            "iit-bhubaneswar",
            "iit-ism-dhanbad",
            "iit-patna",
            "iit-ropar",
            "iit-goa",
            "iit-tirupati",
            "iit-palakkad",
            "iit-dharwad",
            "iit-jammu",
            "iit-bhilai"
        ],
        "nit": [
            "nit-trichy",
            "nit-surathkal",
            "nit-warangal",
            "nit-calicut",
            "nit-allahabad",
            "nit-jaipur",
            "nit-rourkela",
            "nit-nagpur",
            "nit-kurukshetra",
            "nit-durgapur",
            "nit-jamshedpur",
            "nit-bhopal",
            "nit-delhi",
            "nit-patna",
            "nit-goa",
            "nit-jalandhar",
            "nit-hamirpur",
            "nit-silchar",
            "nit-raipur",
            "nit-puducherry",
            "nit-uttarakhand",
            "nit-agartala",
            "nit-meghalaya",
            "nit-sikkim",
            "nit-arunachal-pradesh",
            "nit-srinagar",
            "nit-mizoram",
            "nit-nagaland",
            "nit-manipur"
        ],
        "iiit": [
            "iiit-allahabad",
            "iiitm-gwalior",
            "iiit-lucknow",
            "iiit-kalyani",
            "iiit-naya-raipur",
            "iiit-pune",
            "iiit-vadodara",
            "iiit-kottayam",
            "iiit-kota",
            "iiit-surat",
            "iiit-sri-city",
            "iiit-sonepat",
            "iiit-una",
            "iiitdm-kancheepuram",
            "iiitdm-jabalpur",
            "iiitdm-kurnool",
            "iiit-dharwad",
            "iiit-trichy",
            "iiit-guwahati",
            "iiit-manipur",
            "iiit-ranchi"
        ],
        "gfti": [
            "iiest-shibpur",
            "bit-mesra",
            "pec-chandigarh",
            "spa-delhi",
            "spa-bhopal",
            "jnu-delhi",
            "uoh-hyderabad",
            "bit-patna",
            "soe-tezpur",
            "tssot-silchar",
            "ptu-puducherry",
            "ict-ioc-bhubaneswar",
            "jkiapt-allahabad",
            "niamt-ranchi",
            "niftem-thanjavur",
            "gkv-haridwar",
            "iitram-ahmedabad",
            "gsv-vadodara"
        ]
    }
};



export default function Page() {
    const [collegeData, setCollegeData] = useState<Record<string, { logo: string, "college-pic": string }>>({});
    const [selectedUniType, setSelectedUniType] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const {
        counselling,
    }: {
        counselling: string;
    } = useParams();

    // Save clicked card ID before navigation
    const handleCardClick = (collegeSlug: string) => {
        localStorage.setItem('scrollTarget', collegeSlug);
    };

    // Handle autocomplete selection
    const handleUniversitySelect = (university: UniversitySuggestion) => {
        // Set the search query to the selected university name
        setSearchQuery(university.displayName);

        // Optionally scroll to the selected university card if it exists
        setTimeout(() => {
            const targetElement = document.getElementById(`card-${university.slug}`);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 100);
    };

    // Restore scroll after content loads
    useEffect(() => {
        if (!isLoading) {
            const targetSlug = localStorage.getItem('scrollTarget');
            console.log("target", targetSlug)
            if (targetSlug) {
                requestAnimationFrame(() => {
                    const targetElement = document.getElementById(`card-${targetSlug}`);
                    targetElement?.scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                        inline: 'nearest'
                    });
                    localStorage.removeItem('scrollTarget');
                });
            }
        }
    }, [isLoading]);



    useEffect(() => {
        async function fetchData() {
            setIsLoading(true); // Set loading to true at the start of fetch
            try {
                const response = await fetch(`${API_URL}/v2/about/photo`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.statusCode === 200) {
                    setCollegeData(result.data);
                }
            } catch (error) {
                console.error("Error fetching college data:", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetch completes (success or error)
            }
        }

        fetchData();

        // Set default university type when counselling changes and it's not an array
        if (!Array.isArray(collegeSequence[counselling]) && collegeSequence[counselling]) {
            setSelectedUniType(Object.keys(collegeSequence[counselling] as object)[0]);
        }
    }, [counselling]);

    const getDisplayName = (slug: string): string => {
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
            "iiit-naya-raipur": "IIIT Naya Raipur",

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

        return map[slug] || slug.replace(/-/g, " ").toUpperCase(); // fallback
    };

    return (
        <>
            {isLoading ? (
                <div style={{
                    width: "100%",
                    height: "calc(100vh - 100px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Loader />
                </div>
            ) : (
                <>
                    <div style={{
                        width: "calc(100% - 40px)",
                        maxWidth: "1000px",
                        marginTop: "20px"
                    }}>
                        <AutocompleteInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSelect={handleUniversitySelect}
                            placeholder="Search universities"
                            universities={collegeSequence}
                            counselling={counselling}
                            enabled={true}
                        />
                    </div>


                    <div style={{ marginTop: "10px" }}>
                        {Array.isArray(collegeSequence[counselling]) ? <div className={Styles.page}> {
                            collegeSequence[counselling].filter((collegeSlug: string) =>
                                getDisplayName(collegeSlug).toLowerCase().includes(searchQuery.toLowerCase())).map((collegeSlug: string) => {
                                    const data = collegeData[collegeSlug];
                                    if (!data) return null;

                                    return (
                                        <div key={collegeSlug} className={Styles.container}>
                                            <Link id={`card-${collegeSlug}`}
                                                onClick={() => handleCardClick(collegeSlug)}
                                                href={`/universities/${counselling}/${collegeSlug}`}>
                                                <div className={Styles.cardContainer}>
                                                    <UniInfoCard
                                                        logo={data.logo}
                                                        banner={data["college-pic"]}
                                                        name={getDisplayName(collegeSlug)}
                                                        nirf=""
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })
                        }</div> : <div>
                            <div className={Styles.selectContainer}>
                                <SelectMenu
                                    options={Object.keys(collegeSequence[counselling] as object).map((type) => ({
                                        value: type,
                                        label: type.toUpperCase()
                                    }))}
                                    defaultValue={selectedUniType}
                                    onChange={(value) => setSelectedUniType(value)}
                                    placeholder="Select University Type"
                                />
                            </div>
                            <div className={Styles.page}>
                                {selectedUniType && (collegeSequence[counselling] as Record<string, string[]>)[selectedUniType]?.filter((collegeSlug: string) =>
                                    getDisplayName(collegeSlug).toLowerCase().includes(searchQuery.toLowerCase())).map((collegeSlug: string) => {
                                        const data = collegeData[collegeSlug];
                                        if (!data) return null;

                                        return (
                                            <div key={collegeSlug} className={Styles.container}>
                                                <Link onClick={() => handleCardClick(collegeSlug)}
                                                    id={`card-${collegeSlug}`} href={`/universities/${counselling}/${collegeSlug}`}>
                                                    <div className={Styles.cardContainer}>
                                                        <UniInfoCard
                                                            logo={data.logo}
                                                            banner={data["college-pic"]}
                                                            name={getDisplayName(collegeSlug)}
                                                            nirf=""
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>}
                    </div>
                </>
            )}
        </>
    );
}
