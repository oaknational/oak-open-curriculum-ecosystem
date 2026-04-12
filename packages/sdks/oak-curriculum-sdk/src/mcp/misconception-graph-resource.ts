/**
 * Misconception graph resource for MCP server.
 *
 * Provides the complete misconception graph (common student misconceptions
 * with teacher responses, by subject and key stage) as an MCP resource,
 * enabling application-controlled context injection for clients that
 * support pre-fetching resources.
 *
 * This resource complements the `get-misconception-graph` tool which provides
 * the same data via a model-controlled interface. The dual exposure pattern:
 * - Tools (get-misconception-graph): For agents that request on-demand
 * - Resources (curriculum://misconception-graph): For clients that pre-inject context
 *
 * Priority 0.5 indicates supplementary reference data — valuable for
 * identifying common student errors and planning remediation, but not
 * required for basic agent orientation.
 *
 * @see ./aggregated-misconception-graph.ts for the tool definition
 * @see ADR-086 for the extraction methodology
 * @see ADR-157 for the multi-source integration context
 */

import type { MisconceptionGraph } from '@oaknational/sdk-codegen/vocab';
import { misconceptionGraph } from '@oaknational/sdk-codegen/vocab-data';
import type { GraphSurfaceConfig } from './graph-resource-factory.js';
import { createGraphResource, createGraphJsonGetter } from './graph-resource-factory.js';
import { OAK_API_ATTRIBUTION } from './source-attribution.js';

/**
 * Shared configuration for the misconception graph MCP surface.
 *
 * Used by both the resource definition and the tool definition
 * (in aggregated-misconception-graph.ts) to ensure consistency.
 */
export const MISCONCEPTION_GRAPH_CONFIG: GraphSurfaceConfig<MisconceptionGraph> = {
  name: 'misconception-graph',
  title: 'Oak Curriculum Misconception Graph',
  description: 'Common misconceptions with teacher responses, by subject and key stage.',
  uriSegment: 'misconception-graph',
  sourceData: misconceptionGraph,
  summary: `Misconception graph loaded. Contains ${String(misconceptionGraph.stats.totalMisconceptions)} misconceptions across ${String(misconceptionGraph.stats.subjectsCovered.length)} subjects.`,
  attribution: OAK_API_ATTRIBUTION,
};

/**
 * Misconception graph resource definition for MCP registration.
 *
 * @example
 * ```typescript
 * const { name, uri, ...metadata } = MISCONCEPTION_GRAPH_RESOURCE;
 * server.registerResource(name, uri, metadata, handler);
 * ```
 */
export const MISCONCEPTION_GRAPH_RESOURCE = createGraphResource(MISCONCEPTION_GRAPH_CONFIG);

/**
 * Generates the misconception graph as a JSON string for resource responses.
 *
 * Returns the complete misconception graph data (nodes, stats) as a
 * formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the misconception graph
 */
export const getMisconceptionGraphJson = createGraphJsonGetter(MISCONCEPTION_GRAPH_CONFIG);
