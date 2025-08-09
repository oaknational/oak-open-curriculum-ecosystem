/**
 * @fileoverview Base handler patterns for Moria
 * @module moria/patterns/handler-base
 *
 * Core handler interfaces and basic types
 */

/**
 * Base handler interface for synchronous operations
 */
export interface Handler<TInput = unknown, TOutput = unknown> {
  /**
   * Handle the input and produce output
   */
  handle(input: TInput): TOutput;
}

/**
 * Alias for Handler to maintain compatibility with event processing terminology
 * Used in systems that prefer event-driven naming conventions
 */
export type EventProcessor<TEvent, TResult> = Handler<TEvent, TResult>;

/**
 * Handler for asynchronous operations
 */
export interface AsyncHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Handle the input asynchronously
   */
  handle(input: TInput): Promise<TOutput>;
}

/**
 * Result type for handlers that can fail
 */
export type HandlerResult<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Handler that returns success/failure results
 */
export interface ErrorHandler<TInput = unknown, TOutput = unknown, TError = Error> {
  /**
   * Handle input and return a result
   */
  handle(input: TInput): HandlerResult<TOutput, TError>;
}

/**
 * Handler that can be chained with other handlers
 */
export interface ChainableHandler<TInput = unknown, TOutput = unknown> {
  /**
   * Handle the input
   */
  handle(input: TInput): TOutput;

  /**
   * Chain with another handler
   */
  chain<TNext>(next: Handler<TOutput, TNext>): ChainableHandler<TInput, TNext>;
}

/**
 * Context passed to handlers
 */
export interface HandlerContext {
  /**
   * Request ID or trace ID
   */
  requestId?: string;

  /**
   * User or system that initiated the request
   */
  principal?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Middleware that wraps handlers
 */
export interface HandlerMiddleware<TInput = unknown, TOutput = unknown> {
  /**
   * Wrap a handler with additional behavior
   */
  wrap(handler: Handler<TInput, TOutput>): Handler<TInput, TOutput>;
}

/**
 * Pipeline of handlers executed in sequence
 */
export interface HandlerPipeline<TInput = unknown, TOutput = unknown> {
  /**
   * Handlers in the pipeline
   */
  handlers: Handler[];

  /**
   * Add a handler to the pipeline
   */
  add<T>(handler: Handler<TOutput, T>): HandlerPipeline<TInput, T>;

  /**
   * Execute the pipeline
   */
  execute(input: TInput): TOutput;
}

/**
 * Factory for creating handlers
 */
export interface HandlerFactory<TConfig = unknown, TInput = unknown, TOutput = unknown> {
  /**
   * Create a handler with the given configuration
   */
  create(config: TConfig): Handler<TInput, TOutput>;
}
