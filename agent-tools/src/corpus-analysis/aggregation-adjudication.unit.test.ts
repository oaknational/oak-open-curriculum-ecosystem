import { describe, expect, it } from 'vitest';

import { adjudicate, type AdjudicationStep } from './aggregation-adjudication.js';
import type {
  AdversaryLens,
  AdversaryVerdict,
  Confidence,
  VoterOutcome,
} from './judgment-schemas.js';

function test(pass: boolean, confidence: Confidence = 'high') {
  return { pass, confidence };
}

function verdict(overrides: Partial<AdversaryVerdict> = {}): AdversaryVerdict {
  return {
    grounded: test(true),
    baseRateHolds: test(true),
    survivesNull: test(true),
    notArtefact: test(true),
    importance: 'med',
    ...overrides,
  };
}

function adjudicated(
  tier: VoterOutcome['tier'],
  voterId: string,
  verdictValue: AdversaryVerdict,
): VoterOutcome {
  return { status: 'adjudicated', candidateId: 'c1', voterId, tier, verdict: verdictValue };
}

/** A Tier-2 voter carrying its diverse lens — the panel must span distinct lenses. */
function tier2(lens: AdversaryLens, verdictValue: AdversaryVerdict): VoterOutcome {
  return adjudicated('tier-2', lens, { ...verdictValue, lens });
}

const LENSES: readonly AdversaryLens[] = [
  'correctness-grounding',
  'base-rate',
  'null-reproduction',
];

function unadjudicated(tier: VoterOutcome['tier'], voterId: string): VoterOutcome {
  return { status: 'unadjudicated', candidateId: 'c1', voterId, tier, reason: 'retry-cap' };
}

const borderlineKeep = verdict({ grounded: test(true, 'low') });

describe('adjudicate', () => {
  it('dispatches a single Tier-0 voter when no outcomes exist yet', () => {
    expect(adjudicate({ outcomes: [] })).toEqual<AdjudicationStep>({
      kind: 'dispatch',
      tier: 'tier-0',
      voterCount: 1,
    });
  });

  it('escalates a Tier-0 kill to the Tier-2 diverse-lens quorum — never a terminal discard on one voter', () => {
    const outcomes = [adjudicated('tier-0', 'v0', verdict({ grounded: test(false) }))];
    // Only a diverse-lens quorum may kill (conserve by default); a lone Tier-0 kill is a screen.
    expect(adjudicate({ outcomes })).toMatchObject({ tier: 'tier-2', voterCount: 3 });
  });

  it('dispatches a Tier-1 confirmer after a clean Tier-0 keep', () => {
    const outcomes = [adjudicated('tier-0', 'v0', verdict())];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'dispatch',
      tier: 'tier-1',
      voterCount: 1,
    });
  });

  it('keeps when Tier-0 and the Tier-1 confirmer both keep', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', verdict()),
      adjudicated('tier-1', 'v1', verdict()),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'keep',
    });
  });

  it('escalates to the Tier-2 ensemble on a lone Tier-1 dissent', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', verdict()),
      adjudicated('tier-1', 'v1', verdict({ survivesNull: test(false) })),
    ];
    expect(adjudicate({ outcomes })).toMatchObject({ tier: 'tier-2', voterCount: 3 });
  });

  it('escalates a borderline Tier-0 keep straight to Tier 2', () => {
    const outcomes = [adjudicated('tier-0', 'v0', borderlineKeep)];
    expect(adjudicate({ outcomes })).toMatchObject({ tier: 'tier-2', voterCount: 3 });
  });

  it('escalates a Tier-0 reroute to Tier 2 to confirm anomaly vs noise', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', verdict({ baseRateHolds: test(false), importance: 'high' })),
    ];
    expect(adjudicate({ outcomes })).toMatchObject({ tier: 'tier-2', voterCount: 3 });
  });

  it('escalates to Tier 2 when the Tier-1 confirmer is unadjudicated (C06 fix)', () => {
    const outcomes = [adjudicated('tier-0', 'v0', verdict()), unadjudicated('tier-1', 'v1')];
    expect(adjudicate({ outcomes })).toMatchObject({ tier: 'tier-2' });
  });

  it('gathers a Tier-1 voter when the Tier-0 voter is unadjudicated', () => {
    const outcomes = [unadjudicated('tier-0', 'v0')];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'dispatch',
      tier: 'tier-1',
      voterCount: 1,
    });
  });

  it('does not decide a Tier-2 panel until the full ensemble reports (one vote in)', () => {
    const outcomes = [adjudicated('tier-0', 'v0', borderlineKeep), tier2(LENSES[0], verdict())];
    expect(adjudicate({ outcomes })).toMatchObject({
      kind: 'dispatch',
      tier: 'tier-2',
      voterCount: 2,
    });
  });

  it('does not lock a keep on a partial Tier-2 panel (two keeps in, third unseen)', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[1], verdict()),
    ];
    const step = adjudicate({ outcomes });
    expect(step.kind).toBe('dispatch');
    expect(step).toMatchObject({ tier: 'tier-2', voterCount: 1 });
  });

  it('keeps via a Tier-2 majority of keeps across distinct lenses', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[1], verdict()),
      tier2(LENSES[2], verdict({ survivesNull: test(false) })),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'keep',
    });
  });

  it('finalises on the adjudicated voters when one of the full panel is unavailable', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[1], verdict()),
      unadjudicated('tier-2', 'gone'),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'keep',
    });
  });

  it('holds a lens-collision panel for review, never keeping on correlated votes', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[0], verdict()),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'held-for-review',
      reason: 'lens-collision',
    });
  });

  it('kills when the Tier-2 ensemble mostly refutes', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[1], verdict({ grounded: test(false) })),
      tier2(LENSES[2], verdict({ grounded: test(false) })),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'kill',
    });
  });

  it('holds a Tier-2 dead tie for human review (quorum-tie), never auto-keeping', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      tier2(LENSES[1], verdict({ grounded: test(false) })),
      unadjudicated('tier-2', 'gone'),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'held-for-review',
      reason: 'quorum-tie',
    });
  });

  it('holds for review when fewer than two Tier-2 voters adjudicate', () => {
    const outcomes = [
      adjudicated('tier-0', 'v0', borderlineKeep),
      tier2(LENSES[0], verdict()),
      unadjudicated('tier-2', 'b'),
      unadjudicated('tier-2', 'c'),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'held-for-review',
      reason: 'retry-cap',
    });
  });

  it('reroutes when the Tier-2 ensemble refutes a keep but supports an anomaly', () => {
    const reroute = verdict({ baseRateHolds: test(false), importance: 'high' });
    const outcomes = [
      adjudicated('tier-0', 'v0', reroute),
      tier2(LENSES[0], reroute),
      tier2(LENSES[1], reroute),
      tier2(LENSES[2], verdict({ grounded: test(false) })),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'reroute',
    });
  });

  it('kills a refuted candidate whose lone anomaly support is outweighed by outright kills', () => {
    const reroute = verdict({ baseRateHolds: test(false), importance: 'high' });
    const outcomes = [
      adjudicated('tier-0', 'v0', reroute),
      tier2(LENSES[0], reroute),
      tier2(LENSES[1], verdict({ grounded: test(false) })),
      tier2(LENSES[2], verdict({ grounded: test(false) })),
    ];
    expect(adjudicate({ outcomes })).toEqual<AdjudicationStep>({
      kind: 'terminal',
      disposition: 'kill',
    });
  });
});
