"use client"

import React, { useState } from 'react';
import styles from './radio-button.module.css';

type RadioButtonProps = {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export default function RadioButton({ 
  label, 
  value, 
  name, 
  checked, 
  onChange 
}: RadioButtonProps) {
  const [, setIsHovered] = useState(false);
  const [, setIsFocused] = useState(false);

  const handleChange = () => {
    onChange(value);
  };

  return (
    <label 
      className={styles.radioContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={styles.radioInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span className={`
        ${styles.radioButton} 
        ${checked ? styles.selected : ''} 
      `}></span>
      <span className={styles.radioLabel}>{label}</span>
    </label>
  );
}