import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/**
 * Atomic-judgment contract for the large-corpus-analysis method (v2).
 *
 * The v2 spine, grounded in the first Discovery proving run, is one rule: LLMs judge
 * atomically, deterministic code counts, thresholds, and routes. A map / reduce /
 * validate / meta stage of the harness Workflow emits only local, per-item, typed
 * qualitative judgments. Every count, fraction, threshold, and routing decision is
 * computed in code (see the aggregation modules) from those judgments. No agent is ever
 * asked to produce a number that is a function of more than one item it is also judging
 * — that is exactly the v1 defect, where a meta agent self-reported recall 0.72 while
 * its own per-baseline judgments summed to 0.28 strict and 0.56 lenient.
 *
 * These schemas are that contract. The Workflow sandbox cannot import repo code, so the
 * script mirrors these shapes and a conformance test pins the mirror to this source of
 * truth. Types flow from the schemas — the schema IS the type. Building-block schemas
 * (the enums and citation shapes composed into the top-level judgments) are kept private;
 * only the top-level judgment schemas, the types consumed across modules, and the
 * boundary parsers are exported.
 *
 * Design authority:
 * `.agent/reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md`;
 * the unchanged spine (four conjunctive apophenia tests, three lenses) is in the v1
 * design report `large-corpus-analysis-runbook-design-2026-06-29.md` sections 5 and 8.
 */

const nonEmptyString = z.string().min(1);
const nonNegativeInt = z.number().int().nonnegative();

/** Qualitative confidence an agent attaches to a single judgment. */
const confidenceSchema = z.enum(['low', 'med', 'high']);
export type Confidence = z.infer<typeof confidenceSchema>;

/** The spanning categories a map agent extracts under (v1 design section 5). */
const signalCategorySchema = z.enum([
  'motif',
  'surprise',
  'tension',
  'shift',
  'behavioural-reflex',
]);

/**
 * Discovery pattern kinds (v1 design section 6). `absence` is a negative-space finding
 * whose falsifier differs from a present-pattern's: it must be shown genuinely absent,
 * not merely unsampled.
 */
export const patternKindSchema = z.enum([
  'recurrence',
  'trajectory',
  'relational-lagged',
  'regime',
  'distributional',
  'behavioural',
  'absence',
  'meta',
]);

/** A single grounding citation — a quote anchored to a dated corpus entry. */
const groundingCitationSchema = z.strictObject({
  napkinDate: nonEmptyString,
  quote: nonEmptyString,
});

/**
 * LEAF — one atomic signal a map agent extracts from one time-contiguous window, at high
 * recall. The reduce stage clusters leaves into candidates.
 */
export const leafSignalSchema = z.strictObject({
  id: nonEmptyString,
  window: nonEmptyString,
  category: signalCategorySchema,
  statement: nonEmptyString,
  grounding: z.array(groundingCitationSchema).min(1),
  confidence: confidenceSchema,
});
export type LeafSignal = z.infer<typeof leafSignalSchema>;

/**
 * CANDIDATE — a cross-window emergent pattern (or negative-space finding) from the reduce
 * stage. `isAbsenceClaim` switches the adversary to the absence falsifier. `groundingCount`
 * is descriptive provenance only; the aggregation layer recomputes every number it relies
 * on from `supportingWindows`, never trusting the self-reported count.
 */
export const candidateSchema = z.strictObject({
  id: nonEmptyString,
  pattern: nonEmptyString,
  kind: patternKindSchema,
  isAbsenceClaim: z.boolean(),
  supportingWindows: z.array(nonEmptyString),
  supportingLeafIds: z.array(nonEmptyString),
  groundingCount: nonNegativeInt,
});
export type Candidate = z.infer<typeof candidateSchema>;

/** One apophenia test outcome: did it pass, and how confidently. */
const testJudgmentSchema = z.strictObject({
  pass: z.boolean(),
  confidence: confidenceSchema,
});
export type TestJudgment = z.infer<typeof testJudgmentSchema>;

