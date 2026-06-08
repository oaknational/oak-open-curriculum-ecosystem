/**
 * `get-eef-evidence` — bounded-query graph tool over the EEF Teaching and
 * Learning Toolkit corpus.
 *
 * A NEW shape within the aggregated-tools family. Unlike the open-input tools
 * (`search`, `fetch`) it takes ONLY closed, finite, compile-time-known input —
 * every selector is a `z.enum` over the corpus's own finite domains, so the
 * schema IS the input contract and there is no open content to validate or
 * interpret. Unlike the no-input whole-corpus dumps (`get-misconception-graph`)
 * it answers a BOUNDED query rather than returning everything. The handler is
 * therefore a thin parse-and-dispatch over the D5 graph bindings that returns
 * the evidence envelope verbatim as `structuredContent` — zero transformation,
 * the corpus citation provenance emitted as authored (ADR-191: the data surface
 * is deterministic; the agent is the only reasoner).
 *
 * @see `@oaknational/graph-corpus-sdk/eef-strands` — the D5 query bindings and
 *   the finite input domains.
 * @see ADR-191 (no server-side ranking/scoring), ADR-179 (no MCP types in the
 *   graph substrate; the input enums are typed FROM the corpus domains here, in
 *   the consumer layer).
 */

import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  EEF_STRAND_IDS,
  OBSERVED_PHASES,
  OBSERVED_KEY_STAGES,
  OBSERVED_PRIORITIES,
  inspectStrand,
  evidenceForMove,
  type EvidenceForMoveSelectors,
  type EefEvidenceEnvelope,
} from '@oaknational/graph-corpus-sdk/eef-strands';
import { SCOPES_SUPPORTED } from './scopes-supported.js';

/**
 * The closed input contract for `get-eef-evidence`.
 *
 * Every field enumerates a finite, corpus-derived domain — there is no
 * open/free-text input. `function` dispatches between the two query shapes; the
 * remaining fields are the bounded-query selectors. Registered as its `.shape`
 * (a `z.ZodRawShape`, the aggregated-tool input carrier).
 *
 * The cross-field requirements — `inspect-strand` needs `strandId`,
 * `evidence-for-move` needs at least one selector — are D3 handler-boundary
 * predicates returned as `isError`, NOT structural schema rules: a flat raw
 * shape cannot express them, and D3 specifies them as semantic predicates at
 * the handler boundary.
 */
const EEF_EVIDENCE_INPUT = z.object({
  function: z
    .enum(['inspect-strand', 'evidence-for-move'])
    .describe(
      "Which query to run. 'inspect-strand': the evidence for one named EEF strand by id. 'evidence-for-move': the strands matching a pedagogical context (phase / key stage / priority) or an explicit set of ids.",
    )
    .meta({ examples: ['inspect-strand', 'evidence-for-move'] }),
  strandId: z
    .enum([...EEF_STRAND_IDS])
    .optional()
    .describe('inspect-strand: the single EEF strand id to inspect.'),
  strandIds: z
    .array(z.enum([...EEF_STRAND_IDS]))
    .optional()
    .describe('evidence-for-move: explicit EEF strand ids to retrieve together.'),
  phase: z
    .enum([...OBSERVED_PHASES])
    .optional()
    .describe('evidence-for-move: the school phase the pedagogical move applies to.'),
  keyStage: z
    .enum([...OBSERVED_KEY_STAGES])
    .optional()
    .describe('evidence-for-move: the key stage the pedagogical move applies to.'),
  priority: z
    .enum([...OBSERVED_PRIORITIES])
    .optional()
    .describe('evidence-for-move: the school-improvement priority the move addresses.'),
});

/**
 * The aggregated-tool input carrier — the field map of {@link EEF_EVIDENCE_INPUT}.
 *
 * Deliberately NOT annotated `: z.ZodRawShape`: that annotation would widen the
 * precise per-field schema types (each `ZodEnum` / `ZodOptional<ZodEnum>`) down
 * to `Record<string, ZodTypeAny>`, discarding the closed-domain precision this
 * tool is built on. The inferred type is already a `z.ZodRawShape` structurally,
 * and the `satisfies` guard in `definitions.ts` enforces that contract — so no
 * annotation is needed, and the field-level types survive.
 */
export const GET_EEF_EVIDENCE_INPUT_SCHEMA = EEF_EVIDENCE_INPUT.shape;

/**
 * Tool definition (input-taking, non-widget). `securitySchemes` is the uniform
 * graph-tool class — EEF carries no special auth status (owner-confirmed).
 */
