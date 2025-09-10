"use client"

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { UniversitySuggestion, CollegeSequence } from '@/lib/autocomplete/types';
import { processCollegeData } from '@/lib/autocomplete/data-processor';
import { filterAndRankSuggestions } from '@/lib/autocomplete/ranking';
import { useDebounce, useRequestCancellation, useKeyboardNavigation } from '@/lib/autocomplete/hooks';
import { useAutocompleteAccessibility, useAriaAttributes } from '@/lib/autocomplete/accessibility-hooks';
import { useIsMobile, useVirtualKeyboard, useOrientation } from '@/lib/autocomplete/mobile-hooks';
import { createAutocompleteCache } from '@/lib/autocomplete/cache';
import { useAutocompleteErrorManagement } from '@/lib/autocomplete/error-hooks';
import { AutocompleteError, ErrorType } from '@/lib/autocomplete/error-handling';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import SuggestionDropdown from '../SuggestionDropdown/SuggestionDropdown';
import ErrorMessage from '../ErrorStates/ErrorMessage';
import LoadingState from '../ErrorStates/LoadingState';
import styles from './style.module.css';

export interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (university: UniversitySuggestion) => void;
  placeholder: string;
  enabled?: boolean;
  universities: CollegeSequence;
  counselling: string;
  width?: number;
  maxSuggestions?: number;
  debounceDelay?: number;
}

// Create cache instance outside component to persist across re-renders
const suggestionCache = createAutocompleteCache<UniversitySuggestion[]>();

