"use client"

import React, { useEffect, useRef } from 'react';
import { UniversitySuggestion } from '@/lib/autocomplete/types';
import { useIsMobile, useMobileDropdownPosition, useTouchInteraction } from '@/lib/autocomplete/mobile-hooks';
import SuggestionItem from '../SuggestionItem/SuggestionItem';
import styles from './style.module.css';

export interface SuggestionDropdownProps {
  suggestions: UniversitySuggestion[];
  isLoading: boolean;
  highlightedIndex: number;
  onSelect: (suggestion: UniversitySuggestion) => void;
  onHighlight: (index: number) => void;
  query: string;
  isOpen: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  error?: string | null;
  isTimeout?: boolean;
  fallbackMode?: boolean;
  dropdownId: string;
  componentId: string;
  ariaAttributes?: Record<string, any>;
}

const SuggestionDropdown = React.forwardRef<HTMLDivElement, SuggestionDropdownProps>(({
  suggestions,
  isLoading,
  highlightedIndex,
  onSelect,
  onHighlight,
  query,
  isOpen,
  inputRef,
  error,
  isTimeout,
  fallbackMode = false,
  dropdownId,
  componentId,
  ariaAttributes = {}
}, ref) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const highlightedItemRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mobile positioning
  const mobilePosition = useMobileDropdownPosition(
    inputRef || { current: null }, 
    dropdownRef, 
    isOpen
  );

  // Touch interaction handling
  const { handleTouchStart, handleTouchEnd, isScrolling } = useTouchInteraction();

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedItemRef.current && highlightedIndex >= 0) {
      // Check if scrollIntoView is available (not in test environment)
      if (typeof highlightedItemRef.current.scrollIntoView === 'function') {
        highlightedItemRef.current.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  // Keyboard navigation is now handled by the useKeyboardNavigation hook in the parent component

  // Handle mouse interactions
  const handleSuggestionClick = (suggestion: UniversitySuggestion) => {
    onSelect(suggestion);
  };

  const handleSuggestionMouseEnter = (index: number) => {
    // Only update highlight on mouse enter for non-mobile devices
    if (!isMobile) {
      onHighlight(index);
    }
  };

  // Prevent scroll-based selection issues
  const handleMouseMove = (e: React.MouseEvent) => {
    // Skip mouse move handling on mobile devices
    if (isMobile) return;

    // Only update highlight if mouse actually moved (not just scroll)
    const isMouseMoving = e.movementX !== 0 || e.movementY !== 0;

    if (isMouseMoving) {
      // Allow normal mouse enter behavior
      return;
    }

    // Prevent highlight changes during scroll
    e.preventDefault();
  };

  // Handle touch events for mobile
  const handleTouchStartWrapper = (e: React.TouchEvent) => {
    if (isMobile) {
      handleTouchStart(e);
    }
  };

  const handleTouchEndWrapper = (e: React.TouchEvent) => {
    if (isMobile) {
      handleTouchEnd();

      // Prevent accidental selection during scroll
      if (isScrolling(e)) {
        e.preventDefault();
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const suggestionCount = suggestions.length;

  // Calculate dynamic styles for mobile positioning
  const dynamicStyles: React.CSSProperties = isMobile ? {
    position: 'fixed',
    top: mobilePosition.direction === 'down' ? mobilePosition.top : undefined,
    bottom: mobilePosition.direction === 'up' ? mobilePosition.bottom : undefined,
    maxHeight: mobilePosition.maxHeight,
    left: inputRef?.current ? inputRef.current.getBoundingClientRect().left : 0,
    right: inputRef?.current ? window.innerWidth - inputRef.current.getBoundingClientRect().right : 0,
    zIndex: 9999
  } : {};

  return (
    <div
      ref={(node) => {
        dropdownRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      {...ariaAttributes}
      className={`${styles.dropdown} ${isMobile ? styles.mobileDropdown : ''}`}
      style={dynamicStyles}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStartWrapper}
      onTouchEnd={handleTouchEndWrapper}
      data-testid="suggestion-dropdown"
    >
      {isLoading && (
        <div className={styles.loadingState} role="status" aria-live="polite">
          <div className={styles.loadingSpinner} />
          <span>
            {isTimeout ? 'This is taking longer than expected...' : 'Loading suggestions...'}
          </span>
        </div>
      )}

      {error && !isLoading && (
        <div className={styles.errorState} role="alert" aria-live="polite">
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && suggestions.length === 0 && query && (
        <div className={styles.emptyState} role="status" aria-live="polite">
          <span>No universities found matching "{query}"</span>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className={styles.suggestionsList}>
          {fallbackMode && (
            <div className={styles.fallbackNotice} role="status">
              <span className={styles.fallbackIcon}>📋</span>
              <span>Showing cached results</span>
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              ref={index === highlightedIndex ? highlightedItemRef : null}
              id={`suggestion-${componentId}-${index}`}
            >
              <SuggestionItem
                suggestion={suggestion}
                isHighlighted={index === highlightedIndex}
                query={query}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => handleSuggestionMouseEnter(index)}
                suggestionId={`suggestion-${componentId}-${index}`}
                index={index}
                totalCount={suggestionCount}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SuggestionDropdown.displayName = 'SuggestionDropdown';

export default SuggestionDropdown;