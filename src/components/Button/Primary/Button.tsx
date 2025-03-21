"use Client"

import React from 'react';
import styles from './button.module.css';

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: 'primary';
  width?: number;
  hieght?: number;
};

export default function Button({
  text,
  onClick,
  variant,
  width,
  hieght
}: ButtonProps) {
  return (
    <div 
    className={styles.buttonContainer}
    style={{ 
      width: width ? `${width}px` : '90px', 
      height: hieght ? `${hieght}px` : '45px'}}
    >
      <button 
        onClick={onClick}
        className={`${styles.button} ${variant ? styles[variant] : ''}`}
      >
        {text}
      </button>
    </div>
  );
}
