"use client"

import React from 'react';
import styles from './radio-button.module.css';

type RadioButtonProps = {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: any
};

export default function RadioButton({ 
  label, 
  value, 
  name, 
  checked, 
  onChange 
}: RadioButtonProps) {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label 
      className={styles.radioContainer}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={styles.radioInput}
        onFocus={() => {}}
        onBlur={() => {}}
      />
      <span className={`
        ${styles.radioButton} 
        ${checked ? styles.selected : ''} 
      `}></span>
      <span className={styles.radioLabel}>{label}</span>
    </label>
  );
}