"use client";

import React from "react";
import "./styles.css";

export default function InputT({ holder }: { holder: string }) {
  return (
    <div className="text-containerT">
      <input type="textT" className="textT" placeholder={holder} />
    </div>
  );
}