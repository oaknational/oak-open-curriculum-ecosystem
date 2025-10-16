/**
 * Unit tests for tool response handlers in the stdio server
 */

import { describe, it, expect, vi } from 'vitest';

import {
  toolNames,
  getToolFromToolName,
  type ToolName,
  type ToolDescriptorForName,
} from '@oaknational/oak-curriculum-sdk';

vi.mock(
  '@modelcontextprotocol/sdk/types.ts',
  () => ({ CallToolRequestSchema: {}, ListToolsRequestSchema: {} }),
  { virtual: true },
);
import { createToolResponseHandlers } from './tool-response-handlers';
import { pickPayloadForValidation, validateOutput, type OutputValidationResult } from './server';

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

describe('validation helpers', () => {
  it('prefers the data property when present', () => {
    const payload = {
      data: [{ slug: 'ks1', title: 'Key Stage 1' }],
      response: { status: 200 },
    };
    expect(pickPayloadForValidation(payload)).toEqual(payload.data);
  });

  it('returns the original payload when no data wrapper is present', () => {
    const scalar = 'plain-value';
    expect(pickPayloadForValidation(scalar)).toBe(scalar);
  });

  it('validates curriculum responses once unwrapped', () => {
    const ok: OutputValidationResult = validateOutput('/key-stages', 'GET', {
      data: [
        { slug: 'ks1', title: 'Key Stage 1' },
        { slug: 'ks2', title: 'Key Stage 2' },
      ],
      response: {},
    });
    expect(ok).toEqual({ ok: true });
  });

  it('surfaces informative detail messages when validation fails', () => {
    const result: OutputValidationResult = validateOutput('/key-stages', 'GET', 'not-valid');
    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected validation to fail');
    }
    expect(result.message).toContain('Expected array');
    expect(result.message).toContain('received string');
  });
});

describe('registerMcpTools literals', () => {
  it('iterates over literal tool descriptors in alphabetical order', () => {
    const sortedToolNames = [...toolNames].toSorted((a, b) => a.localeCompare(b));
    expect(sortedToolNames).toEqual(sortedToolNames.slice().sort((a, b) => a.localeCompare(b)));

    for (const name of toolNames) {
      const descriptor: ToolDescriptorForName<typeof name> = getToolFromToolName(name);
      expect(descriptor.name).toBe(name);
      expect(descriptor.inputSchema).toBeDefined();
      expect(descriptor.method.length).toBeGreaterThan(0);
    }
  });
});
