import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
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
import { SEARCH_INPUT_SCHEMA, validateSearchArgs, runSearchTool } from './aggregated-search.js';
import { FETCH_INPUT_SCHEMA, validateFetchArgs, runFetchTool } from './aggregated-fetch.js';

/**
 * TODO: Remove manual security metadata when Phase 0 (comprehensive-mcp-enhancement-plan.md)
 * moves aggregated tools to generated code. Security should flow from OpenAPI schema.
 */
const AGGREGATED_TOOL_DEFS = {
  search: {
    description:
      'Search across lessons and transcripts. Executes get-search-lessons and get-search-transcripts.',
    inputSchema: SEARCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  },
  fetch: {
    description:
      'Fetch lesson, unit, subject, sequence, or thread metadata by canonical identifier.',
    inputSchema: FETCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  },
} as const;

type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;
export type UniversalToolName = AggregatedToolName | ToolName;

type GeneratedToolInputSchema = ToolDescriptorForName<ToolName>['inputSchema'];
type AggregatedToolInputSchema = (typeof AGGREGATED_TOOL_DEFS)[AggregatedToolName]['inputSchema'];
export type UniversalToolInputSchema = GeneratedToolInputSchema | AggregatedToolInputSchema;

export interface UniversalToolListEntry {
  readonly name: UniversalToolName;
  readonly description?: string;
  readonly inputSchema: UniversalToolInputSchema;
  readonly securitySchemes?: readonly SecurityScheme[];
}
function isAggregatedToolName(value: unknown): value is AggregatedToolName {
  return value === 'search' || value === 'fetch';
}

function mapExecutionResult(result: ToolExecutionResult): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatData({ status: outcome.status, data: outcome.data });
}

export function listUniversalTools(): UniversalToolListEntry[] {
  const aggregatedEntries: UniversalToolListEntry[] = typeSafeKeys(AGGREGATED_TOOL_DEFS).map(
    (name) => ({
      name,
      description: AGGREGATED_TOOL_DEFS[name].description,
      inputSchema: AGGREGATED_TOOL_DEFS[name].inputSchema,
      securitySchemes: AGGREGATED_TOOL_DEFS[name].securitySchemes,
    }),
  );

  const generatedEntries: UniversalToolListEntry[] = toolNames.map((name) => {
    const descriptor = getToolFromToolName(name);
    return {
      name,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      securitySchemes: descriptor.securitySchemes,
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
