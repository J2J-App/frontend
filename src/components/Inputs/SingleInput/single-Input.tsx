"use client"

import React from 'react';
import styles from './style.module.css';

export default function SingleInput({holder, width} : {holder: string, width?: number}) {
  return (
    <div className={styles.border}>
        <input type="text" className={styles.text} placeholder={holder} style={{width: width ? `${width}px` : '100%'}} />
        <div className={styles.outline}></div>
    </div>
  );
}