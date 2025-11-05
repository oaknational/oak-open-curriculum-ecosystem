import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFileSink, type SimpleWriteStream } from './file-sink';
import type { FileSinkConfig } from './sink-config';

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

  it('writes JSON payloads to the stream with newline', () => {
    const sink = createFileSink({ path: '/tmp/test.log' }, mockFs);
    expect(sink).not.toBeNull();
    sink?.write({ level: 'INFO', message: 'test', context: { key: 'value' } });
    expect(mockWrite).toHaveBeenCalledWith(
      '{"level":"INFO","message":"test","context":{"key":"value"}}\n',
      'utf8',
      expect.any(Function),
    );
  });

  it('logs errors when write callback receives error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // swallow log
    });
    mockWrite.mockImplementationOnce((_chunk, _encoding, cb) => {
      cb?.(new Error('write error'));
      return true;
    });
    const sink = createFileSink(baseConfig, mockFs);
    sink?.write({ level: 'ERROR', message: 'test error' });
    expect(consoleError).toHaveBeenCalledWith('Failed to write log payload to file', {
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
    sink?.write({ level: 'ERROR', message: 'test error' });
    expect(consoleError).toHaveBeenCalledWith('Failed to write log payload to file', {
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