export default function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  enabled = true,
  universities,
  counselling,
  width,
  maxSuggestions = 10,
  debounceDelay = 300
}: AutocompleteInputProps) {
  // State management
  const [suggestions, setSuggestions] = useState<UniversitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  // Enhanced error management
  const cacheKey = `${counselling}-suggestions`;
  const errorManagementConfig = useMemo(() => ({
    timeout: 5000,
    maxRetries: 2,
    retryDelay: 1000,
    enableFallback: true
  }), []);
  const errorManagement = useAutocompleteErrorManagement<UniversitySuggestion[]>(cacheKey, errorManagementConfig);

  // Refs for DOM elements and focus management
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // Mobile detection and utilities
  const isMobile = useIsMobile();
  const { isVirtualKeyboardOpen } = useVirtualKeyboard();
  const orientation = useOrientation();

  // Performance hooks
  const debouncedQuery = useDebounce(value, isMobile ? debounceDelay + 100 : debounceDelay); // Longer delay on mobile
  const { createNewRequest } = useRequestCancellation();

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: UniversitySuggestion) => {
    onChange(suggestion.displayName);
    setIsOpen(false);

    // Focus back to input
    const input = containerRef.current?.querySelector('input');
    if (input) {
      input.focus();
    }

    // Call onSelect callback if provided
    if (onSelect) {
      onSelect(suggestion);
    }
  }, [onChange, onSelect]);

  // Handle autocomplete (Tab/Right arrow)
  const handleAutocomplete = useCallback((suggestion: UniversitySuggestion) => {
    onChange(suggestion.displayName);
    // Keep dropdown open and maintain focus
  }, [onChange]);

  // Handle dropdown close
  const handleDropdownClose = useCallback(() => {
    setIsOpen(false);
    // Focus back to input
    const input = containerRef.current?.querySelector('input');
    if (input) {
      input.focus();
    }
  }, []);

  // Keyboard navigation hook
  const {
    highlightedIndex,
    setHighlight,
    handleKeyDown: handleNavigationKeyDown
  } = useKeyboardNavigation(
    suggestions,
    isOpen,
    handleSuggestionSelect,
    handleAutocomplete,
    handleDropdownClose
  );

  // Process university data and fetch suggestions with comprehensive error handling
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      errorManagement.clearError();
      setIsTimeout(false);
      return;
    }

    // Check cache first
    const queryCacheKey = `${counselling}-${query.toLowerCase()}`;
    const cachedResults = suggestionCache.get(queryCacheKey);

    if (cachedResults) {
      setSuggestions(cachedResults);
      setIsOpen(true);
      errorManagement.clearError();
      setIsTimeout(false);
      return;
    }

    // Create new request to handle cancellation
    const { signal, isLatest } = createNewRequest();

    try {
      setIsLoading(true);
      setIsTimeout(false);
      errorManagement.clearError();

      // Set timeout indicator
      const timeoutTimer = setTimeout(() => {
        if (isLatest()) {
          setIsTimeout(true);
        }
      }, 3000); // Show timeout warning after 3 seconds

      // Create the suggestion fetching operation
      const fetchOperation = async (): Promise<UniversitySuggestion[]> => {
        // Check if request was cancelled
        if (signal.aborted) {
          throw new Error('Request cancelled');
        }

        // Simulate network delay and potential failures
        await new Promise(resolve => setTimeout(resolve, 100));

        // Simulate occasional network errors for testing
        if (Math.random() < 0.1 && process.env.NODE_ENV === 'development') {
          throw new Error('Simulated network error');
        }

        // Check if request is still latest
        if (!isLatest()) {
          throw new Error('Request superseded');
        }

        // Process university data
        const allSuggestions = processCollegeData(universities, counselling);

        // Filter and rank suggestions
        const rankedSuggestions = filterAndRankSuggestions(
          allSuggestions,
          query,
          { maxResults: maxSuggestions }
        );

        return rankedSuggestions;
      };

      // Execute with error handling and fallback
      const result = await errorManagement.handleOperation(
        fetchOperation,
        (suggestions) => {
          // Success callback
          suggestionCache.set(queryCacheKey, suggestions);
          setSuggestions(suggestions);
          setIsOpen(true);
        },
        (error) => {
          // Error callback - try to use fallback data
          const fallbackSuggestions = errorManagement.fallbackData;
          if (fallbackSuggestions && fallbackSuggestions.length > 0) {
            // Filter fallback data for current query
            const filteredFallback = filterAndRankSuggestions(
              fallbackSuggestions,
              query,
              { maxResults: maxSuggestions }
            );
            setSuggestions(filteredFallback);
            setIsOpen(true);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        }
      );

      clearTimeout(timeoutTimer);

    } catch (err) {
      if (!signal.aborted && isLatest()) {
        // Error is already handled by errorManagement.handleOperation
        console.warn('Suggestion fetch failed:', err);
      }
    } finally {
      if (isLatest()) {
        setIsLoading(false);
        setIsTimeout(false);
      }
    }
  }, [counselling, universities, maxSuggestions, createNewRequest, errorManagement]);

  // Effect to fetch suggestions when debounced query changes
  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear error when user starts typing
    if (errorManagement.error) {
      errorManagement.clearError();
    }
  }, [onChange, errorManagement]);

  // Handle suggestion highlight from mouse interactions
  const handleSuggestionHighlight = useCallback((index: number) => {
    setHighlight(index);
  }, [setHighlight]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Let the navigation hook handle the event
    const wasHandled = handleNavigationKeyDown(e);

    // Handle additional input-specific keys
    if (!wasHandled && e.key === 'Escape' && value && !isOpen) {
      // Clear input when dropdown is closed and there's text
      onChange('');
    }
  }, [handleNavigationKeyDown, value, isOpen, onChange]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0 && value.trim()) {
      setIsOpen(true);
    }

    // On mobile, scroll input into view when virtual keyboard opens
    if (isMobile && inputWrapperRef.current) {
      setTimeout(() => {
        inputWrapperRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300); // Delay to allow keyboard animation
    }
  }, [suggestions.length, value, isMobile]);

  // Handle input blur
  const handleInputBlur = useCallback((_e: React.FocusEvent<HTMLInputElement>) => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => {
      // Check if focus moved to dropdown or its children
      const activeElement = document.activeElement;
      const container = containerRef.current;

      if (!container || !container.contains(activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  }, []);

  // Handle keyboard events
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Tab key for autocompletion
    if (e.key === 'Tab' && isOpen && suggestions.length > 0 && highlightedIndex >= 0) {
      e.preventDefault();
      const suggestion = suggestions[highlightedIndex];
      if (suggestion) {
        handleAutocomplete(suggestion);
        return;
      }
    }

    // Handle other navigation keys
    handleNavigationKeyDown(e);
  }, [handleNavigationKeyDown, isOpen, suggestions, highlightedIndex, handleAutocomplete]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Handle both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle virtual keyboard and orientation changes on mobile
  useEffect(() => {
    if (!isMobile) return;

    // Adjust dropdown when virtual keyboard opens/closes or orientation changes
    if (isOpen && (isVirtualKeyboardOpen || orientation)) {
      // Force recalculation of dropdown position
      const timer = setTimeout(() => {
        // Trigger a re-render to recalculate positions
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 50);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMobile, isVirtualKeyboardOpen, orientation, isOpen]);

  // Cleanup cache periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      suggestionCache.cleanup();
    }, 60000); // Cleanup every minute

    return () => clearInterval(cleanup);
  }, []);

  // Handle retry operation
  const handleRetry = useCallback(async () => {
    if (debouncedQuery.trim()) {
      await fetchSuggestions(debouncedQuery);
    }
  }, [debouncedQuery, fetchSuggestions]);

  // Handle cancel operation
  const handleCancel = useCallback(() => {
    setIsLoading(false);
    setIsTimeout(false);
    errorManagement.clearError();
  }, [errorManagement]);

  // Generate unique IDs and ARIA attributes for accessibility
  const componentId = React.useId();
  const ariaAttributes = useAriaAttributes(
    componentId,
    isOpen,
    highlightedIndex,
    suggestions,
    errorManagement.error?.message
  );

  // Enhanced accessibility features
  const accessibility = useAutocompleteAccessibility(
    suggestions,
    highlightedIndex,
    isOpen,
    isLoading,
    errorManagement.error?.message || null
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.autocompleteContainer} ${isMobile ? styles.mobileContainer : ''}`}
      style={{ width: width ? `${width}px` : '100%' }}
    >
      <div
        ref={inputWrapperRef}
        className={`${styles.inputWrapper} ${isMobile ? styles.mobileInputWrapper : ''}`}
      >
        <div
          className={styles.inputContainer}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          <SingleInput
            holder={placeholder}
            value={value}
            onChange={handleInputChange}
            enabled={enabled}
            width={width}
            onKeyDown={handleInputKeyDown}
            {...ariaAttributes.inputAttributes}
            ref={accessibility.inputRef}
          />
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className={styles.loadingIndicator} aria-hidden="true">
            <div className={styles.spinner} />
          </div>
        )}
      </div>

      {/* Enhanced loading state */}
      {isLoading && (
        <LoadingState
          message="Loading suggestions..."
          timeout={isTimeout}
          onCancel={handleCancel}
          className={styles.loadingStateContainer}
        />
      )}

      {/* Enhanced error message */}
      {errorManagement.showError && errorManagement.error && (
        <ErrorMessage
          error={errorManagement.error}
          onRetry={errorManagement.error.retryable ? handleRetry : undefined}
          onDismiss={errorManagement.dismissError}
          className={styles.errorMessageContainer}
        />
      )}

      {/* Screen reader live region for announcements */}
      <div
        {...ariaAttributes.statusAttributes}
        className={styles.srOnly}
      >
        {isOpen && suggestions.length > 0 && (
          `${suggestions.length} ${suggestions.length === 1 ? 'suggestion' : 'suggestions'} available. Use arrow keys to navigate, Enter to select, Escape to close.`
        )}
        {isOpen && suggestions.length === 0 && debouncedQuery && !isLoading && (
          `No suggestions found for "${debouncedQuery}".`
        )}
        {isLoading && (
          'Loading suggestions...'
        )}
      </div>

      {/* Error announcements */}
      {ariaAttributes.errorAttributes && errorManagement.error && (
        <div
          {...ariaAttributes.errorAttributes}
          className={styles.srOnly}
        >
          {errorManagement.error.message}
        </div>
      )}

      {/* Suggestion dropdown */}
      <SuggestionDropdown
        suggestions={suggestions}
        isLoading={isLoading}
        highlightedIndex={highlightedIndex}
        onSelect={handleSuggestionSelect}
        onHighlight={handleSuggestionHighlight}
        query={debouncedQuery}
        isOpen={isOpen}
        inputRef={inputWrapperRef}
        error={errorManagement.error?.message || null}
        isTimeout={isTimeout}
        fallbackMode={errorManagement.error?.fallbackAvailable || false}
        dropdownId={ariaAttributes.dropdownId}
        componentId={componentId}
        ariaAttributes={ariaAttributes.dropdownAttributes}
        ref={accessibility.dropdownRef}
      />
    </div>
  );
}