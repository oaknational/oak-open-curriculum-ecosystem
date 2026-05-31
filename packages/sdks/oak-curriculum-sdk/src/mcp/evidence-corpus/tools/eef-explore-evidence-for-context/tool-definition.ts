/**
 * Tool definition and input schema for `eef-explore-evidence-for-context`
 * (the current transitional EEF evidence-context tool).
 *
 * The tool surfaces a typed subgraph of EEF Teaching and Learning Toolkit
 * strands for a teacher's lesson context (subject + key stage + topic, with
 * an optional pedagogical focus). The response is the connected evidence
 * graph; the strand-to-strand relationships are the pedagogically meaningful
 * signal. The model uses the graph as evidence context, not as ordered advice
 * or a teacher-replacing choice.
 *
 * Citation discipline is structural at this boundary (`../../citation-shape.ts`):
 * every response carries a non-empty tuple of citations, each with a
 * non-empty tuple of caveats. Source attribution rides once per response in
 * `data.attribution` (model-visible) — `CallToolResult._meta` is reserved by
 * the MCP spec, so the response cannot carry it there. This tool definition's
 * `_meta.attribution` (below) is the separate registration/listing-time
 * attribution. Attribution is never per citation.
 */

import { z } from 'zod';

import { EEF_PRIORITIES, type EefPriority } from '@oaknational/graph-corpus-sdk/eef-strands';

import { SCOPES_SUPPORTED } from '../../../scopes-supported.js';
import { EEF_ATTRIBUTION } from '../../../source-attribution.js';
import { AGGREGATED_EEF_EVIDENCE_GUIDANCE } from '../../eef-evidence-guidance.js';

/**
 * Pedagogical focus a teacher may pass — an EEF priority drawn from the
 * corpus's own controlled vocabulary ({@link EEF_PRIORITIES}, the snapshot's
 * `school_context_schema.priorities.enum`). Schema-first and data-derived: the
 * value space is the data's, not an invented enum. The focus narrows the
 * evidence-context query to strands whose `most_relevant_priorities` include it.
 */
export type EefExploreFocus = EefPriority;

/** Validated arguments for the explore tool. */
export interface EefExploreArgs {
  readonly subject: string;
  readonly keyStage: string;
  readonly topic: string;
  readonly focus?: EefExploreFocus;
}

/**
 * Tool definition with MCP metadata. The `eef-*` prefix and the
 * `_meta.attribution` are required for every EEF surface per ADR-157.
 */
export const EEF_EXPLORE_TOOL_DEF = {
  title: 'Explore EEF Evidence for Context',
  description: `Surface EEF Teaching and Learning Toolkit evidence for a lesson context as a connected graph of strands.

${AGGREGATED_EEF_EVIDENCE_GUIDANCE}

Returns a typed subgraph of EEF strands (evidence-based teaching approaches) and the relationships between them. The connections between strands are pedagogically meaningful: related approaches often combine well. Use the strands whose evidence and implementation requirements fit the lesson context.

Use this when:
- A teacher explicitly asks for evidence context for a lesson, unit, or topic
- You are already adapting, combining, or framing Oak material pedagogically
- You need the EEF evidence base with its caveats attached for honest framing

Do NOT use for:
- Oak curriculum content (lessons, units, threads) — use search / explore-topic
- EEF invocations where you cannot briefly say what prompted the evidence context
- Teacher-facing advice that chooses a single approach or tells the teacher what to do

Every strand in the response carries citations with caveats that MUST be preserved verbatim in any teacher-facing output.`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
    attribution: EEF_ATTRIBUTION,
  },
} as const;

/**
 * Flat Zod shape for MCP SDK registration. Required `subject`, `key_stage`,
 * and `topic`; optional `focus` from the closed enum. `.describe()` +
 * `.meta({ examples })` preserve guidance through `z.toJSONSchema()`.
 */
export const EEF_EXPLORE_INPUT_SCHEMA: z.ZodRawShape = {
  subject: z
    .string()
    .describe('The subject of the lesson, e.g. "maths", "science", "english".')
    .meta({ examples: ['maths', 'science', 'history'] }),
  key_stage: z
    .string()
    .describe('The key stage or phase of the lesson, e.g. "KS2", "KS3", "EYFS".')
    .meta({ examples: ['KS1', 'KS2', 'KS3', 'KS4'] }),
  topic: z
    .string()
    .describe('The lesson topic or learning objective, in natural language.')
    .meta({ examples: ['photosynthesis', 'fractions', 'the Romans'] }),
  focus: z
    .enum([...EEF_PRIORITIES])
    .optional()
    .describe(
      'Optional EEF priority to focus on; narrows the evidence to strands most relevant to it.',
    )
    .meta({
      examples: [
        'improving_maths',
        'metacognition_and_self_regulation',
        'closing_disadvantage_gap',
      ],
    }),
};
