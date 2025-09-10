/**
 * Autocomplete Performance and Caching Utilities
 * 
 * This module provides comprehensive caching and performance utilities for the autocomplete feature:
 * 
 * 1. LRU Cache with TTL support
 * 2. Debouncing hooks for input handling (300ms delay)
 * 3. Request cancellation utilities to prevent race conditions
 * 4. Cache management with size limits and automatic cleanup
 * 
 * Requirements satisfied: 4.1, 4.2, 4.3, 4.4
 */

// Core cache implementation
export {
  LRUCache,
  createAutocompleteCache,
  DEFAULT_CACHE_OPTIONS,
  type CacheEntry,
  type CacheOptions
} from './cache';

// React hooks for performance
export {
  useDebounce,
  useDebouncedCallback,
  useRequestCancellation,
  useThrottle,
  useAutocompletePerformance
} from './hooks';

// Advanced cache management (TODO: implement in future tasks)
// export {
//   CacheManager,
//   createCacheManager,
//   SuggestionCacheManager,
//   CachePerformanceMonitor,
//   suggestionCacheManager,
//   cachePerformanceMonitor,
//   DEFAULT_CACHE_MANAGER_OPTIONS,
//   type CacheManagerOptions,
//   type CacheMetrics,
//   type SuggestionCacheEntry
// } from './cache-manager';

// Request management and cancellation (TODO: implement in future tasks)
// export {
//   RequestManager,
//   autocompleteRequestManager,
//   createCancellablePromise,
//   cancellableFetch,
//   RaceConditionGuard,
//   type RequestInfo
// } from './request-manager';

// Usage examples (removed - example file was deleted during cleanup)

/**
 * Default configuration for autocomplete performance
 */
export const AUTOCOMPLETE_PERFORMANCE_CONFIG = {
  // Debouncing
  debounceDelay: 300, // 300ms as per requirement 4.1
  
  // Caching
  cacheMaxSize: 100, // Maximum cache entries
  cacheTTL: 5 * 60 * 1000, // 5 minutes TTL
  
  // Request management
  maxConcurrentRequests: 1, // Cancel previous requests
  requestTimeout: 10000, // 10 second timeout
  
  // Performance monitoring
  enablePerformanceMonitoring: true,
  maxPerformanceEntries: 1000
} as const;

/**
 * Create a complete autocomplete performance setup
 * This is a convenience function that sets up all performance utilities
 * TODO: Implement in future tasks when cache-manager and request-manager are available
 */
export function createAutocompletePerformanceSetup(config = AUTOCOMPLETE_PERFORMANCE_CONFIG) {
  // TODO: Implement when dependencies are available
  throw new Error('createAutocompletePerformanceSetup not yet implemented - requires cache-manager and request-manager modules');
}

/**
 * Type definitions for autocomplete performance
 * TODO: Update when cache-manager and request-manager are implemented
 */
export interface AutocompletePerformanceSetup {
  config: typeof AUTOCOMPLETE_PERFORMANCE_CONFIG;
  destroy: () => void;
  getStats: () => {
    cache: any;
    requests: any;
    performance: any;
  };
}