/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Library helpers for MCP tool registration and invocation.
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-lib-file.ts
 *
 * @remarks This file is part of the schema-first execution DAG. See
 * .agent/directives-and-memory/schema-first-execution.md.
 */
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, type CallToolRequest, type CallToolResult, type TextContent } from '@modelcontextprotocol/sdk/types.js';
import { getToolFromOperationId, isToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolName, type ToolOperationId } from '../data/definitions.js';
import type { ToolClientForName } from '../aliases/types.js';
import { callTool, listAllToolDescriptors, parseToolArguments } from './execute.js';

type InvocationResult = CallToolResult;

function textContent(text: string): TextContent {
  return { type: 'text', text };
}

function formatSuccess(result: unknown): InvocationResult {
  return { content: [textContent(JSON.stringify(result, null, 2))] };
}

function formatError(error: unknown): InvocationResult {
  const err = error instanceof Error ? error : new Error(String(error));
  const [firstLine, ...rest] = err.message.split("\n");
  const header = firstLine.startsWith("Error:") ? firstLine : `Error: ${firstLine}`;
  const content: TextContent[] = [textContent(header)];
  for (const line of rest) {
    content.push(textContent(line));
  }
  return { content, isError: true };
}

export function listToolDescriptors(): readonly ToolDescriptorForName<ToolName>[] {
  return listAllToolDescriptors();
}

export class McpToolRegistry {
  private readonly client: ToolClientForName<ToolName>;

  constructor(client: ToolClientForName<ToolName>) {
    this.client = client;
  }

  listTools(): readonly ToolDescriptorForName<ToolName>[] {
    return listToolDescriptors();
  }

  async call(name: string, rawArgs: unknown): Promise<InvocationResult> {
    if (!isToolName(name)) {
      return formatError(new TypeError('Unknown tool: ' + String(name)));
    }
    try {
      const { args } = parseToolArguments(name, rawArgs);
      const result = await callTool(name, this.client, args);
      return formatSuccess(result);
    } catch (error) {
      return formatError(error);
    }
  }
}

export function getToolDescriptorForOperationId<TId extends ToolOperationId>(operationId: TId): ToolDescriptorForOperationId<TId> {
  return getToolFromOperationId(operationId);
}

export function attachMcpHandlers(server: Server, registry: McpToolRegistry): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: registry.listTools() }));
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    return registry.call(name, args);
  });
}

export function createMcpToolRegistry(client: ToolClientForName<ToolName>): McpToolRegistry {
  return new McpToolRegistry(client);
}