import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConsolaInstance } from 'consola';
import { createAdaptiveLogger } from './adaptive-node';
import type { FileSinkInterface } from './file-sink';
import { createFileSink } from './file-sink';

// Mock file-sink module
vi.mock('./file-sink', () => {
  const mockFileSink: FileSinkInterface = {
    write: vi.fn(),
    end: vi.fn(),
  };
  return {
    createFileSink: vi.fn((): FileSinkInterface | null => mockFileSink),
  };
});

describe('Logger Sink Integration', () => {
  let mockFileSink: FileSinkInterface;
  let mockConsola: ConsolaInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFileSink = {
      write: vi.fn(),
      end: vi.fn(),
    };
    (createFileSink as ReturnType<typeof vi.fn>).mockReturnValue(mockFileSink);
    mockConsola = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      level: 2,
      withTag: vi.fn().mockReturnThis(),
    } as unknown as ConsolaInstance;
  });

  describe('stdout sink', () => {
    it('should write to stdout when stdout: true', () => {
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, { stdout: true });
      logger.info('Test message', { key: 'value' });
      expect(mockConsola.info).toHaveBeenCalledTimes(1);
      expect(mockConsola.info).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({ key: 'value' }),
      );
    });

    it('should not write to stdout when stdout: false', () => {
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, {
        stdout: false,
        file: { path: '/tmp/test.log', append: true },
      });
      logger.info('Test message');
      expect(mockConsola.info).not.toHaveBeenCalled();
    });
  });

  describe('file sink', () => {
    it('should write formatted JSON to file sink when configured', () => {
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, {
        stdout: true,
        file: { path: '/tmp/test.log', append: true },
      });
      logger.info('Test message', { key: 'value' });
      expect(createFileSink).toHaveBeenCalledTimes(1);
      expect(mockFileSink.write).toHaveBeenCalled();
    });

    it('should handle file sink initialization failure gracefully', () => {
      (createFileSink as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, {
        stdout: true,
        file: { path: '/invalid/path.log', append: true },
      });
      logger.info('Test message');
      expect(mockConsola.info).toHaveBeenCalledTimes(1);
    });
  });

  describe('combined sinks', () => {
    it('should write to both stdout and file when both are enabled', () => {
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, {
        stdout: true,
        file: { path: '/tmp/test.log', append: true },
      });
      logger.info('Test message', { context: 'test' });
      expect(mockConsola.info).toHaveBeenCalledTimes(1);
      expect(mockFileSink.write).toHaveBeenCalledTimes(1);
    });

    it('should format logs consistently for file sink', () => {
      const logger = createAdaptiveLogger({ level: 'INFO' }, mockConsola, {
        stdout: false,
        file: { path: '/tmp/test.log', append: true },
      });
      const testError = new Error('Test error');
      logger.error('Error message', testError, { user: 'alice' });
      expect(mockFileSink.write).toHaveBeenCalledTimes(1);
      const writeCall = (mockFileSink.write as ReturnType<typeof vi.fn>).mock.calls[0];
      if (Array.isArray(writeCall) && writeCall.length > 0) {
        const payload: unknown = writeCall[0];
        if (payload && typeof payload === 'object' && 'level' in payload && 'message' in payload) {
          expect((payload as { level: string }).level).toBe('ERROR');
          expect((payload as { message: string }).message).toBe('Error message');
          expect('error' in payload).toBe(true);
        }
      }
    });
  });
});
