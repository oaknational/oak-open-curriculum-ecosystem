/**
 * @fileoverview ID generation utilities for tracing
 * @module @oak-mcp-core/logging/tracing/utils-id-generator
 *
 * Provides utilities for generating unique request IDs and span IDs
 * used in distributed tracing and request correlation.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import { randomBytes } from 'node:crypto';

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Generate a unique request ID
 * @param prefix - Optional prefix for the ID (default: 'req')
 * @returns Generated request ID
 */
export function generateRequestId(prefix = 'req'): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(8).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate a span ID for distributed tracing
 * @returns 16-character hex string
 */
export function generateSpanId(): string {
  return randomBytes(8).toString('hex');
}
