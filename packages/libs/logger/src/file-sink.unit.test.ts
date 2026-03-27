import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFileSink, type SimpleWriteStream } from './file-sink';
import type { FileSinkConfig } from './sink-config';
import type { LogEvent } from './types';

function createEvent(line: string): LogEvent {
  return {
    level: 'INFO',
    message: 'test',
    context: { key: 'value' },
    otelRecord: {
      Timestamp: '2025-11-08T12:00:00.000Z',
      ObservedTimestamp: '2025-11-08T12:00:00.000Z',
      SeverityNumber: 9,
      SeverityText: 'INFO',
      Body: 'test',
      Attributes: { key: 'value' },
      Resource: {
        'service.name': 'test-service',
        'service.version': '1.0.0',
        'deployment.environment': 'test',
      },
    },
    line,
  };
}

describe('createFileSink', () => {
  const mockWrite = vi.fn();
  const mockEnd = vi.fn();

  const mockStream: SimpleWriteStream = {
    write: mockWrite,
    end: mockEnd,
  };

  const mockFs = {
    mkdirSync: vi.fn(),
    createWriteStream: vi.fn(() => mockStream),
  };

  const baseConfig: FileSinkConfig = {
    path: '/tmp/test.log',
    append: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a file sink with append mode by default', () => {
    const sink = createFileSink({ path: '/tmp/test.log' }, mockFs);
    expect(sink).not.toBeNull();
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('/tmp', { recursive: true });
    expect(mockFs.createWriteStream).toHaveBeenCalledWith('/tmp/test.log', { flags: 'a' });
  });

  it('creates a file sink with append flag when specified', () => {
    const sink = createFileSink({ path: '/tmp/test.log', append: true }, mockFs);
    expect(sink).not.toBeNull();
    expect(mockFs.createWriteStream).toHaveBeenCalledWith('/tmp/test.log', { flags: 'a' });
  });

  it('creates a file sink with overwrite flag when append is false', () => {
    const sink = createFileSink({ path: '/tmp/test.log', append: false }, mockFs);
    expect(sink).not.toBeNull();
    expect(mockFs.createWriteStream).toHaveBeenCalledWith('/tmp/test.log', { flags: 'w' });
  });

  it('creates nested directories when missing', () => {
    createFileSink({ path: '/deep/nested/path/log.log' }, mockFs);
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('/deep/nested/path', { recursive: true });
  });

  it('writes pre-formatted strings to the stream', () => {
    const sink = createFileSink({ path: '/tmp/test.log' }, mockFs);
    expect(sink).not.toBeNull();
    const preFormattedLine = '{"level":"INFO","message":"test","context":{"key":"value"}}\n';
    sink?.write(createEvent(preFormattedLine));
    expect(mockWrite).toHaveBeenCalledWith(preFormattedLine, 'utf8', expect.any(Function));
  });

  it('logs errors when write callback receives error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // swallow log
    });
    mockWrite.mockImplementationOnce(
      (_chunk: unknown, _encoding: unknown, cb?: (error?: Error | null) => void) => {
        cb?.(new Error('write error'));
        return true;
      },
    );
    const sink = createFileSink(baseConfig, mockFs);
    sink?.write(createEvent('{"level":"ERROR","message":"test error"}\n'));
    expect(consoleError).toHaveBeenCalledWith('Failed to write log line to file', {
      path: '/tmp/test.log',
      error: 'write error',
    });
    consoleError.mockRestore();
  });

  it('logs errors when write throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // swallow log
    });
    mockWrite.mockImplementationOnce(() => {
      throw new Error('write throw');
    });
    const sink = createFileSink(baseConfig, mockFs);
    sink?.write(createEvent('{"level":"ERROR","message":"test error"}\n'));
    expect(consoleError).toHaveBeenCalledWith('Failed to write log line to file', {
      path: '/tmp/test.log',
      error: 'write throw',
    });
    consoleError.mockRestore();
  });

  it('closes the stream on end', () => {
    const sink = createFileSink(baseConfig, mockFs);
    sink?.end();
    expect(mockEnd).toHaveBeenCalled();
  });

  it('returns null when initialization fails', () => {
    const error = new Error('init failure');
    mockFs.mkdirSync.mockImplementationOnce(() => {
      throw error;
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // swallow log
    });
    const sink = createFileSink(baseConfig, mockFs);
    expect(sink).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Failed to initialise file sink', {
      path: '/tmp/test.log',
      error: 'init failure',
    });
    consoleError.mockRestore();
  });
});
