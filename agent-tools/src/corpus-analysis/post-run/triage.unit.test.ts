import { describe, expect, it } from 'vitest';

import type { AdversaryVerdict, Candidate, VoterOutcome } from '../judgment-schemas.js';
import type { MetaOutput } from '../recall-schemas.js';
import type { Corroboration } from '../real-world-signal.js';
import type { ValidateResult } from '../workflows/stage-io.js';
import type { TemporalCoverageEntry } from './post-run-analysis.js';
import { triageDispositions } from './triage.js';

/**
 * The triage leg turns a surviving candidate's full deterministic evidence into a
 * strength-of-evidence band for a later manual review round. The banding must be a pure
 * function of recorded evidence (PDR-122: agents judge atomically, code computes
 * aggregates) — these tests describe the band each evidence shape earns and the
 * conservative tie-breaks (narrow quorums, low-confidence passes, suspect longitudinal
 * claims, and anomaly reroutes all route review-first).
 */

const highPass = { pass: true, confidence: 'high' } as const;
const medPass = { pass: true, confidence: 'med' } as const;
const lowPass = { pass: true, confidence: 'low' } as const;

const allHighVerdict: AdversaryVerdict = {
  grounded: highPass,
  baseRateHolds: highPass,
  survivesNull: highPass,
  notArtefact: highPass,
  importance: 'med',
};

const killVerdict: AdversaryVerdict = {
  grounded: { pass: false, confidence: 'high' },
  baseRateHolds: highPass,
  survivesNull: highPass,
  notArtefact: highPass,
  importance: 'med',
};

function adjudicated(
  candidateId: string,
  tier: VoterOutcome['tier'],
  voterId: string,
  verdict: AdversaryVerdict,
): VoterOutcome {
  return { status: 'adjudicated', candidateId, voterId, tier, verdict };
}

function tier2Trio(candidateId: string, verdicts: readonly AdversaryVerdict[]): VoterOutcome[] {
  const lenses = ['correctness-grounding', 'base-rate', 'null-reproduction'] as const;
  return verdicts.map((verdict, index) =>
    adjudicated(candidateId, 'tier-2', `${candidateId}:t2:${index}`, {
      ...verdict,
      lens: lenses[index],
    }),
  );
}

