/**
 * @fileoverview Request tracing implementation for distributed logging
 * @module @oak-mcp-core/logging
 *
 * This module will be extracted to oak-mcp-core.
 * Provides request correlation and distributed tracing support.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { LogContext } from './logger-interface.js';

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
   * Request path/URL
   */
  path?: string;

  /**
   * Sampling decision
   */
  sampled?: boolean;

  /**
   * Additional metadata
   */
  [key: string]: unknown;
}

/**
 * Options for request tracing
 */
export interface RequestTracingOptions {
  /**
   * Custom ID generator
   */
  generateId?: () => string;

  /**
   * Sampling rate (0-1)
   */
  sampleRate?: number;

  /**
   * Headers to extract trace context from
   */
  traceHeaders?: string[];

  /**
   * Sensitive keys to sanitize
   */
  sensitiveKeys?: string[];
}

/**
 * Generate a unique request ID
 * Pure function
 */
export function generateRequestId(prefix = 'req'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a span ID
 * Pure function
 */
export function generateSpanId(): string {
  return Math.random().toString(36).substring(2, 18);
}

/**
 * Parse W3C Trace Context traceparent header
 * Format: version-traceId-parentId-flags
 * Pure function
 */
export function parseTraceparent(traceparent: string): {
  version: string;
  traceId: string;
  parentId: string;
  flags: string;
} | null {
  const parts = traceparent.split('-');
  if (parts.length !== 4) return null;

  const version = parts[0];
  const traceId = parts[1];
  const parentId = parts[2];
  const flags = parts[3];

  // Validate format
  if (!version || version.length !== 2) return null;
  if (!traceId || traceId.length !== 32) return null;
  if (!parentId || parentId.length !== 16) return null;
  if (!flags || flags.length !== 2) return null;

  return { version, traceId, parentId, flags };
}

/**
 * Extract trace headers from HTTP headers
 * Pure function
 */
export function extractTraceHeaders(
  headers: Record<string, string | string[] | undefined>,
  traceHeaders: string[] = [
    'x-request-id',
    'x-trace-id',
    'x-correlation-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'traceparent',
    'tracestate',
  ],
): Record<string, string> {
  const extracted: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (traceHeaders.includes(lowerKey) && value) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          throw new Error(`Trace header '${key}' is an empty array. Expected at least one value.`);
        }
        const firstValue = value[0];
        if (!firstValue) {
          throw new Error(
            `Trace header '${key}' has undefined first element. This should not happen.`,
          );
        }
        extracted[lowerKey] = firstValue;
      } else {
        extracted[lowerKey] = value;
      }
    }
  }

  return extracted;
}

/**
 * Create trace context from various sources
 * Pure function
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
  headers?: Record<string, string>;
  generateId?: () => string;
}): TraceContext {
  const genId = options.generateId || (() => generateRequestId());

  const context: TraceContext = {
    requestId: options.requestId || genId(),
    timestamp: new Date().toISOString(),
  };

  // Set traceId (defaults to requestId)
  context.traceId = options.traceId || context.requestId;

  // Add optional fields
  if (options.spanId) context.spanId = options.spanId;
  if (options.parentSpanId) context.parentSpanId = options.parentSpanId;
  if (options.userId) context.userId = options.userId;
  if (options.sessionId) context.sessionId = options.sessionId;
  if (options.method) context.method = options.method;
  if (options.path) context.path = options.path;

  // Extract from headers if provided
  if (options.headers) {
    const extracted = extractTraceHeaders(options.headers);
    if (extracted['x-trace-id'] && !options.traceId) {
      context.traceId = extracted['x-trace-id'];
    }
    if (extracted['traceparent']) {
      const parsed = parseTraceparent(extracted['traceparent']);
      if (parsed && !options.traceId) {
        context.traceId = parsed.traceId;
        context.parentSpanId = parsed.parentId;
      }
    }
  }

  return context;
}

/**
 * Create a span context from parent
 * Pure function
 */
export function createSpanContext(parent: TraceContext, spanId?: string): TraceContext {
  return {
    ...parent,
    parentSpanId: parent.spanId,
    spanId: spanId || generateSpanId(),
  };
}

/**
 * Format trace info for logging
 * Pure function
 */
