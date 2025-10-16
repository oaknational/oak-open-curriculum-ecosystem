/**
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
import {
  toolNames,
  getToolFromToolName,
  getToolNameFromOperationId,
  isToolName,
  type ToolDescriptorForName,
  type ToolDescriptorForOperationId,
  type ToolName,
  type OperationId,
} from '../data/definitions.js';
import type { OakApiPathBasedClient } from '../../../../../../client/index.js';

interface ToolRegistryEntry<TName extends ToolName> {
  readonly descriptor: ToolDescriptorForName<TName>;
}

type InvocationResult = { readonly content: readonly TextContent[]; readonly isError?: true };

function textContent(text: string): TextContent {
  return { type: 'text', text };
}

function formatStandardContent(result: unknown, isError = false): InvocationResult {
  if (!isError) {
    return { content: [textContent(JSON.stringify(result, null, 2))] };
  }
  const message = result instanceof Error ? result.message : 'Unknown error';
  const [firstLine, ...rest] = message.split('\n');
  const header = firstLine.startsWith('Error:') ? firstLine : 'Error: ' + firstLine;
  const content = [textContent(header)];
  for (const line of rest) {
    content.push(textContent(line));
  }
  return { content, isError: true };
}

export class McpToolRegistry {
  private readonly tools: Map<ToolName, ToolRegistryEntry<ToolName>>;
  private readonly client: OakApiPathBasedClient;

  constructor(client: OakApiPathBasedClient) {
    this.client = client;
    this.tools = new Map();
    for (const name of toolNames) {
      this.tools.set(name, { descriptor: getToolFromToolName(name) });
    }
  }

  register<TName extends ToolName>(name: TName, descriptor: ToolDescriptorForName<TName>): void {
    this.tools.set(name, { descriptor });
  }

  listTools(): readonly ToolDescriptorForName<ToolName>[] {
    return toolNames.map((name) => this.getDescriptor(name));
  }

  private getDescriptor<TName extends ToolName>(name: TName): ToolDescriptorForName<TName> {
    const entry = this.tools.get(name);
    if (entry) {
      return entry.descriptor;
    }
    const descriptor = getToolFromToolName(name);
    this.tools.set(name, { descriptor });
    return descriptor;
  }

  async call(name: string, args: unknown): Promise<InvocationResult> {
    if (!isToolName(name)) {
      return formatStandardContent(new Error('Unknown tool: ' + String(name)), true);
    }
    const descriptor = this.getDescriptor(name);
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

export function getToolDescriptorForOperationId<TId extends OperationId>(
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
