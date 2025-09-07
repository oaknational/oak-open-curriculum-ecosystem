/**
 * @fileoverview Advanced registry patterns for Moria
 * @module moria/patterns/registry-advanced
 *
 * Advanced registry interfaces for complex use cases
 */

import type { Registry } from './registry-base';

/**
 * Registry with versioning support
 */
export interface VersionedRegistry<T> extends Registry<string, T> {
  /**
   * Register with version
   */
  registerVersion(key: string, value: T, version: string): void;

  /**
   * Get specific version
   */
  getVersion(key: string, version: string): T | undefined;

  /**
   * Get all versions of an item
   */
  getVersions(key: string): Record<string, T>;

  /**
   * Get latest version
   */
  getLatest(key: string): T | undefined;
}

/**
 * Registry with tagging support
 */
export interface TaggedRegistry<T> extends Registry<string, T> {
  /**
   * Add tags to an item
   */
  tag(key: string, tags: string[]): void;

  /**
   * Remove tags from an item
   */
  untag(key: string, tags: string[]): void;

  /**
   * Get items by tag
   */
  getByTag(tag: string): T[];

  /**
   * Get all tags for an item
   */
  getTags(key: string): string[];
}

/**
 * Registry with dependency tracking
 */
export interface DependencyRegistry<T> extends Registry<string, T> {
  /**
   * Register with dependencies
   */
  registerWithDependencies(key: string, value: T, dependencies: string[]): void;

  /**
   * Get dependencies of an item
   */
  getDependencies(key: string): string[];

  /**
   * Get items that depend on a key
   */
  getDependents(key: string): string[];

  /**
   * Get items in dependency order
   */
  getInOrder(): T[];
}

/**
 * Registry with indexing support
 */
export interface IndexedRegistry<T> extends Registry<string, T> {
  /**
   * Create an index on a property
   */
  createIndex(property: keyof T): void;

  /**
   * Find items by indexed property
   */
  findByIndex<K extends keyof T>(property: K, value: T[K]): T[];

  /**
   * Remove an index
   */
  dropIndex(property: keyof T): void;
}

/**
 * Registry with caching
 */
export interface CachedRegistry<T> extends Registry<string, T> {
  /**
   * Cache size limit
   */
  readonly cacheSize: number;

  /**
   * Get from cache or load
   */
  getOrLoad(key: string, loader: () => T): T;

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void;

  /**
   * Clear entire cache
   */
  clearCache(): void;
}

/**
 * Registry with expiration
 */
export interface ExpiringRegistry<T> extends Registry<string, T> {
  /**
   * Register with TTL in milliseconds
   */
  registerWithTTL(key: string, value: T, ttl: number): void;

  /**
   * Get if not expired
   */
  getIfValid(key: string): T | undefined;

  /**
   * Clean up expired entries
   */
  cleanExpired(): void;

  /**
   * Get expiration time
   */
  getExpiration(key: string): Date | undefined;
}

/**
 * Registry with transaction support
 */
export interface TransactionalRegistry<T> extends Registry<string, T> {
  /**
   * Begin a transaction
   */
  beginTransaction(): void;

  /**
   * Commit the current transaction
   */
  commit(): void;

  /**
   * Rollback the current transaction
   */
  rollback(): void;

  /**
   * Check if in transaction
   */
  inTransaction(): boolean;
}

/**
 * Registry with partitioning support
 */
export interface PartitionedRegistry<T> extends Registry<string, T> {
  /**
   * Create a partition
   */
  createPartition(name: string): void;

  /**
   * Register in a specific partition
   */
  registerInPartition(partition: string, key: string, value: T): void;

  /**
   * Get from a specific partition
   */
  getFromPartition(partition: string, key: string): T | undefined;

  /**
   * Get all items in a partition
   */
  getPartition(name: string): Record<string, T>;

  /**
   * Remove a partition
   */
  dropPartition(name: string): void;
}
