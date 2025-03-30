"use client";

import { useState, ChangeEvent } from 'react';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Button from '@/components/buttons/button.tsx';
import Styles from './styles.module.css';

export default function Page() {
    const [rank, setRank] = useState<string>('');
    const [result, setResult] = useState<null | number>(null);
    const [upperBound, setUpperBound] = useState<null | number>(null);
    const [lowerBound, setLowerBound] = useState<null | number>(null);
    const [typeOfData, setTypeOfData] = useState<string | null>(null);

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
            const response = await fetch('https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getRank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ percentile : rank, year : 2024 }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const dataObtained : any = await response.json();
            setTypeOfData(dataObtained.data?.type);

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
        <div className={Styles.container}>
            <h1 className={Styles.title}>Percentile to Rank</h1>
            <SingleInput 
                holder='Rank'
                value={rank}
                onChange={handleInputChange}
                type="number" 
            />
            <Button
                text={'Calculate'}
                variant={'Primary'}
                onClick={handleSubmit}
            />
            
            {(result !== null || (lowerBound !== null && upperBound !== null)) && (
                <div className={Styles.result}>
                    {typeOfData === "range" ? (
                        <div className={Styles.range}>
                            <p>Lower Bound: {lowerBound}</p>
                            <p>Upper Bound: {upperBound}</p>
                        </div>
                    ) : (
                        <p>Rank: {result}</p>
                    )}
                </div>
            )}
        </div>
    );
}