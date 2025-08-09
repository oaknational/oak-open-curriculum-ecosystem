/**
 * @fileoverview Base registry patterns for Moria
 * @module moria/patterns/registry-base
 *
 * Core registry interfaces and basic types
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
  unload(name: string): boolean;

  /**
   * Get all loaded plugins
   */
  getAll(): T[];
}

/**
 * Registry with type constraints
 */
export interface TypedRegistry<T> extends Registry<string, T> {
  /**
   * Type name for validation
   */
  readonly typeName: string;

  /**
   * Validate type before registration
   */
  validateType(value: unknown): value is T;
}

/**
 * Registry with named items
 */
export interface NamedRegistry<T extends { name: string }> extends Registry<string, T> {
  /**
   * Register using the item's name property
   */
  registerNamed(item: T): void;

  /**
   * Get all names
   */
  getNames(): string[];
}

/**
 * Registry with hierarchical keys
 */
export interface HierarchicalRegistry<T> extends Registry<string, T> {
  /**
   * Path separator (e.g., '/', '.')
   */
  readonly separator: string;

  /**
   * Get all items under a path
   */
  getByPath(path: string): T[];

  /**
   * Get all child paths under a path
   */
  getChildPaths(path: string): string[];
}

/**
 * Observable registry that notifies on changes
 */
export interface ObservableRegistry<TKey = string, TValue = unknown>
  extends Registry<TKey, TValue> {
  /**
   * Subscribe to changes
   */
  subscribe(observer: RegistryObserver<TKey, TValue>): () => void;

  /**
   * Notify all observers
   */
  notify(event: RegistryEvent<TKey, TValue>): void;
}

/**
 * Observer for registry changes
 */
export interface RegistryObserver<TKey, TValue> {
  /**
   * Called when registry changes
   */
  onRegistryChange(event: RegistryEvent<TKey, TValue>): void;
}

/**
 * Registry change event
 */
export interface RegistryEvent<TKey, TValue> {
  /**
   * Type of change
   */
  type: 'register' | 'unregister' | 'clear';

  /**
   * Key affected (not present for 'clear')
   */
  key?: TKey;

  /**
   * Value affected (not present for 'clear')
   */
  value?: TValue;
}

/**
 * Registry entry with metadata
 */
export interface RegistryEntry<T> {
  /**
   * The actual value
   */
  value: T;

  /**
   * When the entry was registered
   */
  registeredAt: Date;

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
   * Test if an item matches
   */
  matches(item: T): boolean;

  /**
   * Combine with another filter (AND)
   */
  and?(other: RegistryFilter<T>): RegistryFilter<T>;

  /**
   * Combine with another filter (OR)
   */
  or?(other: RegistryFilter<T>): RegistryFilter<T>;
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
