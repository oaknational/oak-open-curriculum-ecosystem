/**
 * `get-thread-progressions` — bounded anchored thread-progression retrieval
 * over the curriculum graph corpus (G3).
 *
 * The tool is a thin parse-and-dispatch over the thread-progressions view in
 * `@oaknational/graph-corpus-sdk/curriculum` — the view owns the retrieval
 * semantics (year-ordered sequences, discovery descriptors, anchor
 * resolution); this module owns only the MCP boundary: input validation
 * (exactly one anchor mode per call — `threadSlug` detail, or
 * `subject`+`keyStage` discovery) and the response envelope. There is no
 * whole-corpus path: every call is anchored, and the detail anchor returns
 * ONE thread's progression, never the whole thread estate.
 *
 * Ordering honesty (the G3 grounded falsification): the bulk exports no
 * authoritative within-thread unit ordering, so progressions order by the
 * placement's teaching YEAR — the axis threads advertise (firstYear →
 * lastYear); within one year the order is not curricular. The tool
 * description states this; unknown anchors are reported as information in
 * the result envelope, never errored (ADR-194: the data surface is
 * deterministic; the agent is the only reasoner).
 *
 * @see `@oaknational/graph-corpus-sdk/curriculum` — the thread-progressions
 *   view (the ordering-basis evidence lives in its TSDoc).
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`)
 *   for the corpus extraction methodology.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  progressionForThread,
  progressionsForSubjectKeyStage,
  threadProgressionStats,
  type ThreadDiscovery,
  type ThreadProgressionSubgraph,
} from '@oaknational/graph-corpus-sdk/curriculum';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';

/**
 * The anchored input contract for `get-thread-progressions`.
 *
 * Exactly one anchor mode per call — `threadSlug` (detail), OR
 * `subject` + `keyStage` together (discovery). Slugs are corpus keys
 * (resolve them first via `search` with scope "threads", `fetch`, or
 * `browse-curriculum`), not free text. An unknown thread slug is reported in
 * the result's `unknownAnchors`, not errored.
 */
const THREAD_PROGRESSIONS_INPUT = z.object({
  threadSlug: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Detail anchor: one thread slug (corpus key). Returns that thread’s full year-ordered unit progression. Exactly one anchor mode per call.',
    ),
  subject: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Discovery anchor (with keyStage): a subject slug, e.g. "maths". Returns bounded thread descriptors without sequences. Exactly one anchor mode per call.',
    ),
  keyStage: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Discovery anchor (with subject): a key-stage slug, e.g. "ks2". Returns bounded thread descriptors without sequences.',
    ),
});

/** The parse-time contract: threadSlug XOR (subject AND keyStage together). */
const THREAD_PROGRESSIONS_INPUT_VALIDATED = THREAD_PROGRESSIONS_INPUT.superRefine((input, ctx) => {
  const detail = input.threadSlug !== undefined;
  const discoveryFields = [input.subject, input.keyStage].filter(
    (field) => field !== undefined,
  ).length;
  if (detail && discoveryFields > 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'exactly one anchor mode is required: threadSlug, OR subject + keyStage',
    });
  }
  if (!detail && discoveryFields !== 2) {
    ctx.addIssue({
      code: 'custom',
      message:
        'exactly one anchor mode is required: threadSlug, OR subject + keyStage (both together)',
    });
  }
});

/**
 * The aggregated-tool input carrier — the field map of
 * {@link THREAD_PROGRESSIONS_INPUT}. Deliberately NOT annotated
 * `: z.ZodRawShape` (the annotation would widen the per-field schema types);
 * the `satisfies` guard in `universal-tools/definitions.ts` enforces the
 * carrier contract. The exactly-one-anchor rule is parse-time
 * ({@link THREAD_PROGRESSIONS_INPUT_VALIDATED}) and stated in the tool
 * description — a flat wire schema cannot carry it.
 */
export const GET_THREAD_PROGRESSIONS_INPUT_SCHEMA = THREAD_PROGRESSIONS_INPUT.shape;

const THREAD_PROGRESSIONS_TOOL_TITLE = 'Oak Curriculum Thread Progressions';

