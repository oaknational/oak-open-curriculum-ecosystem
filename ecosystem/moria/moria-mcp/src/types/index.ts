/**
 * @fileoverview Export all type definitions
 * @module moria/types
 */

// Core type exports
export type {
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
} from './core';

// Result utility exports
export {
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
} from './result';

// State machine type exports
export type {
  StateTransition,
  StateMachine,
  StateWithActions,
  StateMachineWithActions,
  StateMachineInstance,
  HierarchicalState,
  TransitionResult,
  StateHistory,
} from './state-machine';

// Boundary pattern exports
export type {
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
} from './boundary';
export {
  isPure,
  isEffect,
  liftPure,
  mapEffect,
  chainEffect,
  combineEffects,
  sequenceEffects,
} from './boundary';
