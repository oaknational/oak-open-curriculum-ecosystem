import { describe, expect, it, vi } from 'vitest';
import { UnifiedLogger } from '@oaknational/logger';
import { createStdioLogger, createChildLogger } from './index.js';
import type { LOG_LEVELS } from '@oaknational/env';
import type { RuntimeConfig } from '../runtime-config.js';

type LogLevel = (typeof LOG_LEVELS)[number];

interface TestConfigOverrides {
  readonly MCP_LOGGER_STDOUT?: string;
  readonly MCP_LOGGER_FILE_PATH?: string;
  readonly MCP_LOGGER_FILE_APPEND?: string;
  readonly LOG_LEVEL?: LogLevel;
}

function createTestRuntimeConfig(overrides: TestConfigOverrides = {}): RuntimeConfig {
  const logLevel: LogLevel = overrides.LOG_LEVEL ?? 'info';
  return {
    env: {
      OAK_API_KEY: 'test-key',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key',
      LOG_LEVEL: logLevel,
      MCP_LOGGER_STDOUT: overrides.MCP_LOGGER_STDOUT,
      MCP_LOGGER_FILE_PATH: overrides.MCP_LOGGER_FILE_PATH,
      MCP_LOGGER_FILE_APPEND: overrides.MCP_LOGGER_FILE_APPEND,
    },
    logLevel,
    useStubTools: false,
    version: '0.0.0',
  };
}

describe('createStdioLogger', () => {
  it('returns a UnifiedLogger instance', () => {
    const logger = createStdioLogger(createTestRuntimeConfig());
    expect(logger).toBeInstanceOf(UnifiedLogger);
  });

  it('supports the error signature with error parameter', () => {
    const logger = createStdioLogger(createTestRuntimeConfig());

    const testError = new Error('test error');
    const testContext = { key: 'value' };

    expect(() => {
      logger.error('test message', testError, testContext);
    }).not.toThrow();
  });
});

describe('createChildLogger', () => {
  it('returns a UnifiedLogger instance with context', () => {
    const parentLogger = createStdioLogger(createTestRuntimeConfig());
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
    };

    expect(() => {
      createChildLogger(invalidParentLogger, 'test-correlation-id');
    }).toThrow('Parent logger does not support child() method');
  });

  it('child logger supports all log methods', () => {
    const parentLogger = createStdioLogger(createTestRuntimeConfig());
    const childLogger = createChildLogger(parentLogger, 'req_test_abc123');

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
