/**
 * MCP tools module - minimal bridge to SDK
 *
 * Provides MCP tools and handlers by delegating to SDK.
 * All tool logic and validation is handled by the SDK.
 */

import { handleToolCall } from './handlers/tool-handler.js';
import { getMcpTools } from './runtime/index.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * MCP tools module interface
 */
export interface McpToolsModule {
  /** Available MCP tools */
  readonly tools: Tool[];
  /** Handle tool execution */
  handleTool: (name: string, args: unknown) => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getProperty(obj: unknown, key: string): unknown {
  if (!isRecord(obj)) return undefined;
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return desc?.value;
}

function extractTextContent(result: unknown): string | undefined {
  const content: unknown = getProperty(result, 'content');
  const firstOf = (v: unknown): unknown => (Array.isArray(v) ? v[0] : undefined);
  const first = firstOf(content);
  if (!isRecord(first)) return undefined;
  const text: unknown = getProperty(first, 'text');
  return typeof text === 'string' ? text : undefined;
}

/**
 * Creates MCP tools module that delegates to SDK
 */
export function createMcpToolsModule(): McpToolsModule {
  return {
    tools: getMcpTools(),
    handleTool: async (name: string, args: unknown) => {
      const request = {
        method: 'tools/call',
        params: {
          name,
          arguments: isRecord(args) ? args : undefined,
        },
      } as const;
      const result = await handleToolCall(request);
      // If the underlying handler signals an error, pass through untouched
      if (isRecord(result) && result.isError === true && 'content' in result) {
        return result;
      }
      // Extract the text content from the MCP response
      const textContent = extractTextContent(result);
      if (textContent !== undefined) {
        try {
          const parsed: unknown = JSON.parse(textContent);
          return parsed;
        } catch {
          return textContent;
        }
      }
      // Fallback: return a JSON-safe clone to avoid unsafe any propagation
      try {
        const safe: unknown = JSON.parse(JSON.stringify(result));
        return safe;
      } catch {
        return { content: [] };
      }
    },
  };
}

// Backward-compatibility exports
export type McpOrgan = McpToolsModule;
export function createMcpOrgan(): McpToolsModule {
  return createMcpToolsModule();
}
