import { describe, it, expect } from 'vitest';
import { enrichError, type ErrorContext } from './error-context';
import { startTimer } from './timing';

describe('enrichError', () => {
  it('preserves original error message and stack', () => {
    const originalError = new Error('Original message');
    const originalStack = originalError.stack;

    const context: ErrorContext = {
      correlationId: 'req_123_abc',
    };

    const enriched = enrichError(originalError, context);

    expect(enriched.message).toBe('Original message');
    expect(enriched.stack).toBe(originalStack);
    expect(enriched).toBe(originalError); // Should return same instance
  });

  it('adds correlation ID to error metadata', () => {
    const error = new Error('Test error');
    const context: ErrorContext = {
      correlationId: 'req_456_def',
    };

    const enriched = enrichError(error, context);

    // Context should be attached as non-enumerable property
    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context).toBeDefined();
    expect(enrichedError.context?.correlationId).toBe('req_456_def');
  });

  it('adds timing information to error metadata', () => {
    const error = new Error('Test error');
    const timer = startTimer();
    const duration = timer.end();

    const context: ErrorContext = {
      correlationId: 'req_789_ghi',
      duration,
    };

    const enriched = enrichError(error, context);

    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context?.duration).toBeDefined();
    expect(enrichedError.context?.duration?.ms).toBe(duration.ms);
    expect(enrichedError.context?.duration?.formatted).toBe(duration.formatted);
  });

  it('adds request context (method and path)', () => {
    const error = new Error('Request failed');
    const context: ErrorContext = {
      correlationId: 'req_111_222',
      requestMethod: 'POST',
      requestPath: '/api/tools',
    };

    const enriched = enrichError(error, context);

    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context?.requestMethod).toBe('POST');
    expect(enrichedError.context?.requestPath).toBe('/api/tools');
  });

  it('adds tool name for stdio server context', () => {
    const error = new Error('Tool execution failed');
    const context: ErrorContext = {
      correlationId: 'req_333_444',
      toolName: 'searchLessons',
    };

    const enriched = enrichError(error, context);

    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context?.toolName).toBe('searchLessons');
  });

  it('handles errors without stack traces', () => {
    const error = new Error('No stack');
    delete error.stack;

    const context: ErrorContext = {
      correlationId: 'req_555_666',
    };

    const enriched = enrichError(error, context);

    expect(enriched.message).toBe('No stack');
    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context?.correlationId).toBe('req_555_666');
  });

  it('enriched error context is JSON-serializable', () => {
    const error = new Error('Test error');
    const timer = startTimer();
    const duration = timer.end();

    const context: ErrorContext = {
      correlationId: 'req_777_888',
      duration,
      requestMethod: 'GET',
      requestPath: '/health',
      toolName: 'healthCheck',
    };

    const enriched = enrichError(error, context);

    // Context should be accessible but serialization should work
    const enrichedError = enriched as Error & { context?: ErrorContext };
    const serialized = JSON.stringify({
      message: enrichedError.message,
      context: enrichedError.context,
    });

    expect(serialized).toContain('req_777_888');
    expect(serialized).toContain('GET');
    expect(serialized).toContain('/health');
    expect(serialized).toContain('healthCheck');
  });

  it('handles empty context gracefully', () => {
    const error = new Error('Test error');
    const context: ErrorContext = {};

    const enriched = enrichError(error, context);

    expect(enriched.message).toBe('Test error');
    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context).toBeDefined();
  });

  it('allows partial context with only correlation ID', () => {
    const error = new Error('Test error');
    const context: ErrorContext = {
      correlationId: 'req_999_000',
    };

    const enriched = enrichError(error, context);

    const enrichedError = enriched as Error & { context?: ErrorContext };
    expect(enrichedError.context?.correlationId).toBe('req_999_000');
    expect(enrichedError.context?.duration).toBeUndefined();
    expect(enrichedError.context?.requestMethod).toBeUndefined();
  });

  it('preserves error prototype chain', () => {
    class CustomError extends Error {
      public code: string;

      constructor(message: string, code: string) {
        super(message);
        this.code = code;
        this.name = 'CustomError';
      }
    }

    const error = new CustomError('Custom error', 'ERR_CUSTOM');
    const context: ErrorContext = {
      correlationId: 'req_custom_123',
    };

    const enriched = enrichError(error, context);

    expect(enriched).toBeInstanceOf(CustomError);
    expect(enriched).toBeInstanceOf(Error);
    expect((enriched as CustomError).code).toBe('ERR_CUSTOM');
    expect(enriched.name).toBe('CustomError');
  });
});
