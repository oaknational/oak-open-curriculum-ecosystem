/**
 * `get-eef-evidence` — bounded-query graph tool over the EEF Teaching and
 * Learning Toolkit corpus.
 *
 * A NEW shape within the aggregated-tools family. Unlike the open-input tools
 * (`search`, `fetch`) it takes ONLY closed, finite, compile-time-known input —
 * every selector is a `z.enum` over the corpus's own finite domains, so the
 * schema IS the input contract and there is no open content to validate or
 * interpret. Like the anchored curriculum graph tools (`get-misconception-graph`,
 * `get-prior-knowledge-graph`) it answers a BOUNDED query rather than
 * returning everything. The handler is
 * therefore a thin parse-and-dispatch over the D5 graph bindings that returns
 * the evidence envelope verbatim — zero transformation, the corpus citation
 * provenance emitted as authored (ADR-191: the data surface is deterministic;
 * the agent is the only reasoner). The egress membrane emits the family's
 * dual shape via `formatToolResponse` (the MCP spec SHOULD), so the envelope
 * renders in content-block-only AND structuredContent-only clients (owner
 * reversal 2026-06-11 of the D6 structuredContent-only ratification, on live
 * client-matrix evidence — 2026-06-11 snagging plan S1).
 *
 * @see `@oaknational/graph-corpus-sdk/eef-strands` — the D5 query bindings and
 *   the finite input domains.
 * @see ADR-191 (no server-side ranking/scoring), ADR-179 (no MCP types in the
 *   graph substrate; the input enums are typed FROM the corpus domains here, in
 *   the consumer layer).
 */

import type { TextContent } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  EEF_STRAND_IDS,
  OBSERVED_PHASES,
  OBSERVED_KEY_STAGES,
  OBSERVED_PRIORITIES,
  inspectStrand,
  evidenceForMove,
  evidenceForMoveHeadlines,
  type EvidenceForMoveSelectors,
  type EefEvidenceEnvelope,
  type EefStrandHeadline,
} from '@oaknational/graph-corpus-sdk/eef-strands';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { summariseEefEnvelope } from './aggregated-eef-evidence-summaries.js';

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
  detail: z
    .enum(['full', 'headline'])
    .optional()
    .describe(
      "evidence-for-move: 'full' (default) returns the complete strands; 'headline' returns a bounded list — identity, the impact-for-cost headline metrics, tags, and the EEF page — to scan, then drill a chosen strand with inspect-strand. Ignored by inspect-strand.",
    ),
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
- 'evidence-for-move': the strands matching a pedagogical context — any of \`phase\`, \`keyStage\`, \`priority\`, or explicit \`strandIds\`. At least one selector is required. Pass \`detail: 'headline'\` to scan a bounded list (identity, headline metrics, tags, EEF page), then drill a chosen strand with 'inspect-strand'.

Use this when the teacher asks for the evidence behind an approach, or when you are already adapting, combining, or framing Oak material pedagogically. State a terse rationale first (e.g. "EEF because: <pedagogical choice>").

Do NOT use for plain curriculum retrieval (use 'search'/'fetch'), for guaranteed-outcome claims, for individual-pupil causal claims, or to make a teacher-replacing selection. The evidence is population-level; carry its caveats and attribution into anything drafted from it.

Inputs are a closed set drawn from the corpus's own vocabulary. Axis filters (\`phase\`/\`keyStage\`/\`priority\`) match only the strands the corpus tags for school context — they focus the result, they do not bound coverage, and a missing tag is not evidence of inapplicability. The result's \`answerType\` says which it is: 'strand-lookup' (exactly the strands you named, complete) or 'context-subset' (the corpus-curated, non-exhaustive axis match). Use \`eef://interpretation\` for the full strand index and how to read the evidence faithfully.`,
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
 * On success, `envelope` is the exact {@link EefEvidenceEnvelope} — NOT widened
 * to the MCP carrier's `Record<string, unknown>` — and `summary` is its
 * deterministic one-line projection (built where `detail` is statically
 * known). The success shape is pure domain: transport fields (content blocks,
 * decorations) are the egress membrane's concern. On failure, an `isError`
 * text result (no envelope to type).
 *
 * The success union collapses to `EefEvidenceEnvelope<EefStrandHeadline>`
 * (`EefStrand` is assignable to `EefStrandHeadline`) and adds no static
 * information; kept DELIBERATELY (owner decision, 2026-06-09) as an egress
 * transport shape — the sole consumer is the ADR-193 membrane, then JSON,
 * then the calling agent, which gets the full runtime data regardless.
 * Full-member precision for TypeScript consumers lives in the bindings.
 */
export type EefEvidenceResult =
  | {
      summary: string;
      envelope: EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>;
      isError?: false;
    }
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
 * dispatch on `function`, and return the D5 evidence envelope verbatim with
 * its deterministic summary.
 *
 * Validation is the parse itself — enum membership (including rejection of an
 * unknown strand id) falls out of {@link EEF_EVIDENCE_INPUT}; the only
 * additional predicates are the cross-field requirements D3 places at the
 * handler boundary. The summary is built here, at the dispatch sites, because
 * this is the only place `detail` (full vs headline) is statically known.
 * Failures return `isError: true`.
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
    const envelope = inspectStrand(args.strandId);
    return { summary: summariseEefEnvelope(envelope, 'full'), envelope };
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
  const detail = args.detail === 'headline' ? ('headline' as const) : ('full' as const);
  const envelope =
    detail === 'headline' ? evidenceForMoveHeadlines(selectors) : evidenceForMove(selectors);
  return { summary: summariseEefEnvelope(envelope, detail), envelope };
}

// The egress membrane (ADR-193) lives in `eef-evidence-egress.ts` — the single
// seam where this module's strict domain result crosses into the MCP vendor
// transport type.
