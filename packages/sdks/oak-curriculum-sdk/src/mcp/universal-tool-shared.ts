import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import {
  typeSafeEntries,
  typeSafeFromEntries,
  typeSafeKeys,
} from '../types/helpers/type-helpers.js';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import type { ToolExecutionResult } from './execute-tool-call.js';
import { McpParameterError, McpToolError } from './execute-tool-call.js';
import { OAK_CONTEXT_HINT } from './prerequisite-guidance.js';
import type { SearchRetrievalService } from './search-retrieval-types.js';
import type { GeneratedToolRegistry } from './universal-tools/types.js';

/**
 * Type for structuredContent field, derived from the MCP SDK's CallToolResult.
 * This is the format expected by OpenAI Apps SDK for `window.openai.toolOutput`.
 */
type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

/** Type for _meta field, derived from the MCP SDK's CallToolResult. Widget-only data. */
type WidgetMeta = NonNullable<CallToolResult['_meta']>;

/**
 * Type guard: checks if a value is a non-null, non-array object with at least
 * one string key — the minimal shape for StructuredContent.
 */
function isStructuredContent(value: unknown): value is StructuredContent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = typeSafeKeys(value);
  return keys.length > 0 && typeof keys[0] === 'string' && keys[0] !== '';
}

export interface UniversalToolExecutorDependencies {
  readonly executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;

  /**
   * Search retrieval service for SDK-backed search tools.
   *
   * Used by search, browse-curriculum, and explore-topic tools
   * to query Elasticsearch directly via the Search SDK. The type is
   * structurally compatible with Search SDK's RetrievalService.
   *
   * Provided by the MCP server wiring: real ES service in production,
   * stub service (`createStubSearchRetrieval`) in stub mode.
   */
  readonly searchRetrieval: SearchRetrievalService;

  /**
   * Generated tool registry for DI of generation SDK functions.
   *
   * Provides `getToolFromToolName`, `isToolName`, and `toolNames`
   * without hardcoding imports from the generation package. This
   * enables tests to inject lightweight fakes.
   */
  readonly generatedTools: GeneratedToolRegistry;

  /**
   * Factory for generating signed asset download URLs. HTTP-only.
   *
   * When provided, the `download-asset` tool is available and generates
   * short-lived, HMAC-signed URLs pointing to the download proxy route.
   * Omitted for stdio transport where no HTTP route exists.
   */
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
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
 * Input options for the unified formatToolResponse function.
 *
 * All tools — generated and aggregated — use this single interface.
 * Per MCP spec, the content array can contain multiple items:
 * - content[0]: human-readable summary for conversation display
 * - content[1]: JSON-serialised full data for backwards compatibility
 *
 * This ensures every MCP client (Cursor, OpenAI Apps SDK, etc.) sees
 * both the summary AND the full data regardless of how it reads responses.
 */
export interface ToolResponseOptions {
  /** Human-readable summary for content[0] (conversation display) */
  readonly summary: string;
  /** Full data — serialised to content[1] and spread into structuredContent */
  readonly data: unknown;
  /** Whether to include oakContextHint in structuredContent */
  readonly includeContextHint?: boolean;
  /** Optional query string for widget context */
  readonly query?: string;
  /** Optional timestamp for widget context */
  readonly timestamp?: number;
  /** Optional status indicator */
  readonly status?: string;
  /** Tool name for widget routing (e.g., 'search') */
  readonly toolName?: string;
  /** Human-readable tool title from annotations (e.g., 'Search Curriculum') */
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
function buildMeta(options: ToolResponseOptions): WidgetMeta {
  const { toolName, annotationsTitle, query, timestamp } = options;
  return {
    ...(toolName !== undefined ? { toolName } : {}),
    ...(annotationsTitle !== undefined ? { 'annotations/title': annotationsTitle } : {}),
    ...(query !== undefined ? { query } : {}),
    ...(timestamp !== undefined ? { timestamp } : {}),
  };
}

/**
 * Unified tool response formatter for all MCP tools.
 *
 * Produces a 2-item content array (summary + JSON data), structuredContent
 * for the OpenAI Apps SDK, and _meta for widget routing. This ensures
 * every MCP client sees both the human-readable summary AND the full data.
 *
 * Per MCP spec: "For backwards compatibility, a tool that returns structured
 * content SHOULD also return the serialized JSON in a TextContent block."
 *
 * @param options - Response formatting options
 * @returns CallToolResult with unified response shape
 */
export function formatToolResponse(options: ToolResponseOptions): CallToolResult {
  const serialisedData = serialiseArg(options.data);
  const meta = buildMeta(options);
  const base = isStructuredContent(serialisedData) ? serialisedData : { data: serialisedData };
  const structuredContent: StructuredContent = {
    ...base,
    summary: options.summary,
    ...(options.includeContextHint !== false ? { oakContextHint: OAK_CONTEXT_HINT } : {}),
    ...(options.status !== undefined ? { status: options.status } : {}),
  };
  const summaryContent: TextContent = { type: 'text', text: options.summary };
  const jsonContent: TextContent = { type: 'text', text: JSON.stringify(serialisedData) };
  return { content: [summaryContent, jsonContent], structuredContent, _meta: meta };
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
