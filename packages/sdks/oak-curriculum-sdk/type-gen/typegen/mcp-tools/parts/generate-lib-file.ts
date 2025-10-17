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
  type CallToolResult,
  type TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import {
  toolNames,
  getToolFromToolName,
  getToolNameFromOperationId,
  isToolName,
  type ToolDescriptorForName,
  type ToolDescriptorForOperationId,
  type ToolName,
  type ToolOperationId,
} from '../data/definitions.js';
import type { OakApiPathBasedClient } from '../../../../../../client/index.js';

type ToolOverrideStore = Map<ToolName, ToolDescriptorForName<ToolName>>;

type InvocationResult = CallToolResult;

function textContent(text: string): TextContent {
  return { type: 'text', text };
}

function formatStandardContent(result: unknown, isError = false): InvocationResult {
  if (!isError) {
    return { content: [textContent(JSON.stringify(result, null, 2))] };
  }
  const message = result instanceof Error ? result.message : 'Unknown error';
  const [firstLine, ...rest] = message.split('\\n');
  const header = firstLine.startsWith('Error:') ? firstLine : 'Error: ' + firstLine;
  const content = [textContent(header)];
  for (const line of rest) {
    content.push(textContent(line));
  }
  return { content, isError: true };
}

export class McpToolRegistry {
  private readonly overrides: ToolOverrideStore;
  private readonly client: OakApiPathBasedClient;

  constructor(client: OakApiPathBasedClient) {
    this.client = client;
    this.overrides = new Map();
  }

  register<TName extends ToolName>(name: TName, descriptor: ToolDescriptorForName<TName>): void {
    this.overrides.set(name, descriptor);
  }

  listTools(): readonly ToolDescriptorForName<ToolName>[] {
    return toolNames.map((name) => this.resolveDescriptor(name));
  }

  private resolveDescriptor<TName extends ToolName>(name: TName): ToolDescriptorForName<TName> {
    const override = this.overrides.get(name);
    if (override) {
      return override;
    }
    return getToolFromToolName(name);
  }

  async call(name: string, args: unknown): Promise<InvocationResult> {
    if (!isToolName(name)) {
      return formatStandardContent(new Error('Unknown tool: ' + String(name)), true);
    }
    const descriptor = this.resolveDescriptor(name);
    const parsed = descriptor.toolZodSchema.safeParse(args);
    if (!parsed.success) {
      const describe = descriptor.describeToolArgs;
      const message = describe ? describe() : parsed.error.message;
      return formatStandardContent(new Error(message), true);
    }
    try {
      const output = await descriptor.invoke(this.client, parsed.data);
      const outputValidation = descriptor.validateOutput(output);
      if (!outputValidation.ok) {
        return formatStandardContent(new Error('Output validation error: ' + outputValidation.message), true);
      }
      return formatStandardContent(outputValidation.data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error: ' + String(error));
      return formatStandardContent(err, true);
    }
  }
}

export function getToolDescriptorForOperationId<TId extends ToolOperationId>(
  operationId: TId,
): ToolDescriptorForOperationId<TId> {
  const toolName = getToolNameFromOperationId(operationId);
  return getToolFromToolName(toolName);
}

export function attachMcpHandlers(server: Server, registry: McpToolRegistry): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: registry.listTools() }));
  server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    return registry.call(name, args);
  });
}

export function createMcpToolRegistry(client: OakApiPathBasedClient): McpToolRegistry {
  return new McpToolRegistry(client);
}
`;
}
