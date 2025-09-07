/**
 * @fileoverview Main entry point for Moria package
 * @module moria
 *
 * Moria (Molecules/Atoms) - Pure abstractions with zero dependencies
 * This package provides foundational interfaces and patterns for the ecosystem.
 */

// Export all types
export type {
  // Core types
  Result,
  AsyncResult,
  Optional,
  Nullable,
  Maybe,
  NonEmptyArray,
  DeepReadonly,
  DeepPartial,
  Primitive,
  JsonValue,
  JsonObject,
  JsonArray,
  Brand,
  Tagged,
  Opaque,
  KeysOfType,
  PickByType,
  OmitByType,
  RequiredKeys,
  OptionalKeys,
  Fn,
  AsyncFn,
  Constructor,
  AbstractConstructor,
  Mixin,
  UnionToIntersection,
  TupleToUnion,
  Last,
  Length,
  Tail,
  Head,
  Strict,
  Promisify,
  Awaited,
  Path,
  PathValue,
  // State machine types
  StateTransition,
  StateMachine,
  StateWithActions,
  StateMachineWithActions,
  StateMachineInstance,
  HierarchicalState,
  TransitionResult,
  StateHistory,
  // Boundary types
  Pure,
  Effect,
  Boundary,
  PureTransform,
  EffectfulOperation,
  PureToEffect,
  EffectToPure,
  Command,
  Query,
  AsyncQuery,
  IO,
  Computation,
} from './types/index.js';

export {
  // Result utilities
  Ok,
  Err,
  isOk,
  isErr,
  mapResult,
  flatMapResult,
  unwrapOr,
  unwrapOrElse,
  mapError,
  combineResults,
  tryCatch,
  tryCatchAsync,
  // Boundary utilities
  isPure,
  isEffect,
  liftPure,
  mapEffect,
  chainEffect,
  combineEffects,
  sequenceEffects,
  // External boundary utilities - ONLY for validating external data
  isObject,
  isEnvironmentObject,
  hasProperty,
  hasNestedProperty,
  extractProperty,
  extractNestedProperty,
} from './types/index.js';

// Export all interfaces
export type {
  // Logger interface
  Logger,
  // Storage interface
  StorageProvider,
  AsyncStorageProvider,
  // Environment interface
  EnvironmentProvider,
  // Event bus interfaces
  EventHandler,
  EventUnsubscribe,
  EventBus,
  // Stream interfaces
  ReadableStream,
  WritableStream,
  DuplexStream,
} from './interfaces/index.js';

// Export patterns (used by oak-notion-mcp)
export type {
  // Handler patterns
  Handler,
  AsyncHandler,
  ErrorHandler,
  HandlerContext,
  HandlerMiddleware,
  HandlerPipeline,
  HandlerFactory,
  // Registry patterns
  Registry,
  RegistryEntry,
  RegistryFilter,
  // Tool patterns
  ToolExecutor,
  ToolDefinition,
  Tool,
  ToolRegistry,
  ToolValidator,
} from './patterns/index.js';
