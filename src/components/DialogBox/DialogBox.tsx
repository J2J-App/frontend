"use client"

import React, {ReactNode } from 'react'
import styles from './dialogBox.module.css'

type DialogProps = {
  isOpen: boolean
  children: ReactNode
}

export default function Dialog({ 
  isOpen, 
  children, 
}: DialogProps) {

  if (!isOpen) return null

  return (
      <div 
        className={`${styles.dialog} ${isOpen ? styles.open : styles.closing}`}
        id='unblurred'
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.content}>
          {children}
        </div>
      </div>
  )
}