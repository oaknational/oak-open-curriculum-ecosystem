/**
 * @fileoverview Formatting and sanitization utilities for tracing
 * @module @oak-mcp-core/logging/tracing/utils-formatters
 *
 * Provides utilities for formatting trace information for logs,
 * sanitizing sensitive trace data, and sampling decisions.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { TraceContext } from './types.js';
import type { TraceInfo } from './utils-types.js';

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Format trace information for logging
 * @param trace - Trace information to format
 * @returns Formatted trace string
 */
export function formatTraceInfo(trace: TraceInfo): string {
  const parts: string[] = [];

  if (trace.requestId) {
    parts.push(`req=${trace.requestId}`);
  }

  if (trace.traceId) {
    parts.push(`trace=${trace.traceId}`);
  }

  if (trace.spanId) {
    parts.push(`span=${trace.spanId}`);
  }

  if (trace.parentSpanId) {
    parts.push(`parent=${trace.parentSpanId}`);
  }

  return parts.join(' ');
}

/**
 * Sanitize trace context for logging
 * Removes sensitive baggage items
 * @param context - Trace context to sanitize
 * @param sensitiveKeys - Keys to redact from baggage
 * @returns Sanitized trace context
 */
export function sanitizeTraceContext(
  context: TraceContext,
  sensitiveKeys: string[] = [],
): TraceContext {
  if (sensitiveKeys.length === 0 || !context.baggage) {
    return context;
  }

  const sanitizedBaggage: Record<string, string> = {};
  for (const [key, value] of Object.entries(context.baggage)) {
    if (sensitiveKeys.includes(key)) {
      sanitizedBaggage[key] = '[REDACTED]';
    } else {
      sanitizedBaggage[key] = typeof value === 'string' ? value : String(value);
    }
  }

  return {
    ...context,
    baggage: sanitizedBaggage,
  };
}

/**
 * Determine if a request should be sampled
 * @param sampleRate - Sampling rate between 0 and 1
 * @returns True if the request should be sampled
 */
export function shouldSample(sampleRate = 1.0): boolean {
  if (sampleRate <= 0) {
    return false;
  }
  if (sampleRate >= 1) {
    return true;
  }
  return Math.random() < sampleRate;
}
