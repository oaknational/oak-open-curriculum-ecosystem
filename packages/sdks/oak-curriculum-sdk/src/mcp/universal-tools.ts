import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
  toolNames,
  isToolName,
  type ToolName,
  type ToolDescriptorForName,
  getToolFromToolName,
} from '../types/generated/api-schema/mcp-tools/index.js';
import type { SecurityScheme } from '../types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import type { ToolExecutionResult } from './execute-tool-call.js';
import {
  formatData,
  formatError,
  formatUnknownTool,
  extractExecutionData,
  toErrorMessage,
  type UniversalToolExecutorDependencies,
} from './universal-tool-shared.js';
import {
  SEARCH_TOOL_DEF,
  SEARCH_INPUT_SCHEMA,
  validateSearchArgs,
  runSearchTool,
} from './aggregated-search/index.js';
import {
  FETCH_TOOL_DEF,
  FETCH_INPUT_SCHEMA,
  validateFetchArgs,
  runFetchTool,
} from './aggregated-fetch.js';
import { GET_ONTOLOGY_TOOL_DEF, runOntologyTool } from './aggregated-ontology.js';

/**
 * Type guard for ZodObject.
 *
 * Uses instanceof check to safely determine if a Zod schema is a ZodObject,
 * which has a `.shape` property. This enables safe access to the shape for
 * MCP SDK registration.
 *
 * @param schema - Zod schema to check
 * @returns True if schema is a ZodObject with accessible shape
 */
function isZodObject(schema: z.ZodTypeAny): schema is z.ZodObject<z.ZodRawShape> {
  return schema instanceof z.ZodObject;
}

/**
 * Safely extract the shape from a Zod schema if it's a ZodObject.
 *
 * All generated toolMcpFlatInputSchema values are ZodObjects, so this will
 * always return the shape. Returns undefined for non-object schemas or
 * if the schema is undefined (e.g., in test mocks).
 *
 * @param schema - Generated flat Zod schema, may be undefined in tests
 * @returns The ZodRawShape if schema is a ZodObject, undefined otherwise
 */
function extractZodShape(schema: z.ZodTypeAny | undefined): z.ZodRawShape | undefined {
  if (schema && isZodObject(schema)) {
    return schema.shape;
  }
  return undefined;
}

/**
 * Aggregated tool definitions with MCP metadata.
 *
 * These tools combine multiple API calls into a single operation.
 * Annotations match generated tools: read-only, non-destructive, idempotent.
 * Tool definitions (description, annotations, _meta) are imported from
 * their respective modules to keep this file under 250 lines.
 */
export const AGGREGATED_TOOL_DEFS = {
  search: { ...SEARCH_TOOL_DEF, inputSchema: SEARCH_INPUT_SCHEMA },
  fetch: { ...FETCH_TOOL_DEF, inputSchema: FETCH_INPUT_SCHEMA },
  'get-ontology': GET_ONTOLOGY_TOOL_DEF,
} as const;

type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;
export type UniversalToolName = AggregatedToolName | ToolName;

type GeneratedToolInputSchema = ToolDescriptorForName<ToolName>['inputSchema'];
type AggregatedToolInputSchema = (typeof AGGREGATED_TOOL_DEFS)[AggregatedToolName]['inputSchema'];
export type UniversalToolInputSchema = GeneratedToolInputSchema | AggregatedToolInputSchema;

/** MCP tool annotations providing hints about tool behavior. */
export interface ToolAnnotations {
  readonly [x: string]: unknown;
  readonly readOnlyHint?: boolean;
  readonly destructiveHint?: boolean;
  readonly idempotentHint?: boolean;
  readonly openWorldHint?: boolean;
  readonly title?: string;
}

/**
 * OpenAI Apps SDK metadata for tool descriptors.
 *
 * These fields are used by ChatGPT to display status during tool invocation
 * and to render output using a widget.
 * See: https://developers.openai.com/apps-sdk/reference
 */
export interface ToolMeta {
  readonly [x: string]: unknown;
  /** URI of widget resource to render tool output (text/html+skybridge MIME type) */
  readonly 'openai/outputTemplate'?: string;
  /** Status text shown while tool is running (≤64 chars) */
  readonly 'openai/toolInvocation/invoking'?: string;
  /** Status text shown after tool completes (≤64 chars) */
  readonly 'openai/toolInvocation/invoked'?: string;
}