/** Tool definition for the anchored get-thread-progressions. */
export const GET_THREAD_PROGRESSIONS_TOOL_DEF = {
  title: THREAD_PROGRESSIONS_TOOL_TITLE,
  description: `Returns how an Oak curriculum thread progresses across year groups, for the anchor you name.

Threads connect units into conceptual progressions across years (${String(threadProgressionStats.threadCount)} threads across ${String(threadProgressionStats.subjectsCovered.length)} subjects). Every call is anchored — exactly ONE of:
- threadSlug: the detail anchor; returns that ONE thread's full unit progression ordered by teaching year (earliest → latest; "All years" units last) — never the whole thread estate.
- subject + keyStage (both together): the discovery anchor; returns bounded thread descriptors (slug, title, year span, unit count — no sequences) so you can pick a threadSlug to anchor next.

Ordering semantics, stated honestly: the progression axis is the teaching year. Within one year the order is not curricular (the curriculum data defines no within-year unit sequence); treat same-year units as a group, not a chain.

Slugs are corpus keys — resolve them first with search (scope "threads"), fetch, or browse-curriculum. An unknown threadSlug is reported in the result's unknownAnchors, not errored; an unmatched subject+keyStage returns a well-formed empty result.

Use this to answer questions like:
- "What's the learning path for fractions?" (discover with subject+keyStage, then anchor the thread)
- "How does this thread build from early years to GCSE?" (threadSlug)
- "Which threads cover algebra at KS3?" (subject + keyStage)

Complements get-prior-knowledge-graph (unit-level prerequisite subgraphs) and get-misconception-graph (per-lesson misconceptions along a thread).`,

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

/** The anchored envelope payload, discriminated by the anchor kind that produced it. */
type ThreadProgressionsEnvelopeData =
  | ({ readonly anchorKind: 'thread' } & ThreadProgressionSubgraph)
  | ({ readonly anchorKind: 'subjectKeyStage' } & ThreadDiscovery);

/** Summarises one thread's progression result for the envelope TextContent. */
function summariseProgression(subgraph: ThreadProgressionSubgraph): string {
  if (subgraph.threads.length === 0) {
    const unknown = subgraph.unknownAnchors.join(', ');
    return `No thread matched the anchor (unknown: ${unknown}).`;
  }
  const progression = subgraph.threads[0];
  if (progression === undefined) {
    return 'No thread matched the anchor.';
  }
  const span =
    progression.thread.firstYear !== undefined && progression.thread.lastYear !== undefined
      ? ` spanning Year ${String(progression.thread.firstYear)}–${String(progression.thread.lastYear)}`
      : '';
  return `Thread "${progression.thread.title}": ${String(progression.totalUnits)} unit placements${span}, ordered by teaching year.`;
}

/** Summarises a discovery result for the envelope TextContent. */
function summariseDiscovery(discovery: ThreadDiscovery): string {
  return `${String(discovery.threads.length)} thread(s) with ${discovery.subject} units at ${discovery.keyStage}. Anchor get-thread-progressions with a threadSlug for the ordered progression.`;
}

/** Dispatches the validated single-anchor input to the owning view function. */
function dispatchAnchor(input: z.infer<typeof THREAD_PROGRESSIONS_INPUT>): {
  readonly summary: string;
  readonly data: ThreadProgressionsEnvelopeData;
} {
  if (input.threadSlug !== undefined) {
    const subgraph = progressionForThread(input.threadSlug);
    return {
      summary: summariseProgression(subgraph),
      data: { anchorKind: 'thread', ...subgraph },
    };
  }
  const { subject, keyStage } = input;
  if (subject === undefined || keyStage === undefined) {
    // Structurally unreachable: the parse-time exactly-one-anchor rule
    // guarantees subject+keyStage here. Fail loud rather than silently
    // dispatching an empty discovery if that guarantee ever drifts.
    throw new Error(
      'get-thread-progressions invariant breach: discovery anchor missing subject or keyStage after validated parse',
    );
  }
  const discovery = progressionsForSubjectKeyStage(subject, keyStage);
  return {
    summary: summariseDiscovery(discovery),
    data: { anchorKind: 'subjectKeyStage', ...discovery },
  };
}

/**
 * Execute the anchored get-thread-progressions tool.
 *
 * Validation is the schema parse itself — anchor exclusivity falls out of
 * {@link THREAD_PROGRESSIONS_INPUT_VALIDATED}. The bounded result is returned
 * in structuredContent with the summary and serialised JSON alongside as
 * TextContent (MCP spec SHOULD for structured results).
 *
 * @param input - Raw MCP tool-call arguments.
 * @returns CallToolResult with the anchored result in structuredContent.
 */
export function runThreadProgressionsTool(input: unknown): CallToolResult {
  const parsed = THREAD_PROGRESSIONS_INPUT_VALIDATED.safeParse(input);
  if (!parsed.success) {
    return formatError(`Invalid get-thread-progressions input: ${parsed.error.message}`);
  }

  const dispatched = dispatchAnchor(parsed.data);
  return formatToolResponse({
    summary: dispatched.summary,
    data: dispatched.data,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-thread-progressions',
    annotationsTitle: THREAD_PROGRESSIONS_TOOL_TITLE,
  });
}
