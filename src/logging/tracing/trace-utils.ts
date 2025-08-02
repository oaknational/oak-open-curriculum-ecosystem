/**
 * @fileoverview Pure utility functions for trace management
 * @module @oak-mcp-core/logging/tracing
 */

import { randomBytes } from 'node:crypto';
import type { TraceContext } from './types.js';

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

/**
 * Parse W3C Traceparent header
 * @param traceparent - Traceparent header value
 * @returns Parsed trace information
 */
export function parseTraceparent(traceparent: string): {
  version: string;
  traceId: string;
  parentId: string;
  flags: string;
} | null {
  // W3C Trace Context format: version-traceId-parentId-flags
  const parts = traceparent.split('-');
  if (parts.length !== 4) {
    return null;
  }

  const version = parts[0];
  const traceId = parts[1];
  const parentId = parts[2];
  const flags = parts[3];

  // Validate format - all parts are guaranteed to exist due to length check
  if (
    !version ||
    version.length !== 2 ||
    !traceId ||
    traceId.length !== 32 ||
    !parentId ||
    parentId.length !== 16 ||
    !flags ||
    flags.length !== 2
  ) {
    return null;
  }

  return { version, traceId, parentId, flags };
}

/**
 * Extract trace headers from incoming request
 * @param headers - Request headers object
 * @returns Extracted trace context
 */
export function extractTraceHeaders(
  headers: Record<string, string | string[] | undefined>,
): Partial<TraceContext> {
  const context: Partial<TraceContext> = {};

  // W3C Trace Context
  const traceparent = headers['traceparent'];
  if (typeof traceparent === 'string') {
    const parsed = parseTraceparent(traceparent);
    if (parsed) {
      context.traceId = parsed.traceId;
      context.parentSpanId = parsed.parentId;
    }
  }

  // X-Request-ID (common pattern)
  const requestId = headers['x-request-id'] ?? headers['X-Request-ID'];
  if (typeof requestId === 'string') {
    context.requestId = requestId;
  }

  // User context
  const userId = headers['x-user-id'] ?? headers['X-User-ID'];
  if (typeof userId === 'string') {
    context.userId = userId;
  }

  const sessionId = headers['x-session-id'] ?? headers['X-Session-ID'];
  if (typeof sessionId === 'string') {
    context.sessionId = sessionId;
  }

  return context;
}

/**
 * Create a new trace context
 * @param options - Context creation options
 * @returns Complete trace context
 */
export function createTraceContext(options: {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  userId?: string;
  sessionId?: string;
  method?: string;
  path?: string;
  headers?: Record<string, string | string[] | undefined>;
}): TraceContext {
  const requestId = options.requestId ?? generateRequestId();
  const traceId = options.traceId ?? requestId;
  const spanId = options.spanId ?? generateSpanId();

  // Extract additional context from headers if provided
  const headerContext = options.headers ? extractTraceHeaders(options.headers) : {};

  return {
    requestId,
    traceId,
    spanId,
    parentSpanId: options.parentSpanId ?? headerContext.parentSpanId,
    userId: options.userId ?? headerContext.userId,
    sessionId: options.sessionId ?? headerContext.sessionId,
    method: options.method,
    path: options.path,
    ...headerContext,
  };
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

/**
 * Format trace information for logging
 * @param trace - Trace context to format
 * @returns Formatted trace string
 */
export function formatTraceInfo(trace: {
  requestId?: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
}): string {
  const parts: string[] = [];

  if (trace.requestId) {
    parts.push(`req=${trace.requestId}`);
  }
  if (trace.traceId && trace.traceId !== trace.requestId) {
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
 * Sanitize trace context for safe logging
 * @param context - Trace context to sanitize
 * @param options - Sanitization options
 * @returns Sanitized context
 */
export function sanitizeTraceContext(
  context: TraceContext,
  options: {
    includeUserInfo?: boolean;
    includeSessionInfo?: boolean;
    includePath?: boolean;
  } = {},
): TraceContext {
  const sanitized: TraceContext = {
    requestId: context.requestId,
    traceId: context.traceId,
    spanId: context.spanId,
    parentSpanId: context.parentSpanId,
  };

  if (options.includeUserInfo && context.userId) {
    sanitized.userId = context.userId;
  }

  if (options.includeSessionInfo && context.sessionId) {
    sanitized.sessionId = context.sessionId;
  }

  if (options.includePath) {
    sanitized.method = context.method;
    sanitized.path = context.path;
  }

  if (context.statusCode !== undefined) {
    sanitized.statusCode = context.statusCode;
  }

  if (context.duration !== undefined) {
    sanitized.duration = context.duration;
  }

  return sanitized;
}

/**
 * Determine if a request should be sampled
 * @param sampleRate - Sample rate between 0 and 1
 * @returns True if request should be sampled
 */
export function shouldSample(sampleRate = 1.0): boolean {
  if (sampleRate <= 0) return false;
  if (sampleRate >= 1) return true;
  return Math.random() < sampleRate;
}
