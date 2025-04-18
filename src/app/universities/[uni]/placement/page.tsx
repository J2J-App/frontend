import styles from "./page.module.css";
import TabsPlacement from "@/app/universities/[uni]/placement/tabs-placement.tsx";
import {MdWarning} from "react-icons/md";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ uni: string }>
}) {
    const { uni } = await params;


    const data_2024 = await (await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getPlacement",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            year: 2024,
        }),
    })).json()
    const data_2023 = await (await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getPlacement",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            year: 2023,
        }),
    })).json()
    const data_2022 = await (await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getPlacement",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            year: 2022,
        }),
    })).json()

    const placementData = {
        "2024": data_2024.data.filter((item: any) => item.college === uni.toUpperCase()),
        "2023": data_2023.data.filter((item: any) => item.college === uni.toUpperCase()),
        "2022": data_2022.data.filter((item: any) => item.college === uni.toUpperCase()),
    }

    return <div className={styles.mainContainer} >
        <h1 style={{
            textAlign: "center",
            color: "white",
            fontWeight: 900,
            width: "100%",
        }}>Placement</h1>
        <div style={{
            width: "100%",
            maxWidth: "820px",
        }}>
            {uni === "nsutw" || uni === "nsute" ? <div style={{
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
                <p style={{
                    color: "#c9c9c9",
                }}>
                    Placement data is currently not available for this college
                </p>
            </div> : <TabsPlacement data={placementData}/>}
        </div>
    </div>
}