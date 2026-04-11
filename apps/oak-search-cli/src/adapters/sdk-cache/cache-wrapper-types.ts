/**
 * Statistics about cache usage during the current session.
 *
 * Track hits and misses to monitor cache effectiveness during ingestion.
 */
export interface CacheStats {
  /** Number of cache hits (value found in cache). */
  hits: number;
  /** Number of cache misses (value not in cache, fetched from API). */
  misses: number;
}

/**
 * Minimal cache operations interface for dependency injection.
 *
 * This abstraction allows testing cache logic without a real Redis connection.
 * Provide a Map-based fake for unit tests, or a real Redis client for production.
 */
export interface CacheOperations {
  /**
   * Get a value from cache.
   * @param key - Cache key
   * @returns Cached value or null if not found
   */
  readonly get: (key: string) => Promise<string | null>;
  /**
   * Set a value with TTL.
   * @param key - Cache key
   * @param ttl - Time-to-live in seconds
   * @param value - Value to cache (JSON string)
   */
  readonly setex: (key: string, ttl: number, value: string) => Promise<void>;
}
