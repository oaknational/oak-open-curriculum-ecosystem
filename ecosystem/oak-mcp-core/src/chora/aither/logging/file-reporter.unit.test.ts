import { describe, it, expect, vi } from 'vitest';
import { createFileReporter, type FileLogObject } from './file-reporter.js';
import { LOG_LEVELS } from '../../stroma/types/index.js';

describe('createFileReporter', () => {
  it('should create log directory on initialization', () => {
    const mkdirSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: vi.fn(),
        mkdirSync: mkdirSyncSpy,
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    createFileReporter({ logDir: '/test/logs' }, deps);

    expect(mkdirSyncSpy).toHaveBeenCalledWith('/test/logs', { recursive: true });
  });

  it('should write log entries to file with correct format', () => {
    const writeFileSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: writeFileSyncSpy,
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs', filename: 'test.log' }, deps);

    const logObj: FileLogObject = {
      level: LOG_LEVELS.INFO.value,
      msg: 'Test message',
      args: [{ foo: 'bar' }],
      tag: '',
      type: 'log',
      date: new Date(),
    };

    reporter.log(logObj);

    expect(writeFileSyncSpy).toHaveBeenCalledOnce();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringContaining('[INFO] Test message'),
      { flag: 'a' },
    );
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringContaining('"foo": "bar"'),
      { flag: 'a' },
    );
  });

  it('should handle different log levels correctly', () => {
    const writeFileSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: writeFileSyncSpy,
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs', filename: 'test.log' }, deps);

    const levels = [
      { level: LOG_LEVELS.ERROR.value, expected: 'ERROR' },
      { level: LOG_LEVELS.WARN.value, expected: 'WARN' },
      { level: LOG_LEVELS.INFO.value, expected: 'INFO' },
      { level: LOG_LEVELS.DEBUG.value, expected: 'DEBUG' },
    ];

    levels.forEach(({ level, expected }) => {
      writeFileSyncSpy.mockClear();

      const logObj: FileLogObject = {
        level,
        msg: 'Test',
        args: [],
        tag: '',
        type: 'log',
        date: new Date(),
      };

      reporter.log(logObj);

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        '/test/logs/test.log',
        expect.stringContaining(`[${expected}]`),
        { flag: 'a' },
      );
    });
  });

  it('should generate timestamp-based filename if not provided', () => {
    const writeFileSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: writeFileSyncSpy,
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs' }, deps);

    const logObj: FileLogObject = {
      level: LOG_LEVELS.INFO.value,
      msg: 'Test',
      args: [],
      tag: '',
      type: 'log',
      date: new Date(),
    };

    reporter.log(logObj);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\/test\/logs\/oak-notion-mcp-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.log$/,
      ),
      expect.any(String),
      { flag: 'a' },
    );
  });

  it('should silently fail on write errors', () => {
    const deps = {
      fs: {
        writeFileSync: vi.fn(() => {
          throw new Error('Write failed');
        }),
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs' }, deps);

    const logObj: FileLogObject = {
      level: LOG_LEVELS.INFO.value,
      msg: 'Test',
      args: [],
      tag: '',
      type: 'log',
      date: new Date(),
    };

    // Should not throw
    expect(() => {
      reporter.log(logObj);
    }).not.toThrow();
  });

  it('should format different argument types correctly', () => {
    const writeFileSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: writeFileSyncSpy,
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs', filename: 'test.log' }, deps);

    const logObj: FileLogObject = {
      level: LOG_LEVELS.INFO.value,
      msg: 'String',
      args: [123, true, null, undefined, { nested: { value: 'test' } }, ['array', 'values']],
      tag: '',
      type: 'log',
      date: new Date(),
    };

    reporter.log(logObj);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringContaining('String 123 true null undefined'),
      { flag: 'a' },
    );
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringContaining('"nested": {'),
      { flag: 'a' },
    );
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringContaining('"value": "test"'),
      { flag: 'a' },
    );
  });

  it('should include ISO timestamp in log lines', () => {
    const writeFileSyncSpy = vi.fn();
    const deps = {
      fs: {
        writeFileSync: writeFileSyncSpy,
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
      },
    };

    const reporter = createFileReporter({ logDir: '/test/logs', filename: 'test.log' }, deps);

    const logObj: FileLogObject = {
      level: LOG_LEVELS.INFO.value,
      msg: 'Test',
      args: [],
      tag: '',
      type: 'log',
      date: new Date(),
    };

    reporter.log(logObj);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
      { flag: 'a' },
    );
  });
});
