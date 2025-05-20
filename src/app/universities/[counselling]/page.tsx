"use client";

import { useEffect, useState } from "react";
import UniInfoCard from "@/components/uni-card-new/uni-info-card.tsx";
import Styles from "./styles.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import SingleInput from "@/components/Inputs/SingleInput/singleInput.tsx";

const collegeSequence: {
    [key: string]: (string[] | {
        [key: string]: string[]
    });
} = {
    "jac": ["dtu-delhi", "nsut-delhi-west-campus", "nsut-delhi-east-campus", "nsut-delhi", "igdtuw-delhi", "iiit-delhi",],
    "josaa": {
        "iit": ["iit-bhubaneswar", "iit-bombay", "iit-mandi", "iit-delhi", "iit-indore", "iit-kharagpur", "iit-hyderabad",
            "iit-jodhpur", "iit-kanpur", "iit-madras", "iit-gandhinagar", "iit-patna", "iit-roorkee", "iit-ism-dhanbad",
            "iit-ropar", "iit-bhu-varanasi", "iit-guwahati", "iit-bhilai", "iit-goa", "iit-palakkad", "iit-tirupati",
            "iit-jammu", "iit-dharwad"],
        "nit": [
            "nit-jalandhar", "nit-jaipur", "nit-bhopal", "nit-allahabad", "nit-agartala", "nit-calicut", "nit-delhi",
            "nit-durgapur", "nit-goa", "nit-hamirpur", "nit-surathkal", "nit-meghalaya", "nit-patna", "nit-puducherry",
            "nit-raipur", "nit-sikkim", "nit-arunachal-pradesh", "nit-jamshedpur", "nit-kurukshetra", "nit-mizoram",
            "nit-rourkela", "nit-silchar", "nit-srinagar", "nit-trichy", "nit-uttarakhand", "nit-warangal", "nit-surat",
            "nit-nagpur", "nit-nagaland", "nit-manipur"],
        "iiit": [
            "iiit-guwahati", "iiitm-gwalior", "iiit-kota", "iiit-surat", "iiit-sonepat", "iiit-una", "iiit-sri-city",
            "iiit-vadodara", "iiit-allahabad", "iiitdm-kancheepuram", "iiitdm-jabalpur", "iiit-manipur", "iiit-trichy",
            "iiit-dharwad", "iiitdm-kurnool", "iiit-ranchi", "iiit-nagpur", "iiit-pune", "iiit-kalyani", "iiit-lucknow",
            "iiit-kottayam","iiit-naya-raipur"
        ],
        "gfti": [
            "bit-mesra", "bit-patna", "pec-chandigarh", "iiest-shibpur", "uoh-hyderabad", "tssot-silchar", "spa-bhopal",
            "spa-delhi", "soe-tezpur", "ptu-puducherry", "niftem-thanjavur", "niamt-ranchi", "jnu-delhi", "jkiapt-allahabad",
            "ict-ioc-bhubaneswar", "gkv-haridwar", "iitram-ahmedabad", "gsv-vadodara",
        ]
    }
};

export function getCollegeType(college: string): string | null {
    for (const type in collegeSequence) {
        if (Array.isArray(collegeSequence[type])) {
            if (collegeSequence[type].includes(college)) {
                return type;
            }
        } else {
            for (const subtype in collegeSequence[type]) {
                if (collegeSequence[type][subtype].includes(college)) {
                    return subtype;
                }
            }
        }
    }
    return null;
}

export default function Page() {
    const [collegeData, setCollegeData] = useState<Record<string, { logo: string, "college-pic": string }>>({});
    const [selectedUniType, setSelectedUniType] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        counselling,
    }: {
        counselling: string;
    } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("https://api.anmolcreates.tech/api/v2/about/photo", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const result = await response.json();
                if (result.statusCode === 200) {
                    setCollegeData(result.data);
                }
            } catch (error) {
                console.error("Error fetching college data:", error);
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
            <div style={{
                width: "calc(100% - 30px)",
                maxWidth: "1000px",
                marginTop: "20px"
            }}>
                <SingleInput
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    holder="Search universities"
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
                                <Link href={`/universities/${counselling}/${collegeSlug}`}>
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
                                    <Link href={`/universities/${counselling}/${collegeSlug}`}>
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
    );
}
