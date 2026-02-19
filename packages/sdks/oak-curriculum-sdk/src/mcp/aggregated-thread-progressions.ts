/**
 * Oak Curriculum Thread Progressions Tool
 *
 * Provides the thread progression graph showing ordered unit sequences
 * within curriculum threads. Enables learning path recommendations
 * and progression queries.
 *
 * @remarks
 * Thread progressions show conceptual progressions across years.
 * For example, the "Number: Fractions" thread spans Year 2-6 with
 * ordered units showing the learning path.
 *
 * @see thread-progression-data.ts for the graph data structure
 * @see aggregated-knowledge-graph.ts for the companion schema-level graph
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatToolResponse } from './universal-tool-shared.js';
import { threadProgressionGraph } from './thread-progression-data.js';
import { ONTOLOGY_RECOMMENDED_FIRST_STEP } from './prerequisite-guidance.js';
import { WIDGET_URI } from '../types/generated/widget-constants.js';

/**
 * Input schema for get-thread-progressions tool.
 * V1 has no parameters — returns the complete graph.
 */
export const GET_THREAD_PROGRESSIONS_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

/**
 * Tool definition for get-thread-progressions.
 *
 * The graph is delivered in structuredContent because the MODEL needs to reason about it.
 * Do NOT hide the graph in _meta — that would defeat the purpose.
 */
export const GET_THREAD_PROGRESSIONS_TOOL_DEF = {
  description: `Returns the Oak Curriculum thread progression graph.

This instance-level graph shows ordered unit sequences within curriculum threads:
- ${String(threadProgressionGraph.stats.threadCount)} threads across ${String(threadProgressionGraph.stats.subjectsCovered.length)} subjects
- Each thread contains ordered units showing the learning progression
- Year spans show when concepts are taught (e.g., "Number: Fractions" from Year 2-6)

Example threads:
- "Number: Fractions" (maths) — units from Year 2 through Year 6
- "Active citizenship" (citizenship) — units from Year 7 through Year 10

Use this to answer questions like:
- "What's the learning path for fractions?"
- "What comes after this unit in the thread?"
- "Which threads cover algebra?"

${ONTOLOGY_RECOMMENDED_FIRST_STEP}

Complements get-knowledge-graph (schema-level structure) with actual progression data.`,

  inputSchema: GET_THREAD_PROGRESSIONS_INPUT_SCHEMA,

  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,

  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Thread Progressions',
  },

  _meta: {
    'openai/outputTemplate': WIDGET_URI,
    'openai/toolInvocation/invoking': 'Loading thread progressions…',
    'openai/toolInvocation/invoked': 'Thread progressions loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

/**
 * Execute the get-thread-progressions tool.
 *
 * Returns the complete thread progression graph in structuredContent for model reasoning.
 * This is critical — the model needs to see and process the graph data.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runThreadProgressionsTool(): CallToolResult {
  return formatToolResponse({
    summary: `Thread progression graph loaded. Contains ${String(threadProgressionGraph.stats.threadCount)} threads across ${String(threadProgressionGraph.stats.subjectsCovered.length)} subjects with ordered unit sequences.`,
    data: threadProgressionGraph,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-thread-progressions',
    annotationsTitle: 'Get Thread Progressions',
  });
}
