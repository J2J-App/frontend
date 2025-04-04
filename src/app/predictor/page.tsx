"use client";
import React from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput";
import Styles from "./styles.module.css";
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import Button from "@/components/buttons/button.tsx";
import DataTable from "@/components/data-table/data-table.tsx";
import Image from "next/image";

import headingbg from "@/public/backgrounds/predictor/bgheading.jpg"

export default function Page() {
    const [rank, setRank] = React.useState<number | string | null>("");
    const [region, setRegion] = React.useState<string>("Delhi");
    const [category, setCategory] = React.useState<string | null>(null);
    const [subCategory, setSubCategory] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isNaN(Number(value)) && !value.includes(' ')) {
            setRank(value ? parseInt(value) : "");
        }
        setResult([]);
    }


    const handleOnChangeOfRegion = (value: string) => {
        setRegion(value);
        setResult([]);
    };

    const handleOnChangeOfCategory = (value: string) => {
        setCategory(value);
        setResult([]);
    }

    function handleChangeSubCategory(value: string) {
        setSubCategory(value);
        setResult([]);
    }

    function handleClear() {
        setResult([]);
        setRank("")

    }

    const handleSubmit = async () => {
        if (rank === null) {
            return;
        }

        try {
            if(category && subCategory) {
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
                            category: `${category} ${subCategory?.trim()}`.trim(),
                        }),
                    }
                );
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const dataObtained: any = await response.json();

                setResult(dataObtained.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    return (<div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            gap: "21px",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                position: "relative",
                overflow: "visible",
                marginTop: "160px",
            }}>
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
                        maxWidth: "400px",
                    }}>
                        <SingleInput value={`${rank}`} holder="Rank" type="number" onChange={handleChange}/>
                        <div className={Styles.inputContainer}>
                            <SelectMenu
                                options={[
                                    {value: "Delhi", label: "Delhi"},
                                    {value: "Outside Delhi", label: "Outside Delhi"},
                                ]}
                                defaultValue="Delhi"
                                onChange={handleOnChangeOfRegion}
                            />
                            <SelectMenu
                                options={[
                                    {value: "General", label: "General"},
                                    {value: "OBC", label: "OBC"},
                                    {value: "SC", label: "SC"},
                                    {value: "ST", label: "ST"},
                                ]}
                                onChange={handleOnChangeOfCategory}
                                defaultValue="General"
                            />

                            <SelectMenu
                                options={[
                                    {value: " ", label: "None"},
                                    {value: "PWD", label: "PWD"},
                                    {value: "Girl Candidate", label: "Single Girl Candidate"},
                                    {value: "Defence", label: "Defence"}
                                ]}
                                onChange={handleChangeSubCategory}
                                defaultValue=" "
                            />
                        </div>
                        <div style={{
                            zIndex: 2,
                            position: "relative",
                            marginTop: "10px",
                            display: "flex",
                            gap: "15px",
                        }}>
                            <Button text="Submit" onClick={handleSubmit} variant="Primary" height={38}/>
                            <Button text={"Clear"} onClick={handleClear} variant="Outline" height={38}/>
                        </div>
                    </div>
                </div>
            </div>
            {result.length > 0 && <DataTable data={result}/>}

        </div>
    );
}
