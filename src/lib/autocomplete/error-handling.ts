/**
 * Error handling utilities for autocomplete functionality
 * Provides network error handling, timeout management, and error recovery mechanisms
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  API_ERROR = 'API_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AutocompleteError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  timestamp: number;
  retryable: boolean;
  fallbackAvailable: boolean;
}

export interface ErrorHandlerOptions {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  enableFallback: boolean;
}

export const DEFAULT_ERROR_OPTIONS: ErrorHandlerOptions = {
  timeout: 5000, // 5 seconds
  maxRetries: 2,
  retryDelay: 1000, // 1 second
  enableFallback: true
};

/**
 * Creates a standardized error object for autocomplete operations
 */
export function createAutocompleteError(
  type: ErrorType,
  message: string,
  originalError?: Error,
  retryable: boolean = true,
  fallbackAvailable: boolean = false
): AutocompleteError {
  return {
    type,
    message,
    originalError,
    timestamp: Date.now(),
    retryable,
    fallbackAvailable
  };
}

/**
 * Determines error type from various error conditions
 */
export function classifyError(error: Error | unknown): ErrorType {
  if (!error) {
    return ErrorType.UNKNOWN_ERROR;
  }

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
    return ErrorType.TIMEOUT_ERROR;
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return ErrorType.NETWORK_ERROR;
  }
  
  if (errorMessage.includes('api') || errorMessage.includes('server') || errorMessage.includes('response')) {
    return ErrorType.API_ERROR;
  }
  
  if (errorMessage.includes('cache') || errorMessage.includes('storage')) {
    return ErrorType.CACHE_ERROR;
  }
  
  return ErrorType.UNKNOWN_ERROR;
}

/**
 * Gets user-friendly error messages for different error types
 */
export function getErrorMessage(error: AutocompleteError): string {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return error.fallbackAvailable 
        ? 'Connection issue. Showing cached results.'
        : 'Unable to connect. Please check your internet connection.';
    
    case ErrorType.TIMEOUT_ERROR:
      return 'Search is taking longer than expected. Please try again.';
    
    case ErrorType.API_ERROR:
      return error.fallbackAvailable
        ? 'Service temporarily unavailable. Showing cached results.'
        : 'Unable to load suggestions. Please try again.';
    
    case ErrorType.CACHE_ERROR:
      return 'Unable to access cached data. Please refresh the page.';
    
    case ErrorType.UNKNOWN_ERROR:
    default:
      return error.fallbackAvailable
        ? 'Something went wrong. Showing cached results.'
        : 'Unable to load suggestions. Please try again.';
  }
}

/**
 * Determines if an error is retryable based on its type and retry count
 */
export function isRetryable(error: AutocompleteError, currentRetries: number, maxRetries: number): boolean {
  if (currentRetries >= maxRetries) {
    return false;
  }
  
  return error.retryable && (
    error.type === ErrorType.NETWORK_ERROR ||
    error.type === ErrorType.TIMEOUT_ERROR ||
    error.type === ErrorType.API_ERROR
  );
}

/**
 * Calculates retry delay with exponential backoff
 */
export function calculateRetryDelay(retryCount: number, baseDelay: number): number {
  return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max 10 seconds
}

/**
 * Timeout utility that wraps promises with timeout functionality
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(createAutocompleteError(
        ErrorType.TIMEOUT_ERROR,
        timeoutMessage,
        new Error(timeoutMessage),
        true,
        false
      ));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

/**
 * Retry utility with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<ErrorHandlerOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_ERROR_OPTIONS, ...options };
  let lastError: AutocompleteError | null = null;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await withTimeout(operation(), config.timeout);
    } catch (error) {
      const autocompleteError = error instanceof Error && 'type' in error && 'timestamp' in error && 'retryable' in error && 'fallbackAvailable' in error
        ? error as AutocompleteError
        : createAutocompleteError(
            classifyError(error),
            error instanceof Error ? error.message : 'Unknown error occurred',
            error instanceof Error ? error : undefined
          );
      
      lastError = autocompleteError;
      
      // Don't retry if error is not retryable or we've reached max retries
      if (!isRetryable(autocompleteError, attempt, config.maxRetries)) {
        break;
      }
      
      // Wait before retrying
      if (attempt < config.maxRetries) {
        const delay = calculateRetryDelay(attempt, config.retryDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Error recovery manager for handling fallback strategies
 */
export class ErrorRecoveryManager {
  private errorHistory: AutocompleteError[] = [];
  private readonly maxHistorySize = 10;
  
  /**
   * Records an error in the history
   */
  recordError(error: AutocompleteError): void {
    this.errorHistory.push(error);
    
    // Keep only recent errors
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }
  
  /**
   * Gets recent error patterns to determine recovery strategy
   */
  getRecentErrors(timeWindowMs: number = 60000): AutocompleteError[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.errorHistory.filter(error => error.timestamp > cutoff);
  }
  
  /**
   * Determines if the system should use fallback mode
   */
  shouldUseFallback(): boolean {
    const recentErrors = this.getRecentErrors();
    
    // Use fallback if we've had multiple errors in the last minute
    if (recentErrors.length >= 3) {
      return true;
    }
    
    // Use fallback if we've had network errors recently
    const networkErrors = recentErrors.filter(e => e.type === ErrorType.NETWORK_ERROR);
    if (networkErrors.length >= 2) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Clears error history
   */
  clearHistory(): void {
    this.errorHistory = [];
  }
  
  /**
   * Gets error statistics
   */
  getErrorStats() {
    const recentErrors = this.getRecentErrors();
    const errorCounts = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);
    
    return {
      totalErrors: recentErrors.length,
      errorsByType: errorCounts,
      shouldUseFallback: this.shouldUseFallback()
    };
  }
}

/**
 * Global error recovery manager instance
 */
export const globalErrorRecovery = new ErrorRecoveryManager();