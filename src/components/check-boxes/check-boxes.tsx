"use client"

import React from 'react';
import styles from './check-boxes.module.css';
import Image from "next/image";
import checkmark from "@/public/checkmark.svg"

type CheckBoxesProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
};

export default function Checkbox({
    checked = false,
    onChange,
    label
}: CheckBoxesProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    return (
        <label className={styles.checkboxContainer}>
            <div className={styles.checkboxWrapper}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked}
                    onChange={handleChange}
                />
                <div className={styles.checkbox}></div>
                <Image className={styles.checkmark} src={checkmark} alt="" width={10}/>

            </div>
            {label && <span className={styles.label}>{label}</span>}

        </label>
    );
}