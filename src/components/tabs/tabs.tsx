"use client"

import React from "react"
import styles from "./tabs.module.css"

type Tab = {
  label: string
  content: React.ReactNode
}

type TabsProps = {
  tabs: Tab[],
    activeIndex: number,
    setActiveIndex: any
}   

export default function Tabs({
    tabs,
    activeIndex,
    setActiveIndex
}: TabsProps) {

    if (tabs.length === 0) {
        return <div>No data available</div>
    }
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