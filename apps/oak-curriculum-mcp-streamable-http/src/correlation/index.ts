/**
 * Correlation ID support for HTTP request tracing.
 */

/**
 * Context object containing a correlation ID for request tracing.
 *
 * @public
 */
export interface CorrelationContext {
  /**
   * Unique identifier for correlating logs and operations across a request lifecycle.
   *
   * Format: `req_{timestamp}_{randomHex}` (e.g., `req_1699123456789_a3f2c9`)
   */
  readonly correlationId: string;
}

/**
 * Generates a unique correlation ID for request tracing.
 *
 * The correlation ID uses a combination of timestamp and random hex to ensure
 * uniqueness while maintaining sortability and collision resistance.
 *
 * @returns A correlation ID in the format `req_{timestamp}_{randomHex}`
 *
 * @example
 * ```typescript
 * const id = generateCorrelationId();
 * // Returns: "req_1699123456789_a3f2c9"
 * ```
 *
 * @public
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now();
  const randomHex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');

  return `req_${String(timestamp)}_${randomHex}`;
}
