/**
 * Prior knowledge graph resource for MCP server.
 *
 * Provides the complete prior knowledge graph (unit dependencies and
 * prior knowledge requirements) as an MCP resource, enabling
 * application-controlled context injection for clients that support
 * pre-fetching resources.
 *
 * This resource complements the `get-prior-knowledge-graph` tool which provides
 * the same data via a model-controlled interface. The dual exposure pattern:
 * - Tools (get-prior-knowledge-graph): For agents that request on-demand
 * - Resources (curriculum://prior-knowledge-graph): For clients that pre-inject context
 *
 * Priority 0.5 indicates supplementary reference data — valuable for deep
 * reasoning about learning paths and prior knowledge, but not required for
 * basic agent orientation (which is served by curriculum://model at 1.0).
 *
 * @see ./aggregated-prior-knowledge-graph.ts for the tool definition
 * @see ADR-058 for the context grounding strategy
 * @see ADR-086 for the extraction methodology
 */

import type { PriorKnowledgeGraph } from '@oaknational/sdk-codegen/vocab';
import { priorKnowledgeGraph } from '@oaknational/sdk-codegen/vocab-data';
import type { GraphSurfaceConfig } from './graph-resource-factory.js';
import { createGraphResource, createGraphJsonGetter } from './graph-resource-factory.js';
import { OAK_API_ATTRIBUTION } from './source-attribution.js';

/**
 * Shared configuration for the prior knowledge graph MCP surface.
 *
 * Used by both the resource definition and the tool definition
 * (in aggregated-prior-knowledge-graph.ts) to ensure consistency.
 */
export const PRIOR_KNOWLEDGE_GRAPH_CONFIG: GraphSurfaceConfig<PriorKnowledgeGraph> = {
  name: 'prior-knowledge-graph',
  title: 'Oak Curriculum Prior Knowledge Graph',
  description:
    'Unit dependency graph showing prior knowledge requirements and prerequisiteFor edges derived from thread ordering. Use for learning path planning and "what comes before" queries.',
  uriSegment: 'prior-knowledge-graph',
  sourceData: priorKnowledgeGraph,
  summary: `Prior knowledge graph loaded. Contains ${String(priorKnowledgeGraph.stats.unitsWithPrerequisites)} units with prior knowledge requirements and ${String(priorKnowledgeGraph.stats.totalEdges)} edges.`,
  attribution: OAK_API_ATTRIBUTION,
};

/**
 * Prior knowledge graph resource definition for MCP registration.
 *
 * @example
 * ```typescript
 * const { name, uri, ...metadata } = PRIOR_KNOWLEDGE_GRAPH_RESOURCE;
 * server.registerResource(name, uri, metadata, handler);
 * ```
 */
export const PRIOR_KNOWLEDGE_GRAPH_RESOURCE = createGraphResource(PRIOR_KNOWLEDGE_GRAPH_CONFIG);

/**
 * Generates the prior knowledge graph as a JSON string for resource responses.
 *
 * Returns the complete prior knowledge graph data (nodes, edges, stats) as a
 * formatted JSON string for MCP resource/read.
 *
 * @returns JSON string representation of the prior knowledge graph
 */
export const getPriorKnowledgeGraphJson = createGraphJsonGetter(PRIOR_KNOWLEDGE_GRAPH_CONFIG);
