/**
 * Integration tests for Logger Dependency Injection patterns
 *
 * These tests prove that the logger can be properly wired with DI
 * for different runtime contexts (HTTP, stdio) without testing
 * implementation details.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { UnifiedLogger } from './unified-logger';
import type { ResourceAttributes } from './resource-attributes';
import type { FileSinkInterface } from './file-sink';
import type { OtelLogRecord } from './otel-format';

/**
 * Minimal stdout sink interface for testing
 */
interface StdoutSink {
  write(line: string): void;
}

/**
 * Parse a log record line into a typed OtelLogRecord
 */
function parseLogRecord(line: string): OtelLogRecord {
  const parsed = JSON.parse(line) as OtelLogRecord;
  return parsed;
}

describe('Logger DI Integration', () => {
  let stdoutMock: StdoutSink;
  let fileMock: FileSinkInterface;
  let stdoutWriteSpy: Mock<StdoutSink['write']>;
  let fileWriteSpy: Mock<FileSinkInterface['write']>;

  const httpResourceAttributes: ResourceAttributes = {
    'service.name': 'http-test',
    'service.version': '1.0.0',
    'deployment.environment': 'test',
  };

  const stdioResourceAttributes: ResourceAttributes = {
    'service.name': 'stdio-test',
    'service.version': '1.0.0',
    'deployment.environment': 'test',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-11-09T10:00:00.000Z'));

    stdoutWriteSpy = vi.fn<StdoutSink['write']>();
    fileWriteSpy = vi.fn<FileSinkInterface['write']>();

    stdoutMock = {
      write: stdoutWriteSpy,
    };

    fileMock = {
      write: fileWriteSpy,
      end: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('HTTP Context (stdout only)', () => {
    it('writes OTel JSON to stdout sink only', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      logger.info('test message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      expect(written).toContain('"Body":"test message"');
      expect(written).toContain('"service.name":"http-test"');
      expect(written).toMatch(/\n$/); // ends with newline
    });

    it('includes all required OTel fields in stdout output', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      logger.info('test message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);

      expect(record).toHaveProperty('Timestamp');
      expect(record).toHaveProperty('SeverityNumber', 9);
      expect(record).toHaveProperty('SeverityText', 'INFO');
      expect(record).toHaveProperty('Body', 'test message');
      expect(record).toHaveProperty('Resource');
      expect(record.Resource).toHaveProperty('service.name', 'http-test');
    });

    it('never writes to file sink when file sink is null', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      logger.info('test message');
      logger.error('test error');
      logger.warn('test warning');

      expect(fileWriteSpy).not.toHaveBeenCalled();
      expect(stdoutWriteSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Stdio Context (file only)', () => {
    it('writes to file sink, never stdout', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: stdioResourceAttributes,
        context: {},
        stdoutSink: null,
        fileSink: fileMock,
      });

      logger.info('test message');

      expect(fileWriteSpy).toHaveBeenCalledOnce();
      expect(stdoutWriteSpy).not.toHaveBeenCalled();
    });

    it('includes all required OTel fields in file output', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: stdioResourceAttributes,
        context: {},
        stdoutSink: null,
        fileSink: fileMock,
      });

      logger.info('test message');

      const written = fileWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);

      expect(record).toHaveProperty('Timestamp');
      expect(record).toHaveProperty('SeverityNumber', 9);
      expect(record).toHaveProperty('SeverityText', 'INFO');
      expect(record).toHaveProperty('Body', 'test message');
      expect(record).toHaveProperty('Resource');
      expect(record.Resource).toHaveProperty('service.name', 'stdio-test');
    });

    it('never writes to stdout even when logging multiple messages', () => {
      const logger = new UnifiedLogger({
        minSeverity: 1, // TRACE
        resourceAttributes: stdioResourceAttributes,
        context: {},
        stdoutSink: null,
        fileSink: fileMock,
      });

      logger.trace('trace message');
      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');
      logger.fatal('fatal message');

      expect(fileWriteSpy).toHaveBeenCalledTimes(6);
      expect(stdoutWriteSpy).not.toHaveBeenCalled();
    });
  });

  describe('Dual Sink Context', () => {
    it('writes identical content to both stdout and file sinks', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: fileMock,
      });

      logger.info('test message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
      expect(fileWriteSpy).toHaveBeenCalledOnce();

      const stdoutWritten = stdoutWriteSpy.mock.calls[0]?.[0];
      const fileWritten = fileWriteSpy.mock.calls[0]?.[0];

      expect(stdoutWritten).toBe(fileWritten);
    });

    it('writes to both sinks for all severity levels', () => {
      const logger = new UnifiedLogger({
        minSeverity: 1, // TRACE
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: fileMock,
      });

      logger.trace('trace');
      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      logger.fatal('fatal');

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(6);
      expect(fileWriteSpy).toHaveBeenCalledTimes(6);
    });
  });

  describe('Child Logger Inheritance', () => {
    it('child inherits sinks from parent', () => {
      const parent = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: fileMock,
      });

      const child = parent.child({ requestId: 'req-123' });
      child.info('child message');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
      expect(fileWriteSpy).toHaveBeenCalledOnce();
    });

    it('child merges context with parent context', () => {
      const parent = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: { parentKey: 'parentValue' },
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const child = parent.child({ childKey: 'childValue' });
      child.info('child message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);

      expect(record.Attributes).toHaveProperty('parentKey', 'parentValue');
      expect(record.Attributes).toHaveProperty('childKey', 'childValue');
    });

    it('child inherits resource attributes from parent', () => {
      const parent = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const child = parent.child({ childContext: 'value' });
      child.info('child message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);

      expect(record.Resource).toHaveProperty('service.name', 'http-test');
      expect(record.Resource).toHaveProperty('service.version', '1.0.0');
    });

    it('child inherits minimum severity from parent', () => {
      const parent = new UnifiedLogger({
        minSeverity: 13, // WARN
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const child = parent.child({ childContext: 'value' });

      child.debug('should be filtered');
      child.info('should be filtered');
      child.warn('should log');
      child.error('should log');

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Correlation ID Propagation', () => {
    it('correlation ID appears in all child logger output', () => {
      const parent = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const child = parent.child({ correlationId: 'corr-123-abc' });

      child.info('message 1');
      child.warn('message 2');
      child.error('message 3');

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(3);

      const records = stdoutWriteSpy.mock.calls.map((call) => {
        const line = call[0];
        return parseLogRecord(line);
      });

      records.forEach((record) => {
        expect(record.Attributes).toHaveProperty('correlationId', 'corr-123-abc');
      });
    });

    it('correlation ID converted to trace ID in OTel format', () => {
      const parent = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const child = parent.child({ correlationId: 'corr-456-def' });
      child.info('test message');

      const written = stdoutWriteSpy.mock.calls[0]?.[0];
      const record = parseLogRecord(written);

      expect(record).toHaveProperty('TraceId');
      expect(record.TraceId).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('Severity Filtering', () => {
    it('messages below minSeverity not written to any sink', () => {
      const logger = new UnifiedLogger({
        minSeverity: 13, // WARN
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: fileMock,
      });

      logger.trace('should be filtered');
      logger.debug('should be filtered');
      logger.info('should be filtered');
      logger.warn('should log');
      logger.error('should log');
      logger.fatal('should log');

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(3);
      expect(fileWriteSpy).toHaveBeenCalledTimes(3);
    });

    it('severity filtering applies independently per logger instance', () => {
      const infoLogger = new UnifiedLogger({
        minSeverity: 9, // INFO
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      const warnLogger = new UnifiedLogger({
        minSeverity: 13, // WARN
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      infoLogger.info('info message');
      warnLogger.info('should be filtered');

      expect(stdoutWriteSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Resource Attributes in All Output', () => {
    it('all log records include resource attributes', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: null,
      });

      logger.info('message 1');
      logger.warn('message 2');
      logger.error('message 3');

      const records = stdoutWriteSpy.mock.calls.map((call) => {
        const line = call[0];
        return parseLogRecord(line);
      });

      records.forEach((record) => {
        expect(record.Resource).toHaveProperty('service.name', 'http-test');
        expect(record.Resource).toHaveProperty('service.version', '1.0.0');
        expect(record.Resource).toHaveProperty('deployment.environment', 'test');
      });
    });

    it('resource attributes consistent across stdout and file sinks', () => {
      const logger = new UnifiedLogger({
        minSeverity: 9,
        resourceAttributes: httpResourceAttributes,
        context: {},
        stdoutSink: stdoutMock,
        fileSink: fileMock,
      });

      logger.info('test message');

      const stdoutLine = stdoutWriteSpy.mock.calls[0]?.[0];
      const fileLine = fileWriteSpy.mock.calls[0]?.[0];

      const stdoutRecord = parseLogRecord(stdoutLine);
      const fileRecord = parseLogRecord(fileLine);

      expect(stdoutRecord.Resource).toEqual(fileRecord.Resource);
    });
  });
});
