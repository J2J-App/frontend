"use client"

import React from 'react';
import styles from './style.module.css';

interface SingleInputProps {
    type?: string,
    value?: string | number | undefined,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    holder: string,
    width?: number,
    enabled?: boolean,
    props?: any[]
}

const SingleInput = React.forwardRef<HTMLInputElement, SingleInputProps>(({
    holder, type,
    width, value, onChange, onKeyDown, enabled = true,
    ...props
}, ref) => {
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
                ref={ref}
                className={styles.text}
                placeholder={holder}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                value={value}
                disabled={!enabled}
                {...props}
                style={{width: width ? `${width}px` : '100%', height: "38px"}}
            />
            <div className={styles.outline}></div>
        </div>
    );
});

SingleInput.displayName = 'SingleInput';

export default SingleInput;