/**
 * `get-keyword-graph` — bounded anchored frequency-ranked keyword retrieval
 * over the curriculum graph corpus (G4b).
 *
 * The tool is a thin parse-and-dispatch over the keyword view in
 * `@oaknational/graph-corpus-sdk/curriculum` — the view owns the retrieval
 * semantics (in-scope placement ranking, decoration windowing, limit
 * validation, narrowing); this module owns only the MCP boundary: input
 * validation (`subject` + `keyStage` required together) and the response
 * envelope. There is no whole-corpus path: every call is anchored and
 * bounded top-N.
 *
 * Disambiguation contract (G4b readiness adjudication 8): this description
 * and the generated `get-keywords` description each state when to prefer the
 * other, verified end-to-end via `tools/list`. The generated tool serves the
 * LIVE full keyword set; this tool serves a bounded ranked subset of a
 * point-in-time curriculum snapshot.
 *
 * @see `@oaknational/graph-corpus-sdk/curriculum` — the keyword view
 *   (ranking semantics and limit constants live there).
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`)
 *   for the corpus extraction methodology.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  DEFAULT_KEYWORD_LIMIT,
  KEYWORD_LESSON_DECORATION_LIMIT,
  MAX_KEYWORD_LIMIT,
  keywordsForSubjectKeyStage,
  type KeywordSubgraph,
} from '@oaknational/graph-corpus-sdk/curriculum';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';

/**
 * The anchored input contract for `get-keyword-graph`.
 *
 * `subject` + `keyStage` anchor every call (both required — they are lesson
 * attributes; keywords reach them via their placing lessons). `unitSlugs` /
 * `lessonSlugs` narrow within the anchor; `limit` bounds the ranked page.
 * Slugs are corpus keys (resolve them first via `search`, `fetch`, or
 * `browse-curriculum`), not free text.
 */
const KEYWORD_GRAPH_INPUT = z.object({
  subject: z
    .string()
    .min(1)
    .describe('Anchor subject slug (corpus key), e.g. "maths". Required, with keyStage.'),
  keyStage: z
    .string()
    .min(1)
    .describe('Anchor key-stage slug (corpus key), e.g. "ks2". Required, with subject.'),
  unitSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional narrowing: unit slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownUnitAnchors, not errored.',
    ),
  lessonSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional narrowing: lesson slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownLessonAnchors, not errored.',
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_KEYWORD_LIMIT)
    .optional()
    .describe(
      `Optional top-N bound for the ranked keyword page: integer in [1, ${String(MAX_KEYWORD_LIMIT)}], default ${String(DEFAULT_KEYWORD_LIMIT)}.`,
    ),
});

/**
 * The aggregated-tool input carrier — the field map of
 * {@link KEYWORD_GRAPH_INPUT}. Deliberately NOT annotated `: z.ZodRawShape`
 * (the annotation would widen the per-field schema types); the `satisfies`
 * guard in `universal-tools/definitions.ts` enforces the carrier contract.
 */
export const GET_KEYWORD_GRAPH_INPUT_SCHEMA = KEYWORD_GRAPH_INPUT.shape;

const KEYWORD_GRAPH_TOOL_TITLE = 'Oak Curriculum Keyword Graph';

