"use client";

import React from "react";
import styles from "./styles.module.css";

export default function TextArea({ holder, width, height, wrap = true }: { holder: string, width?: number, height: number, wrap?: boolean }) {
  return (
    <div className={styles.textContainerT}>
      <textarea className={styles.textT} placeholder={holder} wrap={wrap ? "soft" : "off"} style={{ width: width ? `${width}px` : '100%', height: `${height*34}px` }} />
    </div>
  );
}