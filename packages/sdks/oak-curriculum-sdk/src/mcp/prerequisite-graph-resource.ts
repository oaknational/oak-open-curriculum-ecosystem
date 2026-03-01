/**
 * Prerequisite graph resource for MCP server.
 *
 * Provides the complete prerequisite graph (unit dependencies and
 * prior knowledge requirements) as an MCP resource, enabling
 * application-controlled context injection for clients that support
 * pre-fetching resources.
 *
 * This resource complements the `get-prerequisite-graph` tool which provides
 * the same data via a model-controlled interface. The dual exposure pattern:
 * - Tools (get-prerequisite-graph): For agents that request on-demand
 * - Resources (curriculum://prerequisite-graph): For clients that pre-inject context
 *
 * Priority 0.5 indicates supplementary reference data — valuable for deep
 * reasoning about learning paths and prerequisites, but not required for
 * basic agent orientation (which is served by curriculum://model at 1.0).
 *
 * @see ./aggregated-prerequisite-graph.ts for the tool definition
 * @see ADR-058 for the context grounding strategy
 * @see ADR-086 for the extraction methodology
 */

import { prerequisiteGraph } from '@oaknational/sdk-codegen/vocab';

/**
 * Prerequisite graph resource definition for MCP registration.
 *
 * @example
 * ```typescript
 * const { name, uri, ...metadata } = PREREQUISITE_GRAPH_RESOURCE;
 * server.registerResource(name, uri, metadata, handler);
 * ```
 */
export const PREREQUISITE_GRAPH_RESOURCE = {
  name: 'prerequisite-graph',
  uri: 'curriculum://prerequisite-graph',
  title: 'Oak Curriculum Prerequisite Graph',
  description:
    'Unit dependency graph showing prior knowledge requirements and prerequisiteFor edges derived from thread ordering. Use for learning path planning and "what comes before" queries.',
  mimeType: 'application/json' as const,
  annotations: {
    priority: 0.5,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
};

/**
 * Generates the prerequisite graph as a JSON string for resource responses.
 *
 * Returns the complete prerequisite graph data (nodes, edges, stats) as a
 * formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the prerequisite graph
 */
export function getPrerequisiteGraphJson(): string {
  return JSON.stringify(prerequisiteGraph, null, 2);
}
