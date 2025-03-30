"use client";
import React from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput";
import Styles from "./styles.module.css";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import Button from "@/components/buttons/button.tsx";
import DataTable from "@/components/data-table/data-table.tsx";

export default function Page() {
    const [rank, setRank] = React.useState<number | null>(null);
    const [region, setRegion] = React.useState<string>("Delhi");
    const [category, setCategory] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRank(value ? parseInt(value) : null);
        setResult([]);
    };

    const handleOnChangeOfRegion = (value: string) => {
        setRegion(value);
        setResult([]);
    };

    const handleOnChangeOfCategory = (value: string) => {
        setCategory(value);
        setResult([]);
    }

    const handleSubmit = async () => {
        if (rank === null) {
            return;
        }

        try {
            const response = await fetch(
                "https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getBranches",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rank: rank,
                        domicile: region,
                        category: category ,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const dataObtained: any = await response.json();

            setResult(dataObtained.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    return (
        <div style={{ marginTop: "120px" }} className={Styles.container}>
            <h1 className={Styles.title}>Predictor</h1>
            <SingleInput holder="Rank" type="number" onChange={handleChange} />
            <SelectMenu
                options={[
                    { value: "Delhi", label: "Delhi" },
                    { value: "Outside Delhi", label: "Outside Delhi" },
                ]}
                defaultValue="Delhi"
                onChange={handleOnChangeOfRegion}
            />
            <SelectMenu
                options={[
                    { value: "General", label: "General" },
                    { value: "OBC", label: "OBC" },
                    { value: "SC", label: "SC" },
                    { value: "ST", label: "ST" },
                ]}
                onChange={handleOnChangeOfCategory}
                defaultValue="General"
            />
            <Button text="Submit" onClick={handleSubmit} variant="Primary" />

            {result.length > 0 && <DataTable data={result} />}
        </div>
    );
}
