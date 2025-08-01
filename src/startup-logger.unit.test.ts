import { describe, expect, it, vi } from 'vitest';
import { createStartupLogger, type StartupLoggerDependencies } from './startup-logger.js';

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
      tmpdir: () => '/tmp',
    };
  }

  it('should log messages to console', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Test message');

    expect(deps.console.log).toHaveBeenCalledWith('Test message');
    expect(deps.console.error).not.toHaveBeenCalled();
  });

  it('should log errors to console.error', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Error message', true);

    expect(deps.console.error).toHaveBeenCalledWith('Error message');
    expect(deps.console.log).not.toHaveBeenCalled();
  });

  it('should write logs to file with timestamp', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('Test message');

    expect(deps.fs.mkdirSync).toHaveBeenCalledWith('/tmp/oak-notion-mcp', { recursive: true });
    expect(deps.fs.writeFileSync).toHaveBeenCalledWith(
      '/tmp/oak-notion-mcp/startup.log',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z Test message\n$/),
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

    expect(deps.console.log).toHaveBeenCalledWith('Test message');
  });

  it('should still log to console when directory creation fails', () => {
    const deps = createMockDeps();
    deps.fs.mkdirSync = vi.fn().mockImplementation(() => {
      throw new Error('Directory creation failed');
    });
    const log = createStartupLogger(deps);

    log('Test message');

    expect(deps.console.log).toHaveBeenCalledWith('Test message');
    expect(deps.fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should append to existing log file', () => {
    const deps = createMockDeps();
    const log = createStartupLogger(deps);

    log('First message');
    log('Second message');

    expect(deps.fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(deps.fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      '/tmp/oak-notion-mcp/startup.log',
      expect.stringContaining('First message'),
      { flag: 'a' },
    );
    expect(deps.fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      '/tmp/oak-notion-mcp/startup.log',
      expect.stringContaining('Second message'),
      { flag: 'a' },
    );
  });
});