function candidate(id: string, overrides?: Partial<Candidate>): Candidate {
  return {
    id,
    pattern: `pattern ${id}`,
    kind: 'recurrence',
    isAbsenceClaim: false,
    supportingWindows: ['w01', 'w05'],
    supportingLeafIds: [],
    groundingCount: 4,
    ...overrides,
  };
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

const emptyMeta: MetaOutput = {
  recallMatches: [],
  corroborationClaims: [],
  discountNote: 'none',
  synthesisNotes: ['none'],
};

function triageOne(input: {
  candidateEntry: Candidate;
  results: readonly Extract<ValidateResult, { ok: true }>[];
  meta?: MetaOutput;
  corroborations?: readonly Corroboration[];
  temporal?: readonly TemporalCoverageEntry[];
}) {
  return triageDispositions({
    candidates: [input.candidateEntry],
    validateResults: input.results,
    meta: input.meta ?? emptyMeta,
    temporal: input.temporal ?? [],
    corroborations: input.corroborations ?? [],
  });
}

describe('triageDispositions banding', () => {
  it('bands a multi-window clean keep with all-high confidences as strong', () => {
    const entries = triageOne({
      candidateEntry: candidate('C01'),
      results: [
        validateSuccess(
          [{ candidateId: 'C01', disposition: 'keep' }],
          [
            adjudicated('C01', 'tier-0', 'C01:t0', allHighVerdict),
            adjudicated('C01', 'tier-1', 'C01:t1', allHighVerdict),
          ],
        ),
      ],
    });
    expect(entries).toEqual([
      {
        candidateId: 'C01',
        disposition: 'keep',
        kind: 'recurrence',
        distinctWindows: 2,
        groundingCount: 4,
        path: 'clean-keep',
        quorumMargin: null,
        minTestConfidence: 'high',
        medianTestConfidence: 'high',
        importance: 'med',
        recallMatched: false,
        novel: true,
        longitudinalSuspect: false,
        band: 'strong',
        reviewFirstTriggers: [],
      },
    ]);
  });

  it('bands a unanimous high-confidence quorum keep as strong', () => {
    const entries = triageOne({
      candidateEntry: candidate('C02'),
      results: [
        validateSuccess(
          [{ candidateId: 'C02', disposition: 'keep' }],
          tier2Trio('C02', [allHighVerdict, allHighVerdict, allHighVerdict]),
        ),
      ],
    });
    expect(entries[0]?.path).toBe('quorum-keep');
    expect(entries[0]?.quorumMargin).toBe(3);
    expect(entries[0]?.band).toBe('strong');
  });

  it('routes a 2-1 quorum keep review-first as a narrow quorum', () => {
    const entries = triageOne({
      candidateEntry: candidate('C03'),
      results: [
        validateSuccess(
          [{ candidateId: 'C03', disposition: 'keep' }],
          tier2Trio('C03', [allHighVerdict, allHighVerdict, killVerdict]),
        ),
      ],
    });
    expect(entries[0]?.quorumMargin).toBe(1);
    expect(entries[0]?.band).toBe('review-first');
    expect(entries[0]?.reviewFirstTriggers).toContain('narrow-quorum');
  });

  it('routes any low-confidence pass review-first', () => {
    const lowConfidenceKeep: AdversaryVerdict = { ...allHighVerdict, survivesNull: lowPass };
    const entries = triageOne({
      candidateEntry: candidate('C04'),
      results: [
        validateSuccess(
          [{ candidateId: 'C04', disposition: 'keep' }],
          tier2Trio('C04', [lowConfidenceKeep, allHighVerdict, allHighVerdict]),
        ),
      ],
    });
    expect(entries[0]?.minTestConfidence).toBe('low');
    expect(entries[0]?.band).toBe('review-first');
    expect(entries[0]?.reviewFirstTriggers).toContain('low-confidence-pass');
  });

  it('routes a single-window longitudinal claim review-first as suspect', () => {
    const entries = triageOne({
      candidateEntry: candidate('C05', { kind: 'trajectory', supportingWindows: ['w07', 'w07'] }),
      results: [
        validateSuccess(
          [{ candidateId: 'C05', disposition: 'keep' }],
          [
            adjudicated('C05', 'tier-0', 'C05:t0', allHighVerdict),
            adjudicated('C05', 'tier-1', 'C05:t1', allHighVerdict),
          ],
        ),
      ],
      temporal: [
        {
          candidateId: 'C05',
          kind: 'trajectory',
          distinctWindows: 1,
          earliest: 'w07',
          latest: 'w07',
          suspect: true,
        },
      ],
    });
    expect(entries[0]?.longitudinalSuspect).toBe(true);
    expect(entries[0]?.band).toBe('review-first');
    expect(entries[0]?.reviewFirstTriggers).toContain('longitudinal-suspect');
  });

  it('routes every anomaly reroute review-first', () => {
    const rerouteVerdict: AdversaryVerdict = {
      ...allHighVerdict,
      baseRateHolds: { pass: false, confidence: 'high' },
      importance: 'high',
    };
    const entries = triageOne({
      candidateEntry: candidate('C06'),
      results: [
        validateSuccess(
          [{ candidateId: 'C06', disposition: 'reroute' }],
          tier2Trio('C06', [rerouteVerdict, rerouteVerdict, killVerdict]),
        ),
      ],
    });
    expect(entries[0]?.path).toBe('quorum-reroute');
    // Reroute margin is reroute-votes minus kills: 2 reroutes, 1 kill.
    expect(entries[0]?.quorumMargin).toBe(1);
    expect(entries[0]?.band).toBe('review-first');
    expect(entries[0]?.reviewFirstTriggers).toContain('reroute');
  });

  it('accumulates every firing trigger — a narrow quorum with a low-confidence pass reports both', () => {
    const lowConfidenceKeep: AdversaryVerdict = { ...allHighVerdict, grounded: lowPass };
    const entries = triageOne({
      candidateEntry: candidate('C20'),
      results: [
        validateSuccess(
          [{ candidateId: 'C20', disposition: 'keep' }],
          tier2Trio('C20', [lowConfidenceKeep, allHighVerdict, killVerdict]),
        ),
      ],
    });
    expect(entries[0]?.reviewFirstTriggers).toEqual(['narrow-quorum', 'low-confidence-pass']);
    expect(entries[0]?.band).toBe('review-first');
  });

  it('bands a 2-0 quorum keep moderate — a quorum with an unavailable voter never bands strong', () => {
    const twoAdjudicated = tier2Trio('C21', [allHighVerdict, allHighVerdict]);
    const unavailable: VoterOutcome = {
      status: 'unadjudicated',
      candidateId: 'C21',
      voterId: 'C21:t2:2',
      tier: 'tier-2',
      reason: 'retry-cap',
    };
    const entries = triageOne({
      candidateEntry: candidate('C21'),
      results: [
        validateSuccess(
          [{ candidateId: 'C21', disposition: 'keep' }],
          [...twoAdjudicated, unavailable],
        ),
      ],
    });
    expect(entries[0]?.path).toBe('quorum-keep');
    expect(entries[0]?.quorumMargin).toBe(2);
    expect(entries[0]?.band).toBe('moderate');
  });

  it('recomputes window spread — duplicate self-reported windows earn no cross-window credit', () => {
    const entries = triageOne({
      candidateEntry: candidate('C22', { supportingWindows: ['w07', 'w07'] }),
      results: [
        validateSuccess(
          [{ candidateId: 'C22', disposition: 'keep' }],
          [
            adjudicated('C22', 'tier-0', 'C22:t0', allHighVerdict),
            adjudicated('C22', 'tier-1', 'C22:t1', allHighVerdict),
          ],
        ),
      ],
    });
    expect(entries[0]?.distinctWindows).toBe(1);
    expect(entries[0]?.band).toBe('moderate');
  });

  it('routes a keep with no recorded testimony review-first — empty evidence reads as low', () => {
    const entries = triageOne({
      candidateEntry: candidate('C23'),
      results: [validateSuccess([{ candidateId: 'C23', disposition: 'keep' }], [])],
    });
    expect(entries[0]?.minTestConfidence).toBe('low');
    expect(entries[0]?.band).toBe('review-first');
    expect(entries[0]?.reviewFirstTriggers).toContain('low-confidence-pass');
  });

  it('bands a single-window clean keep moderate — never strong without cross-window spread', () => {
    const entries = triageOne({
      candidateEntry: candidate('C07', { supportingWindows: ['w09'] }),
      results: [
        validateSuccess(
          [{ candidateId: 'C07', disposition: 'keep' }],
          [
            adjudicated('C07', 'tier-0', 'C07:t0', allHighVerdict),
            adjudicated('C07', 'tier-1', 'C07:t1', allHighVerdict),
          ],
        ),
      ],
    });
    expect(entries[0]?.band).toBe('moderate');
    expect(entries[0]?.reviewFirstTriggers).toEqual([]);
  });

  it('bands a med-confidence clean keep moderate', () => {
    const medKeep: AdversaryVerdict = { ...allHighVerdict, notArtefact: medPass };
    const entries = triageOne({
      candidateEntry: candidate('C08'),
      results: [
        validateSuccess(
          [{ candidateId: 'C08', disposition: 'keep' }],
          [
            adjudicated('C08', 'tier-0', 'C08:t0', allHighVerdict),
            adjudicated('C08', 'tier-1', 'C08:t1', medKeep),
          ],
        ),
      ],
    });
    expect(entries[0]?.minTestConfidence).toBe('med');
    expect(entries[0]?.band).toBe('moderate');
  });
});

describe('triageDispositions evidence assembly', () => {
  it('excludes kills and holds — triage covers only surviving candidates', () => {
    const kept = candidate('C10');
    const killed = candidate('C11');
    const held = candidate('C12');
    const entries = triageDispositions({
      candidates: [kept, killed, held],
      validateResults: [
        validateSuccess(
          [
            { candidateId: 'C10', disposition: 'keep' },
            { candidateId: 'C11', disposition: 'kill' },
            { candidateId: 'C12', disposition: 'held-for-review' },
          ],
          [
            adjudicated('C10', 'tier-0', 'C10:t0', allHighVerdict),
            adjudicated('C10', 'tier-1', 'C10:t1', allHighVerdict),
            ...tier2Trio('C11', [killVerdict, killVerdict, killVerdict]),
          ],
        ),
      ],
      meta: emptyMeta,
      temporal: [],
      corroborations: [],
    });
    expect(entries.map((entry) => entry.candidateId)).toEqual(['C10']);
  });

  it('takes the resolving result on a resumed run — the last terminal disposition wins', () => {
    // Both results are TERMINAL keeps with different quorum shapes: only a last-wins
    // implementation reads the narrow 2-1 margin; a first-wins one would read 3-0.
    const first = validateSuccess(
      [{ candidateId: 'C13', disposition: 'keep' }],
      tier2Trio('C13', [allHighVerdict, allHighVerdict, allHighVerdict]),
    );
    const resumed = validateSuccess(
      [{ candidateId: 'C13', disposition: 'keep' }],
      tier2Trio('C13', [allHighVerdict, allHighVerdict, killVerdict]),
    );
    const entries = triageOne({ candidateEntry: candidate('C13'), results: [first, resumed] });
    expect(entries[0]?.path).toBe('quorum-keep');
    expect(entries[0]?.quorumMargin).toBe(1);
    expect(entries[0]?.band).toBe('review-first');
  });

  it('never resurrects a held candidate — a hold after a keep does not supersede it', () => {
    const kept = validateSuccess(
      [{ candidateId: 'C16', disposition: 'keep' }],
      tier2Trio('C16', [allHighVerdict, allHighVerdict, allHighVerdict]),
    );
    const heldLater = validateSuccess([{ candidateId: 'C16', disposition: 'held-for-review' }], []);
    const entries = triageOne({ candidateEntry: candidate('C16'), results: [kept, heldLater] });
    expect(entries[0]?.quorumMargin).toBe(3);
  });

  it('excludes a candidate whose keep is superseded by a later kill', () => {
    const kept = validateSuccess(
      [{ candidateId: 'C17', disposition: 'keep' }],
      tier2Trio('C17', [allHighVerdict, allHighVerdict, allHighVerdict]),
    );
    const killedLater = validateSuccess(
      [{ candidateId: 'C17', disposition: 'kill' }],
      tier2Trio('C17', [killVerdict, killVerdict, killVerdict]),
    );
    const entries = triageOne({ candidateEntry: candidate('C17'), results: [kept, killedLater] });
    expect(entries).toEqual([]);
  });

  it('marks a re-found baseline recall-matched while staying novel without an on-disk home', () => {
    const meta: MetaOutput = {
      ...emptyMeta,
      recallMatches: [
        { baselineId: 'B01', verdict: 'equal', matchedCandidateId: 'C14', note: 'refound' },
      ],
    };
    const entries = triageOne({
      candidateEntry: candidate('C14'),
      results: [
        validateSuccess(
          [{ candidateId: 'C14', disposition: 'keep' }],
          [
            adjudicated('C14', 'tier-0', 'C14:t0', allHighVerdict),
            adjudicated('C14', 'tier-1', 'C14:t1', allHighVerdict),
          ],
        ),
      ],
      meta,
    });
    expect(entries[0]?.recallMatched).toBe(true);
    expect(entries[0]?.novel).toBe(true);
  });

  it('marks a corroborated candidate not novel independently of recall matching', () => {
    const corroborations: Corroboration[] = [
      {
        candidateId: 'C18',
        corroboratedBy: ['.agent/rules/some-rule.md'],
        missingClaims: [],
        isCorroborated: true,
      },
    ];
    const entries = triageOne({
      candidateEntry: candidate('C18'),
      results: [
        validateSuccess(
          [{ candidateId: 'C18', disposition: 'keep' }],
          [
            adjudicated('C18', 'tier-0', 'C18:t0', allHighVerdict),
            adjudicated('C18', 'tier-1', 'C18:t1', allHighVerdict),
          ],
        ),
      ],
      corroborations,
    });
    expect(entries[0]?.recallMatched).toBe(false);
    expect(entries[0]?.novel).toBe(false);
  });

  it('takes the lower-middle median on an even confidence count (conservative)', () => {
    const medKeep: AdversaryVerdict = {
      grounded: medPass,
      baseRateHolds: medPass,
      survivesNull: medPass,
      notArtefact: medPass,
      importance: 'low',
    };
    const entries = triageOne({
      candidateEntry: candidate('C15'),
      results: [
        validateSuccess(
          [{ candidateId: 'C15', disposition: 'keep' }],
          [
            adjudicated('C15', 'tier-0', 'C15:t0', allHighVerdict),
            adjudicated('C15', 'tier-1', 'C15:t1', medKeep),
          ],
        ),
      ],
    });
    // Eight passes: four med, four high → lower-middle median is med.
    expect(entries[0]?.medianTestConfidence).toBe('med');
    // Importance across the two voters: low, med → lower-middle is low.
    expect(entries[0]?.importance).toBe('low');
  });
});
