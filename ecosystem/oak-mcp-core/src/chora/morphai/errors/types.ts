/**
 * @fileoverview Abstract error patterns - the forms of error handling
 * @module morphai/errors
 *
 * These patterns define how errors manifest and are handled.
 * They are the shapes that exceptions take.
 */

/**
 * The essence of error handling
 * Transforms unknown errors into known responses
 */
export interface ErrorHandler<TError = unknown, TResult = unknown> {
  handle(error: TError, context?: ErrorContext): TResult;
  canHandle(error: unknown): boolean;
}

/**
 * Error context - information about where and when
 */
export interface ErrorContext {
  readonly operation?: string;
  readonly timestamp?: Date;
  readonly correlationId?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * The pattern of error transformation
 */
export interface ErrorTransformer<TFrom = unknown, TTo = unknown> {
  transform(error: TFrom): TTo;
}

/**
 * Error recovery pattern
 */
export interface ErrorRecovery<TError = unknown, TResult = unknown> {
  attempt<T>(operation: () => Promise<T>): Promise<T | TResult>;
  recover(error: TError): Promise<TResult>;
}

/**
 * Retry pattern for transient errors
 */
export interface RetryStrategy {
  readonly maxAttempts: number;
  readonly delay: number;
  readonly backoff?: 'linear' | 'exponential';
  shouldRetry(error: unknown, attempt: number): boolean;
  getDelay(attempt: number): number;
}

/**
 * Circuit breaker pattern
 */
export interface CircuitBreaker {
  readonly state: 'closed' | 'open' | 'half-open';
  readonly failureThreshold: number;
  readonly recoveryTimeout: number;

  call<T>(operation: () => Promise<T>): Promise<T>;
  recordSuccess(): void;
  recordFailure(): void;
  reset(): void;
}

/**
 * Error aggregation pattern
 */
export interface ErrorAggregator {
  add(error: unknown): void;
  hasErrors(): boolean;
  getErrors(): readonly unknown[];
  clear(): void;
  throwIfHasErrors(): void;
}
