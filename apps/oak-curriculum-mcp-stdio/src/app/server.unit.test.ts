/**
 * Unit tests for tool response handlers in the stdio server
 */

import { describe, it, expect, vi } from 'vitest';
import { createToolResponseHandlers } from './tool-response-handlers';

type ToolLogger = Parameters<typeof createToolResponseHandlers>[0];
type ToolContext = Parameters<typeof createToolResponseHandlers>[1];
type ToolResponseHandlers = ReturnType<typeof createToolResponseHandlers>;

function createLogger(): ToolLogger {
  return {
    info: vi.fn<(message: string, data?: unknown) => void>(),
    error: vi.fn<(message: string, data?: unknown) => void>(),
  };
}

const context: ToolContext = {
  name: 'list-tools',
  description: 'GET /tools',
  inputSchemaRaw: { type: 'object' },
  inputSchemaZod: { kind: 'zobject' },
  outputSchemaRaw: { type: 'array' },
  outputSchemaZod: { kind: 'zarray' },
};

describe('createToolResponseHandlers', () => {
  it('logs structured execution errors and marks the response as error', () => {
    const logger = createLogger();
    const handlers: ToolResponseHandlers = createToolResponseHandlers(logger, context);

    const response = handlers.handleExecutionError({ foo: 'bar' }, new Error('boom'));

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('"toolExecutionError"');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Tool execution failed:'));
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('"toolName":"list-tools"'));
  });

  it('logs validation failures with schema metadata', () => {
    const logger = createLogger();
    const handlers: ToolResponseHandlers = createToolResponseHandlers(logger, context);

    const response = handlers.handleValidationError(
      { query: 'oak' },
      { output: true },
      'did not validate',
    );

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('"outputValidationFailed"');
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Tool output validation failed:'),
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('"toolOutput":{"output":true}'),
    );
  });

  it('logs successful payloads via info level', () => {
    const logger = createLogger();
    const handlers: ToolResponseHandlers = createToolResponseHandlers(logger, context);

    const response = handlers.handleSuccess({ success: true });

    expect(response.isError).toBeUndefined();
    expect(response.content[0].text).toBe(JSON.stringify({ success: true }));
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Tool output validated successfully:'),
    );
  });
});
