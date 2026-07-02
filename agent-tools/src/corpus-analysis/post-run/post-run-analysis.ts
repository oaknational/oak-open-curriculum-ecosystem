/**
 * Post-run analysis primitives for the discovery pipeline.
 *
 * @remarks
 * The deterministic legs the post-run driver composes beyond the frozen aggregation
 * modules: the disposition recompute (replay the REAL `adjudicate` over each
 * candidate's recorded voter outcomes and demand a zero diff against the recorded
 * disposition — recompute, never trust), and the additive temporal-coverage report
 * (a longitudinal candidate whose supporting windows do not actually spread across the
 * corpus timeline is flagged for the discovery artefacts). Pure functions, tested here;
 * no aggregation math is touched.
 *
 * @packageDocumentation
 */

import { adjudicate } from '../aggregation-adjudication.js';
import type { Candidate, VoterOutcome } from '../judgment-schemas.js';
import type { Disposition, ValidateResult } from '../workflows/stage-io.js';

/** One recompute comparison: the recorded disposition vs the replayed one. */
export interface DispositionRecompute {
  readonly candidateId: string;
  readonly recorded: Disposition;
  readonly recomputed: Disposition;
  readonly matches: boolean;
}

type ValidateSuccess = Extract<ValidateResult, { ok: true }>;

/**
 * Replay the deterministic state machine over each candidate's recorded voter outcomes
 * and compare with the recorded disposition. Each validate result is replayed
 * independently (a resumed run re-adjudicates its tail from scratch, so a candidate's
 * outcomes live in the result that produced its disposition). A replay that still asks
 * for a dispatch recomputes to `held-for-review` — matching only a recorded hold.
 */
export function recomputeDispositions(
  validateResults: readonly ValidateSuccess[],
): readonly DispositionRecompute[] {
  const recomputes: DispositionRecompute[] = [];
  for (const result of validateResults) {
    const outcomesByCandidate = new Map<string, VoterOutcome[]>();
    for (const outcome of result.voterOutcomes) {
      const existing = outcomesByCandidate.get(outcome.candidateId) ?? [];
      existing.push(outcome);
      outcomesByCandidate.set(outcome.candidateId, existing);
    }
    for (const entry of result.dispositions) {
      const outcomes = outcomesByCandidate.get(entry.candidateId) ?? [];
      const step = adjudicate({ outcomes });
      const recomputed: Disposition =
        step.kind === 'terminal' ? step.disposition : 'held-for-review';
      recomputes.push({
        candidateId: entry.candidateId,
        recorded: entry.disposition,
        recomputed,
        matches: recomputed === entry.disposition,
      });
    }
  }
  return recomputes;
}

/** The longitudinal pattern kinds whose claims are temporal by construction. */
const LONGITUDINAL_KINDS = new Set(['trajectory', 'regime', 'relational-lagged', 'distributional']);

/** One longitudinal candidate's actual window spread. */
export interface TemporalCoverageEntry {
  readonly candidateId: string;
  readonly kind: Candidate['kind'];
  readonly distinctWindows: number;
  readonly earliest: string;
  readonly latest: string;
  /** A single-window "longitudinal" claim cannot span time — flagged for scrutiny. */
  readonly suspect: boolean;
}

/**
 * Report each longitudinal candidate's actual supporting-window spread. Additive — a
 * suspect entry directs scrutiny in the discovery artefacts; it never alters recall or
 * dispositions.
 */
export function temporalCoverageReport(
  candidates: readonly Candidate[],
): readonly TemporalCoverageEntry[] {
  return candidates
    .filter((candidate) => LONGITUDINAL_KINDS.has(candidate.kind))
    .map((candidate) => {
      const windows = [...new Set(candidate.supportingWindows)].sort((a, b) => a.localeCompare(b));
      return {
        candidateId: candidate.id,
        kind: candidate.kind,
        distinctWindows: windows.length,
        earliest: windows[0] ?? '',
        latest: windows.at(-1) ?? '',
        suspect: windows.length < 2,
      };
    });
}
