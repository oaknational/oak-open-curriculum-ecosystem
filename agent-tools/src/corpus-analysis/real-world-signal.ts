import type { Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from './judgment-schemas.js';

/**
 * Real-world-signal close for the large-corpus-analysis method (v2 design change 4).
 *
 * No internal assurance is complete until it closes against a real-world signal: grading
 * only against expectations we authored measures our own assumptions. The recall baseline is
 * our authored expectation; the real-world signal is on disk — several v1 kept patterns had
 * already graduated to pattern/rule files. So the meta stage NAMES, per kept pattern, the
 * on-disk homes that corroborate it (an atomic LLM claim), and this deterministic check
 * verifies each named home actually exists. A claimed home that is absent is surfaced as a
 * discrepancy (the LLM named a home that is not there), never silently trusted.
 */

const nonEmptyString = z.string().min(1);

/**
 * CORROBORATION CLAIM — the meta stage's atomic per-candidate claim that a kept pattern is
 * corroborated by one or more on-disk graduated homes (pattern or rule files). The LLM names
 * the homes; code verifies they exist.
 */
export const corroborationClaimSchema = z.strictObject({
  candidateId: nonEmptyString,
  claimedHomePaths: z.array(nonEmptyString),
});
export type CorroborationClaim = z.infer<typeof corroborationClaimSchema>;

export interface Corroboration {
  readonly candidateId: string;
  /** Claimed homes that genuinely exist on disk — the corroborating real-world signal. */
  readonly corroboratedBy: readonly string[];
  /** Claimed homes absent from disk — a discrepancy to surface, not a corroboration. */
  readonly missingClaims: readonly string[];
  readonly isCorroborated: boolean;
}

/**
 * Verify each candidate's claimed corroborating homes against the set of on-disk home paths
 * (scanned and passed in by the caller, keeping this layer pure). A candidate is corroborated
 * when at least one claimed home exists; named-but-absent homes are reported separately. A
 * candidate with no claims is simply uncorroborated — not all kept patterns have a home, and
 * absence of a home is not a discrepancy.
 */
export function corroborateAgainstHomes(input: {
  readonly claims: readonly CorroborationClaim[];
  readonly existingHomePaths: ReadonlySet<string>;
}): readonly Corroboration[] {
  return input.claims.map((claim): Corroboration => {
    const corroboratedBy = claim.claimedHomePaths.filter((path) =>
      input.existingHomePaths.has(path),
    );
    const missingClaims = claim.claimedHomePaths.filter(
      (path) => !input.existingHomePaths.has(path),
    );
    return {
      candidateId: claim.candidateId,
      corroboratedBy,
      missingClaims,
      isCorroborated: corroboratedBy.length > 0,
    };
  });
}

export const parseCorroborationClaim = (value: unknown): Result<CorroborationClaim, Error> =>
  parseWithSchema({ label: 'corroboration claim', schema: corroborationClaimSchema, value });
