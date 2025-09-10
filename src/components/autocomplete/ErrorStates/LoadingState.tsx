"use client"

import React from 'react';
import styles from './style.module.css';

export interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  timeout?: boolean;
  onCancel?: () => void;
  className?: string;
}

export default function LoadingState({
  message = 'Loading suggestions...',
  showSpinner = true,
  timeout = false,
  onCancel,
  className = ''
}: LoadingStateProps) {
  return (
    <div 
      className={`${styles.loadingState} ${timeout ? styles.timeoutState : ''} ${className}`}
      role="status"
      aria-live="polite"
      data-testid="loading-state"
    >
      <div className={styles.loadingContent}>
        {showSpinner && (
          <div className={styles.loadingSpinner} aria-hidden="true">
            <div className={styles.spinner} />
          </div>
        )}
        
        <div className={styles.loadingText}>
          <span className={styles.loadingMessage}>
            {timeout ? 'This is taking longer than expected...' : message}
          </span>
          
          {timeout && (
            <span className={styles.timeoutHint}>
              Please check your connection or try again
            </span>
          )}
        </div>
        
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            aria-label="Cancel loading"
          >
            Cancel
          </button>
        )}
      </div>
      
      {/* Screen reader announcement */}
      <div className={styles.srOnly}>
        {timeout ? 'Loading is taking longer than expected' : 'Loading suggestions'}
      </div>
    </div>
  );
}