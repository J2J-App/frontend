/**
 * LRU Cache implementation for autocomplete suggestions
 * Supports TTL (Time To Live) and size limits
 */

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
}

export interface CacheOptions {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
}

export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private readonly maxSize: number;
  private readonly ttl: number;

  constructor(options: CacheOptions) {
    this.maxSize = options.maxSize;
    this.ttl = options.ttl;
  }

  /**
   * Get value from cache if it exists and hasn't expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.delete(key);
      return null;
    }

    // Update access order (move to end)
    this.updateAccessOrder(key);
    entry.accessCount++;

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    const now = Date.now();

    // If key already exists, update it
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.value = value;
      entry.timestamp = now;
      entry.accessCount++;
      this.updateAccessOrder(key);
      return;
    }

    // If cache is at max size, remove least recently used item
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    // Add new entry
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      accessCount: 1
    };

    this.cache.set(key, entry);
    this.accessOrder.push(key);
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache has key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const validEntries = entries.filter(([_, entry]) => !this.isExpired(entry));

    return {
      size: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
    return keysToDelete.length;
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder[0];
    this.delete(lruKey);
  }
}

/**
 * Default cache configuration for autocomplete suggestions
 */
export const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxSize: 100,
  ttl: 5 * 60 * 1000 // 5 minutes
};

/**
 * Create a new LRU cache instance with default options
 */
export function createAutocompleteCache<T>(options?: Partial<CacheOptions>): LRUCache<T> {
  return new LRUCache<T>({
    ...DEFAULT_CACHE_OPTIONS,
    ...options
  });
}