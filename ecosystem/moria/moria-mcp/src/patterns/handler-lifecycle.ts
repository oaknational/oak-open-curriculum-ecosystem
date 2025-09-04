/**
 * @fileoverview Lifecycle and validation handler patterns for Moria
 * @module moria/patterns/handler-lifecycle
 *
 * Handler interfaces for lifecycle management and validation
 */

/**
 * Handler with lifecycle hooks
 */
export interface LifecycleHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Called before handling
   */
  beforeHandle?(input: TInput): void;

  /**
   * Main handler logic
   */
  handle(input: TInput): TOutput;

  /**
   * Called after handling
   */
  afterHandle?(input: TInput, output: TOutput): void;

  /**
   * Called on error
   */
  onError?(input: TInput, error: Error): void;
}

/**
 * Handler that validates input
 */
export interface ValidatingHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Validate the input
   */
  validate(input: TInput): boolean | string;

  /**
   * Handle valid input
   */
  handle(input: TInput): TOutput;
}

/**
 * Handler that can be cancelled
 */
export interface CancellableHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Handle with cancellation support
   */
  handle(input: TInput, signal?: AbortSignal): TOutput | Promise<TOutput>;

  /**
   * Check if handler is currently processing
   */
  isProcessing(): boolean;

  /**
   * Cancel current processing
   */
  cancel(): void;
}

/**
 * Handler that emits events
 */
import type { JsonValue } from '../types/core.js';

export interface EventEmittingHandler<
  TInput = unknown,
  TOutput = unknown,
  TEvents extends Record<string, JsonValue> = Record<string, JsonValue>,
> {
  /**
   * Subscribe to an event
   */
  on<K extends keyof TEvents>(event: K, handler: (data: TEvents[K]) => void): void;

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof TEvents>(event: K, handler: (data: TEvents[K]) => void): void;

  /**
   * Handle input and emit events
   */
  handle(input: TInput): TOutput;
}
