"use Client"

import React from 'react';
import styles from './button.module.css';

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: 'primary';
  width?: number;
};

export default function Button({
  text,
  onClick,
  variant,
  width
}: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.button} ${variant ? styles[variant] : ''}`}
      style={{ width: width ? `${width}px` : '100%' }}
    >
      {text}
    </button>
  );
}
