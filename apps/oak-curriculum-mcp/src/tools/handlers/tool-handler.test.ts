/**
 * Integration tests for MCP tool handler
 * Tests the integration between MCP protocol and SDK's executeToolCall
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { createHandleToolCall } from './tool-handler.js';

// Mock the SDK
vi.mock('@oaknational/oak-curriculum-sdk', () => ({
  isToolName: vi.fn(),
  executeToolCall: vi.fn(),
  createOakPathBasedClient: vi.fn(() => ({})),
  McpParameterError: class McpParameterError extends Error {
    toolName: string;
    pathParameterName?: string;
    queryParameterName?: string;
    constructor(
      message: string,
      toolName: string,
      pathParameterName?: string,
      queryParameterName?: string,
    ) {
      super(message);
      this.name = 'McpParameterError';
      this.toolName = toolName;
      this.pathParameterName = pathParameterName;
      this.queryParameterName = queryParameterName;
    }
  },
  McpToolError: class McpToolError extends Error {
    toolName: string;
    code?: string;
    constructor(message: string, toolName: string, options?: { code?: string }) {
      super(message);
      this.name = 'McpToolError';
      this.toolName = toolName;
      this.code = options?.code;
    }
  },
}));

import {
  isToolName,
  executeToolCall,
  McpParameterError,
  McpToolError,
} from '@oaknational/oak-curriculum-sdk';

describe('handleToolCall', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful tool execution', () => {
    it('should execute known tool and return formatted result', async () => {
      // Given: Tool is known and execution succeeds
      vi.mocked(isToolName).mockReturnValue(true);
      vi.mocked(executeToolCall).mockResolvedValue({
        data: { lessons: ['lesson1', 'lesson2'] },
        error: undefined,
      });

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'oak-search-lessons',
          arguments: { q: 'fractions' },
        },
      };

      // When: Execute tool
      const mockClient = {} as never;
      const handleToolCall = createHandleToolCall(mockClient);
      const result = await handleToolCall(request);

      // Then: Returns formatted MCP result
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ lessons: ['lesson1', 'lesson2'] }, null, 2),
          },
        ],
      });

      // And: Called SDK with correct parameters
      expect(executeToolCall).toHaveBeenCalledWith(
        'oak-search-lessons',
        { q: 'fractions' },
        expect.any(Object), // The client
      );
    });
  });

  describe('unknown tool handling', () => {
    it('should return MCP error result for unknown tool', async () => {
      // Given: Tool is unknown
      vi.mocked(isToolName).mockReturnValue(false);

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'unknown-tool',
          arguments: {},
        },
      };

      // When/Then: Should throw McpError with MethodNotFound
      const mockClient = {} as never;
      const handleToolCall = createHandleToolCall(mockClient);
      const result = await handleToolCall(request);
      expect(result).toHaveProperty('isError', true);
      expect(result).toHaveProperty('content');
      const text = (result.content[0] as { type: string; text?: string }).text ?? '';
      expect(text).toContain('Unknown tool');

      // And: Should not call executeToolCall
      expect(executeToolCall).not.toHaveBeenCalled();
    });
  });

  describe('parameter validation errors', () => {
    it('should handle parameter errors from SDK', async () => {
      // Given: Tool is known but parameters are invalid
      vi.mocked(isToolName).mockReturnValue(true);
      vi.mocked(executeToolCall).mockResolvedValue({
        data: undefined,
        error: new McpParameterError('Invalid parameter', 'oak-get-lesson', 'lesson'),
      });

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'oak-get-lesson',
          arguments: {},
        },
      };

      const mockClient = {} as never;
      const handleToolCall = createHandleToolCall(mockClient);
      const result = await handleToolCall(request);
      expect(result).toHaveProperty('isError', true);
      const text = (result.content[0] as { type: string; text?: string }).text ?? '';
      expect(text).toContain('Invalid parameter');
    });
  });

  describe('API errors', () => {
    it('should handle API errors from SDK', async () => {
      // Given: Tool execution fails with API error
      vi.mocked(isToolName).mockReturnValue(true);
      vi.mocked(executeToolCall).mockResolvedValue({
        data: undefined,
        error: new McpToolError('API error: 500', 'oak-get-subjects'),
      });

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'oak-get-subjects',
          arguments: {},
        },
      };

      const mockClient = {} as never;
      const handleToolCall = createHandleToolCall(mockClient);
      const result = await handleToolCall(request);
      expect(result).toHaveProperty('isError', true);
      const text = (result.content[0] as { type: string; text?: string }).text ?? '';
      expect(text).toContain('API error: 500');
    });
  });

  describe('unexpected errors', () => {
    it('should handle unexpected errors gracefully', async () => {
      // Given: executeToolCall throws unexpected error
      vi.mocked(isToolName).mockReturnValue(true);
      vi.mocked(executeToolCall).mockRejectedValue(new Error('Network timeout'));

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'oak-get-subjects',
          arguments: {},
        },
      };

      const mockClient = {} as never;
      const handleToolCall = createHandleToolCall(mockClient);
      const result = await handleToolCall(request);
      expect(result).toHaveProperty('isError', true);
      const text = (result.content[0] as { type: string; text?: string }).text ?? '';
      expect(text).toContain('Network timeout');
    });
  });

  // No env-based tests needed; client is injected
});
