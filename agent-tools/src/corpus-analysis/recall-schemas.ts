import type { Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema, patternKindSchema } from './judgment-schemas.js';
import { corroborationClaimSchema } from './real-world-signal.js';

/**
 * Calibration-leg schemas for the large-corpus-analysis method (v2): the recall baselines
 * the run must re-find, the meta stage's per-baseline match judgments, and the meta
 * envelope. Separated from the extraction/adversary schemas (`./judgment-schemas.ts`)
 * because they are a distinct concern consumed by a distinct aggregation module
 * (`./aggregation-recall.ts`). Types flow from the schemas — the schema IS the type;
 * building-block enums are kept private.
 */

const nonEmptyString = z.string().min(1);

/**
 * Baseline population. `emergent` baselines are within Discovery's remit (the headline
 * recall denominator); `single-window` structural defects are out-of-remit and reported
 * separately, never scored as Discovery misses.
 */
const baselinePopulationSchema = z.enum(['emergent', 'single-window']);

const sourceCitationSchema = z.strictObject({
  synthesis: nonEmptyString,
  locator: nonEmptyString,
});

/** BASELINE — one known-present pattern the recall pass must re-find, with its population. */
export const baselineSchema = z.strictObject({
  id: nonEmptyString,
  statement: nonEmptyString,
  kind: patternKindSchema,
  population: baselinePopulationSchema,
  sourceCitations: z.array(sourceCitationSchema).min(1),
});
export type Baseline = z.infer<typeof baselineSchema>;

/**
 * The five re-found gradings (v1 design section 5). `subsumes`, `refines`, and `equal` are
 * strict re-founds (same phenomenon at equal-or-finer grain); `partial` counts only under
 * the lenient reading; `missed` is not re-found.
 */
const recallVerdictSchema = z.enum(['subsumes', 'refines', 'equal', 'partial', 'missed']);
export type RecallVerdict = z.infer<typeof recallVerdictSchema>;

/**
 * RECALL MATCH — the meta stage's atomic per-baseline judgment: did Discovery re-find this
 * baseline, and via which candidate. Invariant: a `missed` baseline has no matched
 * candidate, and every re-found baseline names one.
 */
export const recallMatchSchema = z
  .strictObject({
    baselineId: nonEmptyString,
    verdict: recallVerdictSchema,
    matchedCandidateId: nonEmptyString.optional(),
    note: nonEmptyString,
  })
  .refine((match) => (match.verdict === 'missed') === (match.matchedCandidateId === undefined), {
    error:
      'a missed baseline must have no matchedCandidateId, and a re-found baseline must name one',
  });
export type RecallMatch = z.infer<typeof recallMatchSchema>;

/**
 * META — the meta stage envelope: per-baseline recall matches, per-candidate
 * corroboration claims (the real-world-signal leg consumed by
 * `corroborateAgainstHomes`), and qualitative synthesis prose — and deliberately NO
 * aggregate numbers: the recall fractions, discount, and threshold verdict are all
 * computed downstream. `z.strictObject` is load-bearing — it rejects a smuggled
 * aggregate (the exact shape of the v1 defect, a self-reported recall field), so the
 * LLM cannot even emit the number it once got wrong. This is THE meta stage contract;
 * consumers project the fields they need (recall aggregation reads `recallMatches`,
 * the real-world-signal check reads `corroborationClaims`) — never a narrower parse.
 */
export const metaOutputSchema = z.strictObject({
  recallMatches: z.array(recallMatchSchema),
  corroborationClaims: z.array(corroborationClaimSchema),
  discountNote: nonEmptyString,
  synthesisNotes: z.array(nonEmptyString),
});
export type MetaOutput = z.infer<typeof metaOutputSchema>;

export const parseBaseline = (value: unknown): Result<Baseline, Error> =>
  parseWithSchema({ label: 'recall baseline', schema: baselineSchema, value });

export const parseMetaOutput = (value: unknown): Result<MetaOutput, Error> =>
  parseWithSchema({ label: 'meta output', schema: metaOutputSchema, value });
