/**
 * Safe localStorage utility functions
 * Handles private browsing mode, storage quota errors, and other localStorage failures
 */

export interface LocalStorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Safely get an item from localStorage
 */
export function safeGetLocalStorage<T = string>(
  key: string
): LocalStorageResult<T> {
  if (typeof window === "undefined") {
    return { success: false, error: "localStorage not available (SSR)" };
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return { success: true, data: undefined };
    }

    // Try to parse JSON, fallback to string
    try {
      const parsed = JSON.parse(item);
      return { success: true, data: parsed as T };
    } catch {
      // If JSON parsing fails, return as string
      return { success: true, data: item as T };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown localStorage error";
    console.warn(`Failed to get localStorage item "${key}":`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Safely set an item in localStorage
 */
export function safeSetLocalStorage(
  key: string,
  value: any
): LocalStorageResult<void> {
  if (typeof window === "undefined") {
    return { success: false, error: "localStorage not available (SSR)" };
  }

  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return { success: true };
  } catch (error) {
    let errorMessage = "Unknown localStorage error";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific error types
      if (
        error.name === "QuotaExceededError" ||
        error.message.includes("quota exceeded")
      ) {
        errorMessage =
          "Storage quota exceeded. Please clear some browser data.";
      } else if (error.message.includes("private browsing")) {
        errorMessage = "localStorage is not available in private browsing mode";
      }
    }

    console.warn(`Failed to set localStorage item "${key}":`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeRemoveLocalStorage(key: string): LocalStorageResult<void> {
  if (typeof window === "undefined") {
    return { success: false, error: "localStorage not available (SSR)" };
  }

  try {
    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown localStorage error";
    console.warn(`Failed to remove localStorage item "${key}":`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__localStorage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get localStorage availability status and error message
 */
export function getLocalStorageStatus(): {
  available: boolean;
  error?: string;
} {
  if (typeof window === "undefined") {
    return { available: false, error: "Server-side rendering" };
  }

  try {
    const testKey = "__localStorage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return { available: true };
  } catch (error) {
    let errorMessage = "Unknown error";

    if (error instanceof Error) {
      if (error.name === "QuotaExceededError") {
        errorMessage = "Storage quota exceeded";
      } else if (error.message.includes("private")) {
        errorMessage = "Private browsing mode detected";
      } else {
        errorMessage = error.message;
      }
    }

    return { available: false, error: errorMessage };
  }
}
