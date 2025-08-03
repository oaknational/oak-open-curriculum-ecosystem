/**
 * @fileoverview Public API barrel export for tracing utilities
 * @module @oak-mcp-core/logging/tracing/utils-index
 *
 * Provides a consolidated public API for all tracing utility functions
 * and types, serving as the main entry point for consuming modules.
 */

// ============================================================================
// EXPORTS
// ============================================================================

// Type definitions
export type {
  ParsedTraceparent,
  TraceHeaders,
  TraceContextOptions,
  TraceInfo,
} from './utils-types.js';

export { TRACE_PATTERNS } from './utils-types.js';

// ID generation utilities
export { generateRequestId, generateSpanId } from './utils-id-generator.js';

// Header parsing utilities
export { parseTraceparent, extractTraceHeaders } from './utils-header-parser.js';

// Context creation utilities
export { createTraceContext, createSpanContext } from './utils-context-creator.js';

// Formatting and sanitization utilities
export { formatTraceInfo, sanitizeTraceContext, shouldSample } from './utils-formatters.js';
