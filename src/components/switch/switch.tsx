"use client"

import React from 'react';
import styles from './switch.module.css';

type SwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Switch({ 
  checked = false, 
  onChange, 
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={styles.switch}>
        <input 
          className={styles.checked}
          type='checkbox'
          checked={checked}
          onChange={handleChange}
        />
        <span className={styles.slider}></span>
    </label>
  );
}