/**
 * @fileoverview Handler patterns for Moria
 * @module moria/patterns/handler
 *
 * Provides pure handler abstractions with zero dependencies.
 * Handlers process inputs and produce outputs in a composable way.
 */

// Re-export all handler types from sub-modules
export type {
  Handler,
  EventProcessor,
  AsyncHandler,
  HandlerResult,
  ErrorHandler,
  ChainableHandler,
  HandlerContext,
  HandlerMiddleware,
  HandlerPipeline,
  HandlerFactory,
} from './handler-base';

export type {
  CompositeHandler,
  ConditionalHandler,
  PrioritizedHandler,
  TransformHandler,
  StatefulHandler,
  RetryableHandler,
  BatchHandler,
} from './handler-advanced';

export type {
  LifecycleHandler,
  ValidatingHandler,
  CancellableHandler,
  EventEmittingHandler,
} from './handler-lifecycle';
