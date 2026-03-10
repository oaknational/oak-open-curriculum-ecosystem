/**
 * Unit tests for UnifiedLogger
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { UnifiedLogger } from './unified-logger';
import type { ResourceAttributes } from './resource-attributes';
import type { StdoutSink } from './stdout-sink';
import type { FileSinkInterface } from './file-sink';
import type { OtelLogRecord } from './otel-format';

/**
 * Parse a log record line into a typed OtelLogRecord
 */
function parseLogRecord(line: string): OtelLogRecord {
  const parsed: unknown = JSON.parse(line);
  if (!isOtelLogRecord(parsed)) {
    throw new Error('Invalid OTel log record payload');
  }
  return parsed;
}

interface OtelLogRecordCandidate {
  Timestamp?: unknown;
  ObservedTimestamp?: unknown;
  SeverityNumber?: unknown;
  SeverityText?: unknown;
  Body?: unknown;
  Attributes?: unknown;
  Resource?: unknown;
}

function isOtelLogRecord(value: unknown): value is OtelLogRecord {
  if (!isOtelLogRecordCandidate(value)) {
    return false;
  }
  return (
    hasRequiredStringFields(value) &&
    hasRequiredNumberFields(value) &&
    hasRequiredObjectFields(value)
  );
}

function isOtelLogRecordCandidate(value: unknown): value is OtelLogRecordCandidate {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasRequiredStringFields(candidate: OtelLogRecordCandidate): boolean {
  return (
    typeof candidate.Timestamp === 'string' &&
    typeof candidate.ObservedTimestamp === 'string' &&
    typeof candidate.SeverityText === 'string' &&
    typeof candidate.Body === 'string'
  );
}

function hasRequiredNumberFields(candidate: OtelLogRecordCandidate): boolean {
  return typeof candidate.SeverityNumber === 'number';
}

function hasRequiredObjectFields(candidate: OtelLogRecordCandidate): boolean {
  return (
    typeof candidate.Attributes === 'object' &&
    candidate.Attributes !== null &&
    typeof candidate.Resource === 'object' &&
    candidate.Resource !== null
  );
}

describe('UnifiedLogger', () => {
  let stdoutSink: StdoutSink;
  let fileSink: FileSinkInterface;
  let stdoutWriteSpy: Mock<StdoutSink['write']>;
  let fileSinkWriteSpy: Mock<FileSinkInterface['write']>;

  const resourceAttributes: ResourceAttributes = {
    'service.name': 'test-service',
    'service.version': '1.0.0',
    'deployment.environment': 'test',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-11-08T12:00:00.000Z'));

    stdoutWriteSpy = vi.fn<StdoutSink['write']>();
    fileSinkWriteSpy = vi.fn<FileSinkInterface['write']>();

    stdoutSink = {
      write: stdoutWriteSpy,
    };

    fileSink = {
      write: fileSinkWriteSpy,
      end: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('shouldLog', () => {
    it('returns true when message severity >= minimum severity', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      expect(logger.shouldLog(9)).toBe(true); // INFO
      expect(logger.shouldLog(13)).toBe(true); // WARN
      expect(logger.shouldLog(17)).toBe(true); // ERROR
    });

    it('returns false when message severity < minimum severity', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      expect(logger.shouldLog(1)).toBe(false); // TRACE
      expect(logger.shouldLog(5)).toBe(false); // DEBUG
    });
  });

  describe('log methods', () => {
    it('trace logs at TRACE level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 1, // TRACE
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.trace('trace message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('TRACE');
      expect(record.SeverityNumber).toBe(1);
      expect(record.Body).toBe('trace message');
    });

    it('debug logs at DEBUG level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 5, // DEBUG
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.debug('debug message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('DEBUG');
      expect(record.SeverityNumber).toBe(5);
    });

    it('info logs at INFO level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.info('info message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('INFO');
      expect(record.SeverityNumber).toBe(9);
    });

    it('warn logs at WARN level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.warn('warn message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('WARN');
      expect(record.SeverityNumber).toBe(13);
    });

    it('error logs at ERROR level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.error('error message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('ERROR');
      expect(record.SeverityNumber).toBe(17);
    });

    it('fatal logs at FATAL level', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.fatal('fatal message');

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.SeverityText).toBe('FATAL');
      expect(record.SeverityNumber).toBe(21);
    });

    it('does not log when below minimum severity', () => {
      const logger = new UnifiedLogger({
        minSeverity: 13, // WARN
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.debug('debug message');
      logger.info('info message');

      expect(stdoutWriteSpy).not.toHaveBeenCalled();
    });

    it('includes error in log record when provided', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      const error = new Error('test error');
      logger.error('error occurred', error);

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.Attributes['exception.type']).toBe('Error');
      expect(record.Attributes['exception.message']).toBe('test error');
    });

    it('includes context in log record', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.info('message with context', { userId: '123', action: 'login' });

      expect(stdoutWriteSpy).toHaveBeenCalled();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.Attributes.userId).toBe('123');
      expect(record.Attributes.action).toBe('login');
    });
  });

  describe('sink writing', () => {
    it('writes to stdout sink when configured', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.info('test message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
    });

    it('writes to file sink when configured', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink: null,
        fileSink,
      });

      logger.info('test message');

      expect(fileSinkWriteSpy).toHaveBeenCalledOnce();
    });

    it('writes to both sinks when both configured', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink,
      });

      logger.info('test message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
      expect(fileSinkWriteSpy).toHaveBeenCalledOnce();

      // Verify both sinks get identical content
      const stdoutContent = stdoutWriteSpy.mock.calls[0]?.[0];
      const fileSinkContent = fileSinkWriteSpy.mock.calls[0]?.[0];
      expect(stdoutContent).toBe(fileSinkContent);
    });

    it('writes single-line JSON with newline', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.info('test message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      expect(written).toMatch(/^\{.*\}\n$/); // Single line JSON with newline
      expect(written.split('\n').length).toBe(2); // JSON + newline = 2 elements
    });

    it('includes resource attributes in every log', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      logger.info('test message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.Resource).toEqual(resourceAttributes);
    });
  });

  describe('child logger', () => {
    it('creates child logger with merged context', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: { parentKey: 'parentValue' },
        stdoutSink,
        fileSink: null,
      });

      const child = logger.child({ childKey: 'childValue' });
      child.info('child message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.Attributes.parentKey).toBe('parentValue');
      expect(record.Attributes.childKey).toBe('childValue');
    });

    it('child inherits minimum severity', () => {
      const logger = new UnifiedLogger({
        minSeverity: 13, // WARN
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      const child = logger.child({ childKey: 'value' });
      child.debug('should not log');
      child.warn('should log');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
    });

    it('child inherits resource attributes', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      const child = logger.child({ childKey: 'value' });
      child.info('child message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);
      expect(record.Resource).toEqual(resourceAttributes);
    });

    it('child inherits sinks', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink,
      });

      const child = logger.child({ childKey: 'value' });
      child.info('child message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
      expect(fileSinkWriteSpy).toHaveBeenCalledOnce();
    });
  });

  describe('isLevelEnabled', () => {
    it('returns true for enabled levels', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      expect(logger.isLevelEnabled?.(9)).toBe(true); // INFO
      expect(logger.isLevelEnabled?.(13)).toBe(true); // WARN
      expect(logger.isLevelEnabled?.(17)).toBe(true); // ERROR
    });

    it('returns false for disabled levels', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes,
        context: {},
        stdoutSink,
        fileSink: null,
      });

      expect(logger.isLevelEnabled?.(1)).toBe(false); // TRACE
      expect(logger.isLevelEnabled?.(5)).toBe(false); // DEBUG
    });
  });
});
