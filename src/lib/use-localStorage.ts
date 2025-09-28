import { useState, useEffect, useCallback } from "react";
import {
  safeGetLocalStorage,
  safeSetLocalStorage,
  safeRemoveLocalStorage,
  getLocalStorageStatus,
} from "./safe-localStorage";

/**
 * React hook for localStorage with error handling and fallbacks
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((val: T) => T)) => void,
  () => void,
  { available: boolean; error?: string }
] {
  // Get localStorage availability status
  const [storageStatus, setStorageStatus] = useState(getLocalStorageStatus);

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const result = safeGetLocalStorage<T>(key);
    if (result.success && result.data !== undefined) {
      return result.data;
    } else if (!result.success) {
      console.warn(`useLocalStorage: Failed to get ${key}:`, result.error);
    }

    return initialValue;
  });

  // Update localStorage status when component mounts
  useEffect(() => {
    setStorageStatus(getLocalStorageStatus());
  }, []);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function for the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          const result = safeSetLocalStorage(key, valueToStore);
          if (!result.success) {
            console.warn(
              `useLocalStorage: Failed to set ${key}:`,
              result.error
            );
            // Update storage status if failed
            setStorageStatus(getLocalStorageStatus());
          }
        }
      } catch (error) {
        console.error(
          `useLocalStorage: Error setting value for ${key}:`,
          error
        );
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      // Reset to initial value
      setStoredValue(initialValue);

      // Remove from localStorage
      if (typeof window !== "undefined") {
        const result = safeRemoveLocalStorage(key);
        if (!result.success) {
          console.warn(
            `useLocalStorage: Failed to remove ${key}:`,
            result.error
          );
        }
      }
    } catch (error) {
      console.error(`useLocalStorage: Error removing value for ${key}:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, storageStatus];
}

/**
 * Hook for managing form data in localStorage with validation
 */
export function useLocalStorageForm<T extends Record<string, any>>(
  key: string,
  initialFormData: T,
  validator?: (data: any) => data is T
) {
  const [formData, setFormData, clearForm, storageStatus] = useLocalStorage(
    key,
    initialFormData
  );

  // Validate loaded data
  useEffect(() => {
    if (validator && formData && !validator(formData)) {
      console.warn(
        `Invalid form data loaded from localStorage for key: ${key}, resetting to initial values`
      );
      setFormData(initialFormData);
    }
  }, [key, formData, initialFormData, validator, setFormData]);

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormData]
  );

  const updateFields = useCallback(
    (updates: Partial<T>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [setFormData]
  );

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    clearForm,
    storageStatus,
  };
}

/**
 * Hook for managing temporary localStorage values (like scroll positions)
 */
export function useTemporaryStorage<T>(key: string, initialValue: T) {
  const [value, setValue, removeValue, storageStatus] = useLocalStorage(
    key,
    initialValue
  );

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      removeValue();
    };
  }, [removeValue]);

  return [value, setValue, storageStatus] as const;
}

/**
 * Hook to monitor localStorage availability changes
 */
export function useLocalStorageStatus() {
  const [status, setStatus] = useState(getLocalStorageStatus);

  useEffect(() => {
    // Check status periodically or on certain events
    const checkStatus = () => setStatus(getLocalStorageStatus());

    // Check on window focus (user might have changed privacy settings)
    window.addEventListener("focus", checkStatus);

    // Check on storage events (though these won't fire for same-origin changes in private mode)
    window.addEventListener("storage", checkStatus);

    return () => {
      window.removeEventListener("focus", checkStatus);
      window.removeEventListener("storage", checkStatus);
    };
  }, []);

  return status;
}
