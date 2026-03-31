import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeError } from './error-normalisation';
import {
  correlationIdToTraceId,
  formatOtelLogRecord,
  logLevelToSeverityNumber,
  logLevelToSeverityText,
} from './otel-format';

describe('otel-format', () => {
  describe('logLevelToSeverityNumber', () => {
    it('maps TRACE to 1', () => {
      expect(logLevelToSeverityNumber('TRACE')).toBe(1);
    });

    it('maps DEBUG to 5', () => {
      expect(logLevelToSeverityNumber('DEBUG')).toBe(5);
    });

    it('maps INFO to 9', () => {
      expect(logLevelToSeverityNumber('INFO')).toBe(9);
    });

    it('maps WARN to 13', () => {
      expect(logLevelToSeverityNumber('WARN')).toBe(13);
    });

    it('maps ERROR to 17', () => {
      expect(logLevelToSeverityNumber('ERROR')).toBe(17);
    });

    it('maps FATAL to 21', () => {
      expect(logLevelToSeverityNumber('FATAL')).toBe(21);
    });
  });

  describe('logLevelToSeverityText', () => {
    it('returns the log level verbatim', () => {
      expect(logLevelToSeverityText('TRACE')).toBe('TRACE');
      expect(logLevelToSeverityText('DEBUG')).toBe('DEBUG');
      expect(logLevelToSeverityText('INFO')).toBe('INFO');
      expect(logLevelToSeverityText('WARN')).toBe('WARN');
      expect(logLevelToSeverityText('ERROR')).toBe('ERROR');
      expect(logLevelToSeverityText('FATAL')).toBe('FATAL');
    });
  });

  describe('correlationIdToTraceId', () => {
    it('produces a stable 32-character hex trace ID', () => {
      const traceId = correlationIdToTraceId('req_1699123456789_a3f2c9');

      expect(traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(traceId).toHaveLength(32);
      expect(traceId).toBe(correlationIdToTraceId('req_1699123456789_a3f2c9'));
    });

    it('returns undefined for missing correlation IDs', () => {
      expect(correlationIdToTraceId(undefined)).toBeUndefined();
    });
  });

  describe('formatOtelLogRecord', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-11-08T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('creates all required OpenTelemetry log record fields', () => {
      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test message',
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
        activeSpanContext: undefined,
      });

      expect(record).toEqual({
        Timestamp: '2025-11-08T12:00:00.000Z',
        ObservedTimestamp: '2025-11-08T12:00:00.000Z',
        SeverityNumber: 9,
        SeverityText: 'INFO',
        Body: 'Test message',
        Attributes: {},
        Resource: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });
    });

    it('merges context attributes into the OTel record', () => {
      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'User action',
        context: {
          userId: '123',
          action: 'login',
          nested: {
            count: 1,
          },
        },
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
        activeSpanContext: undefined,
      });

      expect(record.Attributes).toMatchObject({
        userId: '123',
        action: 'login',
        nested: {
          count: 1,
        },
      });
    });

    it('serialises normalised errors into semantic exception attributes', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.ts:1:1';

      const record = formatOtelLogRecord({
        level: 'ERROR',
        message: 'Error occurred',
        error: normalizeError(error),
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
        activeSpanContext: undefined,
      });

      expect(record.Attributes).toHaveProperty('exception.type', 'Error');
      expect(record.Attributes).toHaveProperty('exception.message', 'Test error');
      expect(record.Attributes).toHaveProperty(
        'exception.stacktrace',
        'Error: Test error\n    at test.ts:1:1',
      );
    });

    it('falls back to correlation-id hashing when no active span exists', () => {
      const correlationId = 'req_1699123456789_a3f2c9';

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context: {
          correlationId,
        },
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
        activeSpanContext: undefined,
      });

      expect(record.TraceId).toBe(correlationIdToTraceId(correlationId));
      expect(record.Attributes).toHaveProperty('correlationId', correlationId);
      expect(record.SpanId).toBeUndefined();
    });

    it('prefers the active span context over correlation-id hashing', () => {
      const spanContext = {
        traceId: '0123456789abcdef0123456789abcdef',
        spanId: '0123456789abcdef',
        traceFlags: 1,
      } as const;

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context: {
          correlationId: 'req_1699123456789_a3f2c9',
        },
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
        activeSpanContext: spanContext,
      });

      expect(record.TraceId).toBe(spanContext.traceId);
      expect(record.SpanId).toBe(spanContext.spanId);
      expect(record.TraceFlags).toBe(spanContext.traceFlags);
    });
  });
});
