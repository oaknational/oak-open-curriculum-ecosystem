/**
 * @fileoverview Registry patterns for Moria
 * @module moria/patterns/registry
 *
 * Provides pure registry abstractions with zero dependencies.
 * Registries manage collections of items with various access patterns.
 */

// Re-export all registry types from sub-modules
export type {
  Registry,
  PluginRegistry,
  TypedRegistry,
  NamedRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryObserver,
  RegistryEvent,
  RegistryEntry,
  RegistryFilter,
  RegistryQuery,
} from './registry-base';

export type {
  VersionedRegistry,
  TaggedRegistry,
  DependencyRegistry,
  IndexedRegistry,
  CachedRegistry,
  ExpiringRegistry,
  TransactionalRegistry,
  PartitionedRegistry,
} from './registry-advanced';
