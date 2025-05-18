"use client"

import React from 'react';
import styles from './style.module.css';

export default function SingleInput({
                                        holder, type,
                                        width, value, onChange, enabled=true,
                                        ...props
                                    } : {
    type?: string,
    value?: string | number | undefined,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    holder: string,
    width?: number,
    enabled?: boolean,
    props?: any[]
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    };

    return (
        <div
            className={styles.border}
            style={{
                width: width ? `unset` : "100%",
                height: "38px",
                opacity: enabled ? 1 : 0.5,
                pointerEvents: enabled ? "all" : "none",
        }}
        >
            <input
                className={styles.text}
                placeholder={holder}
                onChange={handleChange}
                value={value}
                disabled={!enabled}
                {...props}
                style={{width: width ? `${width}px` : '100%', height: "38px"}}
            />
            <div className={styles.outline}></div>
        </div>
    );
}