import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to detect if the device is mobile/touch-enabled
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check for touch capability and screen size
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      // Safely check for touch device with fallback for test environment
      let isTouchDevice = false;
      try {
        if (window.matchMedia) {
          isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        }
      } catch (e) {
        // Fallback for test environment or browsers without matchMedia
        isTouchDevice = hasTouch && isSmallScreen;
      }

      setIsMobile(hasTouch && (isSmallScreen || isTouchDevice));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to handle virtual keyboard visibility and viewport changes
 */
export function useVirtualKeyboard() {
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const initialViewportHeight = useRef(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      setViewportHeight(currentHeight);

      // Detect virtual keyboard by significant viewport height reduction
      const heightDifference = initialViewportHeight.current - currentHeight;
      const isKeyboardOpen = heightDifference > 150; // Threshold for keyboard detection

      setIsVirtualKeyboardOpen(isKeyboardOpen);
    };

    // Handle visual viewport API if available (better for virtual keyboard detection)
    if (window.visualViewport) {
      const handleVisualViewportChange = () => {
        const visualHeight = window.visualViewport!.height;
        const windowHeight = window.innerHeight;
        const heightDifference = windowHeight - visualHeight;

        setViewportHeight(visualHeight);
        setIsVirtualKeyboardOpen(heightDifference > 150);
      };

      window.visualViewport.addEventListener('resize', handleVisualViewportChange);

      return () => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
      };
    } else {
      // Fallback to window resize
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return {
    isVirtualKeyboardOpen,
    viewportHeight,
    keyboardHeight: initialViewportHeight.current - viewportHeight
  };
}

/**
 * Hook to handle device orientation changes
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      // Use a timeout to ensure dimensions are updated after orientation change
      setTimeout(() => {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        setOrientation(newOrientation);
      }, 100);
    };

    // Listen for orientation change events
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Hook to handle touch interactions with scroll prevention
 */
export function useTouchInteraction() {
  const [isTouching, setIsTouching] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const touchThreshold = 10; // Minimum movement to consider as scroll

  const handleTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    setIsTouching(true);
    const touch = 'touches' in e ? e.touches[0] : e;
    setTouchStartY(touch.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (touchStartY === null) return false;

    const touch = 'touches' in e ? e.touches[0] : e;
    const touchMoveY = touch.clientY;
    const deltaY = Math.abs(touchMoveY - touchStartY);

    // If user moved more than threshold, consider it scrolling
    return deltaY > touchThreshold;
  }, [touchStartY, touchThreshold]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    setTouchStartY(null);
  }, []);

  const isScrolling = useCallback((e: TouchEvent | React.TouchEvent) => {
    return handleTouchMove(e);
  }, [handleTouchMove]);

  return {
    isTouching,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isScrolling
  };
}

/**
 * Hook to calculate optimal dropdown positioning for mobile
 */
export function useMobileDropdownPosition(
  inputRef: React.RefObject<HTMLDivElement | null>,
  _dropdownRef: React.RefObject<HTMLDivElement | null>,
  isOpen: boolean
) {
  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    maxHeight?: number;
    direction: 'down' | 'up';
  }>({ direction: 'down' });

  const { isVirtualKeyboardOpen, viewportHeight } = useVirtualKeyboard();
  const orientation = useOrientation();

  const calculatePosition = useCallback(() => {
    if (!inputRef.current || !isOpen) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const availableSpaceBelow = viewportHeight - inputRect.bottom;
    const availableSpaceAbove = inputRect.top;

    // Minimum space needed for dropdown
    const minDropdownHeight = 100;
    const maxDropdownHeight = Math.min(300, viewportHeight * 0.4);

    // Determine if dropdown should open upward or downward
    const shouldOpenUpward = availableSpaceBelow < minDropdownHeight &&
      availableSpaceAbove > availableSpaceBelow;

    if (shouldOpenUpward) {
      setPosition({
        bottom: viewportHeight - inputRect.top,
        maxHeight: Math.min(maxDropdownHeight, availableSpaceAbove - 10),
        direction: 'up'
      });
    } else {
      setPosition({
        top: inputRect.bottom,
        maxHeight: Math.min(maxDropdownHeight, availableSpaceBelow - 10),
        direction: 'down'
      });
    }
  }, [inputRef, viewportHeight, isOpen]);

  // Recalculate position when relevant factors change
  useEffect(() => {
    calculatePosition();
  }, [calculatePosition, isVirtualKeyboardOpen, orientation, isOpen]);

  // Recalculate on scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      calculatePosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, calculatePosition]);

  return position;
}

/**
 * Hook to handle mobile-specific touch events for suggestion items
 */
export function useMobileSuggestionInteraction(
  onSelect: () => void,
  onHighlight: () => void
) {
  const { handleTouchStart, handleTouchEnd, isScrolling } = useTouchInteraction();
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const longPressThreshold = 500; // ms for long press

  const handleTouchStartWrapper = useCallback((e: React.TouchEvent) => {
    handleTouchStart(e);
    setTouchStartTime(Date.now());
    onHighlight(); // Highlight on touch start
  }, [handleTouchStart, onHighlight]);

  const handleTouchEndWrapper = useCallback((e: React.TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchStartTime ? touchEndTime - touchStartTime : 0;

    handleTouchEnd();

    // Only select if it wasn't a scroll and wasn't a long press
    if (!isScrolling(e) && touchDuration < longPressThreshold) {
      onSelect();
    }

    setTouchStartTime(null);
  }, [handleTouchEnd, isScrolling, onSelect, touchStartTime, longPressThreshold]);

  const handleTouchMoveWrapper = useCallback((e: React.TouchEvent) => {
    // If user is scrolling, remove highlight
    if (isScrolling(e)) {
      // Could implement unhighlight logic here if needed
    }
  }, [isScrolling]);

  return {
    handleTouchStart: handleTouchStartWrapper,
    handleTouchEnd: handleTouchEndWrapper,
    handleTouchMove: handleTouchMoveWrapper
  };
}