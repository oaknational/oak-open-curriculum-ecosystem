/**
 * Oak Curriculum Prerequisite Graph Tool
 *
 * Provides the prerequisite graph showing unit dependencies
 * derived from prior knowledge requirements and thread ordering.
 * Enables "what comes before" queries and learning path planning.
 *
 * @remarks
 * The prerequisite graph shows:
 * - Units with their prior knowledge requirements
 * - prerequisiteFor edges derived from thread ordering
 *
 * @see prerequisite-graph-data.ts for the graph data structure
 * @see aggregated-thread-progressions.ts for the companion thread graph
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatToolResponse } from './universal-tool-shared.js';
import { prerequisiteGraph } from '@oaknational/curriculum-sdk-generation/vocab';
import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from './prerequisite-guidance.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk-generation/widget-constants';
import { SCOPES_SUPPORTED } from './scopes-supported.js';

/**
 * Input schema for get-prerequisite-graph tool.
 * V1 has no parameters — returns the complete graph.
 */
export const GET_PREREQUISITE_GRAPH_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

/**
 * Tool definition for get-prerequisite-graph.
 *
 * The graph is delivered in structuredContent because the MODEL needs to reason about it.
 * Do NOT hide the graph in _meta — that would defeat the purpose.
 */
export const GET_PREREQUISITE_GRAPH_TOOL_DEF = {
  description: `Returns the Oak Curriculum prerequisite graph.

This instance-level graph shows unit dependencies and prior knowledge requirements:
- ${prerequisiteGraph.stats.unitsWithPrerequisites} units with prior knowledge requirements
- ${prerequisiteGraph.stats.totalEdges} prerequisiteFor edges derived from thread ordering
- ${prerequisiteGraph.stats.subjectsCovered.length} subjects covered

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

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Complements get-thread-progressions (learning paths) with prerequisite detail.`,

  inputSchema: GET_PREREQUISITE_GRAPH_INPUT_SCHEMA,

  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,

  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Prerequisite Graph',
  },

  _meta: {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Loading prerequisite graph…',
    'openai/toolInvocation/invoked': 'Prerequisite graph loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

/**
 * Execute the get-prerequisite-graph tool.
 *
 * Returns the complete prerequisite graph in structuredContent for model reasoning.
 * This is critical — the model needs to see and process the graph data.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runPrerequisiteGraphTool(): CallToolResult {
  return formatToolResponse({
    summary: `Prerequisite graph loaded. Contains ${prerequisiteGraph.stats.unitsWithPrerequisites} units with prior knowledge requirements and ${prerequisiteGraph.stats.totalEdges} edges.`,
    data: prerequisiteGraph,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-prerequisite-graph',
    annotationsTitle: 'Get Prerequisite Graph',
  });
}
