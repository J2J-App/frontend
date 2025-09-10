"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './combobox.module.css';
import Image from 'next/image';
import arrow from '@/public/arrows2.svg';
import search from '@/public/search.svg';

type ComboboxOption = {
    value: string;
    label: string;
};

type ComboboxProps = {
    options: ComboboxOption[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
    multiSelect?: boolean;
};

export default function Combobox({
                                     options,
                                     defaultValue = [],
                                     onChange,
                                     placeholder = "Select a University...",
                                     searchable = true,
                                     multiSelect = true
                                 }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<ComboboxOption[]>(
        defaultValue ? options.filter(option => defaultValue.includes(option.value)) : []
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);

    const comboboxRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isInitialAnimation = useRef(true);

    // Filter options without triggering re-renders
    const filterOptions = useCallback((term: string) => {
        if (term) {
            return options.filter(option =>
                option.label.toLowerCase().includes(term.toLowerCase())
            );
        }
        return options;
    }, [options]);

    // Update filtered options without triggering animation
    useEffect(() => {
        if (isOpen) {
            const newFilteredOptions = filterOptions(searchTerm);
            setFilteredOptions(newFilteredOptions);

            // Only adjust height after the initial animation
            if (!isInitialAnimation.current && dropdownRef.current) {
                // Set height to auto immediately for content changes
                dropdownRef.current.style.height = 'auto';
            }
        }
    }, [searchTerm, isOpen, filterOptions]);

    const handleOptionClick = (option: ComboboxOption) => {
        // Calculate new selection first
        const newSelection = multiSelect
            ? selectedOptions.some(item => item.value === option.value)
                ? selectedOptions.filter(item => item.value !== option.value)
                : [...selectedOptions, option]
            : [option];

        // Update local state
        setSelectedOptions(newSelection);

        // Propagate changes to parent
        if (onChange) {
            onChange(newSelection.map(opt => opt.value));
        }

        // Handle focus and dropdown state
        if (multiSelect) {
            if (searchable && inputRef.current) {
                inputRef.current;
            }
        } else {
            closeDropdown();
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
        isInitialAnimation.current = true;

        // Reset search when opening
        setSearchTerm('');
        setFilteredOptions(options);

        // Focus on input if searchable
        setTimeout(() => {
            if (searchable && inputRef.current) {
                inputRef.current;
            }
        }, 10);
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
                setSearchTerm('');
            }, 300); // Match this with your CSS transition duration
        }
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
                // Once animation is complete, set to auto to handle content changes
                if (dropdownRef.current) {
                    dropdownRef.current.style.height = 'auto';
                    setIsAnimating(false);
                    isInitialAnimation.current = false;
                }
            }, 300); // Match this with your CSS transition duration
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
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
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            if (filteredOptions.length > 0) {
                const firstOption = filteredOptions[0];
                if (!multiSelect) {
                    setSelectedOptions([firstOption]);
                }
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getDisplayValue = () => {
        if (selectedOptions.length === 0) {
            return placeholder;
        } else if (selectedOptions.length === 1) {
            return selectedOptions[0].label;
        } else {
            return `${selectedOptions.length} items selected`;
        }
    };

    const isOptionSelected = (option: ComboboxOption) => {
        return selectedOptions.some(item => item.value === option.value);
    };

    return (
        <div
            className={styles.comboboxContainer}
            ref={comboboxRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <div
                className={`${styles.comboboxButton} ${isOpen ? styles.active : ''} ${isFocused ? styles.focus : ''}`}
                onClick={toggleDropdown}
            >
                <span className={styles.displayText}>
                    <span className={styles.dspTxt}>
                        {getDisplayValue()}
                    </span>
                </span>
                <div className={styles.arrowContainer}>
                    <Image
                        src={arrow}
                        alt="arrow"
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
                    {searchable && (
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchContainer}>
                                <div className={styles.searchIconContainer}>
                                    <Image
                                        src={search}
                                        alt="search"
                                        width={15}
                                        height={15}
                                        className={styles.searchIcon}
                                    />
                                </div>
                                <input
                                    ref={inputRef}
                                    type="search"
                                    className={styles.searchInput}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                    <div className={styles.dropdownContent}>
                        {filteredOptions.length === 0 ? (
                            <div className={styles.noResults}>No results found</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ''}`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}