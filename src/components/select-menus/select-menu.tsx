"use client"

import React, {useState, useRef, useEffect, use} from 'react';
import styles from './select-menu.module.css';
import Image from 'next/image';
import arrowDown from '@/public/arrow.svg';

export type SelectOption = {
    value: string;
    label: string;
};

type SelectMenuProps = {
    options: SelectOption[];
    defaultValue?: string | null;
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
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
        defaultValue ? options.find(option => option.value === defaultValue) || null : null
    );
    useEffect(() => {
        if (defaultValue) {
            const foundOption = options.find(option => option.value === defaultValue);
            setSelectedOption(foundOption || null);
        }
    }, [defaultValue]);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: SelectOption) => {
        setSelectedOption(option);
        closeDropdown();
        if (onChange) {
            onChange(option.value);
        }
    };

    const toggleDropdown = () => {
        if (isAnimating) return;

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    const openDropdown = () => {
        setIsAnimating(true);
        setIsOpen(true);
    };

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
            }, 300); // Match this with your CSS transition duration
        }
    };

    // Set initial height when dropdown opens
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
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
                // Once animation is complete, set to auto to handle content changes
                if (dropdownRef.current) {
                    dropdownRef.current.style.height = 'auto';
                    setIsAnimating(false);
                }
            }, 300); // Match this with your CSS transition duration
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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
        if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
        } else if (e.key === 'Escape') {
            closeDropdown();
        } else if (e.key === 'Tab') {
            if (isOpen) closeDropdown();
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
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <div className={styles.arrowContainer}>
                    <Image
                        src={arrowDown}
                        alt="Expand dropdown"
                        width={13}
                        height={13}
                        className={styles.rotate}
                    />
                </div>
            </div>
            {isOpen && (
                <div
                    className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}
                    ref={dropdownRef}
                >
                    <div className={styles.dropdownContent}>
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
                </div>
            )}
        </div>
    );
}