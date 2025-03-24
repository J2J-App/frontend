"use client"

import React from "react"
import styles from "./tabs.module.css"

type Tab = {
  label: string
  content: React.ReactNode
}

type TabsProps = {
  tabs: Tab[]
}   

export default function Tabs({
    tabs
}: TabsProps) {
    const [activeIndex, setActiveIndex] = React.useState(0)
    return (
        <div className={styles.tabs}>
            <div className={styles.tabLabels}>
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        className={`${styles.tabLabel} ${index === activeIndex ? styles.active : ""}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <span className={styles.labelText}>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className={styles.tabContent}>
                {tabs[activeIndex].content}
            </div>
        </div>
    )
}