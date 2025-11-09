/**
 * Unit tests for OpenTelemetry log record formatting
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatOtelLogRecord,
  logLevelToSeverityNumber,
  logLevelToSeverityText,
  correlationIdToTraceId,
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
    it('returns the log level as-is for valid levels', () => {
      expect(logLevelToSeverityText('TRACE')).toBe('TRACE');
      expect(logLevelToSeverityText('DEBUG')).toBe('DEBUG');
      expect(logLevelToSeverityText('INFO')).toBe('INFO');
      expect(logLevelToSeverityText('WARN')).toBe('WARN');
      expect(logLevelToSeverityText('ERROR')).toBe('ERROR');
      expect(logLevelToSeverityText('FATAL')).toBe('FATAL');
    });
  });

  describe('correlationIdToTraceId', () => {
    it('converts correlationId to 32-character hex TraceId', () => {
      const correlationId = 'req_1699123456789_a3f2c9';
      const traceId = correlationIdToTraceId(correlationId);

      expect(traceId).toMatch(/^[0-9a-f]{32}$/);
      expect(traceId).toHaveLength(32);
    });

    it('produces consistent TraceId for same correlationId', () => {
      const correlationId = 'req_1699123456789_a3f2c9';
      const traceId1 = correlationIdToTraceId(correlationId);
      const traceId2 = correlationIdToTraceId(correlationId);

      expect(traceId1).toBe(traceId2);
    });

    it('produces different TraceIds for different correlationIds', () => {
      const traceId1 = correlationIdToTraceId('req_1699123456789_a3f2c9');
      const traceId2 = correlationIdToTraceId('req_1699123456790_b4e3d0');

      expect(traceId1).not.toBe(traceId2);
    });

    it('returns undefined for undefined correlationId', () => {
      expect(correlationIdToTraceId(undefined)).toBeUndefined();
    });
  });

  describe('formatOtelLogRecord', () => {
    beforeEach(() => {
      // Mock Date.now() for consistent timestamps
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-11-08T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('creates record with all required OpenTelemetry fields', () => {
      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test message',
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record).toHaveProperty('Timestamp');
      expect(record).toHaveProperty('ObservedTimestamp');
      expect(record).toHaveProperty('SeverityNumber');
      expect(record).toHaveProperty('SeverityText');
      expect(record).toHaveProperty('Body');
      expect(record).toHaveProperty('Attributes');
      expect(record).toHaveProperty('Resource');
    });

    it('formats timestamps as ISO 8601', () => {
      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test message',
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.Timestamp).toBe('2025-11-08T12:00:00.000Z');
      expect(record.ObservedTimestamp).toBe('2025-11-08T12:00:00.000Z');
    });

    it('sets correct severity number and text', () => {
      const record = formatOtelLogRecord({
        level: 'ERROR',
        message: 'Error message',
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.SeverityNumber).toBe(17);
      expect(record.SeverityText).toBe('ERROR');
    });

    it('sets Body to the message', () => {
      const message = 'Test log message';
      const record = formatOtelLogRecord({
        level: 'INFO',
        message,
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.Body).toBe(message);
    });

    it('includes context in Attributes', () => {
      const context = {
        userId: '123',
        action: 'login',
        count: 42,
      };

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'User action',
        context,
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.Attributes).toMatchObject(context);
    });

    it('includes error information in Attributes when error provided', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.ts:1:1';

      const record = formatOtelLogRecord({
        level: 'ERROR',
        message: 'Error occurred',
        error,
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.Attributes).toHaveProperty('exception.type', 'Error');
      expect(record.Attributes).toHaveProperty('exception.message', 'Test error');
      expect(record.Attributes).toHaveProperty('exception.stacktrace');
      expect(record.Attributes['exception.stacktrace']).toContain('Error: Test error');
    });

    it('includes Resource attributes', () => {
      const resourceAttributes = {
        'service.name': 'my-service',
        'service.version': '2.0.0',
        'deployment.environment': 'production',
      };

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context: {},
        resourceAttributes,
      });

      expect(record.Resource).toEqual(resourceAttributes);
    });

    it('converts correlationId to TraceId when present in context', () => {
      const correlationId = 'req_1699123456789_a3f2c9';
      const context = { correlationId };

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context,
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record).toHaveProperty('TraceId');
      expect(record.TraceId).toMatch(/^[0-9a-f]{32}$/);
      expect(record.Attributes).toHaveProperty('correlationId', correlationId);
    });

    it('does not include TraceId when correlationId not present', () => {
      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context: {},
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record).not.toHaveProperty('TraceId');
    });

    it('handles nested context objects', () => {
      const context = {
        user: {
          id: '123',
          name: 'John',
        },
        metadata: {
          count: 5,
        },
      };

      const record = formatOtelLogRecord({
        level: 'INFO',
        message: 'Test',
        context,
        resourceAttributes: {
          'service.name': 'test-service',
          'service.version': '1.0.0',
          'deployment.environment': 'development',
        },
      });

      expect(record.Attributes).toMatchObject(context);
    });
  });
});
