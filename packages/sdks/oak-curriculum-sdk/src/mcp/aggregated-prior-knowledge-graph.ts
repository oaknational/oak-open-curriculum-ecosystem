/**
 * Oak Curriculum Prior Knowledge Graph Tool
 *
 * Provides the prior knowledge graph showing unit dependencies
 * derived from prior knowledge requirements and thread ordering.
 * Enables "what comes before" queries and learning path planning.
 *
 * @remarks
 * The prior knowledge graph shows:
 * - Units with their prior knowledge requirements
 * - prerequisiteFor edges derived from thread ordering
 *
 * @see \@oaknational/sdk-codegen/vocab-data for the graph data export
 * @see aggregated-thread-progressions.ts for the companion thread graph
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { priorKnowledgeGraph } from '@oaknational/sdk-codegen/vocab-data';
import { createGraphToolDef, createGraphToolExecutor } from './graph-resource-factory.js';
import { PRIOR_KNOWLEDGE_GRAPH_CONFIG } from './prior-knowledge-graph-resource.js';

/**
 * Empty input schema for the get-prior-knowledge-graph tool (no parameters).
 *
 * Per MCP spec, no-input tools declare `{ "type": "object", "additionalProperties": false }`
 * on the wire. An empty `ZodRawShape` produces this through the SDK's `z.toJSONSchema()`.
 */
export const GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA: Record<string, never> = {};

/**
 * Tool definition for get-prior-knowledge-graph.
 *
 * @remarks
 * The description includes live stats interpolated from the generated graph data.
 * The graph is delivered in structuredContent because the MODEL needs to reason about it.
 * Do NOT hide the graph in _meta — that would defeat the purpose.
 */
export const GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF = createGraphToolDef({
  ...PRIOR_KNOWLEDGE_GRAPH_CONFIG,
  description: `Returns the Oak Curriculum prior knowledge graph.

This instance-level graph shows unit dependencies and prior knowledge requirements:
- ${String(priorKnowledgeGraph.stats.unitsWithPrerequisites)} units with prior knowledge requirements
- ${String(priorKnowledgeGraph.stats.totalEdges)} prerequisiteFor edges derived from thread ordering
- ${String(priorKnowledgeGraph.stats.subjectsCovered.length)} subjects covered

Each node contains:
- Unit metadata (slug, title, subject, key stage, year)
- Prior knowledge requirements (what students should know before)
- Thread memberships (which curriculum threads this unit belongs to)

Edges show prerequisiteFor relationships:
- Derived from thread ordering (earlier unit → later unit in same thread)

Use this to answer questions like:
- "What should students know before trigonometry?"
- "What's the learning path to algebra?"
- "Which units depend on fractions?"

Complements get-thread-progressions (learning paths) with prior knowledge detail.`,
});

const executePriorKnowledgeGraphTool = createGraphToolExecutor(PRIOR_KNOWLEDGE_GRAPH_CONFIG);

/**
 * Execute the get-prior-knowledge-graph tool.
 *
 * Returns the complete prior knowledge graph in structuredContent for model reasoning.
 * This is critical — the model needs to see and process the graph data.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runPriorKnowledgeGraphTool(): CallToolResult {
  return executePriorKnowledgeGraphTool();
}
