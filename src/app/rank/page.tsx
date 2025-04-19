"use client";

import React, { useState, ChangeEvent } from 'react';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Button from '@/components/buttons/button.tsx';
import Styles from './styles.module.css';
import Image from "next/image";
import headingbg from "@/public/backgrounds/rank/bgheading.jpg";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Loader from "@/components/loader/loader.tsx";

export default function Page() {
    const [rank, setRank] = useState<string>('');
    const [result, setResult] = useState<null | number>(null);
    const [upperBound, setUpperBound] = useState<null | number>(null);
    const [lowerBound, setLowerBound] = useState<null | number>(null);
    const [typeOfData, setTypeOfData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reqPercentile, setReqPercentile] = useState<number | null>(null);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRank(e.target.value);
        setResult(null);
        setLowerBound(null);
        setUpperBound(null);
    };

    const handleSubmit = async () => {
        if (!rank) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('https://api.anmolcreates.tech/api/v1/getRank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ percentile : rank, year : 2024 }),
            });

            if (!response.ok) {
                setIsLoading(false);
                throw new Error(`Server responded with status ${response.status}`);
            }

            const dataObtained : any = await response.json();
            setIsLoading(false);

            setTypeOfData(dataObtained.data?.type);
            setReqPercentile(dataObtained.data?.requested_percentile || dataObtained.data?.data.percentile);
            if(dataObtained.data?.type === "range"){
                setUpperBound(dataObtained.data.upper_bound?.rank);
                setLowerBound(dataObtained.data.lower_bound?.rank);
            }else{
                setResult(dataObtained.data.data?.rank);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
        } 
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            padding: "0 20px",
            marginTop: "80px",
            marginBottom: "20px",
            minHeight: "calc(100vh - 100px)",
            gap: "18px",
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
                            Percentile to Rank
                        </span>
                        <br/>
                        <span style={{
                            color: "white",
                            fontWeight: "200",
                            fontSize: "16px",
                        }}>
                            Enter your percentile and get an estimated number for your rank.
                        </span>
                    </div>

                </div>
                <div className={Styles.container}>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                    }}>
                        <p style={{
                            color: "#989898",
                            fontSize: "12px",
                            fontWeight: "300",
                            marginRight: "10px",
                        }}>
                            This rank predictor uses previous year data to generate an output, actual ranks may vary depending on the total number of candidates in a given year.
                        </p>
                        <SingleInput
                            holder='Percentile'
                            value={rank}
                            onChange={handleInputChange}
                            type="number"
                        />
                        <Button
                            disabled={isLoading}
                            width={100}
                            text={'Calculate'}
                            variant={'Primary'}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
            {isLoading && <Loader />}
            {(result !== null || (lowerBound !== null && upperBound !== null)) && (
                <div className={Styles.results}>
                    {typeOfData === "range" ? (
                        <div className={Styles.range}>
                            <div className={Styles.infoL}>
                                <div className={Styles.infoLC}>
                                    <h3 className={Styles.header}>
                                        Returned ranks
                                    </h3>
                                    <p className={Styles.data}>
                                        Range
                                    </p>
                                </div>
                                <div className={Styles.infoLC}>
                                    <h3 className={Styles.header}>
                                        Requested Percentile
                                    </h3>
                                    <p className={Styles.data}>
                                        {reqPercentile}
                                    </p>
                                </div>
                            </div>
                            <div className={Styles.infoR}>
                                <div className={Styles.infoRC}>
                                    <span className={Styles.num}>
                                        {lowerBound}
                                    </span>
                                    <span className={Styles.desc}>
                                        Lower Bound
                                    </span>
                                </div>
                                <div className={Styles.infoRC}>
                                    <span className={Styles.num}>
                                        {upperBound}
                                    </span>
                                    <span className={Styles.desc}>
                                        Upper Bound
                                    </span>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className={Styles.range}>
                            <div className={Styles.infoL}>
                                <div className={Styles.infoLC}>
                                    <h3 className={Styles.header}>
                                        Returned ranks
                                    </h3>
                                    <p className={Styles.data}>
                                        Exact Match
                                    </p>
                                </div>
                                <div className={Styles.infoLC}>
                                    <h3 className={Styles.header}>
                                        Requested Percentile
                                    </h3>
                                    <p className={Styles.data}>
                                        {reqPercentile}
                                    </p>
                                </div>
                            </div>
                            <div className={Styles.infoR}>
                                <div style={{
                                    width: "100%",
                                }} className={Styles.infoRC}>
                                    <span className={Styles.num}>
                                        {result}
                                    </span>
                                    <span className={Styles.desc}>
                                        Rank
                                    </span>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}