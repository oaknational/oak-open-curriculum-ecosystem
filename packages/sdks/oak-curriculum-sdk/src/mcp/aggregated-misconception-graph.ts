/**
 * `get-misconception-graph` — bounded anchored misconception retrieval over
 * the curriculum graph corpus (G2).
 *
 * The tool is a thin parse-and-dispatch over the misconception view in
 * `@oaknational/graph-corpus-sdk/curriculum` — the view owns the chain
 * retrieval semantics (anchor resolution, curriculum-ordered windows,
 * heavy-tail coverage honesty); this module owns only the MCP boundary: input
 * validation
 * (exactly one anchor mode per call; the unit window belongs to the thread
 * anchor) and the response envelope. There is no whole-corpus path: every
 * call is anchored to the lessons, units, or thread the caller names.
 *
 * Unknown anchor slugs and window coverage are reported as information in the
 * result envelope, never as a recommendation (ADR-194: the data surface is
 * deterministic; the agent is the only reasoner).
 *
 * @see `@oaknational/graph-corpus-sdk/curriculum` — the misconception view and
 *   its window constants (the heavy-tail evidence lives in its TSDoc).
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`)
 *   for the corpus extraction methodology.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  DEFAULT_THREAD_UNIT_LIMIT,
  MAX_THREAD_UNIT_LIMIT,
  misconceptionsForLessons,
  misconceptionsForThread,
  misconceptionsForUnits,
  type LessonMisconceptionsSubgraph,
  type ThreadMisconceptionsSubgraph,
  type UnitMisconceptionsSubgraph,
} from '@oaknational/graph-corpus-sdk/curriculum';
import {
  summariseLessons,
  summariseThread,
  summariseUnits,
} from './aggregated-misconception-graph-summaries.js';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';

/**
 * The anchored input contract for `get-misconception-graph`.
 *
 * Exactly one anchor mode per call — `lessonSlugs`, `unitSlugs`, OR
 * `threadSlug`. Slugs are corpus keys (resolve them first via `search`,
 * `fetch`, or `browse-curriculum`), not free text. Unknown slugs are reported
 * in the result's `unknownAnchors`, not errored. The unit window
 * (`unitOffset` / `unitLimit`) applies to the thread anchor only; its ceiling
 * is encoded at the schema so an out-of-range window fails at the input
 * boundary with a named constraint.
 */
const MISCONCEPTION_INPUT = z.object({
  lessonSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Lesson anchor: lesson slugs (corpus keys). Each lesson carries at most two misconceptions. Exactly one anchor mode per call.',
    )
    .meta({ examples: [['add-fractions-with-the-same-denominator']] }),
  unitSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Unit anchor: unit slugs (corpus keys). Returns each unit with every placed lesson and its misconceptions, in Oak’s authored teaching order. Exactly one anchor mode per call.',
    )
    .meta({ examples: [['comparing-fractions']] }),
  threadSlug: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Thread anchor: one thread slug (corpus key). Returns a unit-granular window over the thread in Oak’s curriculum order, with honest coverage (totalUnits, hasMore). Exactly one anchor mode per call.',
    )
    .meta({ examples: ['number-fractions'] }),
  unitOffset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Thread anchor only: index of the first unit in the window. Default 0.'),
  unitLimit: z
    .number()
    .int()
    .min(1)
    .max(MAX_THREAD_UNIT_LIMIT)
    .optional()
    .describe(
      `Thread anchor only: units per window. Default ${String(DEFAULT_THREAD_UNIT_LIMIT)}, maximum ${String(MAX_THREAD_UNIT_LIMIT)}.`,
    ),
});

/** The parse-time contract: exactly one anchor mode; the unit window only with the thread anchor. */
const MISCONCEPTION_INPUT_VALIDATED = MISCONCEPTION_INPUT.superRefine((input, ctx) => {
  const anchorModes = [input.lessonSlugs, input.unitSlugs, input.threadSlug].filter(
    (anchor) => anchor !== undefined,
  ).length;
  if (anchorModes !== 1) {
    ctx.addIssue({
      code: 'custom',
      message: `exactly one anchor mode is required (lessonSlugs, unitSlugs, or threadSlug); received ${String(anchorModes)}`,
    });
  }
  if ((input.unitOffset !== undefined || input.unitLimit !== undefined) && !input.threadSlug) {
    ctx.addIssue({
      code: 'custom',
      message: 'unitOffset/unitLimit apply to the thread anchor only',
    });
  }
});

/**
 * The aggregated-tool input carrier — the field map of
 * {@link MISCONCEPTION_INPUT}. Deliberately NOT annotated `: z.ZodRawShape`
 * (the annotation would widen the per-field schema types); the `satisfies`
 * guard in `universal-tools/definitions.ts` enforces the carrier contract.
 * The exactly-one-anchor rule is parse-time ({@link MISCONCEPTION_INPUT_VALIDATED})
 * and stated in the tool description — a flat wire schema cannot carry it.
 */
export const GET_MISCONCEPTION_GRAPH_INPUT_SCHEMA = MISCONCEPTION_INPUT.shape;

const MISCONCEPTION_TOOL_TITLE = 'Oak Curriculum Misconception Subgraph';

