"use client"

import React from 'react';
import styles from './toaster.module.css';

type ToasterProps = {
  message: string;
  type: 'success' | 'error';
};

export default function Toaster({ message, type }: ToasterProps) {
  return (
    <div className={`${styles.toaster} ${styles[type]}`}>
      {message}
    </div>
  );
}