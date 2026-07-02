import { describe, expect, it } from 'vitest';

import type { Candidate, VoterOutcome } from '../judgment-schemas.js';
import type { ValidateResult } from '../workflows/stage-io.js';
import { recomputeDispositions, temporalCoverageReport } from './post-run-analysis.js';

/**
 * The recompute leg proves recorded dispositions against the deterministic state
 * machine — the run's trustworthiness rests on a zero diff, so the recompute must catch
 * a tampered or mis-recorded disposition. The temporal report directs discovery
 * scrutiny at longitudinal claims that cannot actually span time.
 */

const passingVerdict = {
  grounded: { pass: true, confidence: 'high' },
  baseRateHolds: { pass: true, confidence: 'high' },
  survivesNull: { pass: true, confidence: 'high' },
  notArtefact: { pass: true, confidence: 'high' },
  importance: 'med',
} as const;

function adjudicated(
  candidateId: string,
  tier: VoterOutcome['tier'],
  voterId: string,
): VoterOutcome {
  return { status: 'adjudicated', candidateId, voterId, tier, verdict: passingVerdict };
}

function validateSuccess(
  dispositions: readonly {
    candidateId: string;
    disposition: 'keep' | 'kill' | 'reroute' | 'held-for-review';
  }[],
  voterOutcomes: readonly VoterOutcome[],
): Extract<ValidateResult, { ok: true }> {
  return {
    ok: true,
    validateComplete: true,
    resolvedCandidateIds: dispositions
      .filter((entry) => entry.disposition !== 'held-for-review')
      .map((entry) => entry.candidateId),
    incompleteCandidateIds: [],
    missingCandidateIds: [],
    dispositions: dispositions.map((entry) => ({ ...entry, reason: null })),
    voterOutcomes: [...voterOutcomes],
  };
}

describe('recomputeDispositions', () => {
  it('matches a clean tier-0 + tier-1 keep', () => {
    const result = validateSuccess(
      [{ candidateId: 'C01', disposition: 'keep' }],
      [adjudicated('C01', 'tier-0', 'C01:t0'), adjudicated('C01', 'tier-1', 'C01:t1')],
    );
    expect(recomputeDispositions([result])).toEqual([
      { candidateId: 'C01', recorded: 'keep', recomputed: 'keep', matches: true },
    ]);
  });

  it('catches a recorded disposition the outcomes do not support (the tamper case)', () => {
    const result = validateSuccess(
      [{ candidateId: 'C01', disposition: 'kill' }],
      [adjudicated('C01', 'tier-0', 'C01:t0'), adjudicated('C01', 'tier-1', 'C01:t1')],
    );
    const recomputes = recomputeDispositions([result]);
    expect(recomputes[0]?.matches).toBe(false);
    expect(recomputes[0]?.recomputed).toBe('keep');
  });

  it('recomputes an incomplete outcome set to held-for-review (a mid-dispatch replay)', () => {
    const result = validateSuccess(
      [{ candidateId: 'C01', disposition: 'held-for-review' }],
      [adjudicated('C01', 'tier-0', 'C01:t0')],
    );
    // tier-0 keep with no tier-1 outcome replays to a dispatch step → held.
    expect(recomputeDispositions([result])[0]).toEqual({
      candidateId: 'C01',
      recorded: 'held-for-review',
      recomputed: 'held-for-review',
      matches: true,
    });
  });

  it('replays each validate result independently (resumed runs re-adjudicate their tail)', () => {
    const first = validateSuccess([{ candidateId: 'C01', disposition: 'held-for-review' }], []);
    const tail = validateSuccess(
      [{ candidateId: 'C01', disposition: 'keep' }],
      [adjudicated('C01', 'tier-0', 'C01:t0'), adjudicated('C01', 'tier-1', 'C01:t1')],
    );
    const recomputes = recomputeDispositions([first, tail]);
    expect(recomputes.map((entry) => entry.matches)).toEqual([true, true]);
  });
});

describe('temporalCoverageReport', () => {
  const base: Candidate = {
    id: 'C01',
    pattern: 'p',
    kind: 'trajectory',
    isAbsenceClaim: false,
    supportingWindows: ['w03', 'w01', 'w12'],
    supportingLeafIds: [],
    groundingCount: 3,
  };

  it('reports each longitudinal candidate with its actual window spread', () => {
    expect(temporalCoverageReport([base])).toEqual([
      {
        candidateId: 'C01',
        kind: 'trajectory',
        distinctWindows: 3,
        earliest: 'w01',
        latest: 'w12',
        suspect: false,
      },
    ]);
  });

  it('flags a single-window longitudinal claim as suspect', () => {
    const single = {
      ...base,
      id: 'C02',
      kind: 'regime' as const,
      supportingWindows: ['w05', 'w05'],
    };
    expect(temporalCoverageReport([single])[0]?.suspect).toBe(true);
  });

  it('ignores non-longitudinal kinds', () => {
    expect(temporalCoverageReport([{ ...base, kind: 'recurrence' }])).toEqual([]);
  });
});