/** Tool definition for the anchored get-misconception-graph. */
export const GET_MISCONCEPTION_GRAPH_TOOL_DEF = {
  title: MISCONCEPTION_TOOL_TITLE,
  description: `Returns the misconceptions (with teacher responses) addressed by the anchor you name.

Misconceptions are extracted per lesson from the Oak curriculum and reached through the thread → unit → lesson → misconception chain. Every call is anchored — exactly ONE of:
- lessonSlugs: the leaf anchor; each lesson carries at most two misconceptions.
- unitSlugs: the core anchor; each unit returns every placed lesson with its misconceptions, in Oak's authored teaching order (typical bodies 2–11 KB per unit).
- threadSlug (+ optional unitOffset/unitLimit): a unit-granular window over one thread in Oak's curriculum order (years ascending within a subject, the subject's authored unit order within a year), default ${String(DEFAULT_THREAD_UNIT_LIMIT)} units per page (maximum ${String(MAX_THREAD_UNIT_LIMIT)}), with totalUnits and hasMore reported so partial coverage is always visible. unitOffset/unitLimit are valid ONLY with threadSlug — combining them with lessonSlugs or unitSlugs is rejected.

Ordering is a deterministic projection of Oak's authored order, not a single global sequence. A thread's units are grouped by subject, each subject's run in curriculum order (years ascending, the authored unit order within a year), and the runs are concatenated — Oak records no order ACROSS subjects, so the join between runs carries no pedagogical claim. A unit's lessons follow the authored lesson order of the programmes that place them; where variants disagree the earliest recorded position is used with a slug tie-break, and a lesson no variant orders follows the ordered ones. What this rules out is the alphabet: the order is never the id-sorted one it used to be.

Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown slugs are reported in the result's unknownAnchors, not errored.

Coverage honesty: some units belong to no thread (unit entries carry threadSlugs membership; an empty list marks a thread-unreachable unit), so thread-anchored results are thread-scoped and never subject-complete.

Use this to answer questions like:
- "What misconceptions should I anticipate in this lesson?" (anchor: that lesson's slug)
- "Which misconceptions does this unit address across its lessons?"
- "How do misconceptions develop along this curriculum thread?" (windowed)

Complements get-prior-knowledge-graph (prerequisite gaps) with per-lesson misconception detail.`,

  securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

  annotations: {
    readOnlyHint: true as const,
    destructiveHint: false as const,
    idempotentHint: true as const,
    openWorldHint: false as const,
    title: MISCONCEPTION_TOOL_TITLE,
  },

  _meta: {
    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],
  },
} as const;

/** The anchored envelope payload, discriminated by the anchor kind that produced it. */
type MisconceptionEnvelopeData =
  | ({ readonly anchorKind: 'lesson' } & LessonMisconceptionsSubgraph)
  | ({ readonly anchorKind: 'unit' } & UnitMisconceptionsSubgraph)
  | ({ readonly anchorKind: 'thread' } & ThreadMisconceptionsSubgraph);

/** Dispatches the validated single-anchor input to the owning view function. */
function dispatchAnchor(
  input: z.infer<typeof MISCONCEPTION_INPUT>,
):
  | { readonly summary: string; readonly data: MisconceptionEnvelopeData }
  | { readonly errorText: string } {
  if (input.lessonSlugs !== undefined) {
    const subgraph = misconceptionsForLessons(input.lessonSlugs);
    return { summary: summariseLessons(subgraph), data: { anchorKind: 'lesson', ...subgraph } };
  }
  if (input.unitSlugs !== undefined) {
    const subgraph = misconceptionsForUnits(input.unitSlugs);
    return { summary: summariseUnits(subgraph), data: { anchorKind: 'unit', ...subgraph } };
  }
  if (input.threadSlug !== undefined) {
    const result = misconceptionsForThread(input.threadSlug, {
      unitOffset: input.unitOffset,
      unitLimit: input.unitLimit,
    });
    if (!result.ok) {
      // Defensive: the schema's window bounds mirror the view's, so this can
      // only fire if the two ceilings ever drift.
      return {
        errorText: `get-misconception-graph failed: ${result.error.kind} — window offset ${String(result.error.unitOffset)}, limit ${String(result.error.unitLimit)} (maximum ${String(result.error.maxUnitLimit)}).`,
      };
    }
    return {
      summary: summariseThread(result.value),
      data: { anchorKind: 'thread', ...result.value },
    };
  }
  // Unreachable: the parse-time exactly-one-anchor rule guarantees a branch above.
  return { errorText: 'get-misconception-graph failed: no anchor resolved after validation.' };
}

/**
 * Execute the anchored get-misconception-graph tool.
 *
 * Validation is the schema parse itself — anchor exclusivity, window
 * coupling, and the window ceiling fall out of
 * {@link MISCONCEPTION_INPUT_VALIDATED}. The bounded result is returned in
 * structuredContent with the summary and serialised JSON alongside as
 * TextContent (MCP spec SHOULD for structured results).
 *
 * @param input - Raw MCP tool-call arguments.
 * @returns CallToolResult with the anchored result in structuredContent.
 */
export function runMisconceptionGraphTool(input: unknown): CallToolResult {
  const parsed = MISCONCEPTION_INPUT_VALIDATED.safeParse(input);
  if (!parsed.success) {
    return formatError(`Invalid get-misconception-graph input: ${parsed.error.message}`);
  }

  const dispatched = dispatchAnchor(parsed.data);
  if ('errorText' in dispatched) {
    return formatError(dispatched.errorText);
  }

  return formatToolResponse({
    summary: dispatched.summary,
    data: dispatched.data,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-misconception-graph',
    annotationsTitle: MISCONCEPTION_TOOL_TITLE,
  });
}
