/**
 * @fileoverview Handler patterns for Moria
 * @module moria/patterns/handler
 *
 * Provides pure handler abstractions with zero dependencies.
 * Handlers process inputs and produce outputs in a composable way.
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
export interface ChainableHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Chain this handler with another
   */
  chain<TNext>(next: Handler<TOutput, TNext>): ChainableHandler<TInput, TNext>;
}

/**
 * Context wrapper for handlers
 */
export interface HandlerContext<TInput = unknown, TContext = unknown> {
  /**
   * The input to process
   */
  input: TInput;

  /**
   * Additional context for processing
   */
  context: TContext;

  /**
   * Optional abort signal for cancellation support
   * Using unknown to avoid dependency on DOM types
   */
  signal?: unknown;

  /**
   * Optional metadata for extensibility
   */
  metadata?: Record<string, unknown>;
}

/**
 * Middleware that wraps handler execution
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
export interface HandlerPipeline<TInput = unknown, TOutput = TInput | Promise<TInput>> {
  /**
   * Handlers in the pipeline
   */
  handlers: Handler<TInput, TInput>[] | AsyncHandler<TInput, TInput>[];

  /**
   * Add a handler to the pipeline
   */
  add(
    handler: Handler<TInput, TInput> | AsyncHandler<TInput, TInput>,
  ): HandlerPipeline<TInput, TOutput>;

  /**
   * Execute the pipeline
   */
  execute(input: TInput): TOutput;
}

/**
 * Factory for creating handlers
 */
export interface HandlerFactory<TInput = unknown, TOutput = unknown> {
  /**
   * Create a new handler instance
   */
  create(): Handler<TInput, TOutput>;
}

/**
 * Composite handler that delegates to multiple handlers
 */
export interface CompositeHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput[]> {
  /**
   * Child handlers
   */
  readonly handlers: Handler<TInput, TOutput>[];

  /**
   * Add a handler to the composite
   */
  add(handler: Handler<TInput, TOutput>): this;

  /**
   * Remove a handler from the composite
   */
  remove(handler: Handler<TInput, TOutput>): this;
}

/**
 * Handler that can be conditionally executed
 */
export interface ConditionalHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput | undefined> {
  /**
   * Condition to check before handling
   */
  canHandle(input: TInput): boolean;
}

/**
 * Handler with priority for ordering
 */
export interface PrioritizedHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Priority level (higher = executed first)
   */
  readonly priority: number;
}

/**
 * Handler that can transform between types
 */
export interface TransformHandler<TFrom = unknown, TTo = unknown> extends Handler<TFrom, TTo> {
  /**
   * Check if transformation is possible
   */
  canTransform(from: TFrom): boolean;
}

/**
 * Handler that maintains state between invocations
 */
export interface StatefulHandler<TInput = unknown, TOutput = unknown, TState = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Current state
   */
  readonly state: TState;

  /**
   * Reset the handler state
   */
  reset(): void;
}

/**
 * Handler that can be retried on failure
 */
export interface RetryableHandler<TInput = unknown, TOutput = unknown>
  extends AsyncHandler<TInput, TOutput> {
  /**
   * Maximum retry attempts
   */
  readonly maxRetries: number;

  /**
   * Delay between retries in milliseconds
   */
  readonly retryDelay: number;

  /**
   * Check if error is retryable
   */
  isRetryable(error: Error): boolean;
}

/**
 * Handler that processes items in batches
 */
export interface BatchHandler<TItem = unknown, TResult = unknown> {
  /**
   * Process a batch of items
   */
  handleBatch(items: TItem[]): TResult[];

  /**
   * Maximum batch size
   */
  readonly batchSize: number;
}

/**
 * Handler with lifecycle hooks
 */
export interface LifecycleHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Called before handling
   */
  beforeHandle?(input: TInput): void;

  /**
   * Called after handling
   */
  afterHandle?(input: TInput, output: TOutput): void;

  /**
   * Called on error
   */
  onError?(input: TInput, error: Error): void;

  /**
   * Called on state change
   */
  onStateChange?(from: unknown, to: unknown): void;

  /**
   * Check if state transition is allowed
   */
  canTransition?(from: unknown, to: unknown): boolean;
}

/**
 * Handler that can validate input
 */
export interface ValidatingHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Validate input before handling
   */
  validate(input: TInput): boolean;

  /**
   * Get validation errors
   */
  getValidationErrors(input: TInput): string[];
}

/**
 * Handler that can be cancelled
 */
export interface CancellableHandler<TInput = unknown, TOutput = unknown>
  extends AsyncHandler<TInput, TOutput> {
  /**
   * Cancel the current operation
   */
  cancel(): void;

  /**
   * Check if operation is cancelled
   */
  readonly isCancelled: boolean;
}

/**
 * Handler that emits events
 */
export interface EventEmittingHandler<TInput = unknown, TOutput = unknown, TEvent = unknown>
  extends Handler<TInput, TOutput> {
  /**
   * Subscribe to events
   */
  on(event: string, listener: (data: TEvent) => void): void;

  /**
   * Unsubscribe from events
   */
  off(event: string, listener: (data: TEvent) => void): void;

  /**
   * Emit an event
   */
  emit(event: string, data: TEvent): void;
}
