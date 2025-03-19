"use client"

import React from 'react';
import styles from './style.module.css';

export default function SingleInput({holder} : {holder: string}) {
  return (
    <div className={styles.border}>
        <input type="text" className={styles.text} placeholder={holder} />
        <div className={styles.outline}>

        </div>
    </div>
  );
}