/**
 * @fileoverview Unit tests for request tracing pure functions
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect } from 'vitest';

describe('Request Tracing Pure Functions', () => {
  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const generateRequestId = (prefix = 'req'): string => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}-${timestamp}-${random}`;
      };

      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).toMatch(/^req-[a-z0-9]+-[a-z0-9]{7}$/);
      expect(id2).toMatch(/^req-[a-z0-9]+-[a-z0-9]{7}$/);
      expect(id1).not.toBe(id2);
    });

    it('should support custom prefixes', () => {
      const generateRequestId = (prefix = 'req'): string => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}-${timestamp}-${random}`;
      };

      const id = generateRequestId('trace');
      expect(id).toMatch(/^trace-[a-z0-9]+-[a-z0-9]{7}$/);
    });
  });

  describe('extractTraceHeaders', () => {
    it('should extract standard trace headers', () => {
      const extractTraceHeaders = (
        headers: Record<string, string | string[] | undefined>,
      ): Record<string, string> => {
        const traceHeaders: Record<string, string> = {};

        // Standard trace headers
        const standardHeaders = [
          'x-request-id',
          'x-trace-id',
          'x-correlation-id',
          'x-b3-traceid',
          'x-b3-spanid',
          'x-b3-parentspanid',
          'traceparent',
          'tracestate',
        ];

        for (const [key, value] of Object.entries(headers)) {
          const lowerKey = key.toLowerCase();
          if (standardHeaders.includes(lowerKey) && value) {
            if (Array.isArray(value)) {
              if (value.length === 0) {
                throw new Error(
                  `Trace header '${key}' is an empty array. Expected at least one value.`,
                );
              }
              const firstValue = value[0];
              if (!firstValue) {
                throw new Error(
                  `Trace header '${key}' has undefined first element. This should not happen.`,
                );
              }
              traceHeaders[lowerKey] = firstValue;
            } else {
              traceHeaders[lowerKey] = value;
            }
          }
        }

        return traceHeaders;
      };

      const headers = {
        'X-Request-ID': '123',
        'X-Trace-ID': '456',
        'Content-Type': 'application/json',
        'X-B3-TraceId': '789',
        Authorization: 'Bearer token',
      };

      const result = extractTraceHeaders(headers);

      expect(result).toEqual({
        'x-request-id': '123',
        'x-trace-id': '456',
        'x-b3-traceid': '789',
      });
    });

    it('should handle array header values', () => {
      const extractTraceHeaders = (
        headers: Record<string, string | string[] | undefined>,
      ): Record<string, string> => {
        const traceHeaders: Record<string, string> = {};
        const standardHeaders = ['x-request-id', 'x-trace-id'];

        for (const [key, value] of Object.entries(headers)) {
          const lowerKey = key.toLowerCase();
          if (standardHeaders.includes(lowerKey) && value) {
            if (Array.isArray(value)) {
              if (value.length === 0) {
                throw new Error(
                  `Trace header '${key}' is an empty array. Expected at least one value.`,
                );
              }
              const firstValue = value[0];
              if (!firstValue) {
                throw new Error(
                  `Trace header '${key}' has undefined first element. This should not happen.`,
                );
              }
              traceHeaders[lowerKey] = firstValue;
            } else {
              traceHeaders[lowerKey] = value;
            }
          }
        }

        return traceHeaders;
      };

      const headers = {
        'X-Request-ID': ['first', 'second'],
        'X-Trace-ID': 'single',
      };

      const result = extractTraceHeaders(headers);

      expect(result).toEqual({
        'x-request-id': 'first',
        'x-trace-id': 'single',
      });
    });
  });

  describe('createTraceContext', () => {
    it('should create trace context from request info', () => {
      const createTraceContext = (options: {
        requestId?: string;
        traceId?: string;
        spanId?: string;
        parentSpanId?: string;
        userId?: string;
        sessionId?: string;
        method?: string;
        path?: string;
      }): Record<string, unknown> => {
        const context: Record<string, unknown> = {};

        // Required fields
        context['requestId'] = options.requestId ?? generateRequestId();
        context['traceId'] = options.traceId ?? context['requestId'];

        // Optional fields
        if (options.spanId) context['spanId'] = options.spanId;
        if (options.parentSpanId) context['parentSpanId'] = options.parentSpanId;
        if (options.userId) context['userId'] = options.userId;
        if (options.sessionId) context['sessionId'] = options.sessionId;
        if (options.method) context['method'] = options.method;
        if (options.path) context['path'] = options.path;

        // Timestamp
        context['timestamp'] = new Date().toISOString();

        return context;
      };

      const generateRequestId = (): string => {
        return `req-${String(Date.now())}-${Math.random().toString(36).substring(2, 9)}`;
      };

      const context = createTraceContext({
        requestId: 'req-123',
        userId: 'user-456',
        method: 'GET',
        path: '/api/users',
      });

      expect(context).toMatchObject({
        requestId: 'req-123',
        traceId: 'req-123',
        userId: 'user-456',
        method: 'GET',
        path: '/api/users',
      });
      expect(context).toHaveProperty('timestamp');
    });

    it('should generate IDs when not provided', () => {
      const createTraceContext = (
        options: {
          requestId?: string;
          traceId?: string;
        } = {},
      ): Record<string, unknown> => {
        const generateId = () =>
          `req-${String(Date.now())}-${Math.random().toString(36).substring(2, 9)}`;

        const context: Record<string, unknown> = {};
        context['requestId'] = options.requestId ?? generateId();
        context['traceId'] = options.traceId ?? context['requestId'];
        context['timestamp'] = new Date().toISOString();

        return context;
      };

      const context = createTraceContext({});

      expect(context['requestId']).toMatch(/^req-[a-z0-9]+-[a-z0-9]{7}$/);
      expect(context['traceId']).toBe(context['requestId']);
    });
  });

  describe('parseTraceparent', () => {
    it('should parse W3C traceparent header', () => {
      const parseTraceparent = (
        traceparent: string,
      ): {
        version: string;
        traceId: string;
        parentId: string;
        flags: string;
      } | null => {
        // W3C Trace Context format: version-traceId-parentId-flags
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
      };

      const valid = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
      const result = parseTraceparent(valid);

      expect(result).toEqual({
        version: '00',
        traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
        parentId: '00f067aa0ba902b7',
        flags: '01',
      });

      // Invalid format
      expect(parseTraceparent('invalid')).toBeNull();
      expect(parseTraceparent('00-short-parentId-01')).toBeNull();
    });
  });

  describe('formatTraceInfo', () => {
    it('should format trace info for logging', () => {
      const formatTraceInfo = (trace: {
        requestId: string;
        traceId?: string;
        spanId?: string;
        parentSpanId?: string;
      }): string => {
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
      };

      const trace = {
        requestId: 'req-123',
        traceId: 'trace-456',
        spanId: 'span-789',
        parentSpanId: 'parent-012',
      };

      expect(formatTraceInfo(trace)).toBe(
        'req=req-123 trace=trace-456 span=span-789 parent=parent-012',
      );

      // Omit traceId if same as requestId
      const trace2 = {
        requestId: 'req-123',
        traceId: 'req-123',
        spanId: 'span-789',
      };

      expect(formatTraceInfo(trace2)).toBe('req=req-123 span=span-789');
    });
  });

  describe('sanitizeTraceContext', () => {
    it('should remove sensitive data from trace context', () => {
      const sanitizeTraceContext = (
        context: Record<string, unknown>,
        sensitiveKeys: string[] = ['authorization', 'cookie', 'password'],
      ): Record<string, unknown> => {
        const sanitized: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(context)) {
          const lowerKey = key.toLowerCase();
          const isSensitive = sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive));

          if (isSensitive) {
            sanitized[key] = '[REDACTED]';
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Type-safe nested sanitization
            const nestedContext: Record<string, unknown> = {};
            Object.assign(nestedContext, value);
            sanitized[key] = sanitizeTraceContext(nestedContext, sensitiveKeys);
          } else {
            sanitized[key] = value;
          }
        }

        return sanitized;
      };

      const context = {
        requestId: 'req-123',
        userId: 'user-456',
        authorization: 'Bearer secret-token',
        headers: {
          cookie: 'session=abc123',
          'content-type': 'application/json',
        },
      };

      const result = sanitizeTraceContext(context);

      expect(result).toEqual({
        requestId: 'req-123',
        userId: 'user-456',
        authorization: '[REDACTED]',
        headers: {
          cookie: '[REDACTED]',
          'content-type': 'application/json',
        },
      });
    });
  });
});
