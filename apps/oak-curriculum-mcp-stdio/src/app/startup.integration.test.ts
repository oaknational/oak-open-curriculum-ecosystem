import { describe, it, expect, vi } from 'vitest';
import { join, dirname } from 'node:path';
import type { Logger } from '@oaknational/logger';
import { createStartupLogger } from './startup.js';
import type { StartupLoggerDependencies } from './startup.js';

function createLoggerMock() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  } satisfies Logger;
}

function createTestDeps(overrides?: Partial<StartupLoggerDependencies>): StartupLoggerDependencies {
  return {
    logger: createLoggerMock(),
    fs: {
      writeFileSync: vi.fn(),
      mkdirSync: vi.fn(),
    },
    path: { join, dirname },
    rootDir: '/test/root',
    ...overrides,
  };
}

describe('createStartupLogger', () => {
  it('logs info messages to logger and writes timestamped line to file', () => {
    const deps = createTestDeps();
    const log = createStartupLogger(deps);

    log('Test message');

    expect(deps.logger.info).toHaveBeenCalledWith('Test message');
    expect(deps.fs.mkdirSync).toHaveBeenCalledWith(
      join('/test/root', '.logs', 'oak-curriculum-mcp-startup'),
      { recursive: true },
    );
    expect(deps.fs.writeFileSync).toHaveBeenCalledWith(
      join('/test/root', '.logs', 'oak-curriculum-mcp-startup', 'startup.log'),
      expect.stringContaining('[INFO] Test message'),
      { flag: 'a' },
    );
  });

  it('logs error messages to logger.error', () => {
    const deps = createTestDeps();
    const log = createStartupLogger(deps);

    log('Error message', true);

    expect(deps.logger.error).toHaveBeenCalledWith('Error message');
    expect(deps.fs.writeFileSync).toHaveBeenCalledWith(
      join('/test/root', '.logs', 'oak-curriculum-mcp-startup', 'startup.log'),
      expect.stringContaining('[ERROR] Error message'),
      { flag: 'a' },
    );
  });

  it('logs file write errors without suppressing the original message', () => {
    const deps = createTestDeps({
      fs: {
        writeFileSync: vi.fn().mockImplementation(() => {
          throw new Error('Write failed');
        }),
        mkdirSync: vi.fn(),
      },
    });
    const log = createStartupLogger(deps);

    log('Test message');

    expect(deps.logger.info).toHaveBeenCalledWith('Test message');
    expect(deps.logger.error).toHaveBeenCalledWith(
      'Failed to write startup log file',
      expect.objectContaining({
        name: 'Error',
        message: 'Write failed',
      }),
    );
  });
});
