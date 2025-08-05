/**
 * @fileoverview Abstract registry patterns - the forms of collection management
 * @module morphai/registries
 *
 * These patterns define how collections are organized and accessed.
 * They are the hidden structures that manage multiplicity.
 */

/**
 * The essence of a registry
 * A pattern for managing named entities
 */
export interface Registry<T> {
  register(name: string, item: T): void;
  unregister(name: string): boolean;
  get(name: string): T | undefined;
  has(name: string): boolean;
  getAll(): ReadonlyMap<string, T>;
  clear(): void;
  readonly size: number;
}

/**
 * Factory registry pattern
 * Manages factories that create instances
 */
export interface FactoryRegistry<TFactory, TProduct> {
  registerFactory(name: string, factory: TFactory): void;
  create(name: string, ...args: unknown[]): TProduct | undefined;
  hasFactory(name: string): boolean;
  getFactories(): ReadonlyMap<string, TFactory>;
}

/**
 * Hierarchical registry pattern
 * Registries with parent-child relationships
 */
export interface HierarchicalRegistry<T> extends Registry<T> {
  readonly parent?: HierarchicalRegistry<T>;
  createChild(): HierarchicalRegistry<T>;
  lookup(name: string): T | undefined; // Searches up the hierarchy
}

/**
 * Observable registry pattern
 * Notifies observers of registry changes
 */
export interface ObservableRegistry<T> extends Registry<T> {
  subscribe(observer: RegistryObserver<T>): () => void;
}

/**
 * Registry observer
 */
export interface RegistryObserver<T> {
  onRegister?(name: string, item: T): void;
  onUnregister?(name: string, item: T): void;
  onClear?(): void;
}

/**
 * Filtered registry view
 * Provides a filtered view of a registry
 */
export interface FilteredRegistry<T> extends Registry<T> {
  filter(predicate: (name: string, item: T) => boolean): FilteredRegistry<T>;
}

/**
 * Registry with metadata
 */
export interface MetadataRegistry<T, TMeta = unknown> extends Registry<T> {
  registerWithMetadata(name: string, item: T, metadata: TMeta): void;
  getMetadata(name: string): TMeta | undefined;
  getAllWithMetadata(): ReadonlyMap<string, { item: T; metadata: TMeta }>;
}
