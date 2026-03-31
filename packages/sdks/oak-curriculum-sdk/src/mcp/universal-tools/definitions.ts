/**
 * Aggregated tool definitions with MCP metadata.
 *
 * This module defines the constant map of aggregated tools - hand-written
 * tools that combine multiple API calls into a single operation.
 *
 * @remarks Aggregated tools are separate from generated tools (which come
 * from the OpenAPI spec). They're currently defined at runtime but will
 * eventually move to sdk-codegen time.
 *
 * Each aggregated tool imports its definition from its own module to
 * maintain separation of concerns and keep this file focused on the
 * combined definition map.
 */

import { FETCH_TOOL_DEF, FETCH_INPUT_SCHEMA } from '../aggregated-fetch.js';
import { GET_CURRICULUM_MODEL_TOOL_DEF } from '../aggregated-curriculum-model/index.js';
import { GET_THREAD_PROGRESSIONS_TOOL_DEF } from '../aggregated-thread-progressions.js';
import { GET_PREREQUISITE_GRAPH_TOOL_DEF } from '../aggregated-prerequisite-graph.js';
import { SEARCH_TOOL_DEF, SEARCH_INPUT_SCHEMA } from '../aggregated-search/index.js';
import { BROWSE_TOOL_DEF, BROWSE_INPUT_SCHEMA } from '../aggregated-browse/index.js';
import { EXPLORE_TOOL_DEF, EXPLORE_INPUT_SCHEMA } from '../aggregated-explore/index.js';
import {
  DOWNLOAD_ASSET_TOOL_DEF,
  DOWNLOAD_ASSET_INPUT_SCHEMA,
} from '../aggregated-asset-download/index.js';
import {
  USER_SEARCH_TOOL_DEF,
  USER_SEARCH_INPUT_SCHEMA,
  USER_SEARCH_QUERY_TOOL_DEF,
  USER_SEARCH_QUERY_INPUT_SCHEMA,
} from '../aggregated-user-search/index.js';
import type { SecurityScheme } from '@oaknational/sdk-codegen/mcp-tools';
import type { GenericToolInputJsonSchema } from '../zod-input-schema.js';

/**
 * Map of aggregated tool definitions with full MCP metadata.
 *
 * These tools combine multiple API calls into a single operation:
 * - `get-curriculum-model`: Combined orientation (domain model + tool guidance)
 * - `search`: Full-text search across curriculum content
 * - `fetch`: Retrieve detailed content by prefixed ID
 * - `get-thread-progressions`: Return ordered unit sequences within threads
 * - `get-prerequisite-graph`: Return unit dependencies and prior knowledge
 * - `browse-curriculum`: Browse subjects, key stages, units
 * - `explore-topic`: Explore a topic across lessons, units, and threads
 *
 * Annotations match generated tools: read-only, non-destructive, idempotent.
 *
 * **`_meta` contract (ADR-141)**:
 * - Widget tools (`search`, `get-curriculum-model`) declare
 *   `_meta: { ui: { resourceUri: WIDGET_URI } }`.
 * - All other aggregated tools declare `_meta: undefined` (no widget UI).
 * - Aggregated tools do not include `_meta.securitySchemes` — that mirror
 *   is emitted only by the generator for generated tools. Aggregated tools
 *   expose `securitySchemes` at the top level of their definition.
 * - The allowlist is defined in `WIDGET_TOOL_NAMES` (cross-domain-constants.ts).
 */
export const AGGREGATED_TOOL_DEFS = {
  search: { ...SEARCH_TOOL_DEF, inputSchema: SEARCH_INPUT_SCHEMA },
  fetch: { ...FETCH_TOOL_DEF, inputSchema: FETCH_INPUT_SCHEMA },
  'get-curriculum-model': GET_CURRICULUM_MODEL_TOOL_DEF,
  'get-thread-progressions': GET_THREAD_PROGRESSIONS_TOOL_DEF,
  'get-prerequisite-graph': GET_PREREQUISITE_GRAPH_TOOL_DEF,
  'browse-curriculum': { ...BROWSE_TOOL_DEF, inputSchema: BROWSE_INPUT_SCHEMA },
  'explore-topic': { ...EXPLORE_TOOL_DEF, inputSchema: EXPLORE_INPUT_SCHEMA },
  'download-asset': { ...DOWNLOAD_ASSET_TOOL_DEF, inputSchema: DOWNLOAD_ASSET_INPUT_SCHEMA },
  'user-search': { ...USER_SEARCH_TOOL_DEF, inputSchema: USER_SEARCH_INPUT_SCHEMA },
  'user-search-query': {
    ...USER_SEARCH_QUERY_TOOL_DEF,
    inputSchema: USER_SEARCH_QUERY_INPUT_SCHEMA,
  },
} as const;

/**
 * Structural shape that all aggregated tool definitions must conform to.
 *
 * This compile-time guard catches drift between hand-authored and generated
 * tool shapes. Every entry in AGGREGATED_TOOL_DEFS must have description,
 * securitySchemes, annotations, and inputSchema at minimum.
 */
interface AggregatedToolDefShape {
  readonly description: string;
  readonly securitySchemes: readonly SecurityScheme[];
  readonly annotations: {
    readonly readOnlyHint: boolean;
    readonly destructiveHint: boolean;
    readonly idempotentHint: boolean;
    readonly openWorldHint: boolean;
    readonly title: string;
  };
  readonly inputSchema: GenericToolInputJsonSchema;
}

/**
 * Compile-time structural constraint: every aggregated tool entry conforms
 * to the expected shape. This catches missing fields at build time.
 */
const structuralCheck: Record<string, AggregatedToolDefShape> = AGGREGATED_TOOL_DEFS;
void structuralCheck;
