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
import { type ToolDescriptor } from './types.js';
import {
  getToolFromToolName,
  getToolFromOperationId,
  isToolName,
  type OperationId,
  type ToolName,
} from './definitions.js';

interface ToolRegistryEntry {
  readonly descriptor: ToolDescriptor;
}

interface InvocationResult { readonly content: readonly TextContent[]; readonly isError?: true }

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
  private readonly tools = new Map<ToolName, ToolRegistryEntry>();

  register(name: ToolName, descriptor: ToolDescriptor): void {
    this.tools.set(name, { descriptor });
  }

  listTools(): readonly ToolDescriptor[] {
    return Array.from(this.tools.values())
      .map((entry) => entry.descriptor)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async call(name: string, args: unknown): Promise<InvocationResult> {
      if (!isToolName(name)) {
      return formatStandardContent(new Error('Unknown tool: ' + name), true);
    }
    const entry = this.tools.get(name);
    if (!entry) {
      return formatStandardContent(new Error('Tool not registered: ' + name), true);
    }
    const { descriptor } = entry;
    const parsed = descriptor.toolZodSchema.safeParse(args);
    if (!parsed.success) {
      const describe = descriptor.describeToolArgs;
      const message = describe ? describe() : parsed.error.issues.map((issue) => issue.message).join('; ');
      return formatStandardContent(new Error(message), true);
    }
    try {
      const output = await descriptor.invoke(parsed.data);
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

export function attachMcpHandlers(server: Server, registry: McpToolRegistry): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: registry.listTools() }));
  server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    return registry.call(name, args);
  });
}
