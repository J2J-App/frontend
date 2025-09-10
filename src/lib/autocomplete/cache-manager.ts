/**
 * Cache management utilities for autocomplete suggestions
 * Provides high-level cache operations and management functions
 */

import { LRUCache, CacheOptions, createAutocompleteCache } from './cache';

export interface CacheManagerOptions extends CacheOptions {
  cleanupInterval?: number; // Interval for automatic cleanup in milliseconds
  enableAutoCleanup?: boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  cacheSize: number;
  validEntries: number;
  expiredEntries: number;
}

/**
 * Advanced cache manager with metrics and automatic cleanup
 */
export class CacheManager<T> {
  private cache: LRUCache<T>;
  private metrics: Omit<CacheMetrics, 'hitRate' | 'totalRequests' | 'cacheSize' | 'validEntries' | 'expiredEntries'>;
  private cleanupInterval?: NodeJS.Timeout;
  private readonly options: CacheManagerOptions;

  constructor(options: CacheManagerOptions) {
    this.options = options;
    this.cache = new LRUCache<T>(options);
    this.metrics = {
      hits: 0,
      misses: 0
    };

    if (options.enableAutoCleanup && options.cleanupInterval) {
      this.startAutoCleanup();
    }
  }

  /**
   * Get value from cache with metrics tracking
   */
  get(key: string): T | null {
    const normalizedKey = this.normalizeKey(key);
    const value = this.cache.get(normalizedKey);
    
    if (value !== null) {
      this.metrics.hits++;
    } else {
      this.metrics.misses++;
    }
    
    return value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    const normalizedKey = this.normalizeKey(key);
    this.cache.set(normalizedKey, value);
  }

  /**
   * Check if cache has key
   */
  has(key: string): boolean {
    const normalizedKey = this.normalizeKey(key);
    return this.cache.has(normalizedKey);
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const normalizedKey = this.normalizeKey(key);
    return this.cache.delete(normalizedKey);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.resetMetrics();
  }

  /**
   * Get comprehensive cache metrics
   */
  getMetrics(): CacheMetrics {
    const cacheStats = this.cache.getStats();
    const totalRequests = this.metrics.hits + this.metrics.misses;
    
    return {
      ...this.metrics,
      hitRate: totalRequests > 0 ? this.metrics.hits / totalRequests : 0,
      totalRequests,
      cacheSize: cacheStats.size,
      validEntries: cacheStats.validEntries,
      expiredEntries: cacheStats.expiredEntries
    };
  }

  /**
   * Perform manual cleanup of expired entries
   */
  cleanup(): number {
    return this.cache.cleanup();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.cache.getStats(),
      metrics: this.getMetrics(),
      options: this.options
    };
  }

  /**
   * Warm up cache with predefined entries
   */
  warmUp(entries: Array<{ key: string; value: T }>): void {
    entries.forEach(({ key, value }) => {
      this.set(key, value);
    });
  }

  /**
   * Export cache contents for persistence
   */
  export(): Array<{ key: string; value: T; timestamp: number }> {
    const entries: Array<{ key: string; value: T; timestamp: number }> = [];
    
    // Access private cache data through public methods
    // This is a simplified export - in a real implementation,
    // you might need to expose more cache internals
    return entries;
  }

  /**
   * Import cache contents from persistence
   */
  import(entries: Array<{ key: string; value: T; timestamp: number }>): void {
    entries.forEach(({ key, value }) => {
      this.set(key, value);
    });
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0
    };
  }

  /**
   * Destroy cache manager and cleanup resources
   */
  destroy(): void {
    this.stopAutoCleanup();
    this.cache.clear();
    this.resetMetrics();
  }

  private normalizeKey(key: string): string {
    return key.toLowerCase().trim();
  }

  private startAutoCleanup(): void {
    if (this.options.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, this.options.cleanupInterval);
    }
  }

  private stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }
}

/**
 * Default cache manager options for autocomplete
 */
