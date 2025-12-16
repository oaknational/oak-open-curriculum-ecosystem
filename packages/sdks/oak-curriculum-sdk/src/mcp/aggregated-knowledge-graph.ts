/**
 * Oak Curriculum Knowledge Graph Tool
 *
 * Provides a static, schema-level graph of curriculum concept TYPE relationships.
 * Complements get-ontology by showing HOW concepts connect (vs WHAT they mean).
 *
 * @see knowledge-graph-data.ts for the graph data structure
 * @see aggregated-ontology.ts for the companion tool
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatOptimizedResult } from './universal-tool-shared.js';
import { conceptGraph } from './knowledge-graph-data.js';
import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from './prerequisite-guidance.js';
import { WIDGET_URI } from '../types/generated/widget-constants.js';

/**
 * Input schema for get-knowledge-graph tool.
 * V1 has no parameters — returns the complete graph.
 */
export const GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

/**
 * Tool definition for get-knowledge-graph.
 *
 * The graph is delivered in structuredContent because the MODEL needs to reason about it.
 * Do NOT hide the graph in _meta — that would defeat the purpose.
 */
export const GET_KNOWLEDGE_GRAPH_TOOL_DEF = {
  description: `Returns the Oak Curriculum knowledge graph.

This schema-level graph shows how curriculum concept TYPES relate to each other:
- Core hierarchy: Subject → Sequence → Unit → Lesson
- Content structure: Lesson → Quiz → Question → Answer
- Taxonomy: Thread ↔ Unit, Category ↔ Unit
- KS4 complexity: Programme → Tier/Pathway/ExamBoard

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Use this to understand domain structure. For rich definitions and guidance, call get-ontology.

The graph includes both explicit relationships (from API schema) and inferred relationships 
(implied by domain knowledge but not explicit in the API).`,

  inputSchema: GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA,

  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,

  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Knowledge Graph',
  },

  _meta: {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Loading knowledge graph…',
    'openai/toolInvocation/invoked': 'Knowledge graph loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

/**
 * Execute the get-knowledge-graph tool.
 *
 * Returns the complete knowledge graph in structuredContent for model reasoning.
 * This is critical — the model needs to see and process the graph data.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runKnowledgeGraphTool(): CallToolResult {
  return formatOptimizedResult({
    summary:
      'Oak Curriculum knowledge graph loaded. Use with get-ontology for complete domain understanding.',
    fullData: conceptGraph,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-knowledge-graph',
    annotationsTitle: 'Get Knowledge Graph',
  });
}
