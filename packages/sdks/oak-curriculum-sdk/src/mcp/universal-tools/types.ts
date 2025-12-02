/**
 * Type definitions for universal MCP tools.
 *
 * This module defines the core type interfaces for MCP tool metadata,
 * including annotations for behavior hints and OpenAI Apps SDK metadata
 * for invocation status display.
 *
 * @remarks These types are used throughout the universal tools system
 * to ensure consistent structure for tool listings and registration.
 */

import type { z } from 'zod';
import type {
  ToolName,
  ToolDescriptorForName,
} from '../../types/generated/api-schema/mcp-tools/index.js';
import type { SecurityScheme } from '../../types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';
import type { AGGREGATED_TOOL_DEFS } from './definitions.js';

/**
 * Aggregated tool names derived from the aggregated tool definitions.
 *
 * These are hand-written tools that combine multiple API calls into
 * a single operation. Currently defined at runtime but will eventually
 * move to type-gen time.
 */
export type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;

/**
 * Union of all tool names combining aggregated and generated tools.
 *
 * - Aggregated tools: search, fetch, get-ontology, get-help (hand-written)
 * - Generated tools: All tools from OpenAPI spec (from type-gen)
 */
export type UniversalToolName = AggregatedToolName | ToolName;

/**
 * Input schema type for generated tools (from OpenAPI spec).
 */
type GeneratedToolInputSchema = ToolDescriptorForName<ToolName>['inputSchema'];

/**
 * Input schema type for aggregated tools (hand-written JSON Schema).
 */
type AggregatedToolInputSchema = (typeof AGGREGATED_TOOL_DEFS)[AggregatedToolName]['inputSchema'];

/**
 * Union of all tool input schema types.
 */
export type UniversalToolInputSchema = GeneratedToolInputSchema | AggregatedToolInputSchema;

/**
 * MCP tool annotations providing hints about tool behavior.
 *
 * These annotations help MCP clients understand tool characteristics
 * for better UX decisions, such as whether a tool is safe to auto-invoke
 * or requires user confirmation.
 *
 * All annotation fields are explicitly enumerated per MCP specification.
 * No index signature - every field must be known at compile time.
 *
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/#annotations-object
 */
export interface ToolAnnotations {
  /** Whether the tool only reads data and doesn't modify state */
  readonly readOnlyHint?: boolean;
  /** Whether the tool might cause destructive/irreversible changes */
  readonly destructiveHint?: boolean;
  /** Whether repeated calls with same args produce same result */
  readonly idempotentHint?: boolean;
  /** Whether the tool interacts with external systems beyond the MCP server */
  readonly openWorldHint?: boolean;
  /** Human-readable title for the tool */
  readonly title?: string;
}

/**
 * OpenAI Apps SDK metadata for tool descriptors.
 *
 * These fields are used by ChatGPT to display status during tool invocation
 * and to render output using a custom widget.
 *
 * All known OpenAI _meta fields are explicitly enumerated per project rules.
 * No index signature - every field must be known at compile time.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */
export interface ToolMeta {
  /**
   * URI of widget resource to render tool output.
   * Widget must serve content with text/html+skybridge MIME type.
   */
  readonly 'openai/outputTemplate'?: string;
  /** Status text shown while tool is running (max 64 characters) */
  readonly 'openai/toolInvocation/invoking'?: string;
  /** Status text shown after tool completes (max 64 characters) */
  readonly 'openai/toolInvocation/invoked'?: string;
  /** Allow widget to call this tool via window.openai.callTool() */
  readonly 'openai/widgetAccessible'?: boolean;
  /** Tool visibility: 'public' (default) or 'private' (hidden from model) */
  readonly 'openai/visibility'?: 'public' | 'private';
  /** Mirror securitySchemes for clients that only read _meta */
  readonly securitySchemes?: readonly SecurityScheme[];
}

/**
 * Entry in the universal tools list for MCP registration.
 *
 * Contains all metadata needed to register a tool with an MCP server,
 * including both JSON Schema (for backwards compatibility) and Zod schema
 * (for MCP SDK registration with proper parameter descriptions).
 */
export interface UniversalToolListEntry {
  /** Tool name used for invocation */
  readonly name: UniversalToolName;
  /** Human-readable description of what the tool does */
  readonly description?: string;
  /**
   * JSON Schema for tool inputs.
   * Kept for backwards compatibility with older MCP implementations.
   */
  readonly inputSchema: UniversalToolInputSchema;
  /**
   * Zod raw shape for MCP SDK registerTool().
   *
   * Generated Zod schemas include .describe() calls that preserve
   * parameter descriptions through the SDK's zodToJsonSchema conversion.
   * Undefined for aggregated tools (which use JSON Schema only).
   *
   * @remarks Use this instead of converting inputSchema to avoid
   * losing parameter description information.
   */
  readonly flatZodSchema?: z.ZodRawShape;
  /** Security schemes required to invoke this tool */
  readonly securitySchemes?: readonly SecurityScheme[];
  /** MCP annotations providing behavior hints */
  readonly annotations?: ToolAnnotations;
  /** OpenAI Apps SDK metadata for invocation status display */
  readonly _meta?: ToolMeta;
}
