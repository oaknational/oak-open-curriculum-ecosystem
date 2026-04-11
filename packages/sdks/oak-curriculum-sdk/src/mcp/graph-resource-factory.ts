/**
 * Graph resource factory for MCP surfaces.
 *
 * Extracts the shared boilerplate from graph-as-MCP-resource+tool surfaces
 * into composable factory functions. Each function is independently usable:
 * a consumer that needs only a resource (e.g. a non-tool graph) can use
 * `createGraphResource` without `createGraphToolDef`.
 *
 * @remarks
 * This factory follows the ADR-154 "separate framework from consumer" pattern:
 * the factory is the reusable mechanism, each graph surface is the consumer.
 *
 * **Prerequisite distinction**: `get-curriculum-model` (priority 1.0) is the
 * ONLY tool that agents must always call first — it provides domain orientation.
 * All factory-produced graph surfaces (priority 0.5) are strictly optional,
 * loaded only when the conversation needs them. The factory does NOT inject
 * prerequisite guidance because graph tools are not prerequisites.
 *
 * The curriculum model (`curriculum://model`) is intentionally NOT produced
 * by this factory. It composes two data sources (ontology + tool guidance)
 * and serves as the priority 1.0 orientation resource — a fundamentally
 * different responsibility from the supplementary graph surfaces.
 *
 * @packageDocumentation
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { formatToolResponse } from './universal-tool-shared.js';
import { SCOPES_SUPPORTED } from './scopes-supported.js';

/**
 * Configuration for a graph MCP surface.
 *
 * The generic parameter `T` preserves the concrete source data type
 * through the factory. This is deliberate: `unknown` would destroy
 * type information that exists at the call site.
 *
 * @example
 * ```typescript
 * const config: GraphSurfaceConfig<PriorKnowledgeGraph> = \{
 *   name: 'prior-knowledge-graph',
 *   title: 'Oak Curriculum Prior Knowledge Graph',
 *   description: 'Unit dependency graph...',
 *   uriSegment: 'prior-knowledge-graph',
 *   sourceData: priorKnowledgeGraph,
 *   summary: `Graph loaded. $\{stats\}.`,
 * \};
 * ```
 */
export interface GraphSurfaceConfig<T extends { readonly version: string }> {
  /** Kebab-case identifier, e.g. 'prerequisite-graph'. */
  readonly name: string;
  /** Human-readable display name. */
  readonly title: string;
  /** Multi-line description for AI agents (may include interpolated stats). */
  readonly description: string;
  /** URI path segment, e.g. 'prerequisite-graph'. Scheme defaults to 'curriculum'. */
  readonly uriSegment: string;
  /** Resource priority: 0.5 (supplementary) or 1.0 (essential). Defaults to 0.5. */
  readonly priority?: 0.5 | 1.0;
  /** The data to serialise and return. Concrete type preserved via generic. */
  readonly sourceData: T;
  /** Summary line for tool response content[0]. */
  readonly summary: string;
}

/**
 * Creates an MCP resource constant from graph surface configuration.
 *
 * @returns Object suitable for destructuring into `server.registerResource(name, uri, metadata, handler)`.
 */
export function createGraphResource<T extends { readonly version: string }>(
  config: GraphSurfaceConfig<T>,
): {
  readonly name: string;
  readonly uri: string;
  readonly title: string;
  readonly description: string;
  readonly mimeType: 'application/json';
  readonly annotations: {
    readonly priority: 0.5 | 1.0;
    readonly audience: ('user' | 'assistant')[];
  };
} {
  return {
    name: config.name,
    uri: `curriculum://${config.uriSegment}`,
    title: config.title,
    description: config.description,
    mimeType: 'application/json',
    annotations: {
      priority: config.priority ?? 0.5,
      audience: ['assistant'] satisfies ('user' | 'assistant')[],
    },
  };
}

/**
 * Creates a JSON getter function that serialises the source data.
 *
 * @returns Function returning formatted JSON string of the graph data.
 */
export function createGraphJsonGetter<T extends { readonly version: string }>(
  config: GraphSurfaceConfig<T>,
): () => string {
  return () => JSON.stringify(config.sourceData, null, 2);
}

/**
 * Creates an MCP tool definition for a graph surface.
 *
 * Includes standard annotations (readOnly, idempotent) and security schemes
 * from SCOPES_SUPPORTED. Does NOT include prerequisite guidance — graph
 * tools are supplementary resources loaded as needed, not prerequisites.
 *
 * @returns Tool definition object for registration in AGGREGATED_TOOL_DEFS.
 */
export function createGraphToolDef<T extends { readonly version: string }>(
  config: GraphSurfaceConfig<T>,
): {
  readonly title: string;
  readonly description: string;
  readonly securitySchemes: readonly [
    { readonly type: 'oauth2'; readonly scopes: readonly string[] },
  ];
  readonly annotations: {
    readonly readOnlyHint: true;
    readonly destructiveHint: false;
    readonly idempotentHint: true;
    readonly openWorldHint: false;
  };
  readonly _meta: undefined;
} {
  return {
    title: config.title,
    description: config.description,

    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

    annotations: {
      readOnlyHint: true as const,
      destructiveHint: false as const,
      idempotentHint: true as const,
      openWorldHint: false as const,
    },

    _meta: undefined,
  };
}

/**
 * Creates a tool executor function for a graph surface.
 *
 * Returns a no-argument function that produces a `CallToolResult` via
 * `formatToolResponse`, matching the pattern in existing aggregated tools.
 *
 * @returns Function returning CallToolResult with graph data in structuredContent.
 */
export function createGraphToolExecutor<T extends { readonly version: string }>(
  config: GraphSurfaceConfig<T>,
): () => CallToolResult {
  return () =>
    formatToolResponse({
      summary: config.summary,
      data: config.sourceData,
      status: 'success',
      timestamp: Date.now(),
      toolName: `get-${config.name}`,
      annotationsTitle: config.title,
    });
}
