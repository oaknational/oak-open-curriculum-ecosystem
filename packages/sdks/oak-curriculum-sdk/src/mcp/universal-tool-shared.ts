import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { typeSafeEntries, typeSafeFromEntries } from '../types/helpers/type-helpers.js';
import type { ToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import type { ToolExecutionResult } from './execute-tool-call.js';
import { McpParameterError, McpToolError } from './execute-tool-call.js';

export interface UniversalToolExecutorDependencies {
  readonly executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;
}

export function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: message };
  return { content: [content], isError: true };
}

export function serialiseArg(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serialiseArg);
  }
  if (typeof value === 'object' && value !== null) {
    const entries = typeSafeEntries(value);
    const normalisedEntries: [string, unknown][] = [];
    for (const [key, nested] of entries) {
      normalisedEntries.push([String(key), serialiseArg(nested)]);
    }
    return typeSafeFromEntries(normalisedEntries);
  }
  return value;
}

export function formatData(data: unknown): CallToolResult {
  const normalised = serialiseArg(data);
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  return { content: [content] };
}

export function formatUnknownTool(value: unknown): CallToolResult {
  if (typeof value === 'string') {
    return formatError(`Unknown tool: ${value}`);
  }
  return formatError('Unknown tool');
}

export function toErrorMessage(value: unknown): string {
  if (value instanceof McpToolError || value instanceof McpParameterError) {
    return value.message;
  }
  if (value instanceof Error) {
    return value.message.length > 0 ? value.message : 'Unknown error';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return 'Unknown error';
}

export function extractExecutionData(
  result: ToolExecutionResult,
): { readonly ok: true; readonly data: unknown } | { readonly ok: false; readonly error: unknown } {
  if ('error' in result && result.error) {
    return { ok: false, error: result.error };
  }
  return { ok: true, data: result.data };
}
