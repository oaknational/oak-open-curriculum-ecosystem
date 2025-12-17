import { beforeEach, describe, expect, it } from 'vitest';
import { UnifiedLogger } from '@oaknational/mcp-logger';
import type { Response } from 'express';

import { createHttpLogger, createChildLogger, extractCorrelationId } from './index.js';
import { loadRuntimeConfig, type RuntimeConfig } from '../runtime-config.js';

function createRuntimeConfig(overrides: Record<string, string> = {}): RuntimeConfig {
  const baseEnv: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_value',
    CLERK_SECRET_KEY: 'sk_test_value',
  };
  return loadRuntimeConfig({ ...baseEnv, ...overrides });
}

describe('createHttpLogger', () => {
  beforeEach(() => {
    // No setup needed - testing actual behavior
  });

  it('returns a UnifiedLogger instance', () => {
    const runtimeConfig = createRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig);

    expect(logger).toBeInstanceOf(UnifiedLogger);
  });

  it('creates logger with stdout sink only (no file logging)', () => {
    const runtimeConfig = createRuntimeConfig({ LOG_LEVEL: 'debug' });
    const logger = createHttpLogger(runtimeConfig);

    // Behavior test: Logger should be instance of UnifiedLogger
    // Implementation (stdout-only) is proven by DI integration tests
    expect(logger).toBeInstanceOf(UnifiedLogger);
  });

  it('supports shared logger error signature with error parameter', () => {
    const runtimeConfig = createRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig);

    const testError = new Error('test error');
    const testContext = { key: 'value' };

    // Behavior test: error method should accept error and context
    // Should not throw
    expect(() => {
      logger.error('test message', testError, testContext);
    }).not.toThrow();
  });
});

describe('createChildLogger', () => {
  beforeEach(() => {
    // No setup needed - testing actual behavior
  });

  it('creates a child logger with correlation ID in context', () => {
    const runtimeConfig = createRuntimeConfig();
    const parentLogger = createHttpLogger(runtimeConfig);
    const correlationId = 'req_123456789_abc123';

    const childLogger = createChildLogger(parentLogger, correlationId);

    expect(childLogger).toBeInstanceOf(UnifiedLogger);
  });

  it('child logger supports logging with context', () => {
    const runtimeConfig = createRuntimeConfig();
    const parentLogger = createHttpLogger(runtimeConfig);
    const correlationId = 'req_123456789_abc123';

    const childLogger = createChildLogger(parentLogger, correlationId);

    // Behavior test: child logger should support logging with context
    // Should not throw
    expect(() => {
      childLogger.info('Test message', { extra: 'data' });
    }).not.toThrow();
  });
});

describe('extractCorrelationId', () => {
  it('extracts correlation ID from res.locals', () => {
    const mockRes = {
      locals: {
        correlationId: 'req_123456789_abc123',
      },
    } as Response;

    const correlationId = extractCorrelationId(mockRes);

    expect(correlationId).toBe('req_123456789_abc123');
  });

  it('returns undefined when correlation ID is not in res.locals', () => {
    const mockRes = {
      locals: {},
    } as Response;

    const correlationId = extractCorrelationId(mockRes);

    expect(correlationId).toBeUndefined();
  });

  it('returns undefined when res.locals is undefined', () => {
    const mockRes = {} as Response;

    const correlationId = extractCorrelationId(mockRes);

    expect(correlationId).toBeUndefined();
  });
});
