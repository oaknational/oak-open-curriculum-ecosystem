/**
 * Integration tests for MCP tool handler
 * Tests the integration between MCP tools and SDK's executeToolCall
 *
 * These tests prove useful things about the actual system we have:
 * - Tool handler correctly delegates to SDK's executeToolCall
 * - Error handling and logging work correctly
 * - Unknown tools are rejected
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import { createToolHandler, McpOperationError } from './tool-handler.js';

// Mock the SDK's executeToolCall function
vi.mock('@oaknational/oak-curriculum-sdk', () => ({
  isToolName: vi.fn(),
  executeToolCall: vi.fn(),
  McpToolError: class McpToolError extends Error {
    readonly toolName: string;
    readonly code?: string;
    constructor(message: string, toolName: string, options?: { cause?: unknown; code?: string }) {
      super(message);
      this.name = 'McpToolError';
      this.toolName = toolName;
      this.code = options?.code;
      if (options?.cause !== undefined && 'cause' in this) {
        (this as { cause?: unknown }).cause = options.cause;
      }
    }
  },
  McpParameterError: class McpParameterError extends Error {
    toolName: string;
    readonly parameterName?: string;
    constructor(message: string, toolName: string, parameterName?: string) {
      super(message);
      this.name = 'McpParameterError';
      this.toolName = toolName;
      this.parameterName = parameterName;
    }
  },
}));

import {
  isToolName,
  executeToolCall,
  McpToolError,
  McpParameterError,
} from '@oaknational/oak-curriculum-sdk';

describe('createToolHandler', () => {
  let mockSdkClient: OakApiPathBasedClient;
  let mockLogger: Logger;
  let toolHandler: ReturnType<typeof createToolHandler>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock SDK client (minimal - just needs to be passed through)
    mockSdkClient = {} as OakApiPathBasedClient;

    // Create mock logger
    mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      child: vi.fn(() => mockLogger),
    } as unknown as Logger;

    // Create tool handler
    toolHandler = createToolHandler(mockSdkClient, mockLogger);
  });

  describe('successful tool execution', () => {
    it('should execute known tool and return data', async () => {
      // Given: Tool is known and execution succeeds
      vi.mocked(isToolName).mockReturnValue(true);
      vi.mocked(executeToolCall).mockResolvedValue({
        data: { lessons: ['lesson1', 'lesson2'] },
        error: undefined,
      } as const);

      // When: Execute tool
      const result = await toolHandler('oak-search-lessons', {
        q: 'fractions',
      });

      // Then: Validates tool name
      expect(isToolName).toHaveBeenCalledWith('oak-search-lessons');

      // And: Delegates to SDK's executeToolCall
      expect(executeToolCall).toHaveBeenCalledWith(
        'oak-search-lessons',
        { q: 'fractions' },
        mockSdkClient,
      );

      // And: Returns the data
      expect(result).toEqual({ lessons: ['lesson1', 'lesson2'] });

      // And: Logs debug messages
      expect(mockLogger.debug).toHaveBeenCalledWith('Executing tool via SDK', {
        toolName: 'oak-search-lessons',
        params: { q: 'fractions' },
      });
      expect(mockLogger.debug).toHaveBeenCalledWith('Tool execution successful', {
        toolName: 'oak-search-lessons',
      });
    });
  });

  describe('unknown tool handling', () => {
    it('should throw error for unknown tool', async () => {
      // Given: Tool is unknown
      vi.mocked(isToolName).mockReturnValue(false);

      // When/Then: Should throw McpOperationError
      await expect(toolHandler('unknown-tool', {})).rejects.toThrow(McpOperationError);

      // And: Should not call executeToolCall
      expect(executeToolCall).not.toHaveBeenCalled();

      // And: Error has correct details
      try {
        await toolHandler('unknown-tool', {});
      } catch (error) {
        expect(error).toBeInstanceOf(McpOperationError);
        expect((error as McpOperationError).message).toBe('Unknown tool: unknown-tool');
        expect((error as McpOperationError).operation).toBe('unknown-tool');
      }
    });
  });

  describe('parameter validation errors', () => {
    it('should handle parameter validation errors from SDK', async () => {
      // Given: Tool is known but parameters are invalid
      vi.mocked(isToolName).mockReturnValue(true);
      const paramError = new McpParameterError(
        'Required parameter missing',
        'oak-search-lessons',
        'keyStage',
      );
      vi.mocked(executeToolCall).mockResolvedValue({
        data: undefined,
        error: paramError,
      } as const);

      // When/Then: Should throw McpOperationError
      await expect(toolHandler('oak-search-lessons', {})).rejects.toThrow(McpOperationError);

      // And: Logs the parameter error
      expect(mockLogger.error).toHaveBeenCalledWith('Parameter validation failed', {
        toolName: 'oak-search-lessons',
        parameterName: 'keyStage',
        error: 'Required parameter missing',
      });
    });
  });

  describe('execution errors', () => {
    it('should handle execution errors with cause chain', async () => {
      // Given: Tool execution fails with nested errors
      vi.mocked(isToolName).mockReturnValue(true);
      const rootCause = new Error('Network timeout');
      const toolError = new McpToolError('Failed to fetch data', 'oak-search-lessons', {
        code: 'FETCH_ERROR',
        cause: rootCause,
      });
      vi.mocked(executeToolCall).mockResolvedValue({
        data: undefined,
        error: toolError,
      } as const);

      // When/Then: Should throw McpOperationError
      await expect(toolHandler('oak-search-lessons', { q: 'test' })).rejects.toThrow(
        McpOperationError,
      );

      // And: Logs the error with cause chain
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Tool execution failed',
        expect.objectContaining({
          toolName: 'oak-search-lessons',
          code: 'FETCH_ERROR',
          error: 'Failed to fetch data',
          causeChain: 'Failed to fetch data -> Caused by: Network timeout',
        }),
      );
    });

    it('should handle unrecognized error types', async () => {
      // Given: Execution fails with unrecognized error (not McpParameterError)
      vi.mocked(isToolName).mockReturnValue(true);
      const unknownError = new McpToolError('Unknown error type', 'oak-search-lessons');
      // Remove the code to make it not match the specific error handling
      delete (unknownError as unknown).code;
      vi.mocked(executeToolCall).mockResolvedValue({
        data: undefined,
        error: unknownError,
      } as const);

      // When/Then: Should throw McpOperationError
      await expect(toolHandler('oak-search-lessons', { q: 'test' })).rejects.toThrow(
        McpOperationError,
      );

      // And: Still logs as tool error with cause chain
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Tool execution failed',
        expect.objectContaining({
          toolName: 'oak-search-lessons',
          error: 'Unknown error type',
        }),
      );
    });
  });
});
