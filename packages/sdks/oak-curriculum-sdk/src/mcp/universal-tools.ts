import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import type { ZodTypeAny } from 'zod';
import {
  OPENAI_CONNECTOR_TOOL_ENTRIES,
  isOpenAiToolName,
  type OpenAiToolName,
} from '../types/generated/openai-connector/index.js';
import { MCP_TOOLS } from '../types/generated/api-schema/mcp-tools/definitions.js';
import { isToolName, type AllToolNames } from '../types/generated/api-schema/mcp-tools/types.js';
import { zodFromToolInputJsonSchema, type GenericToolInputJsonSchema } from './zod-input-schema.js';
import type { ToolExecutionResult } from './execute-tool-call.js';

export type UniversalToolName = OpenAiToolName | AllToolNames;

export interface UniversalToolListEntry {
  readonly name: UniversalToolName;
  readonly description?: string;
  readonly inputSchema: GenericToolInputJsonSchema;
}

export interface UniversalToolExecutorDependencies {
  readonly executeMcpTool: (name: AllToolNames, args: unknown) => Promise<ToolExecutionResult>;
  readonly executeOpenAiTool: (name: OpenAiToolName, args: unknown) => Promise<unknown>;
}

interface ToolMetadata {
  readonly schema: ZodTypeAny;
  readonly inputSchema: GenericToolInputJsonSchema;
  readonly description?: string;
  readonly describeToolArgs?: () => string;
  readonly outputJsonSchema: unknown;
}

const toolMetadata: ReadonlyMap<UniversalToolName, ToolMetadata> = (() => {
  const entries = new Map<UniversalToolName, ToolMetadata>();

  for (const [name, def] of OPENAI_CONNECTOR_TOOL_ENTRIES) {
    const inputSchema = def.inputSchema;
    entries.set(name, {
      schema: zodFromToolInputJsonSchema(inputSchema),
      inputSchema,
      description: def.description,
      describeToolArgs: undefined,
      outputJsonSchema: undefined,
    });
  }

  for (const [name, descriptor] of Object.entries(MCP_TOOLS) as readonly [
    AllToolNames,
    (typeof MCP_TOOLS)[AllToolNames],
  ][]) {
    entries.set(name, {
      schema: descriptor.toolZodSchema,
      inputSchema: descriptor.inputSchema,
      description: descriptor.description,
      describeToolArgs: descriptor.describeToolArgs,
      outputJsonSchema: descriptor.toolOutputJsonSchema,
    });
  }

  return entries;
})();

function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: message };
  return { content: [content], isError: true };
}

function formatData(data: unknown): CallToolResult {
  const normalised = serialiseArg(data);
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  return { content: [content] };
}

function formatUnknownTool(value: unknown): CallToolResult {
  if (typeof value === 'string') {
    return formatError(`Unknown tool: ${value}`);
  }
  return formatError('Unknown tool');
}

function toErrorMessage(value: unknown): string {
  if (value instanceof Error) {
    const { message } = value;
    if (message.length === 0) {
      return 'Unknown error';
    }
    return message;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return 'Unknown error';
}

function validateArgs(
  name: UniversalToolName,
  args: unknown,
):
  | { ok: true; value: unknown }
  | {
      ok: false;
      message: string;
    } {
  const metadata = toolMetadata.get(name);
  if (!metadata) {
    return { ok: false, message: `Unknown tool: ${name}` };
  }
  const safeResult = metadata.schema.safeParse(args);
  if (safeResult.success) {
    return { ok: true, value: safeResult.data };
  }
  const describe = metadata.describeToolArgs;
  const fallbackMessage = safeResult.error.issues.map((issue) => issue.message).join('; ');
  return {
    ok: false,
    message: describe ? describe() : fallbackMessage,
  };
}

function serialiseArg(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serialiseArg);
  }
  if (typeof value === 'object' && value !== null) {
    const entries: [string, unknown][] = [];
    for (const key of Object.keys(value)) {
      const nested = (value as Record<string, unknown>)[key];
      entries.push([key, serialiseArg(nested)]);
    }
    const result: Record<string, unknown> = {};
    for (const [key, nested] of entries) {
      result[key] = nested;
    }
    return result;
  }
  return value;
}

export function listUniversalTools(): readonly UniversalToolListEntry[] {
  const entries: UniversalToolListEntry[] = [];
  for (const [name, metadata] of toolMetadata.entries()) {
    entries.push({
      name,
      description: metadata.description,
      inputSchema: metadata.inputSchema,
    });
  }
  return entries;
}

export function isUniversalToolName(value: unknown): value is UniversalToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return isOpenAiToolName(value) || isToolName(value);
}

async function runOpenAiTool(
  name: OpenAiToolName,
  value: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  try {
    const result = await deps.executeOpenAiTool(name, value);
    return formatData(result);
  } catch (error) {
    return formatError(toErrorMessage(error));
  }
}

async function runMcpTool(
  name: AllToolNames,
  value: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  try {
    const execution = await deps.executeMcpTool(name, value);
    if ('error' in execution && execution.error) {
      return formatError(toErrorMessage(execution.error));
    }
    return formatData(execution.data);
  } catch (error) {
    return formatError(toErrorMessage(error));
  }
}

export function createUniversalToolExecutor(
  deps: UniversalToolExecutorDependencies,
): (name: UniversalToolName, args: unknown) => Promise<CallToolResult> {
  return async (name: UniversalToolName, args: unknown): Promise<CallToolResult> => {
    if (!isUniversalToolName(name)) {
      return formatUnknownTool(name);
    }

    const input = args === undefined ? {} : args;
    const validation = validateArgs(name, input);
    if (!validation.ok) {
      return formatError(validation.message);
    }

    if (isOpenAiToolName(name)) {
      return runOpenAiTool(name, validation.value, deps);
    }

    if (!isToolName(name)) {
      return formatUnknownTool(name);
    }

    return runMcpTool(name, validation.value, deps);
  };
}
