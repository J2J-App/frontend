"use client"

import React from 'react';
import styles from './style.module.css';

export default function SingleInput({
                                        holder, type,
                                        width, value, onChange,
                                        ...props
                                    } : {
    type?: string,
    value?: string | number | undefined,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    holder: string,
    width?: number,
    props?: any[]
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // If type is number, prevent non-numeric input
        if (type === 'number') {
            // Remove any non-digit characters (except for negative sign and decimal point)
            const numericValue = e.target.value.replace(/[^0-9.-]/g, '');

            // Only update if the value is a valid number or empty
            if (numericValue === '' || !isNaN(Number(numericValue))) {
                onChange?.(({
                    ...e,
                    target: {
                        ...e.target,
                        value: numericValue
                    }
                } as React.ChangeEvent<HTMLInputElement>));
            }
        } else {
            // For non-number inputs, use the original onChange
            onChange?.(e);
        }
    };

    return (
        <div
            className={styles.border}
            style={{ width: width ? `unset` : "100%" }}
        >
            <input
                className={styles.text}
                placeholder={holder}
                onChange={handleChange}
                value={value}
                {...props}
                style={{width: width ? `${width}px` : '100%'}}
            />
            <div className={styles.outline}></div>
        </div>
    );
}