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

type ToolDescriptorStore = {
  [TName in ToolName]?: ToolDescriptorForName<TName>;
};

function storeDescriptor<TName extends ToolName>(
  store: ToolDescriptorStore,
  name: TName,
  descriptor: ToolDescriptorForName<TName>,
): void {
  store[name] = descriptor;
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
  const [firstLine, ...rest] = message.split('\\n');
  const header = firstLine.startsWith('Error:') ? firstLine : 'Error: ' + firstLine;
  const content = [textContent(header)];
  for (const line of rest) {
    content.push(textContent(line));
  }
  return { content, isError: true };
}

export class McpToolRegistry {
  private readonly descriptors: ToolDescriptorStore;
  private readonly client: OakApiPathBasedClient;

  constructor(client: OakApiPathBasedClient) {
    this.client = client;
    this.descriptors = {};
    for (const name of toolNames) {
      storeDescriptor(this.descriptors, name, getToolFromToolName(name));
    }
  }

  register<TName extends ToolName>(name: TName, descriptor: ToolDescriptorForName<TName>): void {
    storeDescriptor(this.descriptors, name, descriptor);
  }

  listTools(): readonly ToolDescriptorForName<ToolName>[] {
    return toolNames.map((name) => this.getDescriptor(name));
  }

  private getDescriptor<TName extends ToolName>(name: TName): ToolDescriptorForName<TName> {
    const descriptor = this.descriptors[name];
    if (descriptor) {
      return descriptor;
    }
    const generated = getToolFromToolName(name);
    storeDescriptor(this.descriptors, name, generated);
    return generated;
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
      const invoke = descriptor.invoke as (
        client: OakApiPathBasedClient,
        args: typeof parsed.data,
      ) => unknown;
      const output = await invoke(this.client, parsed.data);
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
