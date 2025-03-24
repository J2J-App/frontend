"use Client"

import React from 'react';
import styles from './button.module.css';
import Link from "next/link";

type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: 'Primary' | 'Secondary' | 'Outline' | 'Danger' | 'Link';
  width?: number;
  height?: number;
  to?: string;
  newTab?: boolean;
};

export default function Button({
  text,
  onClick,
  variant,
  width,
  height, to, newTab,
}: ButtonProps) {
  return (
    <div 
      className={`${styles.buttonContainer} ${variant ? styles[variant] : ''}`}
      style={{ 
        width: width ? `${width}px` : '90px', 
        height: height ? `${height}px` : '35px'
      }}
    >
      {variant!="Link" ? <button
          onClick={onClick}
          className={`${styles.button} ${variant ? styles[variant] : ''}`}
      >
        <span style={{
          zIndex: "5"
        }}>
          {text}
        </span>
      </button> : <Link
          className={`${styles.button} ${variant ? styles[variant] : ''}`}
          href={to ? to : "/"} target={newTab ? "_blank" : ""}>
            {text}
      </Link>}
    </div>
  );
}
