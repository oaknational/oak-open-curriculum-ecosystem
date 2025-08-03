/**
 * @fileoverview Type definitions for request tracing
 * @module @oak-mcp-core/logging/tracing
 */

import type { LogContext } from '../logger-interface.js';

/**
 * Trace context for request tracking
 */
export interface TraceContext extends LogContext {
  /**
   * Unique request identifier
   */
  requestId: string;

  /**
   * Trace identifier (may be same as requestId)
   */
  traceId?: string;

  /**
   * Current span identifier
   */
  spanId?: string;

  /**
   * Parent span identifier
   */
  parentSpanId?: string;

  /**
   * User identifier
   */
  userId?: string;

  /**
   * Session identifier
   */
  sessionId?: string;

  /**
   * Request method (HTTP)
   */
  method?: string;

  /**
   * Request path (HTTP)
   */
  path?: string;

  /**
   * HTTP status code
   */
  statusCode?: number;

  /**
   * Request duration in milliseconds
   */
  duration?: number;

  /**
   * Additional trace metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Options for request tracing
 */
export interface RequestTracingOptions {
  /**
   * Enable tracing (default: true)
   */
  enabled?: boolean;

  /**
   * Sample rate (0-1, default: 1.0)
   */
  sampleRate?: number;

  /**
   * Prefix for request IDs (default: 'req')
   */
  requestIdPrefix?: string;

  /**
   * Extract headers from requests (default: true)
   */
  extractHeaders?: boolean;

  /**
   * Propagate trace headers (default: true)
   */
  propagateHeaders?: boolean;

  /**
   * Log trace info (default: true)
   */
  logTraceInfo?: boolean;
}