/**
 * Entry in the universal tools list for MCP registration.
 *
 * Contains both JSON Schema (for backwards compatibility) and Zod schema
 * (for MCP SDK registration with proper parameter descriptions).
 */
export interface UniversalToolListEntry {
  readonly name: UniversalToolName;
  readonly description?: string;
  /** JSON Schema for tool inputs (kept for backwards compatibility) */
  readonly inputSchema: UniversalToolInputSchema;
  /**
   * Zod raw shape for MCP SDK registerTool().
   *
   * Generated Zod schemas include .describe() calls that preserve
   * parameter descriptions through the SDK's zodToJsonSchema conversion.
   * Undefined for aggregated tools (which use JSON Schema only).
   *
   * @remarks Use this instead of converting inputSchema to avoid information loss.
   */
  readonly flatZodSchema?: z.ZodRawShape;
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly annotations?: ToolAnnotations;
  /** OpenAI Apps SDK metadata for invocation status */
  readonly _meta?: ToolMeta;
}
export function isAggregatedToolName(value: unknown): value is AggregatedToolName {
  return value === 'search' || value === 'fetch' || value === 'get-ontology';
}

function mapExecutionResult(result: ToolExecutionResult): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatData({ status: outcome.status, data: outcome.data });
}

/**
 * Lists all available MCP tools with their metadata.
 *
 * Returns both aggregated tools (search, fetch) and generated tools
 * from the OpenAPI schema, all with proper MCP annotations.
 *
 * Generated tools include `flatZodSchema` which contains .describe() calls
 * that preserve parameter descriptions through the MCP SDK's zodToJsonSchema
 * conversion. Aggregated tools don't have this (they use JSON Schema directly).
 *
 * @returns Array of tool entries with name, description, schema, security, and annotations
 */
export function listUniversalTools(): UniversalToolListEntry[] {
  const aggregatedEntries: UniversalToolListEntry[] = typeSafeKeys(AGGREGATED_TOOL_DEFS).map(
    (name) => {
      const def = AGGREGATED_TOOL_DEFS[name];
      return {
        name,
        description: def.description,
        inputSchema: def.inputSchema,
        // Aggregated tools don't have generated Zod, so flatZodSchema is undefined
        securitySchemes: def.securitySchemes,
        annotations: def.annotations,
        // Include _meta if present (for OpenAI Apps SDK invocation status)
        _meta: '_meta' in def ? def._meta : undefined,
      };
    },
  );

  const generatedEntries: UniversalToolListEntry[] = toolNames.map((name) => {
    const descriptor = getToolFromToolName(name);
    return {
      name,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      // Use generated Zod schema which includes .describe() for parameter descriptions
      flatZodSchema: extractZodShape(descriptor.toolMcpFlatInputSchema),
      securitySchemes: descriptor.securitySchemes,
      annotations: descriptor.annotations,
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}

export function isUniversalToolName(value: unknown): value is UniversalToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return isAggregatedToolName(value) || isToolName(value);
}

export function createUniversalToolExecutor(
  deps: UniversalToolExecutorDependencies,
): (name: UniversalToolName, args: unknown) => Promise<CallToolResult> {
  return async (name: UniversalToolName, args: unknown): Promise<CallToolResult> => {
    if (!isUniversalToolName(name)) {
      return formatUnknownTool(name);
    }

    const input = args === undefined ? {} : args;

    if (isAggregatedToolName(name)) {
      if (name === 'search') {
        const validation = validateSearchArgs(input);
        if (!validation.ok) {
          return formatError(validation.message);
        }
        return runSearchTool(validation.value, deps);
      }
      if (name === 'get-ontology') {
        return runOntologyTool();
      }
      const validation = validateFetchArgs(input);
      if (!validation.ok) {
        return formatError(validation.message);
      }
      return runFetchTool(validation.value, deps);
    }

    const result = await deps.executeMcpTool(name, input);
    return mapExecutionResult(result);
  };
}

export { type UniversalToolExecutorDependencies } from './universal-tool-shared.js';
