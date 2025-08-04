/**
 * @fileoverview Context creation utilities for tracing
 * @module @oak-mcp-core/logging/tracing/utils-context-creator
 *
 * Provides utilities for creating trace contexts from various inputs,
 * including W3C Traceparent headers and creating child span contexts.
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { TraceContext } from './types.js';
import type { TraceContextOptions, ParsedTraceparent } from './utils-types.js';
import { generateRequestId, generateSpanId } from './utils-id-generator.js';
import { parseTraceparent } from './utils-header-parser.js';

// ============================================================================
// PRIVATE UTILITIES
// ============================================================================

/**
 * Create context from parsed traceparent
 */
function createFromTraceparent(
  parsed: ParsedTraceparent,
  options: { requestId?: string; spanId?: string; baggage?: Record<string, string> },
): TraceContext {
  return {
    requestId: options.requestId ?? generateRequestId(),
    traceId: parsed.traceId,
    spanId: options.spanId ?? generateSpanId(),
    parentSpanId: parsed.parentId,
    sampled: (parseInt(parsed.flags, 16) & 0x01) === 1,
    baggage: options.baggage ?? {},
  };
}

/**
 * Create new trace context with defaults
 */
function createNewContext(options: {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  baggage?: Record<string, string>;
}): TraceContext {
  return {
    requestId: options.requestId ?? generateRequestId(),
    traceId: options.traceId ?? generateSpanId() + generateSpanId(), // 32 chars
    spanId: options.spanId ?? generateSpanId(),
    parentSpanId: options.parentSpanId,
    sampled: true,
    baggage: options.baggage ?? {},
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Create a new trace context
 * @param options - Trace context options
 * @returns New trace context
 */
export function createTraceContext(options: TraceContextOptions): TraceContext {
  // Try to use traceparent if provided
  if (options.traceparent) {
    const parsed = parseTraceparent(options.traceparent);
    if (parsed) {
      return createFromTraceparent(parsed, options);
    }
  }

  // Otherwise create new context
  return createNewContext(options);
}

/**
 * Create a child span context
 * @param parent - Parent trace context
 * @param spanId - Optional span ID (generated if not provided)
 * @returns Child trace context
 */
export function createSpanContext(parent: TraceContext, spanId?: string): TraceContext {
  return {
    ...parent,
    spanId: spanId ?? generateSpanId(),
    parentSpanId: parent.spanId,
  };
}
