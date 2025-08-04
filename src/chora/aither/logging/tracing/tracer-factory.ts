/**
 * @fileoverview Factory for creating RequestTracer instances
 * @module @oak-mcp-core/logging/tracing
 */

import { RequestTracer } from './request-tracer.js';
import type { RequestTracingOptions } from './types.js';

/**
 * Create a new request tracer instance
 * @param options - Tracing options
 * @returns New RequestTracer instance
 */
export function createRequestTracer(options?: RequestTracingOptions): RequestTracer {
  return new RequestTracer(options);
}

/**
 * Global request tracer instance
 * Can be used when a shared tracer is needed across the application
 */
export const globalTracer = createRequestTracer();
