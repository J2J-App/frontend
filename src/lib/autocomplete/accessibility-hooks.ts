/**
 * React hooks for accessibility features in the autocomplete component
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import {
  announceToScreenReader,
  generateNavigationDescription,
  generateSuggestionCountDescription,
  FocusManager,
  setupKeyboardUserDetection,
  ScreenReaderHelpers,
  HighContrastHelpers,
  MotionHelpers
} from './accessibility-utils';

/**
 * Hook for managing screen reader announcements
 */
export function useScreenReaderAnnouncements() {
  const lastAnnouncementRef = useRef<string>('');
  const announcementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const announce = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite',
    debounceMs: number = 500
  ) => {
    // Avoid duplicate announcements
    if (message === lastAnnouncementRef.current) return;

    // Clear previous timeout
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    // Debounce announcements
    announcementTimeoutRef.current = setTimeout(() => {
      announceToScreenReader(message, priority);
      lastAnnouncementRef.current = message;
    }, debounceMs);
  }, []);

  const announceNavigation = useCallback((
    currentIndex: number,
    totalCount: number,
    suggestionName: string
  ) => {
    const message = generateNavigationDescription(currentIndex, totalCount, suggestionName);
    announce(message, 'polite', 200); // Shorter debounce for navigation
  }, [announce]);

  const announceSuggestionCount = useCallback((count: number) => {
    const message = generateSuggestionCountDescription(count);
    announce(message, 'polite');
  }, [announce]);

  const announceError = useCallback((errorMessage: string) => {
    announce(`Error: ${errorMessage}`, 'assertive');
  }, [announce]);

  const announceLoading = useCallback((isLoading: boolean) => {
    if (isLoading) {
      announce('Loading suggestions...', 'polite');
    }
  }, [announce]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, []);

  return {
    announce,
    announceNavigation,
    announceSuggestionCount,
    announceError,
    announceLoading
  };
}

/**
 * Hook for managing focus in the autocomplete component
 */
export function useAutocompleteFocus() {
  const focusManager = FocusManager.getInstance();
  const containerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const focusFirstSuggestion = useCallback(() => {
    if (dropdownRef.current) {
      const firstSuggestion = dropdownRef.current.querySelector('[role="option"]') as HTMLElement;
      if (firstSuggestion) {
        focusManager.moveFocus(firstSuggestion);
      }
    }
  }, [focusManager]);

  const restoreFocus = useCallback(() => {
    focusManager.restoreFocus();
  }, [focusManager]);

  const trapFocusInDropdown = useCallback(() => {
    if (dropdownRef.current) {
      return focusManager.trapFocus(dropdownRef.current);
    }
    return () => { };
  }, [focusManager]);

  // Setup keyboard user detection
  useEffect(() => {
    const cleanup = setupKeyboardUserDetection();
    return cleanup;
  }, []);

  return {
    containerRef,
    inputRef,
    dropdownRef,
    focusInput,
    focusFirstSuggestion,
    restoreFocus,
    trapFocusInDropdown
  };
}

/**
 * Hook for accessibility preferences detection
 */
export function useAccessibilityPreferences() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Setup high contrast detection
    const cleanupHighContrast = HighContrastHelpers.setupHighContrastDetection(setIsHighContrast);

    // Setup reduced motion detection
    const cleanupReducedMotion = MotionHelpers.setupReducedMotionDetection(setPrefersReducedMotion);

    // Check for screen reader
    setIsScreenReaderActive(ScreenReaderHelpers.isScreenReaderActive());

    return () => {
      cleanupHighContrast();
      cleanupReducedMotion();
    };
  }, []);

  return {
    isHighContrast,
    prefersReducedMotion,
    isScreenReaderActive
  };
}

/**
 * Hook for comprehensive autocomplete accessibility
 */
export function useAutocompleteAccessibility(
  suggestions: any[],
  highlightedIndex: number,
  isOpen: boolean,
  isLoading: boolean,
  error: string | null
) {
  const announcements = useScreenReaderAnnouncements();
  const focus = useAutocompleteFocus();
  const preferences = useAccessibilityPreferences();

  // Announce suggestion count changes
  useEffect(() => {
    if (isOpen && !isLoading) {
      announcements.announceSuggestionCount(suggestions.length);
    }
  }, [suggestions.length, isOpen, isLoading, announcements]);

  // Announce navigation changes
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      const suggestion = suggestions[highlightedIndex];
      const suggestionName = suggestion.displayName || suggestion.name || String(suggestion);
      announcements.announceNavigation(highlightedIndex, suggestions.length, suggestionName);
    }
  }, [highlightedIndex, suggestions, isOpen, announcements]);

  // Announce loading state
  useEffect(() => {
    announcements.announceLoading(isLoading);
  }, [isLoading, announcements]);

  // Announce errors
  useEffect(() => {
    if (error) {
      announcements.announceError(error);
    }
  }, [error, announcements]);

  return {
    ...announcements,
    ...focus,
    ...preferences
  };
}

