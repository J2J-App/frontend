/**
 * Accessibility utilities for the autocomplete component
 * Provides screen reader announcements, focus management, and ARIA helpers
 */

/**
 * Announces text to screen readers using a live region
 */
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Create or find existing live region
  let liveRegion = document.getElementById('autocomplete-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'autocomplete-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  
  // Clear and set new message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100); // Small delay to ensure screen readers pick up the change
}

/**
 * Generates accessible description for suggestion navigation
 */
export function generateNavigationDescription(
  currentIndex: number,
  totalCount: number,
  suggestionName: string
): string {
  if (totalCount === 0) return 'No suggestions available';
  
  return `${currentIndex + 1} of ${totalCount}: ${suggestionName}`;
}

/**
 * Generates accessible description for suggestion count
 */
export function generateSuggestionCountDescription(count: number): string {
  if (count === 0) return 'No suggestions found';
  if (count === 1) return '1 suggestion available';
  return `${count} suggestions available`;
}

/**
 * Manages focus for keyboard-only users
 */
export class FocusManager {
  private static instance: FocusManager;
  private focusStack: HTMLElement[] = [];
  
  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }
  
  /**
   * Saves current focus and moves to new element
   */
  moveFocus(element: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== element) {
      this.focusStack.push(currentFocus);
    }
    
    element.focus();
  }
  
  /**
   * Restores previous focus
   */
  restoreFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }
  
  /**
   * Clears focus stack
   */
  clearFocusStack(): void {
    this.focusStack = [];
  }
  
  /**
   * Traps focus within a container
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
}

/**
 * Checks if user is using keyboard navigation
 */
export function isKeyboardUser(): boolean {
  // Check if user has recently used keyboard navigation
  return document.body.classList.contains('keyboard-user');
}

/**
 * Sets up keyboard user detection
 */
export function setupKeyboardUserDetection(): () => void {
  let isUsingKeyboard = false;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter' || 
        e.key === 'Escape' || e.key === 'Home' || e.key === 'End') {
      if (!isUsingKeyboard) {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-user');
      }
    }
  };
  
  const handleMouseDown = () => {
    if (isUsingKeyboard) {
      isUsingKeyboard = false;
      document.body.classList.remove('keyboard-user');
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
  };
}

/**
 * ARIA attribute helpers
 */
export const AriaHelpers = {
  /**
   * Generates ARIA attributes for combobox input
   */
  getComboboxAttributes(
    isExpanded: boolean,
    hasPopup: boolean = true,
    activeDescendant?: string,
    owns?: string,
    describedBy?: string
  ) {
    return {
      role: 'combobox' as const,
      'aria-expanded': isExpanded,
      'aria-haspopup': hasPopup ? 'listbox' as const : false,
      'aria-activedescendant': activeDescendant || undefined,
      'aria-owns': owns || undefined,
      'aria-describedby': describedBy || undefined,
      'aria-autocomplete': 'list' as const
    };
  },
  
  /**
   * Generates ARIA attributes for listbox
   */
  getListboxAttributes(label?: string) {
    return {
      role: 'listbox' as const,
      'aria-label': label || 'Suggestions'
    };
  },
  
  /**
   * Generates ARIA attributes for option
   */
  getOptionAttributes(
    isSelected: boolean,
    position?: number,
    setSize?: number,
    label?: string
  ) {
    return {
      role: 'option' as const,
      'aria-selected': isSelected,
      'aria-posinset': position,
      'aria-setsize': setSize,
      'aria-label': label
    };
  }
};

/**
 * Screen reader compatibility helpers
 */
export const ScreenReaderHelpers = {
  /**
   * Checks if a screen reader is likely active
   */
  isScreenReaderActive(): boolean {
    // Check for common screen reader indicators
    return !!(
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis ||
      (window as any).speechSynthesis ||
      document.body.classList.contains('screen-reader-active')
    );
  },
  
  /**
   * Optimizes content for screen readers
   */
  optimizeForScreenReader(text: string): string {
    // Add pauses for better screen reader pronunciation
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  },
  
  /**
   * Creates descriptive text for complex UI elements
   */
  createDescription(
    elementType: string,
    state: string,
    position?: { current: number; total: number },
    additionalInfo?: string
  ): string {
    let description = `${elementType}, ${state}`;
    
    if (position) {
      description += `, ${position.current} of ${position.total}`;
    }
    
    if (additionalInfo) {
      description += `, ${additionalInfo}`;
    }
    
    return this.optimizeForScreenReader(description);
  }
};

/**
 * High contrast mode detection and support
 */
export const HighContrastHelpers = {
  /**
   * Detects if high contrast mode is active
   */
  isHighContrastMode(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
  
  /**
   * Sets up high contrast mode detection
   */
  setupHighContrastDetection(callback: (isHighContrast: boolean) => void): () => void {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial call
    callback(mediaQuery.matches);
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
};

/**
 * Reduced motion detection and support
 */
export const MotionHelpers = {
  /**
   * Detects if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  /**
   * Sets up reduced motion detection
   */
  setupReducedMotionDetection(callback: (prefersReduced: boolean) => void): () => void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial call
    callback(mediaQuery.matches);
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }
};