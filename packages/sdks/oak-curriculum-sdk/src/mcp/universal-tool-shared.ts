import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { typeSafeEntries, typeSafeFromEntries } from '../types/helpers/type-helpers.js';
import type { ToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import type { ToolExecutionResult } from './execute-tool-call.js';
import { McpParameterError, McpToolError } from './execute-tool-call.js';
import { OAK_CONTEXT_HINT } from './prerequisite-guidance.js';

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- JC: Sometimes we really do need to deal with unknown records at incoming system boundaries
type UnknownRecord = Record<string, unknown>;

/**
 * Type guard to check if a value is a non-null object (UnknownRecord).
 *
 * @param value - The value to check
 * @returns True if the value is a non-null, non-array object with at least one key-value pair where the key is a string and the value is not undefined
 */
function isUnknownRecord(value: unknown): value is UnknownRecord {
  const isProbablyObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  if (!isProbablyObject) {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- JC: genuine unknown record at incoming system boundary
  const hasKeys = Object.keys(value).length > 0;
  // eslint-disable-next-line no-restricted-properties -- JC: genuine unknown record at incoming system boundary
  const hasValues = Object.values(value).length > 0;
  // eslint-disable-next-line no-restricted-properties -- JC: genuine unknown record at incoming system boundary
  const firstKey = Object.keys(value)[0];
  const hasStringKey = typeof firstKey === 'string' && firstKey !== '';
  return hasKeys && hasValues && hasStringKey;
}

/**
 * Type for structuredContent field, derived from the MCP SDK's CallToolResult.
 * This is the format expected by OpenAI Apps SDK for `window.openai.toolOutput`.
 */
type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

/**
 * Type guard to check if a value is a valid structured content object.
 * StructuredContent must be a non-null, non-array object with string keys.
 */

function isStructuredContent(value: unknown): value is StructuredContent {
  // StructuredContent must be a non-null, non-array object with string keys.
  return isUnknownRecord(value);
}

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
    return typeSafeFromEntries<string, unknown>(normalisedEntries);
  }
  return value;
}

export function formatData(data: unknown): CallToolResult {
  const normalised = serialiseArg(data);
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  // structuredContent is required for OpenAI Apps SDK widgets to receive data
  // via window.openai.toolOutput. Without it, the widget only sees {}.
  const structuredContent: StructuredContent = isStructuredContent(normalised)
    ? normalised
    : { data: normalised };
  return { content: [content], structuredContent };
}

/**
 * Formats data for generated tools, optionally including context hint.
 *
 * @param options - Options including status, data, and includeContextHint flag
 * @returns CallToolResult with optional context hint in structuredContent
 */
export function formatDataWithContext(options: {
  readonly status: number | string;
  readonly data: unknown;
  readonly includeContextHint: boolean;
}): CallToolResult {
  const { status, data, includeContextHint } = options;
  const normalised = serialiseArg({ status, data });
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  const baseContent = isStructuredContent(normalised) ? normalised : { data: normalised };
  const structuredContent: StructuredContent = includeContextHint
    ? { ...baseContent, oakContextHint: OAK_CONTEXT_HINT }
    : baseContent;
  return { content: [content], structuredContent };
}

/**
 * Input options for formatOptimizedResult.
 *
 * Per OpenAI Apps SDK reference:
 * - Full data goes to structuredContent (model + widget see this)
 * - Summary goes to content (human-readable for conversation)
 * - Widget metadata goes to _meta (widget-only)
 */
export interface OptimizedResultOptions {
  /** Human-readable summary for content (conversation display) */
  readonly summary: string;
  /** Full data for structuredContent (model reasoning + widget display) */
  readonly fullData: unknown;
  /** Optional query string for widget context */
  readonly query?: string;
  /** Optional timestamp for widget context */
  readonly timestamp?: number;
  /** Optional status indicator */
  readonly status?: string;
  /** Tool name for widget routing (e.g., 'get-search-lessons') */
  readonly toolName?: string;
  /** Human-readable tool title from annotations (e.g., 'Search Lessons') */
  readonly annotationsTitle?: string;
}

/**
 * Formats MCP CallToolResult per OpenAI Apps SDK reference.
 *
 * Per OpenAI docs (https://developers.openai.com/apps-sdk/reference#tool-results):
 * - `structuredContent`: Model AND widget see this - contains FULL data for reasoning
 * - `content`: Model AND widget see this - human-readable summary for conversation
 * - `_meta`: Widget ONLY sees this - additional computed data like lookups
 *
 * @see https://developers.openai.com/apps-sdk/reference#tool-results
 */

/** Builds _meta object for widget-only data. Model never sees _meta. */
function buildMeta(options: OptimizedResultOptions): UnknownRecord {
  const { toolName, annotationsTitle, query, timestamp } = options;
  const meta: UnknownRecord = {};
  if (toolName !== undefined) {
    meta.toolName = toolName;
  }
  if (annotationsTitle !== undefined) {
    meta['annotations/title'] = annotationsTitle;
  }
  if (query !== undefined) {
    meta.query = query;
  }
  if (timestamp !== undefined) {
    meta.timestamp = timestamp;
  }
  return meta;
}

/**
 * Builds structuredContent with FULL data for model reasoning.
 *
 * Per OpenAI Apps SDK: structuredContent is "Surfaced to the model and the component".
 * This is where the model gets the data it needs to reason over.
 */
function buildStructuredContent(
  options: OptimizedResultOptions,
  serialisedFullData: unknown,
): UnknownRecord {
  const { summary, status } = options;
  // Full data goes here - model needs this for reasoning
  const base = isUnknownRecord(serialisedFullData)
    ? serialisedFullData
    : { data: serialisedFullData };
  const structuredContent: UnknownRecord = {
    ...base,
    summary,
    oakContextHint: OAK_CONTEXT_HINT,
  };
  if (status !== undefined) {
    structuredContent.status = status;
  }
  return structuredContent;
}

export function formatOptimizedResult(options: OptimizedResultOptions): CallToolResult {
  const serialisedFullData = serialiseArg(options.fullData);
  const meta = buildMeta(options);
  const structuredContent = buildStructuredContent(options, serialisedFullData);
  // Human-readable summary for conversation display
  const content: TextContent = { type: 'text', text: options.summary };
  return { content: [content], structuredContent, _meta: meta };
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
):
  | { readonly ok: true; readonly status: number | string; readonly data: unknown }
  | { readonly ok: false; readonly error: unknown } {
  if ('error' in result && result.error) {
    return { ok: false, error: result.error };
  }
  return { ok: true, status: result.status, data: result.data };
}
