"use client"

import React, { useState, useRef, useEffect } from 'react';
import styles from './rank-selector.module.css';
import Image from 'next/image';
import arrow from '@/public/arrows2.svg';
import SingleInput from "@/components/Inputs/SingleInput/singleInput.tsx";

type RangeSelectorProps = {
    onChange?: (range: { min: number | null, max: number | null }) => void;
    defaultValue?: { min?: number | null, max?: number | null };
    placeholder?: string;
};

export default function RangeSelector({
                                          onChange,
                                          defaultValue = { min: null, max: null },
                                          placeholder = "Select a range..."
                                      }: RangeSelectorProps) {
    // States
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [range, setRange] = useState({
        min: defaultValue.min !== undefined ? defaultValue.min : null,
        max: defaultValue.max !== undefined ? defaultValue.max : null
    });
    const [minInputValue, setMinInputValue] = useState(
        range.min !== null ? range.min.toString() : ''
    );
    const [maxInputValue, setMaxInputValue] = useState(
        range.max !== null ? range.max.toString() : ''
    );
    const [isFocused, setIsFocused] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isInitialAnimation = useRef(true);

    // Toggle dropdown functionality
    const toggleDropdown = () => {
        if (isAnimating) return;

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    // Open dropdown with animation
    const openDropdown = () => {
        setIsAnimating(true);
        setIsOpen(true);
        isInitialAnimation.current = true;
    };

    // Close dropdown with animation
    const closeDropdown = () => {
        setIsAnimating(true);
        if (dropdownRef.current) {
            dropdownRef.current.style.height = `${dropdownRef.current.scrollHeight}px`;
            // Force reflow
            dropdownRef.current.offsetHeight;
            dropdownRef.current.style.height = '0';
            dropdownRef.current.style.opacity = '0';
            dropdownRef.current.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                setIsOpen(false);
                setIsAnimating(false);
            }, 300);
        }
    };

    // Handle input changes
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setMinInputValue(inputValue);

        const numValue = inputValue === '' ? null : Number(inputValue);
        setRange(prev => {
            const newRange = { ...prev, min: numValue };
            if (onChange) onChange(newRange);
            return newRange;
        });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setMaxInputValue(inputValue);

        const numValue = inputValue === '' ? null : Number(inputValue);
        setRange(prev => {
            const newRange = { ...prev, max: numValue };
            if (onChange) onChange(newRange);
            return newRange;
        });
    };

    // Set initial height when dropdown opens
    useEffect(() => {
        if (isOpen && dropdownRef.current && isInitialAnimation.current) {
            // Start with height 0
            dropdownRef.current.style.height = '0';
            dropdownRef.current.style.opacity = '0';

            // Force reflow
            dropdownRef.current.offsetHeight;

            // Animate to full height
            const height = dropdownRef.current.scrollHeight;
            dropdownRef.current.style.height = `${height}px`;
            dropdownRef.current.style.opacity = '1';
            dropdownRef.current.style.transform = 'translateY(0)';

            setTimeout(() => {
                if (dropdownRef.current) {
                    dropdownRef.current.style.height = 'auto';
                    setIsAnimating(false);
                    isInitialAnimation.current = false;
                }
            }, 300);
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (isOpen) closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isOpen) {
            toggleDropdown();
        } else if (e.key === 'Escape') {
            closeDropdown();
        } else if (e.key === 'Tab') {
            if (isOpen) closeDropdown();
        }
    };

    // Display value text
    const getDisplayValue = () => {
        if (range.min === null && range.max === null) {
            return placeholder;
        } else if (range.min !== null && range.max !== null) {
            return `${range.min} - ${range.max}`;
        } else if (range.min !== null) {
            return `Min: ${range.min}`;
        } else {
            return `Max: ${range.max}`;
        }
    };

    return (
        <div
            className={styles.comboboxContainer}
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <div
                className={`${styles.comboboxButton} ${isOpen ? styles.active : ''} ${isFocused ? styles.focus : ''}`}
                onClick={toggleDropdown}
            >
                <span className={styles.displayText}>{getDisplayValue()}</span>
                <div className={styles.arrowContainer}>
                    <Image
                        src={arrow}
                        alt="Expand dropdown"
                        width={16}
                        height={16}
                        className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
                    />
                </div>
            </div>
            {isOpen && (
                <div
                    className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}
                    ref={dropdownRef}
                >
                    <div className={styles.rangeContainer}>
                        <div className={styles.rangeInputGroup}>
                            <label className={styles.rangeLabel}>Min</label>
                            <SingleInput
                                holder="Enter minimum value"
                                value={minInputValue}
                                onChange={handleMinChange}
                                type="number"
                            />
                        </div>
                        <div className={styles.rangeInputGroup}>
                            <label className={styles.rangeLabel}>Max</label>
                            <SingleInput
                                holder="Enter maximum value"
                                value={maxInputValue}
                                onChange={handleMaxChange}
                                type="number"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
