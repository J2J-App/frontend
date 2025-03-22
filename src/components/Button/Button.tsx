"use Client"

import React from 'react';
import styles from './button.module.css';

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: 'Primary' | 'Secondary';
  width?: number;
  height?: number;
};

export default function Button({
  text,
  onClick,
  variant,
  width,
  height
}: ButtonProps) {
  return (
    <div 
      className={`${styles.buttonContainer} ${variant ? styles[variant] : ''}`}
      style={{ 
        width: width ? `${width}px` : '90px', 
        height: height ? `${height}px` : '45px'
      }}
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
