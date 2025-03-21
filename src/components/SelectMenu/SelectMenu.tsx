"use client"

import React, { useState, useRef, useEffect } from 'react';
import styles from './selectMenu.module.css';
import Image from 'next/image';
import arrowDown from '@/public/arrow.svg';

type SelectOption = {
    value: string;
    label: string;
};

type SelectMenuProps = {
    options: SelectOption[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
};

export default function SelectMenu({
    options,
    defaultValue,
    onChange,
    placeholder = "Select"
}: SelectMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
        defaultValue ? options.find(option => option.value === defaultValue) || null : null
    );
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: SelectOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option.value);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Tab') {
            setIsOpen(false);
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            const currentIndex = selectedOption 
                ? options.findIndex(opt => opt.value === selectedOption.value) 
                : -1;
            const nextIndex = (currentIndex + 1) % options.length;
            setSelectedOption(options[nextIndex]);
        } else if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            const currentIndex = selectedOption 
                ? options.findIndex(opt => opt.value === selectedOption.value) 
                : options.length;
            const prevIndex = (currentIndex - 1 + options.length) % options.length;
            setSelectedOption(options[prevIndex]);
        }
    };

    return (
        <div 
            className={styles.selectContainer} 
            ref={selectRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <div 
                className={`${styles.selectButton} ${isOpen ? styles.active : ''} ${isFocused ? styles.focus : ''}`}
                onClick={toggleDropdown}
                style={{
                    borderBottomLeftRadius: isOpen ? 0 : 6,
                    borderBottomRightRadius: isOpen ? 0 : 6
                }}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={`${styles.arrowOuterContainer} ${isOpen ? styles.up : styles.down}`}>
                    {isOpen ? (
                        <div className={styles.arrowContainer}>
                            <Image src={arrowDown} alt="arrow-up" width={16} height={16} className={styles.arrow}/>
                        </div>
                    ) : (
                        <div className={styles.arrowContainer}>
                            <Image src={arrowDown} alt="arrow-up" width={16} height={16} className={styles.rotate}/>
                        </div>
                    )}
                </span>
            </div>
            {isOpen && (
                <div className={styles.dropdown}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}