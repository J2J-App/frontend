import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debouncing hook for input handling
 * Delays execution until after wait time has elapsed since the last invocation
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounced callback hook
 * Returns a debounced version of the callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Request cancellation utility hook
 * Provides utilities to cancel previous requests and prevent race conditions
 */
export function useRequestCancellation() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const createNewRequest = useCallback(() => {
    // Cancel any existing request
    cancelPreviousRequest();

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Generate unique request ID
    const requestId = ++requestIdRef.current;

    return {
      signal: abortControllerRef.current.signal,
      requestId,
      isLatest: () => requestId === requestIdRef.current
    };
  }, [cancelPreviousRequest]);

  const cleanup = useCallback(() => {
    cancelPreviousRequest();
    abortControllerRef.current = null;
    requestIdRef.current = 0;
  }, [cancelPreviousRequest]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    createNewRequest,
    cancelPreviousRequest,
    cleanup
  };
}

/**
 * Throttling hook
 * Limits the rate at which a function can be called
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        // Execute immediately
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else {
        // Schedule for later
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callbackRef.current(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [delay]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * Keyboard navigation hook for managing highlighted suggestion index
 * Handles arrow key navigation, Tab/Enter selection, and Escape handling
 */
export function useKeyboardNavigation<T>(
  suggestions: T[],
  isOpen: boolean,
  onSelect: (item: T) => void,
  onAutocomplete?: (item: T) => void,
  onClose?: () => void
) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasManuallySetHighlight, setHasManuallySetHighlight] = useState(false);

  // Reset highlighted index when suggestions change or dropdown closes
  useEffect(() => {
    if (!isOpen || suggestions.length === 0) {
      setHighlightedIndex(-1);
      setHasManuallySetHighlight(false);
    }
  }, [isOpen, suggestions.length]);

  // Auto-highlight first suggestion and adjust index if needed
  useEffect(() => {
    if (isOpen && suggestions.length > 0) {
      setHighlightedIndex(prevIndex => {
        // If no suggestion is highlighted and we haven't manually set highlight, auto-highlight first
        if (prevIndex === -1 && !hasManuallySetHighlight) {
          return 0;
        }
        // If highlighted index is beyond available suggestions, adjust it
        if (prevIndex >= suggestions.length) {
          return suggestions.length - 1;
        }
        return prevIndex;
      });
    }
  }, [suggestions.length, isOpen, hasManuallySetHighlight]);

  // Navigation functions
  const moveUp = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;

    setHighlightedIndex(prevIndex => {
      if (prevIndex <= 0) {
        // Wrap to last suggestion
        return suggestions.length - 1;
      }
      return prevIndex - 1;
    });
  }, [isOpen, suggestions.length]);

  const moveDown = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;

    setHighlightedIndex(prevIndex => {
      if (prevIndex >= suggestions.length - 1) {
        // Wrap to first suggestion
        return 0;
      }
      return prevIndex + 1;
    });
  }, [isOpen, suggestions.length]);

  const moveToFirst = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;
    setHighlightedIndex(0);
  }, [isOpen, suggestions.length]);

  const moveToLast = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;
    setHighlightedIndex(suggestions.length - 1);
  }, [isOpen, suggestions.length]);

  const selectHighlighted = useCallback(() => {
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      onSelect(suggestions[highlightedIndex]);
    }
  }, [highlightedIndex, suggestions, onSelect]);

  const autocompleteHighlighted = useCallback(() => {
    if (highlightedIndex >= 0 && suggestions[highlightedIndex] && onAutocomplete) {
      onAutocomplete(suggestions[highlightedIndex]);
    }
  }, [highlightedIndex, suggestions, onAutocomplete]);

  const closeDropdown = useCallback(() => {
    setHighlightedIndex(-1);
    setHasManuallySetHighlight(true); // Prevent auto-highlighting after escape
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Main keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      // Handle Escape when dropdown is closed
      if (e.key === 'Escape' && onClose) {
        onClose();
        return true; // Indicate event was handled
      }
      return false;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveDown();
        return true;

      case 'ArrowUp':
        e.preventDefault();
        moveUp();
        return true;

      case 'Home':
        e.preventDefault();
        moveToFirst();
        return true;

      case 'End':
        e.preventDefault();
        moveToLast();
        return true;

      case 'Tab':
      case 'ArrowRight':
        // Autocomplete with highlighted suggestion
        e.preventDefault();
        autocompleteHighlighted();
        return true;

      case 'Enter':
        // Select highlighted suggestion and execute search
        e.preventDefault();
        selectHighlighted();
        return true;

      case 'Escape':
        // Close dropdown and clear selection
        e.preventDefault();
        closeDropdown();
        return true;

      default:
        return false; // Event not handled
    }
  }, [
    isOpen,
    suggestions.length,
    moveDown,
    moveUp,
    moveToFirst,
    moveToLast,
    autocompleteHighlighted,
    selectHighlighted,
    closeDropdown,
    onClose
  ]);

  // Manual highlight control
  const setHighlight = useCallback((index: number) => {
    if (index === -1 || (index >= 0 && index < suggestions.length)) {
      setHighlightedIndex(index);
      setHasManuallySetHighlight(true);
    }
  }, [suggestions.length]);

  return {
    highlightedIndex,
    setHighlight,
    handleKeyDown,
    moveUp,
    moveDown,
    moveToFirst,
    moveToLast,
    selectHighlighted,
    autocompleteHighlighted,
    closeDropdown
  };
}

/**
 * Combined autocomplete performance hook
 * Combines debouncing, throttling, and request cancellation for optimal performance
 */
export function useAutocompletePerformance(delay: number = 300) {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, delay);
  const { createNewRequest, cancelPreviousRequest } = useRequestCancellation();

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const createRequest = useCallback(() => {
    return createNewRequest();
  }, [createNewRequest]);

  return {
    query,
    debouncedQuery,
    updateQuery,
    createRequest,
    cancelPreviousRequest
  };
}