export const GET_EEF_EVIDENCE_TOOL_DEF = {
  title: 'EEF Evidence (Teaching and Learning Toolkit)',
  description: `Returns the Education Endowment Foundation (EEF) Teaching and Learning Toolkit's evidence for a pedagogical move — strength, cost, months of additional progress, caveats, and source attribution — as deterministic facts to reason over (not recommendations).

Two queries via \`function\`:
- 'inspect-strand': the evidence for one named EEF strand, by \`strandId\`.
- 'evidence-for-move': the strands matching a pedagogical context — any of \`phase\`, \`keyStage\`, \`priority\`, or explicit \`strandIds\`. At least one selector is required.

Use this when the teacher asks for the evidence behind an approach, or when you are already adapting, combining, or framing Oak material pedagogically. State a terse rationale first (e.g. "EEF because: <pedagogical choice>").

Do NOT use for plain curriculum retrieval (use 'search'/'fetch'), for guaranteed-outcome claims, for individual-pupil causal claims, or to make a teacher-replacing selection. The evidence is population-level; carry its caveats and attribution into anything drafted from it.

Inputs are a closed set drawn from the corpus's own vocabulary — read \`eef://interpretation\` for the strand index and how to read the evidence faithfully.`,
  securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  _meta: {
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
  },
} as const;

/**
 * The strict result of `get-eef-evidence`.
 *
 * On success, `structuredContent` is the exact {@link EefEvidenceEnvelope} — NOT
 * widened to the MCP carrier's `Record<string, unknown>`. That erasure is only
 * correct for genuinely-unknown content; this response is fully typed, so its
 * type is preserved here and only widens to the shared `CallToolResult` carrier
 * when stored in the `AGGREGATED_HANDLERS` map. On failure, an `isError` text
 * result (no structured content to type).
 */
type EefEvidenceResult =
  | { content: never[]; structuredContent: EefEvidenceEnvelope; isError?: false }
  | { content: TextContent[]; isError: true };

/** Build the strict `isError` result for a boundary-predicate failure. */
function eefError(message: string): EefEvidenceResult {
  const text: TextContent = { type: 'text', text: message };
  return { content: [text], isError: true };
}

/**
 * Does the evidence-for-move selector set carry at least one selector?
 *
 * The single semantic predicate the flat input schema cannot express (D3): an
 * unscoped `evidence-for-move` is contractually invalid (an empty envelope
 * would imply searched-and-found-none rather than a bounded query).
 */
function hasSelector(selectors: EvidenceForMoveSelectors): boolean {
  return (
    (selectors.strandIds !== undefined && selectors.strandIds.length > 0) ||
    selectors.phase !== undefined ||
    selectors.keyStage !== undefined ||
    selectors.priority !== undefined
  );
}

/**
 * Run `get-eef-evidence`: narrow the closed input with a single schema parse,
 * dispatch on `function`, and return the D5 evidence envelope verbatim as
 * `structuredContent`.
 *
 * Validation is the parse itself — enum membership (including rejection of an
 * unknown strand id) falls out of {@link EEF_EVIDENCE_INPUT}; the only
 * additional predicates are the cross-field requirements D3 places at the
 * handler boundary. Success returns `content: []` with the envelope as
 * `structuredContent` (the owner-ratified structuredContent-only shape);
 * failures return `isError: true`.
 */
export function runEefEvidenceTool(input: unknown): EefEvidenceResult {
  const parsed = EEF_EVIDENCE_INPUT.safeParse(input);
  if (!parsed.success) {
    return eefError(`Invalid get-eef-evidence input: ${parsed.error.message}`);
  }
  const args = parsed.data;

  if (args.function === 'inspect-strand') {
    if (args.strandId === undefined) {
      return eefError("inspect-strand requires 'strandId'.");
    }
    return { content: [], structuredContent: inspectStrand(args.strandId) };
  }

  const selectors: EvidenceForMoveSelectors = {
    strandIds: args.strandIds,
    phase: args.phase,
    keyStage: args.keyStage,
    priority: args.priority,
  };
  if (!hasSelector(selectors)) {
    return eefError(
      'evidence-for-move requires at least one selector: strandIds, phase, keyStage, or priority.',
    );
  }
  return { content: [], structuredContent: evidenceForMove(selectors) };
}

// ─── EGRESS MEMBRANE (ADR-193) ───────────────────────────────────────────────
// Everything above is strict EEF DOMAIN code: exact types derived from the fixed
// `as const` corpus, no `unknown`/`Record`/index-signature/`as`. The function
// below is the single seam where that strict result crosses into the MCP vendor
// TRANSPORT type. Everything that consumes its output (the executor, the auth
// layer, registration) is vendor-facing transport whose currency is the SDK's
// `CallToolResult`.

/**
 * Egress membrane (ADR-193): cross the strict {@link EefEvidenceResult} produced
 * by {@link runEefEvidenceTool} into the vendor's `CallToolResult`.
 *
 * On success the envelope crosses as `structuredContent` via a fresh object
 * (`{ ...envelope }`). That fresh object is structurally assignable to the
 * vendor's `Record<string, unknown>` slot with **no `as` cast, no index
 * signature on the strict domain type, no `any`, and no disabled check** — a
 * fresh object literal *is* a record; the strict interface is the named
 * constraint on that shape; the spread is the one erasure as the value crosses
 * out. `isError` results pass through unchanged. Beyond this function the value
 * is the vendor's; the SDK serialises it to JSON for the calling agent, which is
 * its only consumer (ADR-191).
 */
export function eefEvidenceToCallToolResult(result: EefEvidenceResult): CallToolResult {
  if (result.isError) {
    return { content: result.content, isError: true };
  }
  return { content: [], structuredContent: { ...result.structuredContent } };
}
