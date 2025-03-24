"use client"

import { useState, useRef, useEffect } from 'react'
import styles from "./accordion.module.css"
import Image from 'next/image'
import arrow from "@/public/arrow.svg"

type AccordionProps = {
    title: string;
    content: string;
    height?: string;
    width?: string;
}

export default function Accordion({
                                      title,
                                      content,
                                      height,
                                      width
                                  }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState(0)

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight)
        }
    }, [content])

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={styles.accodionContainer}
             style={{
                 height : height ? `${height}` : 'auto',
                 width : width ? `${width}` : '200px'
             }}>
            <div className={`${styles.accordionTitle} ${isOpen ? styles.active : ''}`} onClick={toggleAccordion}>
                <span className={styles.titleText}>{title}</span>
                <div className={styles.arrowContainer}>
                    <Image src={arrow} alt="arrow" className={styles.arrow} />
                </div>
            </div>
            <div
                ref={contentRef}
                className={`${styles.contentWrapper} ${isOpen ? styles.open : ''}`}
                style={{ maxHeight: isOpen ? `${contentHeight}px` : '0' }}
            >
                <div className={styles.contentText}>
                    {content}
                </div>
            </div>
        </div>
    )
}
