"use client"
import { useState } from 'react';
import styles from './Switch.module.css';

export default function Switch(){
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
        <label className={`${styles.switch}`}>
            <input className={`${styles.checked}`} type='checkbox'/>
            <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
        <label className={`${styles.switch}`}>
            <input className={`${styles.checked}`} type='checkbox'/>
            <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
    </div>
  );
};
