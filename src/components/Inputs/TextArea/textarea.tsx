"use client";

import React from "react";
import styles from "./styles.module.css";

export default function TextArea({ holder }: { holder: string }) {
  return (
    <div className="textContainerT">
      <textarea className={styles.textT} placeholder={holder} />
    </div>
  );
}