import type { Result } from '@oaknational/result';
import { z } from 'zod';

import { finaliseQuorum } from '../aggregation-adjudication.js';
import {
  adversaryLensSchema,
  adversaryVerdictSchema,
  parseWithSchema,
} from '../judgment-schemas.js';
import type { AdversaryVerdict } from '../judgment-schemas.js';

/**
 * The banked free-tool verdict corpus and its frozen-quorum replay (salvage ws1).
 *
 * @remarks
 * The aborted 2026-07-02 validate runs banked every free-tool voter verdict before the
 * regime change, mapped to candidate ids from the committed reduce checkpoint. This
 * module is that corpus's strict boundary schema plus the offline quorum replay: the
 * lensed (tier-2) verdicts re-enter the FROZEN `finaliseQuorum` exactly as a live
 * ensemble would — never a re-derivation of the quorum math.
 *
 * `opusFreetool` drives the tier-C quorum recompute; `sonnetFreetool` is retained as
 * paired-comparison provenance (same candidates, same prompts, different regime) and is
 * validated but unused by the tier math.
 */

const nonEmptyString = z.string().min(1);

const bankedEntrySchema = <TRegime extends string>(regime: TRegime) =>
  z.strictObject({
    candidateId: nonEmptyString,
    regime: z.literal(regime),
    /** Null marks a tier-0/1 plain voter; a lens marks a tier-2 ensemble member. */
    lens: adversaryLensSchema.nullable(),
    /** The lens lives on the entry, never inside the verdict — a stray inner lens fails. */
    verdict: adversaryVerdictSchema.omit({ lens: true }),
  });

export const bankedFreetoolVerdictsSchema = z.strictObject({
  description: nonEmptyString,
  opusFreetool: z.array(bankedEntrySchema('opus-freetool')),
  sonnetFreetool: z.array(bankedEntrySchema('sonnet-freetool')),
});
export type BankedFreetoolVerdicts = z.infer<typeof bankedFreetoolVerdictsSchema>;
export type BankedFreetoolEntry = BankedFreetoolVerdicts['opusFreetool'][number];

export const parseBankedFreetoolVerdicts = (
  value: unknown,
): Result<BankedFreetoolVerdicts, Error> =>
  parseWithSchema({
    label: 'banked free-tool verdicts',
    schema: bankedFreetoolVerdictsSchema,
    value,
  });

/**
 * The full diverse-lens ensemble size, derived from the lens enum itself. The frozen
 * adjudication module hand-lists the same lenses as `TIER_2_LENSES`; if the enum ever
 * grows, reconcile both in one move so the offline replay and live dispatch agree.
 */
const FULL_ENSEMBLE_SIZE = adversaryLensSchema.options.length;

/** One candidate's replayed quorum: complete ensembles carry the frozen keep verdict. */
export type QuorumOutcome =
  { readonly complete: true; readonly keep: boolean } | { readonly complete: false };

/** Banked entries naming no known candidate — a checkpoint mismatch the caller fails loud on. */
export function unknownBankedCandidateIds(
  entries: readonly BankedFreetoolEntry[],
  candidateIds: ReadonlySet<string>,
): readonly string[] {
  return [...new Set(entries.map((entry) => entry.candidateId))].filter(
    (candidateId) => !candidateIds.has(candidateId),
  );
}

/**
 * Replay the frozen Tier-2 quorum per candidate over the banked opus verdicts. Only the
 * lensed (tier-2) verdicts enter the quorum — the real corpus banks a lens-null tier-0/1
 * voter alongside most ensembles, and feeding it in would trip the lens-collision hold on
 * every candidate. A candidate with fewer lensed verdicts than the full ensemble forms no
 * quorum at all, mirroring the adjudication machine's full-ensemble gate.
 */
export function opusQuorumOutcomes(
  entries: readonly BankedFreetoolEntry[],
): ReadonlyMap<string, QuorumOutcome> {
  const lensedByCandidate = new Map<string, AdversaryVerdict[]>();
  for (const entry of entries) {
    if (entry.lens === null) {
      continue;
    }
    const verdicts = lensedByCandidate.get(entry.candidateId) ?? [];
    verdicts.push({ ...entry.verdict, lens: entry.lens });
    lensedByCandidate.set(entry.candidateId, verdicts);
  }
  const outcomes = new Map<string, QuorumOutcome>();
  for (const [candidateId, verdicts] of lensedByCandidate) {
    if (verdicts.length < FULL_ENSEMBLE_SIZE) {
      outcomes.set(candidateId, { complete: false });
      continue;
    }
    const step = finaliseQuorum(verdicts);
    outcomes.set(candidateId, {
      complete: true,
      keep: step.kind === 'terminal' && step.disposition === 'keep',
    });
  }
  return outcomes;
}
