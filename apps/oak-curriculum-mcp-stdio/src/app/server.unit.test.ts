/**
 * Unit tests for tool response handlers in the stdio server
 */

import { describe, it, expect, vi } from 'vitest';

import {
  toolNames,
  getToolFromToolName,
  type ToolDescriptorForName,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

vi.mock('@modelcontextprotocol/sdk/types.ts', () => ({
  CallToolRequestSchema: {},
  ListToolsRequestSchema: {},
}));
import { createToolResponseHandlers } from './tool-response-handlers';
import { registerMcpTools } from './server';
import {
  pickPayloadForValidation,
  validateOutput,
  type ToolExecutionSuccessEnvelope,
} from './validation.js';
import {
  createFakeToolExecutionSuccessEnvelope,
  createFakeMcpServer,
  createFakeLogger,
  createFakeOakPathBasedClient,
} from '../test-helpers/fakes.js';

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
    const firstContent = response.content[0];
    // Narrow to text response type
    if (!('text' in firstContent)) {
      throw new TypeError('Test: Expected text content, got blob');
    }
    expect(firstContent.text).toContain('"toolExecutionError"');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Tool execution failed:'));
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('"toolName":"list-tools"'));
  });

  it('logs validation failures with schema metadata', () => {
    const logger = createLogger();
    const handlers: ToolResponseHandlers = createToolResponseHandlers(logger, context);
    const envelope: ToolExecutionSuccessEnvelope = {
      status: 404,
      data: { output: true },
    };

    const response = handlers.handleValidationError({ query: 'oak' }, envelope, 'did not validate');

    expect(response.isError).toBe(true);
    const firstContent = response.content[0];
    // Narrow to text response type
    if (!('text' in firstContent)) {
      throw new TypeError('Test: Expected text content, got blob');
    }
    expect(firstContent.text).toContain('"outputValidationFailed"');
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Tool output validation failed:'),
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('"toolOutput":{"status":404,"data":{"output":true}}'),
    );
  });

  it('logs successful payloads via info level', () => {
    const logger = createLogger();
    const handlers: ToolResponseHandlers = createToolResponseHandlers(logger, context);

    const response = handlers.handleSuccess({ status: 200, data: { success: true } });

    expect(response.isError).toBeUndefined();
    const firstContent = response.content[0];
    // Narrow to text response type
    if (!('text' in firstContent)) {
      throw new TypeError('Test: Expected text content, got blob');
    }
    expect(firstContent.text).toBe(JSON.stringify({ status: 200, data: { success: true } }));
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Tool output validated successfully:'),
    );
  });
});

describe('validation helpers', () => {
  it('returns the original payload when no wrapper is present', () => {
    const scalar = 'plain-value';
    const envelope: ToolExecutionSuccessEnvelope = { status: 200, data: scalar };
    expect(pickPayloadForValidation(envelope)).toBe(scalar);
  });

  it('validates curriculum responses once unwrapped', () => {
    const descriptor = getToolFromToolName('get-key-stages');
    const ok = validateOutput(descriptor, {
      status: 200,
      data: [
        { slug: 'ks1', title: 'Key Stage 1' },
        { slug: 'ks2', title: 'Key Stage 2' },
      ],
    });
    expect(ok.ok).toBe(true);
    if (!ok.ok) {
      throw new Error('Expected validation to succeed');
    }
    expect(ok.result.status).toBe(200);
    expect(ok.result.data).toEqual([
      { slug: 'ks1', title: 'Key Stage 1' },
      { slug: 'ks2', title: 'Key Stage 2' },
    ]);
  });

  it('surfaces informative detail messages when validation fails', () => {
    const descriptor = getToolFromToolName('get-key-stages');
    const result = validateOutput(descriptor, {
      status: 200,
      data: 'not-valid',
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected validation to fail');
    }
    expect(result.message).toContain('Response does not match any documented schema');
    expect(result.message).toContain('statuses: 200');
  });

  it('fails fast when the response references an undocumented status', () => {
    const descriptor = getToolFromToolName('get-key-stages');
    const undocumented = createFakeToolExecutionSuccessEnvelope<'get-key-stages'>(599, {});
    const result = validateOutput(descriptor, undocumented);
    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected validation to report unsupported status');
    }
    expect(result.message).toContain('Undocumented response status 599');
  });
});

describe('registerMcpTools literals', () => {
  it('maps each tool name to its corresponding descriptor', () => {
    for (const name of toolNames) {
      const descriptor: ToolDescriptorForName<typeof name> = getToolFromToolName(name);
      expect(descriptor.name).toBe(name);
      expect(descriptor.inputSchema).toBeDefined();
      expect(descriptor.method.length).toBeGreaterThan(0);
    }
  });
});

describe('registerMcpTools registration metadata', () => {
  it('uses descriptor.description for tool registration', () => {
    const registered = new Map<
      string,
      { readonly title: string; readonly description?: string; readonly inputSchema: unknown }
    >();
    const fakeServer = createFakeMcpServer();
    vi.mocked(fakeServer.registerTool).mockImplementation(
      (
        name: string,
        definition: {
          readonly title: string;
          readonly description?: string;
          readonly inputSchema: unknown;
        },
        ...handler: unknown[]
      ) => {
        void handler;
        registered.set(name, {
          title: definition.title,
          description: definition.description,
          inputSchema: definition.inputSchema,
        });
        return undefined as unknown as ReturnType<McpServer['registerTool']>;
      },
    );
    const fakeClient = createFakeOakPathBasedClient();
    const fakeLogger = createFakeLogger();

    registerMcpTools(fakeServer, fakeClient, fakeLogger);

    const targetName = 'get-changelog' as const;
    const descriptor: ToolDescriptorForName<typeof targetName> = getToolFromToolName(targetName);
    const registration = registered.get(targetName);
    expect(registration).toBeDefined();
    expect(registration?.description).toBe(descriptor.description);
  });
});
