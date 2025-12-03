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

import { SEARCH_TOOL_DEF, SEARCH_INPUT_SCHEMA } from '../aggregated-search/index.js';
import { FETCH_TOOL_DEF, FETCH_INPUT_SCHEMA } from '../aggregated-fetch.js';
import { GET_ONTOLOGY_TOOL_DEF } from '../aggregated-ontology.js';
import { GET_HELP_TOOL_DEF } from '../aggregated-help/index.js';
import { GET_KNOWLEDGE_GRAPH_TOOL_DEF } from '../aggregated-knowledge-graph.js';

/**
 * Map of aggregated tool definitions with full MCP metadata.
 *
 * These tools combine multiple API calls into a single operation:
 * - `search`: Full-text search across curriculum content
 * - `fetch`: Retrieve detailed content by prefixed ID
 * - `get-ontology`: Return curriculum domain model structure
 * - `get-help`: Return tool usage guidance
 *
 * Annotations match generated tools: read-only, non-destructive, idempotent.
 * OpenAI Apps SDK _meta fields are included where defined.
 */
export const AGGREGATED_TOOL_DEFS = {
  search: { ...SEARCH_TOOL_DEF, inputSchema: SEARCH_INPUT_SCHEMA },
  fetch: { ...FETCH_TOOL_DEF, inputSchema: FETCH_INPUT_SCHEMA },
  'get-ontology': GET_ONTOLOGY_TOOL_DEF,
  'get-help': GET_HELP_TOOL_DEF,
  'get-knowledge-graph': GET_KNOWLEDGE_GRAPH_TOOL_DEF,
} as const;
