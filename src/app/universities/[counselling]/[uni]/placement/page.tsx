import styles from "./page.module.css";
import TabsPlacement from "./tabs-placement.tsx";
import {MdWarning} from "react-icons/md";
import {redirect} from "next/navigation";

export const dynamic = "force-static";
export const fetchCache = "force-cache";

export default async function Page({ params }: { params: Promise<{ uni: string, counselling: string }> }) {
    const { uni, counselling } = await params;

    const fetchData = async (year: number) => {
        try {
            const res = await fetch("https://api.jeepedia.in/api/v2/placement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    college: uni,
                    year,
                }),
            });

            // Only parse JSON if the response is OK
            if (res.ok) {
                const data = await res.json();
                return Array.isArray(data?.data) ? data.data.filter((item: any) => item.year === year) : [];
            } else {
                return [];
            }
        } catch (error) {
            // If fetch or JSON parsing fails, return empty array
            console.error(`Failed to fetch placement data for ${year}:`, error);
            return [];
        }
    };

    const [data_2024, data_2023, data_2022] = await Promise.all([
        fetchData(2024),
        fetchData(2023),
        fetchData(2022),
    ]);

    const placementData = {
        "2024": data_2024,
        "2023": data_2023,
        "2022": data_2022,
    };

    const isUnavailable = uni === "nsutw" || uni === "nsute";

    return (
        <div className={styles.mainContainer}>
            <h1 style={{ textAlign: "center", color: "white", fontWeight: 900, width: "100%" }}>Placement</h1>
            <div style={{ width: "100%", maxWidth: "820px" }}>
                {isUnavailable ? (
                    <div style={{
                        width: "100%",
                        height: "fit-content",
                        display: "flex",
                        fontSize: "14px",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        borderRadius: "8px",
                        gap: "10px",
                        backgroundColor: "#171717",
                        border: "1px solid",
                        padding: "10px",
                        borderColor: "#2a2a2a",
                    }}>
                        <div style={{
                            fontSize: 24,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                            width: "42px",
                            height: "42px",
                            color: "rgba(255,255,255,0.85)",
                            border: "1px solid",
                            borderRadius: "7px",
                            borderColor: "#333333",
                            backgroundColor: "#090909",
                        }}>
                            <MdWarning />
                        </div>
                        <p style={{ color: "#c9c9c9" }}>
                            Placement data is currently not available for this college
                        </p>
                    </div>
                ) : (
                    <TabsPlacement data={placementData} />
                )}
            </div>
        </div>
    );
}
