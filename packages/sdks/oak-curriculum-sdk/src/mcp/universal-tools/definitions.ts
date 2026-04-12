/**
 * Aggregated tool definitions with MCP metadata.
 *
 * This module defines the constant map of aggregated tools — hand-written
 * tools that combine multiple API calls into a single operation.
 *
 * Each tool provides `inputSchema` (Zod raw shape with `.describe()` and
 * `.meta({ examples })`) as the canonical input schema for MCP registration.
 * No-input tools expose `inputSchema: {}`.
 *
 * Each aggregated tool imports its definition from its own module to
 * maintain separation of concerns and keep this file focused on the
 * combined definition map.
 */

import type { z } from 'zod';
import { FETCH_TOOL_DEF, FETCH_INPUT_SCHEMA } from '../aggregated-fetch/index.js';
import {
  GET_CURRICULUM_MODEL_TOOL_DEF,
  GET_CURRICULUM_MODEL_INPUT_SCHEMA,
} from '../aggregated-curriculum-model/index.js';
import {
  GET_THREAD_PROGRESSIONS_TOOL_DEF,
  GET_THREAD_PROGRESSIONS_INPUT_SCHEMA,
} from '../aggregated-thread-progressions.js';
import {
  GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF,
  GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
} from '../aggregated-prior-knowledge-graph.js';
import {
  GET_MISCONCEPTION_GRAPH_TOOL_DEF,
  GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA,
} from '../aggregated-misconception-graph.js';
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
import type { SecurityScheme, ToolMeta } from '@oaknational/sdk-codegen/mcp-tools';
import type { AggregatedToolName } from './types.js';

/**
 * Structural shape that all aggregated tool definitions must conform to.
 *
 * This compile-time guard catches drift between hand-authored and generated
 * tool shapes. Every entry in AGGREGATED_TOOL_DEFS must have title,
 * description, securitySchemes, annotations, inputSchema, and _meta.
 * No-input tools still provide `inputSchema: {}` so registration stays uniform.
 */
interface AggregatedToolDefShape {
  readonly title: string;
  readonly description: string;
  readonly securitySchemes: readonly SecurityScheme[];
  readonly annotations: {
    readonly readOnlyHint: boolean;
    readonly destructiveHint: boolean;
    readonly idempotentHint: boolean;
    readonly openWorldHint: boolean;
  };
  readonly inputSchema: z.ZodRawShape;
  readonly _meta: ToolMeta;
}

/**
 * Map of aggregated tool definitions with full MCP metadata.
 *
 * These tools combine multiple API calls into a single operation:
 * - `get-curriculum-model`: Combined orientation (domain model + tool guidance)
 * - `search`: Full-text search across curriculum content
 * - `fetch`: Retrieve detailed content by prefixed ID
 * - `get-thread-progressions`: Return ordered unit sequences within threads
 * - `get-prior-knowledge-graph`: Return unit dependencies and prior knowledge
 * - `browse-curriculum`: Browse subjects, key stages, units
 * - `explore-topic`: Explore a topic across lessons, units, and threads
 *
 * Annotations match generated tools: read-only, non-destructive, idempotent.
 *
 * **`_meta` contract (ADR-141)**:
 * - Widget tools (`search`, `get-curriculum-model`, `user-search`,
 *   `user-search-query`) declare `_meta: { ui: { resourceUri: WIDGET_URI }, securitySchemes }`.
 * - All other aggregated tools declare `_meta: { securitySchemes }` (no widget UI).
 * - All aggregated tools mirror `securitySchemes` into `_meta` for clients
 *   that only read `_meta`, matching the generated tools' pattern.
 * - The widget allowlist is defined in `WIDGET_TOOL_NAMES` (cross-domain-constants.ts).
 *
 * @example
 * ```typescript
 * const searchDefinition = AGGREGATED_TOOL_DEFS.search;
 *
 * console.log(searchDefinition.title);
 * console.log(Object.keys(searchDefinition.inputSchema));
 * ```
 */
export const AGGREGATED_TOOL_DEFS = {
  search: {
    ...SEARCH_TOOL_DEF,
    inputSchema: SEARCH_INPUT_SCHEMA,
  },
  fetch: {
    ...FETCH_TOOL_DEF,
    inputSchema: FETCH_INPUT_SCHEMA,
  },
  'get-curriculum-model': {
    ...GET_CURRICULUM_MODEL_TOOL_DEF,
    inputSchema: GET_CURRICULUM_MODEL_INPUT_SCHEMA,
  },
  'get-thread-progressions': {
    ...GET_THREAD_PROGRESSIONS_TOOL_DEF,
    inputSchema: GET_THREAD_PROGRESSIONS_INPUT_SCHEMA,
  },
  'get-prior-knowledge-graph': {
    ...GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF,
    inputSchema: GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
  },
  'get-misconception-graph': {
    ...GET_MISCONCEPTION_GRAPH_TOOL_DEF,
    inputSchema: GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA,
  },
  'browse-curriculum': {
    ...BROWSE_TOOL_DEF,
    inputSchema: BROWSE_INPUT_SCHEMA,
  },
  'explore-topic': {
    ...EXPLORE_TOOL_DEF,
    inputSchema: EXPLORE_INPUT_SCHEMA,
  },
  'download-asset': {
    ...DOWNLOAD_ASSET_TOOL_DEF,
    inputSchema: DOWNLOAD_ASSET_INPUT_SCHEMA,
  },
  'user-search': {
    ...USER_SEARCH_TOOL_DEF,
    inputSchema: USER_SEARCH_INPUT_SCHEMA,
  },
  'user-search-query': {
    ...USER_SEARCH_QUERY_TOOL_DEF,
    inputSchema: USER_SEARCH_QUERY_INPUT_SCHEMA,
  },
} as const satisfies Record<AggregatedToolName, AggregatedToolDefShape>;
