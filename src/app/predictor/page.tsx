"use client";
import React from 'react';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Styles from './styles.module.css';

export default function Page() {
    const [rank, setRank] = React.useState< number | null>(null);
    const [region, setRegion] = React.useState<string >("Delhi");
    const [catogory, setCategory] = React.useState<string | null>(null);


    return (
        <div className={Styles.container}>
        <SingleInput 
            holder='Rank'
        />
        </div>
    );
}