/**
 * @fileoverview Public API for request tracing functionality
 * @module @oak-mcp-core/logging/tracing
 */

// Re-export all public interfaces and functions
export type { TraceContext, RequestTracingOptions } from './types.js';
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
} from './trace-utils.js';
export { RequestTracer } from './request-tracer.js';
export { createRequestTracer, globalTracer } from './tracer-factory.js';
