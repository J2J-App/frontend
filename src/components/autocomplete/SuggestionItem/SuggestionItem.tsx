"use client"

import React from 'react';
import { UniversitySuggestion } from '@/lib/autocomplete/types';
import { normalizeText } from '@/lib/autocomplete/text-utils';
import { useIsMobile, useMobileSuggestionInteraction } from '@/lib/autocomplete/mobile-hooks';
import styles from './style.module.css';

export interface SuggestionItemProps {
  suggestion: UniversitySuggestion;
  isHighlighted: boolean;
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
  suggestionId: string;
  index: number;
  totalCount: number;
}

/**
 * Highlights matching parts of text by returning JSX elements
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);
  
  // Find the start index of the match (case insensitive)
  const matchIndex = normalizedText.indexOf(normalizedQuery);
  
  if (matchIndex === -1) return text;
  
  // Get the actual case-preserved match from original text
  const beforeMatch = text.substring(0, matchIndex);
  const match = text.substring(matchIndex, matchIndex + query.length);
  const afterMatch = text.substring(matchIndex + query.length);
  
  return (
    <>
      {beforeMatch}
      <mark className={styles.highlight}>{match}</mark>
      {afterMatch}
    </>
  );
}

export default function SuggestionItem({
  suggestion,
  isHighlighted,
  query,
  onClick,
  onMouseEnter,
  suggestionId,
  index,
  totalCount
}: SuggestionItemProps) {
  const isMobile = useIsMobile();
  
  // Mobile touch interaction handling
  const {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove
  } = useMobileSuggestionInteraction(onClick, onMouseEnter);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleMouseEnter = () => {
    // Only handle mouse enter on non-mobile devices to avoid conflicts with touch
    if (!isMobile) {
      onMouseEnter();
    }
  };

  // Prevent mouse down from stealing focus from input
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Enhanced keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={suggestionId}
      role="option"
      aria-selected={isHighlighted}
      aria-posinset={index + 1}
      aria-setsize={totalCount}
      aria-label={`${suggestion.displayName}, ${suggestion.type.toUpperCase()}, ${index + 1} of ${totalCount}`}
      className={`${styles.suggestionItem} ${isHighlighted ? styles.highlighted : ''} ${isMobile ? styles.mobileItem : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      tabIndex={isHighlighted ? 0 : -1}
      data-testid="suggestion-item"
      data-suggestion-id={suggestion.id}
    >
      <div className={styles.universityName}>
        {highlightText(suggestion.displayName, query)}
      </div>
      <div className={styles.universityType} aria-hidden="true">
        {suggestion.type.toUpperCase()}
      </div>
    </div>
  );
}