/**
 * Hook for ARIA attributes generation
 */
export function useAriaAttributes(
  componentId: string,
  isOpen: boolean,
  highlightedIndex: number,
  suggestions: any[],
  error?: string | null
) {
  const inputId = `autocomplete-input-${componentId}`;
  const dropdownId = `autocomplete-dropdown-${componentId}`;
  const statusId = `autocomplete-status-${componentId}`;
  const errorId = error ? `autocomplete-error-${componentId}` : undefined;

  const activeDescendant = highlightedIndex >= 0 && suggestions.length > 0
    ? `suggestion-${componentId}-${highlightedIndex}`
    : undefined;

  const describedBy = [statusId, errorId].filter(Boolean).join(' ');

  const inputAttributes = {
    id: inputId,
    role: 'combobox' as const,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox' as const,
    'aria-owns': isOpen ? dropdownId : undefined,
    'aria-activedescendant': activeDescendant,
    'aria-autocomplete': 'list' as const,
    'aria-describedby': describedBy || undefined,
    'aria-label': `Search field. ${isOpen ? `${suggestions.length} suggestions available.` : ''} Use arrow keys to navigate suggestions.`
  };

  const dropdownAttributes = {
    id: dropdownId,
    role: 'listbox' as const,
    'aria-label': `Suggestions, ${suggestions.length} ${suggestions.length === 1 ? 'result' : 'results'} available`
  };

  const statusAttributes = {
    id: statusId,
    'aria-live': 'polite' as const,
    'aria-atomic': true,
    role: 'status' as const
  };

  const errorAttributes = errorId ? {
    id: errorId,
    'aria-live': 'assertive' as const,
    role: 'alert' as const
  } : undefined;

  return {
    inputId,
    dropdownId,
    statusId,
    errorId,
    activeDescendant,
    inputAttributes,
    dropdownAttributes,
    statusAttributes,
    errorAttributes
  };
}

/**
 * Hook for keyboard navigation with accessibility enhancements
 */
export function useAccessibleKeyboardNavigation(
  suggestions: any[],
  isOpen: boolean,
  onSelect: (item: any) => void,
  onAutocomplete?: (item: any) => void,
  onClose?: () => void
) {
  const announcements = useScreenReaderAnnouncements();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Enhanced navigation with announcements
  const moveUp = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;

    setHighlightedIndex(prevIndex => {
      const newIndex = prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1;

      // Announce navigation
      if (suggestions[newIndex]) {
        const suggestionName = suggestions[newIndex].displayName || suggestions[newIndex].name || String(suggestions[newIndex]);
        announcements.announceNavigation(newIndex, suggestions.length, suggestionName);
      }

      return newIndex;
    });
  }, [isOpen, suggestions, announcements]);

  const moveDown = useCallback(() => {
    if (!isOpen || suggestions.length === 0) return;

    setHighlightedIndex(prevIndex => {
      const newIndex = prevIndex >= suggestions.length - 1 ? 0 : prevIndex + 1;

      // Announce navigation
      if (suggestions[newIndex]) {
        const suggestionName = suggestions[newIndex].displayName || suggestions[newIndex].name || String(suggestions[newIndex]);
        announcements.announceNavigation(newIndex, suggestions.length, suggestionName);
      }

      return newIndex;
    });
  }, [isOpen, suggestions, announcements]);

  const selectHighlighted = useCallback(() => {
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      const suggestion = suggestions[highlightedIndex];
      onSelect(suggestion);

      // Announce selection
      const suggestionName = suggestion.displayName || suggestion.name || String(suggestion);
      announcements.announce(`Selected ${suggestionName}`, 'assertive');
    }
  }, [highlightedIndex, suggestions, onSelect, announcements]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Escape' && onClose) {
        onClose();
        announcements.announce('Suggestions closed', 'polite');
        return true;
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

      case 'Enter':
        e.preventDefault();
        selectHighlighted();
        return true;

      case 'Escape':
        e.preventDefault();
        if (onClose) {
          onClose();
          announcements.announce('Suggestions closed', 'polite');
        }
        return true;

      case 'Tab':
      case 'ArrowRight':
        if (onAutocomplete && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          e.preventDefault();
          onAutocomplete(suggestions[highlightedIndex]);
          return true;
        }
        return false;

      default:
        return false;
    }
  }, [isOpen, suggestions, highlightedIndex, moveDown, moveUp, selectHighlighted, onClose, onAutocomplete, announcements]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    if (!isOpen || suggestions.length === 0) {
      setHighlightedIndex(-1);
    } else if (highlightedIndex >= suggestions.length) {
      setHighlightedIndex(suggestions.length - 1);
    } else if (highlightedIndex === -1 && suggestions.length > 0 && isOpen) {
      setHighlightedIndex(0);
    }
  }, [suggestions, isOpen, highlightedIndex]);

  return {
    highlightedIndex,
    setHighlight: setHighlightedIndex,
    handleKeyDown,
    moveUp,
    moveDown,
    selectHighlighted
  };
}