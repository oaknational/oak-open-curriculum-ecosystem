export function generateLibFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Library functions for MCP tools
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { isToolName, getToolNameFromOperationId, type AllOperationIds, type OakMcpToolBase } from './types.js';
import { MCP_TOOLS } from './index.js';

export function getToolFromToolName(toolName: string): typeof MCP_TOOLS[keyof typeof MCP_TOOLS] {
  if (!isToolName(toolName)) throw new TypeError('Unknown tool: ' + String(toolName));
  return MCP_TOOLS[toolName];
}

export function getToolFromOperationId(operationId: AllOperationIds): (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS] {
  const name = getToolNameFromOperationId(operationId);
  return MCP_TOOLS[name];
}

/**
 * Format content for MCP responses
 */
export function formatStandardContent(
  result: unknown,
  isError = false,
): { content: readonly TextContent[]; isError?: true } {
  function textContent(text: string): { type: 'text'; text: string } {
    return { type: 'text', text };
  }
  if (!isError) {
    return { content: [textContent(JSON.stringify(result, null, 2))] };
  }
  const message = result instanceof Error ? result.message : 'Unknown error';
  const lines = message.split('\\n');
  const [first, ...rest] = lines;
  const content = [textContent(\`Error: \${first}\`), ...rest.map((t) => textContent(t))];
  return { content, isError: true };
}

/**
 * MCP Tool Registry for managing and executing tools
 */
export class McpToolRegistry {
  private readonly tools = new Map<string, OakMcpToolBase<unknown, unknown>>();

  register(tool: OakMcpToolBase<unknown, unknown>): void {
    this.tools.set(tool.name, tool);
  }

  listTools(): readonly OakMcpToolBase<unknown, unknown>[] {
    return Array.from(this.tools.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async call(
    name: string,
    args: unknown,
  ): Promise<{ content: readonly TextContent[]; isError?: true }> {
    const tool = this.tools.get(name);
    if (!tool) {
      return formatStandardContent(new Error(\`Unknown tool: \${name}\`), true);
    }
    const result = tool.validateInput(args);
    if (!result.ok) {
      return formatStandardContent(new Error(\`Validation error: \${result.message}\`), true);
    }
    try {
      const output = await tool.handle(result.data);
      const outputValidation = tool.validateOutput(output);
      if (!outputValidation.ok) {
        return formatStandardContent(new Error(\`Output validation error: \${outputValidation.message}\`), true);
      }
      return formatStandardContent(outputValidation.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      return formatStandardContent(error, true);
    }
  }
}

/**
 * Attach tool list and call handlers to a Server instance using a registry.
 */
export function attachMcpHandlers(server: Server, registry: McpToolRegistry): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: registry.listTools() }));
  server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    return registry.call(name, args);
  });
}
`;
}