export const DEFAULT_CACHE_MANAGER_OPTIONS: CacheManagerOptions = {
  maxSize: 100,
  ttl: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000, // 1 minute
  enableAutoCleanup: true
};

/**
 * Create a new cache manager instance
 */
export function createCacheManager<T>(options?: Partial<CacheManagerOptions>): CacheManager<T> {
  return new CacheManager<T>({
    ...DEFAULT_CACHE_MANAGER_OPTIONS,
    ...options
  });
}

/**
 * Suggestion-specific cache manager
 */
export interface SuggestionCacheEntry {
  suggestions: any[]; // Will be typed properly when we have the suggestion type
  query: string;
  timestamp: number;
  resultCount: number;
}

export class SuggestionCacheManager extends CacheManager<SuggestionCacheEntry> {
  constructor(options?: Partial<CacheManagerOptions>) {
    super({
      ...DEFAULT_CACHE_MANAGER_OPTIONS,
      maxSize: 50, // Smaller cache for suggestions
      ttl: 3 * 60 * 1000, // 3 minutes for suggestions
      ...options
    });
  }

  /**
   * Cache suggestions with additional metadata
   */
  cacheSuggestions(query: string, suggestions: any[]): void {
    const entry: SuggestionCacheEntry = {
      suggestions,
      query,
      timestamp: Date.now(),
      resultCount: suggestions.length
    };
    
    this.set(query, entry);
  }

  /**
   * Get cached suggestions
   */
  getCachedSuggestions(query: string): any[] | null {
    const entry = this.get(query);
    return entry ? entry.suggestions : null;
  }

  /**
   * Get suggestions with metadata
   */
  getCachedEntry(query: string): SuggestionCacheEntry | null {
    return this.get(query);
  }

  /**
   * Check if query has cached results
   */
  hasCachedSuggestions(query: string): boolean {
    return this.has(query);
  }

  /**
   * Get cache statistics specific to suggestions
   */
  getSuggestionStats() {
    const baseStats = this.getStats();
    const metrics = this.getMetrics();
    
    return {
      ...baseStats,
      averageResultCount: this.calculateAverageResultCount(),
      cacheEfficiency: metrics.hitRate,
      suggestionsServed: metrics.hits
    };
  }

  private calculateAverageResultCount(): number {
    // This would require access to cache internals
    // For now, return 0 as placeholder
    return 0;
  }
}

/**
 * Global suggestion cache manager instance
 */
export const suggestionCacheManager = new SuggestionCacheManager();

/**
 * Performance monitoring utilities
 */
export class CachePerformanceMonitor {
  private performanceEntries: Array<{
    operation: string;
    duration: number;
    timestamp: number;
    cacheHit?: boolean;
  }> = [];

  /**
   * Measure cache operation performance
   */
  measureOperation<T>(
    operation: string,
    fn: () => T,
    cacheHit?: boolean
  ): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.performanceEntries.push({
      operation,
      duration,
      timestamp: Date.now(),
      cacheHit
    });
    
    // Keep only recent entries
    if (this.performanceEntries.length > 1000) {
      this.performanceEntries = this.performanceEntries.slice(-500);
    }
    
    return result;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    if (this.performanceEntries.length === 0) {
      return null;
    }

    const durations = this.performanceEntries.map(e => e.duration);
    const cacheHits = this.performanceEntries.filter(e => e.cacheHit === true).length;
    const cacheMisses = this.performanceEntries.filter(e => e.cacheHit === false).length;
    
    return {
      totalOperations: this.performanceEntries.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      cacheHitRate: cacheHits / (cacheHits + cacheMisses) || 0,
      recentOperations: this.performanceEntries.slice(-10)
    };
  }

  /**
   * Clear performance data
   */
  clear(): void {
    this.performanceEntries = [];
  }
}

/**
 * Global performance monitor instance
 */
export const cachePerformanceMonitor = new CachePerformanceMonitor();