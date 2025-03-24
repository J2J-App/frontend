"use client"

import React, { useState } from 'react';
import RadioButton from './radio-button.tsx';
import styles from './radio-button.module.css';

type Option = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  name: string;
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export default function RadioGroup({ 
  name, 
  options, 
  defaultValue,
  onChange 
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          value={option.value}
          name={name}
          checked={selectedValue === option.value}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}