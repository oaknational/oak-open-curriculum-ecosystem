import { describe, expect, it, vi } from 'vitest';
import { dirname } from 'node:path';
import { appendToLogFile } from './file-reporter.js';
import type { AppendToLogFileDeps } from './file-reporter.js';

function createFakeDeps(): AppendToLogFileDeps {
  return {
    fs: {
      mkdirSync: vi.fn(),
      writeFileSync: vi.fn(),
    },
    path: { dirname },
  };
}

describe('appendToLogFile', () => {
  it('creates directory and writes message to log file', () => {
    const deps = createFakeDeps();

    appendToLogFile('/tmp/logs/app.log', 'hello', deps);

    expect(deps.fs.mkdirSync).toHaveBeenCalledWith('/tmp/logs', { recursive: true });
    expect(deps.fs.writeFileSync).toHaveBeenCalledWith('/tmp/logs/app.log', 'hello\n', {
      flag: 'a',
    });
  });

  it('throws with cause when writing fails', () => {
    const deps = createFakeDeps();
    const writeError = new Error('disk full');
    vi.mocked(deps.fs.writeFileSync).mockImplementation(() => {
      throw writeError;
    });

    expect(() => appendToLogFile('/tmp/logs/app.log', 'hello', deps)).toThrowError(
      expect.objectContaining({
        message: 'Failed to write to log file',
        cause: writeError,
      }),
    );
  });
});
