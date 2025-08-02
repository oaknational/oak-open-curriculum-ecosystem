/**
 * @fileoverview Request tracing implementation for distributed logging
 * @module @oak-mcp-core/logging
 *
 * This module will be extracted to oak-mcp-core.
 * Provides request correlation and distributed tracing support.
 *
 * This file now re-exports from the modular tracing subdomain
 * to maintain backward compatibility while reducing file size.
 */

// Re-export types
export type { TraceContext, RequestTracingOptions } from './tracing/index.js';

// Re-export utility functions
export {
  generateRequestId,
  generateSpanId,
  parseTraceparent,
  extractTraceHeaders,
  createTraceContext,
  createSpanContext,
  formatTraceInfo,
  sanitizeTraceContext,
  shouldSample,
} from './tracing/index.js';

// Re-export classes
export { RequestTracer } from './tracing/index.js';

// Re-export factory functions
export { createRequestTracer, globalTracer } from './tracing/index.js';
