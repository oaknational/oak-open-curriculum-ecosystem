/**
 * Correlation ID support for HTTP request tracing.
 */

import { randomBytes } from 'node:crypto';

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
 * The correlation ID combines a millisecond timestamp with six hex characters
 * from the cryptographic source (`node:crypto`), so it stays sortable and its
 * collision resistance does not rest on `Math.random` (sonar-disposition-policy
 * §S2245: every pseudo-random site takes the cryptographic source).
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
  const randomHex = randomBytes(3).toString('hex');

  return `req_${String(timestamp)}_${randomHex}`;
}