/** Tool definition for the anchored get-keyword-graph. */
export const GET_KEYWORD_GRAPH_TOOL_DEF = {
  title: KEYWORD_GRAPH_TOOL_TITLE,
  description: `Returns the key vocabulary for one teaching context: a bounded, frequency-ranked page of curriculum keywords, each decorated with its in-scope placing lessons.

Every call is anchored by subject + keyStage (both required — corpus keys, e.g. "maths" + "ks2"), narrowable by unitSlugs and/or lessonSlugs. Ranking is by in-scope placement count (how many anchor-matching lessons place the keyword), descending — vocabulary frequent elsewhere in the curriculum never outranks locally relevant vocabulary. Results are bounded top-N (default ${String(DEFAULT_KEYWORD_LIMIT)}, max ${String(MAX_KEYWORD_LIMIT)}) with honest totals (totalMatchingKeywords, hasMore); each entry carries the keyword node (term, description, global frequency = unique placing lessons corpus-wide, coarse firstYear at key-stage granularity: ks1→1, ks2→3, ks3→7, ks4→10) plus up to ${String(KEYWORD_LESSON_DECORATION_LIMIT)} in-scope placing lessons (hasMoreLessons marks the cut) — richness arrives by edge traversal on the curriculum graph, never a flat dump.

Data is a point-in-time snapshot of the published curriculum (bulk export), not the live API; coverage can lag live content, materially at KS4 while subjects restructure.

When to prefer which keywords tool: get-keywords returns the LIVE full keyword set for a key stage + subject — fresh, authoritative at KS4, alphabetical, unranked, and large. This tool returns a bounded frequency-ranked subset with lesson connections — token-economical, best for "the most relevant vocabulary for this teaching context" and for navigating from keywords into lessons, units, and the wider curriculum graph.

Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown unitSlugs/lessonSlugs are reported in the result's unknown-anchor fields, not errored; an unknown subject or keyStage returns a well-formed empty result.

Use this to answer questions like:
- "What vocabulary should I emphasise teaching maths at KS2?" (subject + keyStage)
- "Which keywords matter most in this unit?" (narrow with unitSlugs)
- "What terms does this lesson rely on?" (narrow with lessonSlugs)

Complements get-keywords (live full set), get-misconception-graph, get-prior-knowledge-graph, and get-thread-progressions on the same curriculum graph.`,

  securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

  annotations: {
    readOnlyHint: true as const,
    destructiveHint: false as const,
    idempotentHint: true as const,
    openWorldHint: false as const,
  },

  _meta: {
    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],
  },
} as const;

/** The anchored envelope payload: the anchor echo plus the view's ranked subgraph. */
type KeywordGraphEnvelopeData = {
  readonly subject: string;
  readonly keyStage: string;
} & KeywordSubgraph;

/**
 * Summarises the ranked result for the envelope TextContent. `narrowed`
 * reflects whether the CALLER provided narrowing inputs (not whether they
 * resolved) — the summary must never imply narrowing that was not asked for,
 * and must still name it when every narrowing slug was unknown.
 */
function summariseKeywords(
  subject: string,
  keyStage: string,
  narrowed: boolean,
  subgraph: KeywordSubgraph,
): string {
  if (subgraph.keywords.length === 0) {
    return `No keywords matched ${subject} at ${keyStage}${narrowed ? ' with the given narrowing' : ''}.`;
  }
  const shown = String(subgraph.keywords.length);
  const total = String(subgraph.totalMatchingKeywords);
  return `Top ${shown} of ${total} keywords for ${subject} at ${keyStage}${narrowed ? ' (narrowed)' : ''}, ranked by in-scope lesson placements.`;
}

/**
 * Execute the anchored get-keyword-graph tool.
 *
 * Validation is the schema parse plus the view's own limit contract — a
 * limit outside [1, max] surfaces as a boundary error (the view returns
 * `KeywordLimitInvalid`; the envelope reports it as an error result). The
 * bounded result is returned in structuredContent with the summary and
 * serialised JSON alongside as TextContent (MCP spec SHOULD for structured
 * results).
 *
 * @param input - Raw MCP tool-call arguments.
 * @returns CallToolResult with the anchored ranked result in structuredContent.
 */
export function runKeywordGraphTool(input: unknown): CallToolResult {
  const parsed = KEYWORD_GRAPH_INPUT.safeParse(input);
  if (!parsed.success) {
    return formatError(`Invalid get-keyword-graph input: ${parsed.error.message}`);
  }

  const { subject, keyStage, unitSlugs, lessonSlugs, limit } = parsed.data;
  const result = keywordsForSubjectKeyStage(subject, keyStage, {
    unitSlugs,
    lessonSlugs,
    limit,
  });
  if (!result.ok) {
    return formatError(
      `Invalid get-keyword-graph limit: ${String(result.error.limit)} (must be an integer in [1, ${String(result.error.maxLimit)}])`,
    );
  }

  const narrowed = (unitSlugs?.length ?? 0) > 0 || (lessonSlugs?.length ?? 0) > 0;
  const data: KeywordGraphEnvelopeData = { subject, keyStage, ...result.value };
  return formatToolResponse({
    summary: summariseKeywords(subject, keyStage, narrowed, result.value),
    data,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-keyword-graph',
    annotationsTitle: KEYWORD_GRAPH_TOOL_TITLE,
  });
}
