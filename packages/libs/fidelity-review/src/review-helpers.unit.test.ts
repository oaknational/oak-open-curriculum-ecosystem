import { describe, expect, it } from 'vitest';

import type { PairResult } from './report';
import type { FidelityRegister } from './register';
import { summaryLines } from './review-helpers';

const PAIR = {
  id: 'picker-oak-fold',
  kind: 'page-abovefold',
  diffEligible: true,
  exportPng: 'demo-evidence/export-picker-oak-fold.png',
  livePng: 'demo-evidence/live-picker-oak-fold.png',
  liveRoute: '/specimen',
};

const REGISTER = {
  version: 1,
  entries: [
    {
      id: 'picker-oak-fold/known-divergence',
      pairId: 'picker-oak-fold',
      kind: 'feature',
      summary: 'A recorded divergence.',
      evidence: ['demo-evidence/live-picker-oak-fold.png'],
      disposition: 'deliberate',
      rationale: 'Recorded.',
      author: 'design-lane',
      date: '2026-08-01',
    },
  ],
} satisfies FidelityRegister;

describe('summaryLines', () => {
  it('formats a diffed pair as a two-decimal percentage', () => {
    const results: readonly PairResult[] = [
      {
        pair: PAIR,
        status: 'diffed',
        diff: {
          changedRatio: 0.041256,
          diffPngName: 'diff-picker-oak-fold.png',
          exportDims: { width: 2880, height: 4000 },
          liveDims: { width: 2880, height: 4000 },
          croppedTo: { width: 2880, height: 4000 },
          caveats: [],
        },
      },
    ];

    expect(summaryLines(results, REGISTER)).toEqual([
      'PAIR picker-oak-fold: 4.13% disposition=recorded',
    ]);
  });

  it('falls back to the status when there is no diff', () => {
    const results: readonly PairResult[] = [
      { pair: { ...PAIR, id: 'picker-emc2-full' }, status: 'missing-evidence', missing: ['x'] },
    ];

    expect(summaryLines(results, REGISTER)).toEqual([
      'PAIR picker-emc2-full: missing-evidence disposition=UNREGISTERED',
    ]);
  });

  it('marks a pair UNREGISTERED only when no register entry keys to it', () => {
    const results: readonly PairResult[] = [
      { pair: PAIR, status: 'reference-only' },
      { pair: { ...PAIR, id: 'picker-chrome' }, status: 'reference-only' },
    ];

    const lines = summaryLines(results, REGISTER);

    expect(lines[0]).toContain('disposition=recorded');
    expect(lines[1]).toContain('disposition=UNREGISTERED');
  });
});