/**
 * Tier-2 diverse-lens identity. The three lenses are different (not three identical
 * refuters), so their votes are uncorrelated — the property that licenses the simple
 * majority quorum.
 */
const adversaryLensSchema = z.enum(['correctness-grounding', 'base-rate', 'null-reproduction']);
export type AdversaryLens = z.infer<typeof adversaryLensSchema>;

/**
 * VERDICT — one adversary's atomic judgment of one candidate against the four conjunctive
 * apophenia tests (v1 design sections 5 and 8). The LLM emits the four pass/confidence
 * tuples plus an importance rating; code computes the keep/kill/reroute disposition and
 * the Tier-2 borderline trigger. The adversary never emits a disposition.
 */
export const adversaryVerdictSchema = z.strictObject({
  lens: adversaryLensSchema.optional(),
  grounded: testJudgmentSchema,
  baseRateHolds: testJudgmentSchema,
  survivesNull: testJudgmentSchema,
  notArtefact: testJudgmentSchema,
  importance: confidenceSchema,
});
export type AdversaryVerdict = z.infer<typeof adversaryVerdictSchema>;

/** Which apophenia tier a voter was dispatched in. */
const adversaryTierSchema = z.enum(['tier-0', 'tier-1', 'tier-2']);

/**
 * Why a candidate or voter resolved to a held / unavailable state: `retry-cap` (too few
 * voters adjudicated), `quorum-tie` (a dead-even quorum), `lens-collision` (a Tier-2
 * ensemble whose adjudicated voters did not span distinct lenses). The C06
 * single-point-of-failure made explicit.
 */
const unadjudicatedReasonSchema = z.enum(['retry-cap', 'quorum-tie', 'lens-collision']);
export type UnadjudicatedReason = z.infer<typeof unadjudicatedReasonSchema>;

/**
 * VOTER OUTCOME — the orchestrator's deterministic record of one dispatched voter: either
 * an adjudicated verdict, or an availability failure carrying its reason. Tracking an
 * unadjudicated voter as a first-class state (rather than a missing verdict) is what lets
 * the quorum exclude it from its denominator instead of stranding the candidate.
 */
export const voterOutcomeSchema = z.discriminatedUnion('status', [
  z.strictObject({
    status: z.literal('adjudicated'),
    candidateId: nonEmptyString,
    voterId: nonEmptyString,
    tier: adversaryTierSchema,
    verdict: adversaryVerdictSchema,
  }),
  z.strictObject({
    status: z.literal('unadjudicated'),
    candidateId: nonEmptyString,
    voterId: nonEmptyString,
    tier: adversaryTierSchema,
    reason: unadjudicatedReasonSchema,
  }),
]);
export type VoterOutcome = z.infer<typeof voterOutcomeSchema>;

/**
 * Parse a value through a schema at a boundary, returning a `Result` with a prettified
 * error on failure (per the Result discipline — a parse failure is a typed value at the
 * call site, never an invisible throw). The boundary here is reading the Workflow's JSON
 * output back into typed judgments; the aggregation layer consumes already-parsed types.
 * The calibration schemas (`./recall-schemas.ts`) reuse this helper.
 */
export function parseWithSchema<TSchema extends z.ZodType>(input: {
  readonly label: string;
  readonly schema: TSchema;
  readonly value: unknown;
}): Result<z.output<TSchema>, Error> {
  const result = input.schema.safeParse(input.value);
  if (result.success) {
    return ok(result.data);
  }
  return err(new Error(`${input.label} failed validation: ${z.prettifyError(result.error)}`));
}

export const parseLeafSignal = (value: unknown): Result<LeafSignal, Error> =>
  parseWithSchema({ label: 'leaf signal', schema: leafSignalSchema, value });

export const parseCandidate = (value: unknown): Result<Candidate, Error> =>
  parseWithSchema({ label: 'candidate', schema: candidateSchema, value });

export const parseVoterOutcome = (value: unknown): Result<VoterOutcome, Error> =>
  parseWithSchema({ label: 'voter outcome', schema: voterOutcomeSchema, value });
