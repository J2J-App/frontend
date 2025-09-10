import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  AutocompleteError, 
  ErrorRecoveryManager, 
  withRetry, 
  withTimeout,
  createAutocompleteError,
  classifyError,
  ErrorType,
  DEFAULT_ERROR_OPTIONS,
  ErrorHandlerOptions
} from './error-handling';

/**
 * Hook for managing autocomplete errors with recovery mechanisms
 */
export function useErrorHandling(options: Partial<ErrorHandlerOptions> = {}) {
  const [error, setError] = useState<AutocompleteError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const errorRecoveryRef = useRef(new ErrorRecoveryManager());
  const config = { ...DEFAULT_ERROR_OPTIONS, ...options };

  const recordError = useCallback((error: AutocompleteError) => {
    errorRecoveryRef.current.recordError(error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const retry = useCallback(async (operation: () => Promise<any>) => {
    if (!error || !error.retryable) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      const result = await withRetry(operation, config);
      clearError();
      return result;
    } catch (retryError) {
      const autocompleteError = retryError instanceof Error && 'type' in retryError && 'timestamp' in retryError && 'retryable' in retryError && 'fallbackAvailable' in retryError
        ? retryError as AutocompleteError
        : createAutocompleteError(
            classifyError(retryError),
            retryError instanceof Error ? retryError.message : 'Retry failed',
            retryError instanceof Error ? retryError : undefined
          );
      
      recordError(autocompleteError);
    } finally {
      setIsRetrying(false);
    }
  }, [error, config, recordError, clearError]);

  const shouldUseFallback = useCallback(() => {
    return errorRecoveryRef.current.shouldUseFallback();
  }, []);

  const getErrorStats = useCallback(() => {
    return errorRecoveryRef.current.getErrorStats();
  }, []);

  return {
    error,
    isRetrying,
    retryCount,
    recordError,
    clearError,
    retry,
    shouldUseFallback,
    getErrorStats
  };
}

/**
 * Hook for handling network operations with timeout and error recovery
 */
export function useNetworkOperation<T>(
  operation: () => Promise<T>,
  options: Partial<ErrorHandlerOptions> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  
  const { error, isRetrying, recordError, clearError, retry } = useErrorHandling(options);
  const config = { ...DEFAULT_ERROR_OPTIONS, ...options };
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const execute = useCallback(async (fallbackData?: T) => {
    setIsLoading(true);
    setIsTimeout(false);
    clearError();

    // Set timeout indicator
    timeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
    }, config.timeout * 0.8); // Show timeout warning at 80% of timeout

    try {
      const result = await withTimeout(operation(), config.timeout);
      setData(result);
      return result;
    } catch (operationError) {
      const autocompleteError = operationError instanceof Error && 'type' in operationError && 'timestamp' in operationError && 'retryable' in operationError && 'fallbackAvailable' in operationError
        ? operationError as AutocompleteError
        : createAutocompleteError(
            classifyError(operationError),
            operationError instanceof Error ? operationError.message : 'Operation failed',
            operationError instanceof Error ? operationError : undefined,
            true,
            !!fallbackData
          );
      
      recordError(autocompleteError);
      
      // Use fallback data if available
      if (fallbackData && autocompleteError.fallbackAvailable) {
        setData(fallbackData);
        return fallbackData;
      }
      
      throw autocompleteError;
    } finally {
      setIsLoading(false);
      setIsTimeout(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [operation, config, recordError, clearError]);

  const retryOperation = useCallback(async (fallbackData?: T) => {
    return retry(() => execute(fallbackData));
  }, [retry, execute]);

  const cancel = useCallback(() => {
    setIsLoading(false);
    setIsTimeout(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    execute,
    retryOperation,
    cancel,
    isLoading,
    isTimeout,
    isRetrying,
    data,
    error,
    clearError
  };
}

/**
 * Hook for managing cached fallback data
 */
export function useFallbackCache<T>(cacheKey: string) {
  const [fallbackData, setFallbackData] = useState<T | null>(null);
  const [hasFallback, setHasFallback] = useState(false);

  const updateFallback = useCallback((data: T) => {
    setFallbackData(data);
    setHasFallback(true);
    
    // Store in session storage for persistence
    try {
      sessionStorage.setItem(`autocomplete_fallback_${cacheKey}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Ignore storage errors
    }
  }, [cacheKey]);

  const getFallback = useCallback((): T | null => {
    if (fallbackData) {
      return fallbackData;
    }

    // Try to retrieve from session storage
    try {
      const stored = sessionStorage.getItem(`autocomplete_fallback_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const age = Date.now() - parsed.timestamp;
        
        // Use fallback if it's less than 1 hour old
        if (age < 3600000) {
          setFallbackData(parsed.data);
          setHasFallback(true);
          return parsed.data;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    return null;
  }, [cacheKey, fallbackData]);

  const clearFallback = useCallback(() => {
    setFallbackData(null);
    setHasFallback(false);
    
    try {
      sessionStorage.removeItem(`autocomplete_fallback_${cacheKey}`);
    } catch (e) {
      // Ignore storage errors
    }
  }, [cacheKey]);

  return {
    fallbackData: getFallback(),
    hasFallback,
    updateFallback,
    clearFallback
  };
}

/**
 * Hook for comprehensive autocomplete error management
 */
export function useAutocompleteErrorManagement<T>(
  cacheKey: string,
  options: Partial<ErrorHandlerOptions> = {}
) {
  const errorHandling = useErrorHandling(options);
  const fallbackCache = useFallbackCache<T>(cacheKey);
  const [showError, setShowError] = useState(false);

  const handleOperation = useCallback(async (
    operation: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: AutocompleteError) => void
  ) => {
    try {
      errorHandling.clearError();
      setShowError(false);
      
      const result = await withRetry(operation, { ...DEFAULT_ERROR_OPTIONS, ...options });
      
      // Update fallback cache with successful result
      fallbackCache.updateFallback(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const autocompleteError = error instanceof Error && 'type' in error && 'timestamp' in error && 'retryable' in error && 'fallbackAvailable' in error
        ? error as AutocompleteError
        : createAutocompleteError(
            classifyError(error),
            error instanceof Error ? error.message : 'Operation failed',
            error instanceof Error ? error : undefined,
            true,
            fallbackCache.hasFallback
          );
      
      // Mark error as having fallback if cache is available
      if (fallbackCache.hasFallback) {
        autocompleteError.fallbackAvailable = true;
      }
      
      errorHandling.recordError(autocompleteError);
      setShowError(true);
      
      if (onError) {
        onError(autocompleteError);
      }
      
      // Return fallback data if available
      if (fallbackCache.hasFallback) {
        return fallbackCache.fallbackData;
      }
      
      throw autocompleteError;
    }
  }, [errorHandling, fallbackCache, options]);

  const dismissError = useCallback(() => {
    setShowError(false);
    errorHandling.clearError();
  }, [errorHandling]);

  const retryWithFallback = useCallback(async (operation: () => Promise<T>) => {
    return errorHandling.retry(operation);
  }, [errorHandling]);

  return {
    ...errorHandling,
    ...fallbackCache,
    handleOperation,
    retryWithFallback,
    dismissError,
    showError
  };
}