/**
 * @fileoverview Advanced handler patterns for Moria
 * @module moria/patterns/handler-advanced
 *
 * Advanced handler interfaces for complex use cases
 */

import type { Handler, AsyncHandler } from './handler-base';

/**
 * Handler composed of multiple handlers
 */
export interface CompositeHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Component handlers
   */
  handlers: Handler<TInput, TOutput>[];

  /**
   * Compose the handlers' results
   */
  compose(results: TOutput[]): TOutput;

  /**
   * Handle input using all component handlers
   */
  handle(input: TInput): TOutput;
}

/**
 * Handler that conditionally processes input
 */
export interface ConditionalHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Condition to check
   */
  condition(input: TInput): boolean;

  /**
   * Handler for when condition is true
   */
  whenTrue: Handler<TInput, TOutput>;

  /**
   * Handler for when condition is false
   */
  whenFalse: Handler<TInput, TOutput>;

  /**
   * Handle input conditionally
   */
  handle(input: TInput): TOutput;
}

/**
 * Handler with priority for ordering
 */
export interface PrioritizedHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Priority (lower values = higher priority)
   */
  priority: number;

  /**
   * The actual handler
   */
  handler: Handler<TInput, TOutput>;
}

/**
 * Handler that transforms input before processing
 */
export interface TransformHandler<TInput = unknown, TTransformed = unknown, TOutput = unknown> {
  /**
   * Transform the input
   */
  transform(input: TInput): TTransformed;

  /**
   * Process the transformed input
   */
  process(transformed: TTransformed): TOutput;

  /**
   * Handle by transforming then processing
   */
  handle(input: TInput): TOutput;
}

/**
 * Handler that maintains state
 */
export interface StatefulHandler<TInput = unknown, TOutput = unknown, TState = unknown> {
  /**
   * Current state
   */
  state: TState;

  /**
   * Handle input and update state
   */
  handle(input: TInput): TOutput;

  /**
   * Reset state to initial value
   */
  reset(): void;
}

/**
 * Handler that can retry on failure
 */
export interface RetryableHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Maximum number of retries
   */
  maxRetries: number;

  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;

  /**
   * The handler to retry
   */
  handler: Handler<TInput, TOutput> | AsyncHandler<TInput, TOutput>;

  /**
   * Handle with retry logic
   */
  handle(input: TInput): TOutput | Promise<TOutput>;
}

/**
 * Handler that processes inputs in batches
 */
export interface BatchHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Batch size
   */
  batchSize: number;

  /**
   * Process a batch of inputs
   */
  processBatch(inputs: TInput[]): TOutput[];

  /**
   * Handle a single input (may buffer internally)
   */
  handle(input: TInput): TOutput | null;

  /**
   * Flush any buffered inputs
   */
  flush(): TOutput[];
}