export function formatTraceInfo(trace: {
  requestId: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
}): string {
  const parts: string[] = [`req=${trace.requestId}`];

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
 * Sanitize trace context to remove sensitive data
 * Pure function
 */
export function sanitizeTraceContext(
  context: Record<string, unknown>,
  sensitiveKeys: string[] = ['authorization', 'cookie', 'password', 'token', 'secret', 'apiKey'],
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitive) =>
      lowerKey.includes(sensitive.toLowerCase()),
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Type-safe nested object sanitization
      const nestedContext: Record<string, unknown> = {};
      Object.assign(nestedContext, value);
      sanitized[key] = sanitizeTraceContext(nestedContext, sensitiveKeys);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Determine if request should be sampled
 * Pure function
 */
export function shouldSample(sampleRate = 1.0): boolean {
  if (sampleRate >= 1.0) return true;
  if (sampleRate <= 0) return false;
  return Math.random() < sampleRate;
}

/**
 * Request tracer using AsyncLocalStorage
 * Manages trace context across async boundaries
 */
export class RequestTracer {
  private storage: AsyncLocalStorage<TraceContext>;
  private options: RequestTracingOptions;

  constructor(storage?: AsyncLocalStorage<TraceContext>, options: RequestTracingOptions = {}) {
    this.storage = storage || new AsyncLocalStorage<TraceContext>();
    this.options = options;
  }

  /**
   * Run a function with trace context
   */
  async runWithTrace<T>(
    context: TraceContext | Partial<TraceContext>,
    fn: () => T | Promise<T>,
  ): Promise<T> {
    const fullContext = this.ensureFullContext(context);
    return this.storage.run(fullContext, fn);
  }

  /**
   * Run a function with a new span
   */
  async runWithSpan<T>(spanId: string | undefined, fn: () => T | Promise<T>): Promise<T> {
    const parent = this.getTraceContext();
    if (!parent) {
      throw new Error('No parent trace context available');
    }

    const spanContext = createSpanContext(parent, spanId);
    return this.storage.run(spanContext, fn);
  }

  /**
   * Get current trace context
   */
  getTraceContext(): TraceContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Get or create trace context
   */
  getOrCreateContext(partial?: Partial<TraceContext>): TraceContext {
    const existing = this.getTraceContext();
    if (existing) return existing;

    return this.ensureFullContext(partial || {});
  }

  /**
   * Create trace context from HTTP request
   */
  createFromRequest(request: {
    headers?: Record<string, string | string[] | undefined>;
    method?: string;
    url?: string;
    user?: { id?: string; sessionId?: string };
  }): TraceContext {
    const headers = request.headers || {};
    const extracted = extractTraceHeaders(headers, this.options.traceHeaders);

    return createTraceContext({
      requestId: extracted['x-request-id'],
      traceId: extracted['x-trace-id'],
      method: request.method,
      path: request.url,
      userId: request.user?.id,
      sessionId: request.user?.sessionId,
      headers: extracted,
      generateId: this.options.generateId,
    });
  }

  /**
   * Serialize trace context for propagation
   */
  serializeContext(context?: TraceContext): string {
    const ctx = context || this.getTraceContext();
    if (!ctx) return '';

    const sanitized = sanitizeTraceContext(
      {
        requestId: ctx.requestId,
        traceId: ctx.traceId,
        spanId: ctx.spanId,
        parentSpanId: ctx.parentSpanId,
      },
      this.options.sensitiveKeys,
    );

    return JSON.stringify(sanitized);
  }

  /**
   * Deserialize trace context
   */
  deserializeContext(serialized: string): TraceContext | null {
    try {
      const parsed: unknown = JSON.parse(serialized);

      // Type guard to validate parsed is an object
      if (typeof parsed !== 'object' || parsed === null) {
        return null;
      }

      // Check for required field
      if (!('requestId' in parsed)) {
        return null;
      }

      // At IO boundary - handle unknown data by building validated object
      // This avoids type assertions while ensuring type safety
      const partialContext: Partial<TraceContext> = {
        requestId: undefined,
        traceId: undefined,
        spanId: undefined,
        parentSpanId: undefined,
        userId: undefined,
        sessionId: undefined,
        timestamp: undefined,
        metadata: undefined,
      };

      // Safely extract properties using Object.entries
      Object.entries(parsed).forEach(([key, value]) => {
        if (key === 'requestId' && typeof value === 'string') {
          partialContext.requestId = value;
        } else if (key === 'traceId' && typeof value === 'string') {
          partialContext.traceId = value;
        } else if (key === 'spanId' && typeof value === 'string') {
          partialContext.spanId = value;
        } else if (key === 'parentSpanId' && typeof value === 'string') {
          partialContext.parentSpanId = value;
        } else if (key === 'userId' && typeof value === 'string') {
          partialContext.userId = value;
        } else if (key === 'sessionId' && typeof value === 'string') {
          partialContext.sessionId = value;
        } else if (key === 'timestamp' && typeof value === 'string') {
          partialContext['timestamp'] = value;
        } else if (
          key === 'metadata' &&
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // Skip metadata for now to avoid type assertions
          // TODO: Implement proper metadata validation
        }
      });

      // Clean up undefined values without type assertions
      const cleanContext: Partial<TraceContext> = {};
      if (partialContext.requestId !== undefined) cleanContext.requestId = partialContext.requestId;
      if (partialContext.traceId !== undefined) cleanContext.traceId = partialContext.traceId;
      if (partialContext.spanId !== undefined) cleanContext.spanId = partialContext.spanId;
      if (partialContext.parentSpanId !== undefined)
        cleanContext.parentSpanId = partialContext.parentSpanId;
      if (partialContext.userId !== undefined) cleanContext.userId = partialContext.userId;
      if (partialContext.sessionId !== undefined) cleanContext.sessionId = partialContext.sessionId;
      if (partialContext['timestamp'] !== undefined)
        cleanContext['timestamp'] = partialContext['timestamp'];

      return this.ensureFullContext(cleanContext);
    } catch {
      return null;
    }
  }

  /**
   * Ensure context has all required fields
   */
  private ensureFullContext(partial: Partial<TraceContext>): TraceContext {
    const genId = this.options.generateId || (() => generateRequestId());

    const context: TraceContext = {
      requestId: partial.requestId || genId(),
      ...partial,
    };

    // Ensure traceId
    if (!context.traceId) {
      context.traceId = context.requestId;
    }

    // Add sampling decision
    if (context.sampled === undefined && this.options.sampleRate !== undefined) {
      context.sampled = shouldSample(this.options.sampleRate);
    }

    return context;
  }
}

/**
 * Factory function to create request tracer
 * Enables easy dependency injection
 */
export function createRequestTracer(
  storage?: AsyncLocalStorage<TraceContext>,
  options?: RequestTracingOptions,
): RequestTracer {
  return new RequestTracer(storage, options);
}

/**
 * Global request tracer instance (optional)
 * Can be used for convenience but prefer dependency injection
 */
export const globalTracer = createRequestTracer();
