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
  ToolDescriptor,
  SecurityScheme,
} from '@oaknational/sdk-codegen/mcp-tools';
import type { AGGREGATED_TOOL_DEFS } from './definitions.js';

/**
 * Subset of ToolDescriptor fields that the universal-tools layer accesses.
 *
 * Narrowed from the full `ToolDescriptorForName<TName>` via Interface
 * Segregation: consumers only need listing metadata and domain-context
 * hints, not invoke functions or Zod schemas.
 */
export interface ToolRegistryDescriptor {
  readonly description?: string;
  readonly inputSchema: GeneratedToolInputSchema;
  readonly toolMcpFlatInputSchema?: z.ZodType;
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly annotations?: ToolAnnotations;
  readonly _meta?: ToolMeta;
  readonly requiresDomainContext?: boolean;
}

/**
 * Dependency interface for generated tool functions from the generation SDK.
 *
 * Abstracts the generation SDK's runtime exports behind an interface,
 * enabling dependency injection in both product code and tests.
 * The default implementation wires the real generation SDK functions;
 * tests inject lightweight fakes.
 */
export interface GeneratedToolRegistry {
  readonly toolNames: readonly ToolName[];
  readonly getToolFromToolName: (name: ToolName) => ToolRegistryDescriptor;
  readonly isToolName: (value: unknown) => value is ToolName;
}

/**
 * Aggregated tool names derived from the aggregated tool definitions.
 *
 * These are hand-written tools that combine multiple API calls into
 * a single operation. Currently defined at runtime but will eventually
 * move to sdk-codegen time.
 */
export type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;

/**
 * Union of all tool names combining aggregated and generated tools.
 *
 * - Aggregated tools: search, fetch, get-ontology, get-help (hand-written)
 * - Generated tools: All tools from OpenAPI spec (from code-generation)
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
 * Contract-level ToolDescriptor with non-parametric properties.
 *
 * `annotations` and `_meta` on ToolDescriptor don't depend on any type
 * parameter — they define the structural shape that ALL tools (generated
 * and aggregated) conform to. We extract from the contract, not from
 * concrete instances, so we get `title?: string` rather than a union
 * of specific literal titles.
 */
type ContractDescriptor = ToolDescriptor<string, never, never, never, never, string>;

/**
 * MCP tool annotations — derived from the generated ToolDescriptor contract.
 *
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/#annotations-object
 */
export type ToolAnnotations = NonNullable<ContractDescriptor['annotations']>;

/**
 * OpenAI Apps SDK metadata — derived from the generated ToolDescriptor contract.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */
export type ToolMeta = NonNullable<ContractDescriptor['_meta']>;

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
