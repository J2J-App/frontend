"use client"

import React from 'react';
import styles from './style.module.css';

// added props so that we can add required props to the component

export default function SingleInput({
  holder, 
  width, 
  ...props
} : {holder: string, width?: number}) 
{
  return (
    <div className={styles.border}>
        <input 
          type="text" 
          className={styles.text} 
          placeholder={holder} 
          {...props}
          style={{width: width ? `${width}px` : '100%'}} 
        />
        <div className={styles.outline}></div>
    </div>
  );
}