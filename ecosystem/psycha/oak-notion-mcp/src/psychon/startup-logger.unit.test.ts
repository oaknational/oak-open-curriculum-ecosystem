import { describe, expect, it, vi } from 'vitest';
import { createStartupLogger, type StartupLoggerDependencies } from './startup';

describe('createStartupLogger', () => {
  function createMockDeps(): StartupLoggerDependencies {
    return {
      console: {
        log: vi.fn(),
        error: vi.fn(),
      },
      fs: {
        writeFileSync: vi.fn(),
        mkdirSync: vi.fn(),
      },
      path: {
        join: (...args: string[]) => args.join('/'),
        dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
      },
      rootDir: '/test/root',
    };
  }

  it('should log messages to console', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Test message');

    // Startup logger writes to stderr to keep stdout clean for MCP JSON-RPC
    expect(deps.console.error).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test message'));
    expect(deps.console.log).not.toHaveBeenCalled();
  });

  it('should log errors to console.error', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Error message', true);

    expect(deps.console.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] Error message'),
    );
    expect(deps.console.log).not.toHaveBeenCalled();
  });

  it('should write logs to file with timestamp', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Test message');

    // Check that mkdirSync was called with a path ending in oak-notion-mcp-startup
    expect(deps.fs.mkdirSync).toHaveBeenCalledWith(
      expect.stringMatching(/\.logs\/oak-notion-mcp-startup$/),
      { recursive: true },
    );

    // Check that writeFileSync was called with a path ending in startup.log
    expect(deps.fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/oak-notion-mcp-startup\/startup\.log$/),
      expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z: \[INFO\] Test message\n$/,
      ),
      { flag: 'a' },
    );
  });

  it('should still log to console when file writing fails', () => {
    const deps = createMockDeps();
    deps.fs.writeFileSync = vi.fn().mockImplementation(() => {
      throw new Error('File write failed');
    });
    const log = createStartupLogger(deps);

    log('Test message');

    // Even on file write failure, we still log to stderr
    expect(deps.console.error).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test message'));
    expect(deps.console.error).toHaveBeenCalledWith(
      'Failed to write startup log file',
      expect.any(Error),
    );
  });

  it('should still log to console when directory creation fails', () => {
    const deps = createMockDeps();
    deps.fs.mkdirSync = vi.fn().mockImplementation(() => {
      throw new Error('Directory creation failed');
    });
    const log = createStartupLogger(deps);

    log('Test message');

    // Even on directory creation failure, we still log to stderr
    expect(deps.console.error).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test message'));
    expect(deps.fs.writeFileSync).not.toHaveBeenCalled();
    expect(deps.console.error).toHaveBeenCalledWith(
      'Failed to write startup log file',
      expect.any(Error),
    );
  });

  it('should append to existing log file', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('First message');
    log('Second message');

    expect(deps.fs.writeFileSync).toHaveBeenCalledTimes(2);

    // Check first call
    expect(deps.fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/oak-notion-mcp-startup\/startup\.log$/),
      expect.stringContaining('[INFO] First message'),
      { flag: 'a' },
    );

    // Check second call
    expect(deps.fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/oak-notion-mcp-startup\/startup\.log$/),
      expect.stringContaining('[INFO] Second message'),
      { flag: 'a' },
    );
  });
});
