import { describe, expect, it } from 'vitest';

import { findRecallIntegrityViolations } from './aggregation-recall.js';
import { RECALL_BASELINES } from './recall-baseline-fixture.js';
import { baselineSchema } from './recall-schemas.js';

describe('RECALL_BASELINES fixture', () => {
  it('parses every baseline through the strict schema', () => {
    for (const baseline of RECALL_BASELINES) {
      expect(baselineSchema.safeParse(baseline).success).toBe(true);
    }
  });

  it('pins eighteen baselines split ten emergent / eight single-window', () => {
    expect(RECALL_BASELINES).toHaveLength(18);
    const emergent = RECALL_BASELINES.filter((baseline) => baseline.population === 'emergent');
    const singleWindow = RECALL_BASELINES.filter(
      (baseline) => baseline.population === 'single-window',
    );
    expect(emergent).toHaveLength(10);
    expect(singleWindow).toHaveLength(8);
  });

  it('has unique baseline ids (no integrity violation)', () => {
    expect(findRecallIntegrityViolations({ matches: [], baselines: RECALL_BASELINES })).toEqual([]);
  });

  it('pins the single-window set to the v1-assessed out-of-remit defects', () => {
    // These eight are the structural defects the v1 proving run assessed first-hand as
    // out-of-remit (no cross-window recurrence for an emergence pass to surface). A drift
    // here changes the headline-recall denominator and must be a deliberate recalibration.
    const byName = (a: string, b: string): number => a.localeCompare(b);
    const singleWindowIds = RECALL_BASELINES.filter(
      (baseline) => baseline.population === 'single-window',
    )
      .map((baseline) => baseline.id)
      .sort(byName);
    expect(singleWindowIds).toEqual(
      [
        'commit-editmsg-single-writer',
        'completion-language-overload',
        'identity-tuple-insufficiency',
        'presence-vs-ownership-collapse',
        'record-staged-full-index-fingerprint',
        'reviewer-cycle-split-on-convergence',
        'reviewer-pre-execution-catch',
        'skill-invocation-not-owner-direction',
      ].sort(byName),
    );
  });
});
