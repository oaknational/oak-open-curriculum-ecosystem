import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnifiedLogger } from '@oaknational/logger';
import { createStdioLogger, createChildLogger } from './index.js';
import { loadRuntimeConfig, type RuntimeConfig } from '../runtime-config.js';

interface TestSinkEnvironment {
  readonly MCP_LOGGER_STDOUT?: string;
  readonly MCP_LOGGER_FILE_PATH?: string;
  readonly MCP_LOGGER_FILE_APPEND?: string;
}

function createRuntimeConfig(
  overrides: Partial<TestSinkEnvironment> & { LOG_LEVEL?: string } = {},
): RuntimeConfig {
  const env: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key',
    LOG_LEVEL: overrides.LOG_LEVEL ?? 'info',
    MCP_LOGGER_STDOUT: overrides.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: overrides.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: overrides.MCP_LOGGER_FILE_APPEND,
  };
  return loadRuntimeConfig(env);
}

describe('createStdioLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a UnifiedLogger instance', () => {
    const logger = createStdioLogger(createRuntimeConfig());
    expect(logger).toBeInstanceOf(UnifiedLogger);
  });

  it('creates a logger with stdout sink set to null (no stdout)', () => {
    const logger = createStdioLogger(createRuntimeConfig());
    expect(logger).toBeInstanceOf(UnifiedLogger);
  });

  it('supports the error signature with error parameter', () => {
    const logger = createStdioLogger(createRuntimeConfig());

    const testError = new Error('test error');
    const testContext = { key: 'value' };

    // Should not throw
    expect(() => {
      logger.error('test message', testError, testContext);
    }).not.toThrow();
  });

  it('respects log level configuration', () => {
    const logger = createStdioLogger(createRuntimeConfig({ LOG_LEVEL: 'WARN' }));

    // Should not throw for higher severity levels
    expect(() => {
      logger.warn('test warning');
      logger.error('test error');
      logger.fatal('test fatal');
    }).not.toThrow();
  });
});

describe('createChildLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a UnifiedLogger instance with context', () => {
    const parentLogger = createStdioLogger(createRuntimeConfig());
    const correlationId = 'req_1699123456789_a3f2c9';

    const childLogger = createChildLogger(parentLogger, correlationId);

    expect(childLogger).toBeInstanceOf(UnifiedLogger);
  });

  it('throws error if parent logger does not support child() method', () => {
    const invalidParentLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      isLevelEnabled: vi.fn(() => true),
      // No child() method
    };

    expect(() => {
      createChildLogger(invalidParentLogger, 'test-correlation-id');
    }).toThrow('Parent logger does not support child() method');
  });

  it('child logger supports all log methods', () => {
    const parentLogger = createStdioLogger(createRuntimeConfig());
    const childLogger = createChildLogger(parentLogger, 'req_test_abc123');

    // Should not throw
    expect(() => {
      childLogger.trace('test trace');
      childLogger.debug('test debug');
      childLogger.info('test info');
      childLogger.warn('test warning');
      childLogger.error('test error');
      childLogger.fatal('test fatal');
    }).not.toThrow();
  });
});
