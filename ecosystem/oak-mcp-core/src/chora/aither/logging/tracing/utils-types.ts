/**
 * @fileoverview Type definitions for tracing utilities
 * @module @oak-mcp-core/logging/tracing/utils-types
 *
 * Contains all type definitions used by the tracing utility modules.
 * This includes interfaces for parsed headers, context options, and trace information.
 */

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Parsed traceparent header components
 */
export interface ParsedTraceparent {
  version: string;
  traceId: string;
  parentId: string;
  flags: string;
}

/**
 * Trace headers extracted from request
 */
export interface TraceHeaders {
  traceparent?: string;
  tracestate?: string;
}

/**
 * Options for creating trace context
 */
export interface TraceContextOptions {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  traceparent?: string;
  tracestate?: string;
  baggage?: Record<string, string>;
}

/**
 * Trace information for formatting
 */
export interface TraceInfo {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
}

/**
 * Validation patterns for trace components
 */
export const TRACE_PATTERNS = {
  traceId: /^[0-9a-f]{32}$/,
  parentId: /^[0-9a-f]{16}$/,
  flags: /^[0-9a-f]{2}$/,
} as const;
