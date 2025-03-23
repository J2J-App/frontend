"use client"

import { useState } from 'react'
import styles from "./accordion.module.css"
import Image from 'next/image'
import arrow from "@/public/arrow.svg"

type AccordionProps = {
  title: string;
  content: string;
  height?: number;
  width?: number;
}

export default function Accordion(
    {
        title,
        content,
        height,
        width
    }: AccordionProps){
    const [isOpen, setIsOpen] = useState(false)

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={styles.accodionContainer}
        style={{
            height : height ? `${height}px` : 'auto',
            width : width ? `${width}px` : '200px'
        }}>
            <div className={`${styles.accordionTitle} ${isOpen ? styles.active : ''} `} onClick={toggleAccordion}>
                <span className={styles.titleText}>{title}</span>
                <div className={styles.arrowContainer}>
                    <Image src={arrow} alt="arrow" className={styles.arrow} />
                </div>
            </div>
            {isOpen && <div className={styles.contentText}>
                {content}
            </div>}
        </div>
    )
}