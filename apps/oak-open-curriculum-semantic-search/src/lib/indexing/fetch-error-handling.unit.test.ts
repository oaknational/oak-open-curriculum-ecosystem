/**
 * @module fetch-error-handling.unit.test
 * @description Unit tests for fetch error handling helpers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFetchError } from './fetch-error-handling';
import type { FetchErrorConfig } from './fetch-error-handling';
import type { IngestionErrorCollector } from './ingestion-error-types';
import type { Logger } from '@oaknational/mcp-logger';

describe('handleFetchError', () => {
  const mockErrorCollector: IngestionErrorCollector = {
    recordError: vi.fn(),
    recordWarning: vi.fn(),
    record500Error: vi.fn(),
    record404: vi.fn(),
    getIssues: vi.fn(() => []),
    getSummary: vi.fn(() => ({
      totalErrors: 0,
      totalWarnings: 0,
      byHttpStatus: {},
      byOperation: {},
      byKeyStage: {},
      bySubject: {},
      issues: [],
    })),
    hasErrors: vi.fn(() => false),
    hasIssues: vi.fn(() => false),
    logSummary: vi.fn(),
    clear: vi.fn(),
  };

  const mockLogger: Logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };

  function createConfig(overrides?: Partial<FetchErrorConfig<string>>): FetchErrorConfig<string> {
    return {
      fallback: 'default-value',
      errorCollector: mockErrorCollector,
      logger: mockLogger,
      context: { lessonSlug: 'test-lesson' },
      operation: 'testOperation',
      handle404: true,
      ...overrides,
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns fallback for 404 error when handle404 is true', () => {
    const error = new Error('Resource not found: 404');
    const config = createConfig({ handle404: true });

    const result = handleFetchError(error, config);

    expect(result).toBe('default-value');
  });

  it('throws 404 error when handle404 is false', () => {
    const error = new Error('Resource not found: 404');
    const config = createConfig({ handle404: false });

    expect(() => handleFetchError(error, config)).toThrow('Resource not found: 404');
  });

  it('returns fallback and logs warning for 500 error', () => {
    const error = new Error('Internal Server Error: 500');
    const config = createConfig();

    const result = handleFetchError(error, config);

    expect(result).toBe('default-value');
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'testOperation failed with 500, using fallback',
      expect.objectContaining({ lessonSlug: 'test-lesson' }),
    );
    expect(mockErrorCollector.record500Error).toHaveBeenCalledWith(
      { lessonSlug: 'test-lesson' },
      'testOperation',
    );
  });

  it('returns fallback for 502 error', () => {
    const error = new Error('Bad Gateway: 502');
    const config = createConfig();

    const result = handleFetchError(error, config);

    expect(result).toBe('default-value');
  });

  it('returns fallback for 503 error', () => {
    const error = new Error('Service Unavailable: 503');
    const config = createConfig();

    const result = handleFetchError(error, config);

    expect(result).toBe('default-value');
  });

  it('returns fallback for 504 error', () => {
    const error = new Error('Gateway Timeout: 504');
    const config = createConfig();

    const result = handleFetchError(error, config);

    expect(result).toBe('default-value');
  });

  it('re-throws non-server errors', () => {
    const error = new Error('Network failure');
    const config = createConfig();

    expect(() => handleFetchError(error, config)).toThrow('Network failure');
  });

  it('re-throws 400 errors', () => {
    const error = new Error('Bad Request: 400');
    const config = createConfig();

    expect(() => handleFetchError(error, config)).toThrow('Bad Request: 400');
  });
});
