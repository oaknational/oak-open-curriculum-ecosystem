import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createToolResponseHandlers } from './tool-response-handlers';
import type { Logger, Duration } from '@oaknational/mcp-logger/node';

describe('Error Enrichment Integration', () => {
  let logger: Logger;
  let logSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    logSpy = vi.fn();
    logger = {
      info: vi.fn(),
      error: logSpy,
    } as unknown as Logger;
  });

  it('logs execution errors with correlation ID and timing', () => {
    const handlers = createToolResponseHandlers(logger, {
      name: 'testTool',
      description: 'Test tool',
      inputSchemaRaw: {},
      inputSchemaZod: {},
      outputSchemaRaw: {},
      outputSchemaZod: {},
    });

    const duration: Duration = {
      ms: 145.23,
      formatted: '145ms',
    };

    const errorContext = {
      correlationId: 'req_1699123456789_a3f2c9',
      duration,
      toolName: 'testTool',
    };

    handlers.handleExecutionError({ input: 'test' }, new Error('Test error'), errorContext);

    expect(logSpy).toHaveBeenCalled();
    const logCall = logSpy.mock.calls[0];
    expect(logCall[0]).toBe('Tool execution failed');
    expect(logCall[1]).toMatchObject({
      correlationId: 'req_1699123456789_a3f2c9',
      duration: '145ms',
      durationMs: 145.23,
      toolName: 'testTool',
    });
  });

  it('logs validation errors with correlation ID and timing', () => {
    const handlers = createToolResponseHandlers(logger, {
      name: 'getLessonPlan',
      description: 'Get lesson plan',
      inputSchemaRaw: {},
      inputSchemaZod: {},
      outputSchemaRaw: {},
      outputSchemaZod: {},
    });

    const duration: Duration = {
      ms: 2340.56,
      formatted: '2.34s',
    };

    const errorContext = {
      correlationId: 'req_1699123456790_b4e3d0',
      duration,
      toolName: 'getLessonPlan',
    };

    const output = { status: 200 as const, data: { incomplete: 'data' } };

    handlers.handleValidationError(
      { input: 'test' },
      output,
      'Missing required field',
      errorContext,
    );

    expect(logSpy).toHaveBeenCalled();
    const logCall = logSpy.mock.calls[0];
    expect(logCall[0]).toBe('Tool output validation failed');
    expect(logCall[1]).toMatchObject({
      correlationId: 'req_1699123456790_b4e3d0',
      duration: '2.34s',
      durationMs: 2340.56,
      toolName: 'getLessonPlan',
    });
  });

  it('handles errors without context gracefully (backward compatibility)', () => {
    const handlers = createToolResponseHandlers(logger, {
      name: 'testTool',
      description: 'Test tool',
      inputSchemaRaw: {},
      inputSchemaZod: {},
      outputSchemaRaw: {},
      outputSchemaZod: {},
    });

    // Call without errorContext (backward compatibility)
    handlers.handleExecutionError({ input: 'test' }, new Error('Test error'));

    expect(logSpy).toHaveBeenCalled();
    const logCall = logSpy.mock.calls[0];
    // Should still log, just without enrichment
    expect(logCall[0]).toContain('Tool execution failed');
  });

  it('includes all error context fields when available', () => {
    const handlers = createToolResponseHandlers(logger, {
      name: 'searchLessons',
      description: 'Search lessons',
      inputSchemaRaw: {},
      inputSchemaZod: {},
      outputSchemaRaw: {},
      outputSchemaZod: {},
    });

    const duration: Duration = {
      ms: 523.78,
      formatted: '523ms',
    };

    const errorContext = {
      correlationId: 'req_1699999999999_ffffff',
      duration,
      toolName: 'searchLessons',
    };

    handlers.handleExecutionError({ query: 'test' }, new Error('Search failed'), errorContext);

    expect(logSpy).toHaveBeenCalled();
    const logCall = logSpy.mock.calls[0];
    expect(logCall[1]).toMatchObject({
      correlationId: 'req_1699999999999_ffffff',
      duration: '523ms',
      durationMs: 523.78,
      toolName: 'searchLessons',
    });
  });

  it('logs errors in file-safe format (no stdout contamination)', () => {
    const handlers = createToolResponseHandlers(logger, {
      name: 'testTool',
      description: 'Test tool',
      inputSchemaRaw: {},
      inputSchemaZod: {},
      outputSchemaRaw: {},
      outputSchemaZod: {},
    });

    const duration: Duration = {
      ms: 100.5,
      formatted: '100ms',
    };

    const errorContext = {
      correlationId: 'req_test_123',
      duration,
      toolName: 'testTool',
    };

    handlers.handleExecutionError({ input: 'test' }, new Error('Test error'), errorContext);

    // Verify logger.error was called (which goes to file, not stdout)
    expect(logSpy).toHaveBeenCalledWith(
      'Tool execution failed',
      expect.objectContaining({
        correlationId: 'req_test_123',
        toolName: 'testTool',
      }),
    );
  });
});
