/**
 * Oak Curriculum Misconception Graph Tool
 *
 * Provides the misconception graph showing common student misconceptions
 * with teacher responses, organised by subject and key stage. Enables
 * diagnostic question planning and targeted remediation.
 *
 * @remarks
 * The misconception graph contains 12,858 misconceptions extracted from
 * the Oak bulk data, each with:
 * - The misconception text
 * - The recommended teacher response
 * - Subject and key stage context
 * - The lesson it originates from
 *
 * @see \@oaknational/sdk-codegen/vocab-data for the graph data export
 * @see ADR-086 for the extraction methodology
 * @see ADR-157 for the multi-source integration context
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { misconceptionGraph } from '@oaknational/sdk-codegen/vocab-data';
import { createGraphToolDef, createGraphToolExecutor } from './graph-resource-factory.js';
import { MISCONCEPTION_GRAPH_CONFIG } from './misconception-graph-resource.js';
import { MISCONCEPTION_GUIDANCE } from './misconception-guidance.js';

/**
 * Empty input schema for the get-misconception-graph tool (no parameters).
 *
 * Per MCP spec, no-input tools declare `{ "type": "object", "additionalProperties": false }`
 * on the wire. An empty `ZodRawShape` produces this through the SDK's `z.toJSONSchema()`.
 */
export const GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA: Record<string, never> = {};

/**
 * Tool definition for get-misconception-graph.
 *
 * @remarks
 * The description includes live stats interpolated from the generated graph data.
 * This is a supplementary resource — load it when diagnosing student understanding,
 * not as a prerequisite for other tools.
 */
export const GET_MISCONCEPTION_GRAPH_TOOL_DEF = createGraphToolDef({
  ...MISCONCEPTION_GRAPH_CONFIG,
  description: `Returns the Oak Curriculum misconception graph.

Common student misconceptions with teacher responses, organised by subject and key stage:
- ${String(misconceptionGraph.stats.totalMisconceptions)} misconceptions across ${String(misconceptionGraph.stats.subjectsCovered.length)} subjects
- Each misconception includes the teacher's recommended response
- Covers all key stages from the Oak curriculum

Each node contains:
- Misconception text (what students commonly get wrong)
- Teacher response (how to address it)
- Subject and key stage context
- Source lesson reference

Use this to answer questions like:
- "What misconceptions do students have about fractions?"
- "What are common errors in KS3 science?"
- "How should I address the misconception that heavier objects fall faster?"

${MISCONCEPTION_GUIDANCE}`,
});

/**
 * Execute the get-misconception-graph tool.
 *
 * Returns the complete misconception graph in structuredContent for model reasoning.
 *
 * @returns CallToolResult with graph in structuredContent
 */
const executeMisconceptionGraphTool = createGraphToolExecutor(MISCONCEPTION_GRAPH_CONFIG);

/**
 * Execute the get-misconception-graph tool.
 *
 * Returns the complete misconception graph in structuredContent for model reasoning.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runMisconceptionGraphTool(): CallToolResult {
  return executeMisconceptionGraphTool();
}
