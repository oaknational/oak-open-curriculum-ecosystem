/**
 * @fileoverview Registry patterns for Moria
 * @module moria/patterns/registry
 *
 * Provides pure registry abstractions with zero dependencies.
 * Registries manage collections of items with various access patterns.
 */

/**
 * Base registry interface for managing items
 */
export interface Registry<TKey = string, TValue = unknown> {
  /**
   * Register an item
   */
  register(key: TKey, value: TValue): void;

  /**
   * Get an item by key
   */
  get(key: TKey): TValue | undefined;

  /**
   * Check if an item exists
   */
  has(key: TKey): boolean;

  /**
   * Unregister an item
   */
  unregister(key: TKey): boolean;

  /**
   * Clear all items
   */
  clear(): void;
}

/**
 * Registry interface for plugin management
 * Extends base Registry with plugin-specific functionality
 */
export interface PluginRegistry<T> extends Registry<string, T> {
  /**
   * Load a plugin with name property
   */
  load(plugin: T & { name: string }): void;

  /**
   * Unload a plugin by name
   */
  unload(name: string): void;

  /**
   * Check if a plugin is loaded
   */
  isLoaded(name: string): boolean;

  /**
   * Get metadata for a plugin
   */
  getMetadata(name: string): Record<string, unknown> | undefined;
}

/**
 * Registry that enforces type constraints
 */
export interface TypedRegistry<T> {
  /**
   * Register a typed item
   */
  register(item: T): void;

  /**
   * Get items by type
   */
  getByType<TSpecific extends T>(type: new (...args: any[]) => TSpecific): TSpecific[];
}

/**
 * Registry with named items
 */
export interface NamedRegistry<T> {
  /**
   * Register an item with a name
   */
  register(name: string, item: T): void;

  /**
   * Get an item by name
   */
  getByName(name: string): T | undefined;

  /**
   * Get all registered names
   */
  getAllNames(): string[];

  /**
   * Find items by name prefix
   */
  findByPrefix(prefix: string): T[];
}

/**
 * Registry with parent-child relationships
 */
export interface HierarchicalRegistry<TKey = string, TValue = unknown>
  extends Registry<TKey, TValue> {
  /**
   * Parent registry
   */
  parent?: HierarchicalRegistry<TKey, TValue>;

  /**
   * Child registries
   */
  children: HierarchicalRegistry<TKey, TValue>[];

  /**
   * Set the parent registry
   */
  setParent(parent: HierarchicalRegistry<TKey, TValue>): void;

  /**
   * Add a child registry
   */
  addChild(child: HierarchicalRegistry<TKey, TValue>): void;

  /**
   * Lookup item in hierarchy
   */
  lookup(key: TKey): TValue | undefined;
}

/**
 * Observable registry that notifies on changes
 */
export interface ObservableRegistry<TKey = string, TValue = unknown>
  extends Registry<TKey, TValue> {
  /**
   * Add an observer
   */
  addObserver(observer: (event: string, data: unknown) => void): void;

  /**
   * Remove an observer
   */
  removeObserver(observer: (event: string, data: unknown) => void): void;

  /**
   * Notify all observers
   */
  notifyObservers(event: string, data: unknown): void;
}

/**
 * Registry entry with metadata
 */
export interface RegistryEntry<T> {
  /**
   * Entry key
   */
  key: string;

  /**
   * Entry value
   */
  value: T;

  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Filter for registry queries
 */
export interface RegistryFilter<T> {
  /**
   * Apply filter to items
   */
  apply(items: T[]): T[];
}

/**
 * Query builder for registries
 */
export interface RegistryQuery<T> {
  /**
   * Add a where clause
   */
  where(predicate: (item: T) => boolean): RegistryQuery<T>;

  /**
   * Order results
   */
  orderBy(key: keyof T, direction?: 'asc' | 'desc'): RegistryQuery<T>;

  /**
   * Limit results
   */
  limit(count: number): RegistryQuery<T>;

  /**
   * Execute the query
   */
  execute(items: T[]): T[];
}

/**
 * Registry with versioning support
 */
export interface VersionedRegistry<T> extends Registry<string, T> {
  /**
   * Register a versioned item
   */
  registerVersion(key: string, version: string, value: T): void;

  /**
   * Get a specific version
   */
  getVersion(key: string, version: string): T | undefined;

  /**
   * Get all versions of an item
   */
  getAllVersions(key: string): Map<string, T>;

  /**
   * Get the latest version
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
  addTags(key: string, tags: string[]): void;

  /**
   * Remove tags from an item
   */
  removeTags(key: string, tags: string[]): void;

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
   * Register dependencies
   */
  addDependency(key: string, dependency: string): void;

  /**
   * Remove dependencies
   */
  removeDependency(key: string, dependency: string): void;

  /**
   * Get direct dependencies
   */
  getDependencies(key: string): string[];

  /**
   * Get all transitive dependencies
   */
  getAllDependencies(key: string): string[];

  /**
   * Get items that depend on this
   */
  getDependents(key: string): string[];
}

/**
 * Registry with indexing support
 */
export interface IndexedRegistry<T> extends Registry<string, T> {
  /**
   * Create an index
   */
  createIndex(name: string, keyExtractor: (item: T) => string): void;

  /**
   * Drop an index
   */
  dropIndex(name: string): void;

  /**
   * Get by index
   */
  getByIndex(indexName: string, key: string): T | undefined;

  /**
   * Check if index exists
   */
  hasIndex(name: string): boolean;
}

/**
 * Registry with caching support
 */
export interface CachedRegistry<T> extends Registry<string, T> {
  /**
   * Cache size limit
   */
  readonly cacheSize: number;

  /**
   * Set cache size
   */
  setCacheSize(size: number): void;

  /**
   * Clear cache
   */
  clearCache(): void;

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    hits: number;
    misses: number;
    size: number;
  };
}

/**
 * Registry with expiration support
 */
export interface ExpiringRegistry<T> extends Registry<string, T> {
  /**
   * Register with expiration
   */
  registerWithTTL(key: string, value: T, ttlMs: number): void;

  /**
   * Get remaining TTL
   */
  getTTL(key: string): number | undefined;

  /**
   * Refresh TTL
   */
  refreshTTL(key: string, ttlMs: number): void;

  /**
   * Clean expired items
   */
  cleanExpired(): number;
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
   * Commit the transaction
   */
  commit(): void;

  /**
   * Rollback the transaction
   */
  rollback(): void;

  /**
   * Check if in transaction
   */
  readonly inTransaction: boolean;
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
   * Drop a partition
   */
  dropPartition(name: string): void;

  /**
   * Register in partition
   */
  registerInPartition(partition: string, key: string, value: T): void;

  /**
   * Get from partition
   */
  getFromPartition(partition: string, key: string): T | undefined;

  /**
   * List partitions
   */
  listPartitions(): string[];
}
