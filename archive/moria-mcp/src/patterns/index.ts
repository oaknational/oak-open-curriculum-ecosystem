/**
 * @fileoverview Export all pattern interfaces
 * @module moria/patterns
 */

// Tool patterns
export type { ToolExecutor, ToolDefinition, Tool, ToolRegistry, ToolValidator } from './tool';

// Handler patterns
export type {
  Handler,
  AsyncHandler,
  ErrorHandler,
  ChainableHandler,
  HandlerContext,
  HandlerMiddleware,
  HandlerPipeline,
  HandlerFactory,
  EventProcessor,
  HandlerResult,
  CompositeHandler,
  ConditionalHandler,
  PrioritizedHandler,
  TransformHandler,
  StatefulHandler,
  RetryableHandler,
  BatchHandler,
  LifecycleHandler,
  ValidatingHandler,
  CancellableHandler,
  EventEmittingHandler,
} from './handler';

// Registry patterns
export type {
  Registry,
  TypedRegistry,
  NamedRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryEntry,
  RegistryFilter,
  RegistryQuery,
  PluginRegistry,
  VersionedRegistry,
  TaggedRegistry,
  DependencyRegistry,
  IndexedRegistry,
  CachedRegistry,
  ExpiringRegistry,
  TransactionalRegistry,
  PartitionedRegistry,
} from './registry';
