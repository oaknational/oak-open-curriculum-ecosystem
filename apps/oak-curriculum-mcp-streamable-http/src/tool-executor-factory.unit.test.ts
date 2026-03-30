/**
 * Unit tests for the tool executor factory.
 *
 * Verifies that `createDefaultRequestExecutor` composes the SDK functions
 * (createClient, executeToolCall, createExecutor) into a single factory
 * that the DI interface can expose.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { createDefaultRequestExecutor } from './tool-executor-factory.js';
import { createFakeSearchRetrieval } from './test-helpers/fakes.js';

describe('createDefaultRequestExecutor', () => {
  it('returns an executor function', () => {
    const executor = createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(() => Promise.resolve(ok({ status: 200 as const, data: {} }))),
      createExecutor: vi.fn(() => vi.fn()),
    });

    expect(typeof executor).toBe('function');
  });

  it('creates a client with the provided API key', () => {
    const createClient = vi.fn(() => ({}));
    const createExecutor = vi.fn(() => vi.fn());

    createDefaultRequestExecutor({
      apiKey: 'my-api-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient,
      executeToolCall: vi.fn(),
      createExecutor,
    });

    expect(createClient).toHaveBeenCalledWith('my-api-key');
  });

  it('passes searchRetrieval to the executor factory', () => {
    const searchRetrieval = createFakeSearchRetrieval();
    const createExecutor = vi.fn(() => vi.fn());

    createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval,
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(),
      createExecutor,
    });

    expect(createExecutor).toHaveBeenCalledWith(expect.objectContaining({ searchRetrieval }));
  });

  it('passes createAssetDownloadUrl to the executor factory when provided', () => {
    const createAssetDownloadUrl = vi.fn();
    const createExecutor = vi.fn(() => vi.fn());

    createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(),
      createExecutor,
      createAssetDownloadUrl,
    });

    expect(createExecutor).toHaveBeenCalledWith(
      expect.objectContaining({ createAssetDownloadUrl }),
    );
  });

  it('delegates tool execution to the composed executor', async () => {
    const expectedResult = {
      content: [{ type: 'text' as const, text: 'success' }],
    };
    const innerExecutor = vi.fn(() => Promise.resolve(expectedResult));
    const createExecutor = vi.fn(() => innerExecutor);

    const executor = createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(),
      createExecutor,
    });

    const result = await executor('get-key-stages', { lessonSlug: 'test' });
    expect(result).toBe(expectedResult);
  });

  it('calls onToolExecution callback for successful executions', async () => {
    const successResult: ToolExecutionResult = ok({ status: 200 as const, data: { ok: true } });
    const onToolExecution = vi.fn();

    // The executeMcpTool inside createExecutor is the wrapped version
    // We need to test the full composition by capturing the wrapper
    let capturedExecuteMcpTool:
      | ((name: 'get-key-stages', args: unknown) => Promise<ToolExecutionResult>)
      | undefined;
    const createExecutor = vi.fn(
      (deps: {
        readonly executeMcpTool: (
          name: 'get-key-stages',
          args: unknown,
        ) => Promise<ToolExecutionResult>;
      }) => {
        capturedExecuteMcpTool = deps.executeMcpTool;
        return vi.fn();
      },
    );

    createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(() => Promise.resolve(successResult)),
      createExecutor,
      onToolExecution,
    });

    // Simulate the executor calling executeMcpTool
    if (capturedExecuteMcpTool === undefined) {
      throw new Error('executeMcpTool was not captured by createExecutor');
    }
    const wrappedResult = await capturedExecuteMcpTool('get-key-stages', {});
    expect(wrappedResult).toBe(successResult);
    expect(onToolExecution).toHaveBeenCalledWith('get-key-stages', successResult);
  });

  it('calls onToolExecution callback for failed executions', async () => {
    const failureResult: ToolExecutionResult = err(
      new McpToolError('auth failed', 'get-key-stages', { code: 'UPSTREAM_AUTH_ERROR' }),
    );
    const onToolExecution = vi.fn();

    let capturedExecuteMcpTool:
      | ((name: 'get-key-stages', args: unknown) => Promise<ToolExecutionResult>)
      | undefined;
    const createExecutor = vi.fn(
      (deps: {
        readonly executeMcpTool: (
          name: 'get-key-stages',
          args: unknown,
        ) => Promise<ToolExecutionResult>;
      }) => {
        capturedExecuteMcpTool = deps.executeMcpTool;
        return vi.fn();
      },
    );

    createDefaultRequestExecutor({
      apiKey: 'test-key',
      searchRetrieval: createFakeSearchRetrieval(),
      createClient: vi.fn(() => ({})),
      executeToolCall: vi.fn(() => Promise.resolve(failureResult)),
      createExecutor,
      onToolExecution,
    });

    if (capturedExecuteMcpTool === undefined) {
      throw new Error('executeMcpTool was not captured by createExecutor');
    }
    const wrappedResult = await capturedExecuteMcpTool('get-key-stages', {});
    expect(wrappedResult).toBe(failureResult);
    expect(onToolExecution).toHaveBeenCalledWith('get-key-stages', failureResult);
  });
});
