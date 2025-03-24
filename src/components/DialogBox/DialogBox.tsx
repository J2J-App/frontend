"use client"

import React, { ReactNode, useEffect, useState } from 'react'
import styles from './dialogBox.module.css'

type DialogProps = {
  isOpen: boolean
  children: ReactNode
  onClose: () => void
}

export default function Dialog({ 
  isOpen, 
  children,
  onClose, 
}: DialogProps) {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div 
        className={`${styles.dialog} ${isOpen ? styles.open : styles.closing}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}