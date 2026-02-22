/**
 * Aggregated tool definitions with MCP metadata.
 *
 * This module defines the constant map of aggregated tools - hand-written
 * tools that combine multiple API calls into a single operation.
 *
 * @remarks Aggregated tools are separate from generated tools (which come
 * from the OpenAPI spec). They're currently defined at runtime but will
 * eventually move to type-gen time.
 *
 * Each aggregated tool imports its definition from its own module to
 * maintain separation of concerns and keep this file focused on the
 * combined definition map.
 */

import { FETCH_TOOL_DEF, FETCH_INPUT_SCHEMA } from '../aggregated-fetch.js';
import { GET_ONTOLOGY_TOOL_DEF } from '../aggregated-ontology.js';
import { GET_HELP_TOOL_DEF } from '../aggregated-help/index.js';
import { GET_THREAD_PROGRESSIONS_TOOL_DEF } from '../aggregated-thread-progressions.js';
import { GET_PREREQUISITE_GRAPH_TOOL_DEF } from '../aggregated-prerequisite-graph.js';
import { SEARCH_SDK_TOOL_DEF, SEARCH_SDK_INPUT_SCHEMA } from '../aggregated-search-sdk/index.js';
import { BROWSE_TOOL_DEF, BROWSE_INPUT_SCHEMA } from '../aggregated-browse/index.js';
import { EXPLORE_TOOL_DEF, EXPLORE_INPUT_SCHEMA } from '../aggregated-explore/index.js';

/**
 * Map of aggregated tool definitions with full MCP metadata.
 *
 * These tools combine multiple API calls into a single operation:
 * - `search`: Full-text search across curriculum content
 * - `fetch`: Retrieve detailed content by prefixed ID
 * - `get-ontology`: Return curriculum domain model structure
 * - `get-help`: Return tool usage guidance
 * - `get-thread-progressions`: Return ordered unit sequences within threads
 * - `get-prerequisite-graph`: Return unit dependencies and prior knowledge
 *
 * Annotations match generated tools: read-only, non-destructive, idempotent.
 * OpenAI Apps SDK _meta fields are included where defined.
 */
export const AGGREGATED_TOOL_DEFS = {
  search: { ...SEARCH_SDK_TOOL_DEF, inputSchema: SEARCH_SDK_INPUT_SCHEMA },
  fetch: { ...FETCH_TOOL_DEF, inputSchema: FETCH_INPUT_SCHEMA },
  'get-ontology': GET_ONTOLOGY_TOOL_DEF,
  'get-help': GET_HELP_TOOL_DEF,
  'get-thread-progressions': GET_THREAD_PROGRESSIONS_TOOL_DEF,
  'get-prerequisite-graph': GET_PREREQUISITE_GRAPH_TOOL_DEF,
  'browse-curriculum': { ...BROWSE_TOOL_DEF, inputSchema: BROWSE_INPUT_SCHEMA },
  'explore-topic': { ...EXPLORE_TOOL_DEF, inputSchema: EXPLORE_INPUT_SCHEMA },
} as const;
