import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import type { ZodTypeAny } from 'zod';
import {
  OPENAI_CONNECTOR_TOOL_DEFS,
  isOpenAiToolName,
  type OpenAiToolName,
} from '../types/generated/openai-connector/index.js';
import { MCP_TOOLS, isToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import type { AllToolNames } from '../types/generated/api-schema/mcp-tools/types.js';
import { typeSafeEntries } from '../types/helpers.js';
import { zodFromToolInputJsonSchema } from './zod-input-schema.js';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';
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

interface ToolValidator {
  readonly name: UniversalToolName;
  readonly schema: ZodTypeAny;
}

interface InputSchemaLike {
  readonly type: 'object';
  readonly properties?: GenericToolInputJsonSchema['properties'];
  readonly required?: readonly string[] | string[];
  readonly additionalProperties?: boolean;
}

function cloneInputSchema(schema: InputSchemaLike): GenericToolInputJsonSchema {
  const requiredValues = (() => {
    if (!schema.required) {
      return undefined;
    }
    const values: string[] = [];
    for (const value of schema.required) {
      values.push(value);
    }
    return values;
  })();

  const base: GenericToolInputJsonSchema = {
    type: 'object',
    ...(schema.properties ? { properties: schema.properties } : {}),
    ...(schema.additionalProperties !== undefined
      ? { additionalProperties: schema.additionalProperties }
      : {}),
    ...(requiredValues ? { required: requiredValues } : {}),
  };
  return base;
}

const openAiValidators: readonly ToolValidator[] = typeSafeEntries(OPENAI_CONNECTOR_TOOL_DEFS).map(
  ([name, def]) => ({
    name,
    schema: zodFromToolInputJsonSchema(cloneInputSchema(def.inputSchema)),
  }),
);

const mcpValidators: readonly ToolValidator[] = typeSafeEntries(MCP_TOOLS).map(([name, def]) => ({
  name,
  schema: zodFromToolInputJsonSchema(cloneInputSchema(def.inputSchema)),
}));

const validatorMap: ReadonlyMap<UniversalToolName, ZodTypeAny> = (() => {
  const validators = new Map<UniversalToolName, ZodTypeAny>();
  for (const validator of openAiValidators) {
    validators.set(validator.name, validator.schema);
  }
  for (const validator of mcpValidators) {
    validators.set(validator.name, validator.schema);
  }
  return validators;
})();

function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: message };
  return { content: [content], isError: true };
}

function formatData(data: unknown): CallToolResult {
  const content: TextContent = { type: 'text', text: JSON.stringify(data) };
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
    const message = value.message;
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
  const validator = validatorMap.get(name);
  if (!validator) {
    return { ok: false, message: `Unknown tool: ${name}` };
  }
  const safeResult = validator.safeParse(args);
  if (safeResult.success) {
    return { ok: true, value: safeResult.data };
  }
  return {
    ok: false,
    message: safeResult.error.errors.map((issue) => issue.message).join('; '),
  };
}

export function listUniversalTools(): readonly UniversalToolListEntry[] {
  const openAiTools: UniversalToolListEntry[] = typeSafeEntries(OPENAI_CONNECTOR_TOOL_DEFS).map(
    ([name, def]) => ({
      name,
      description: def.description,
      inputSchema: cloneInputSchema(def.inputSchema),
    }),
  );

  const curriculumTools: UniversalToolListEntry[] = typeSafeEntries(MCP_TOOLS).map(
    ([name, def]) => ({
      name,
      description: def.description,
      inputSchema: cloneInputSchema(def.inputSchema),
    }),
  );

  return [...openAiTools, ...curriculumTools];
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
    const data = await deps.executeOpenAiTool(name, value);
    return formatData(data);
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
    if (!('error' in execution)) {
      return formatData(execution.data);
    }

    const errorDetails = execution.error;
    if (!errorDetails) {
      return formatError('Tool execution failed');
    }
    const message = errorDetails.message;
    if (message.length === 0) {
      return formatError('Tool execution failed');
    }
    return formatError(message);
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

    const parsedArgs = args === undefined ? {} : args;
    const validation = validateArgs(name, parsedArgs);
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
