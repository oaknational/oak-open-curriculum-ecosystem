import { describe, it, expect, vi } from 'vitest';
import { createFileReporter } from './file-reporter.js';
import type { LogObject } from 'consola';

// Create a mock context that satisfies the type requirements
const mockContext = { options: undefined };

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

    const logObj: LogObject = {
      level: 3, // INFO
      type: 'log',
      tag: '',
      args: ['Test message', { foo: 'bar' }],
      date: new Date(),
    };

    reporter.log(logObj, mockContext);

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
      { level: 1, expected: 'ERROR' },
      { level: 2, expected: 'WARN' },
      { level: 3, expected: 'INFO' },
      { level: 4, expected: 'DEBUG' },
    ];

    levels.forEach(({ level, expected }) => {
      writeFileSyncSpy.mockClear();

      const logObj: LogObject = {
        level,
        type: 'log',
        tag: '',
        args: ['Test'],
        date: new Date(),
      };

      reporter.log(logObj, mockContext);

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

    const logObj: LogObject = {
      level: 3,
      type: 'log',
      tag: '',
      args: ['Test'],
      date: new Date(),
    };

    reporter.log(logObj, mockContext);

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

    const logObj: LogObject = {
      level: 3,
      type: 'log',
      tag: '',
      args: ['Test'],
      date: new Date(),
    };

    // Should not throw
    expect(() => {
      reporter.log(logObj, { options: {} });
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

    const logObj: LogObject = {
      level: 3,
      type: 'log',
      tag: '',
      args: [
        'String',
        123,
        true,
        null,
        undefined,
        { nested: { value: 'test' } },
        ['array', 'values'],
      ],
      date: new Date(),
    };

    reporter.log(logObj, mockContext);

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

    const logObj: LogObject = {
      level: 3,
      type: 'log',
      tag: '',
      args: ['Test'],
      date: new Date(),
    };

    reporter.log(logObj, mockContext);

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      '/test/logs/test.log',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
      { flag: 'a' },
    );
  });
});
