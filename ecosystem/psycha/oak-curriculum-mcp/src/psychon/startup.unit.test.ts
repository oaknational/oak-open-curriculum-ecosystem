/**
 * Unit tests for startup logger
 */

import { describe, it, expect, vi } from 'vitest';
import { createStartupLogger } from './startup';
import type { StartupLoggerDependencies } from './startup';

describe('createStartupLogger', () => {
  it('should log messages to console and file', () => {
    // Given: Mock dependencies
    const consoleMock = {
      log: vi.fn(),
      error: vi.fn(),
    };
    const fsMock = {
      writeFileSync: vi.fn(),
      mkdirSync: vi.fn(),
    };
    const pathMock = {
      join: (...args: string[]) => args.join('/'),
      dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
    };
    const deps: StartupLoggerDependencies = {
      console: consoleMock,
      fs: fsMock,
      path: pathMock,
      rootDir: '/test/root',
    };

    // When: Create logger and log a message
    const log = createStartupLogger(deps);
    log('Test message');

    // Then: Console and file are called
    expect(consoleMock.log).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test message'));
    expect(fsMock.mkdirSync).toHaveBeenCalledWith('/test/root/.logs/oak-curriculum-mcp-startup', {
      recursive: true,
    });
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(
      '/test/root/.logs/oak-curriculum-mcp-startup/startup.log',
      expect.stringContaining('[INFO] Test message'),
      { flag: 'a' },
    );
  });

  it('should log errors to console.error', () => {
    // Given: Mock dependencies
    const consoleMock = {
      log: vi.fn(),
      error: vi.fn(),
    };
    const fsMock = {
      writeFileSync: vi.fn(),
      mkdirSync: vi.fn(),
    };
    const pathMock = {
      join: (...args: string[]) => args.join('/'),
      dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
    };
    const deps: StartupLoggerDependencies = {
      console: consoleMock,
      fs: fsMock,
      path: pathMock,
      rootDir: '/test/root',
    };

    // When: Log an error
    const log = createStartupLogger(deps);
    log('Error message', true);

    // Then: Console.error is called
    expect(consoleMock.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] Error message'),
    );
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(
      '/test/root/.logs/oak-curriculum-mcp-startup/startup.log',
      expect.stringContaining('[ERROR] Error message'),
      { flag: 'a' },
    );
  });

  it('should handle file write errors gracefully', () => {
    // Given: Mock dependencies with failing fs
    const consoleMock = {
      log: vi.fn(),
      error: vi.fn(),
    };
    const fsMock = {
      writeFileSync: vi.fn().mockImplementation(() => {
        throw new Error('Write failed');
      }),
      mkdirSync: vi.fn(),
    };
    const pathMock = {
      join: (...args: string[]) => args.join('/'),
      dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
    };
    const deps: StartupLoggerDependencies = {
      console: consoleMock,
      fs: fsMock,
      path: pathMock,
      rootDir: '/test/root',
    };

    // When: Log a message (fs will fail)
    const log = createStartupLogger(deps);
    log('Test message');

    // Then: Console.log is still called, error is logged
    expect(consoleMock.log).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test message'));
    expect(consoleMock.error).toHaveBeenCalledWith(
      'Failed to write startup log file',
      expect.any(Error),
    );
  });
});
