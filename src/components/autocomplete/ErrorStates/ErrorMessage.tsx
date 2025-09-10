"use client"

import React from 'react';
import { AutocompleteError, getErrorMessage } from '@/lib/autocomplete/error-handling';
import styles from './style.module.css';

export interface ErrorMessageProps {
  error: AutocompleteError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  className = ''
}: ErrorMessageProps) {
  const errorMessage = getErrorMessage(error);
  const showRetryButton = error.retryable && onRetry;
  
  return (
    <div 
      className={`${styles.errorMessage} ${className}`}
      role="alert"
      aria-live="polite"
      data-testid="error-message"
    >
      <div className={styles.errorContent}>
        <div className={styles.errorIcon} aria-hidden="true">
          ⚠️
        </div>
        
        <div className={styles.errorText}>
          <span className={styles.errorTitle}>
            {error.fallbackAvailable ? 'Limited Results' : 'Error'}
          </span>
          <span className={styles.errorDescription}>
            {errorMessage}
          </span>
        </div>
        
        <div className={styles.errorActions}>
          {showRetryButton && (
            <button
              type="button"
              className={styles.retryButton}
              onClick={onRetry}
              aria-label="Retry loading suggestions"
            >
              Retry
            </button>
          )}
          
          {onDismiss && (
            <button
              type="button"
              className={styles.dismissButton}
              onClick={onDismiss}
              aria-label="Dismiss error message"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {error.fallbackAvailable && (
        <div className={styles.fallbackNotice}>
          Showing cached results from previous searches
        </div>
      )}
    </div>
  );
}