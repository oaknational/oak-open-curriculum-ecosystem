/**
 * Configuration for SDK request retry with exponential backoff.
 *
 * Pure functions for testability - no side effects.
 *
 * @public
 */

/**
 * Per-status-code retry limits.
 * Maps HTTP status codes to their maximum retry count.
 * @public
 */
export type StatusCodeMaxRetries = Readonly<Partial<Record<number, number>>>;

/**
 * Configuration for SDK request retry with exponential backoff.
 * Automatically retries transient failures (429, 503) with increasing delays.
 * Supports per-status-code retry limits for conservative retries on 404/500.
 * @public
 */
export interface RetryConfig {
  /** Enable/disable retry. Default: true */
  readonly enabled: boolean;
  /** Maximum retry attempts. Default: 3 */
  readonly maxRetries: number;
  /** Initial backoff delay in ms. Default: 1000ms */
  readonly initialDelayMs: number;
  /** Backoff multiplier. Default: 2 (exponential) */
  readonly backoffMultiplier: number;
  /** Maximum backoff delay in ms. Default: 60000ms (1 minute) */
  readonly maxDelayMs: number;
  /** HTTP status codes that trigger retry. Default: [429, 503] */
  readonly retryableStatusCodes: readonly number[];
  /**
   * Per-status-code maximum retries. Overrides `maxRetries` for specific codes.
   * Example: `{ 404: 2, 500: 2 }` limits 404/500 to 2 retries while others use `maxRetries`.
   * @public
   */
  readonly statusCodeMaxRetries?: StatusCodeMaxRetries;
}

/**
 * Default retry configuration.
 * Exponential backoff: 1s, 2s, 4s (max 3 attempts).
 * Retries 429 (rate limit) and 503 (service unavailable).
 * @public
 */
export const DEFAULT_RETRY_CONFIG: Readonly<RetryConfig> = Object.freeze({
  enabled: true,
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 60000,
  retryableStatusCodes: Object.freeze([429, 503]),
});

/**
 * Create retry config with overrides.
 * Pure function - no side effects, does not mutate defaults.
 *
 * @param overrides - Partial config to override defaults
 * @returns New retry configuration
 * @public
 */
export function createRetryConfig(overrides?: Partial<RetryConfig>): RetryConfig {
  return { ...DEFAULT_RETRY_CONFIG, ...overrides };
}

/**
 * Calculate exponential backoff delay for attempt N.
 * Pure function for testability - no side effects.
 * Formula: initialDelay * (multiplier ^ attempt), capped at maxDelay.
 *
 * @param attempt - Current attempt number (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 * @public
 */
export function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Determine if a response should be retried based on status code.
 * Pure function for testability - no side effects.
 *
 * @param statusCode - HTTP status code from response
 * @param config - Retry configuration
 * @returns True if this status code should trigger retry
 * @public
 */
export function shouldRetry(statusCode: number, config: RetryConfig): boolean {
  if (!config.enabled) {
    return false;
  }
  return config.retryableStatusCodes.includes(statusCode);
}

/**
 * Get the maximum retry count for a specific status code.
 * Uses per-status-code limit if defined, otherwise falls back to `maxRetries`.
 * Pure function for testability - no side effects.
 *
 * @param statusCode - HTTP status code from response
 * @param config - Retry configuration
 * @returns Maximum retry attempts for this status code
 * @public
 */
export function getMaxRetriesForStatus(statusCode: number, config: RetryConfig): number {
  const perStatusLimit = config.statusCodeMaxRetries?.[statusCode];
  if (perStatusLimit !== undefined) {
    return perStatusLimit;
  }
  return config.maxRetries;
}
