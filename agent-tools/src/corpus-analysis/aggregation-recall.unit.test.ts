import { describe, expect, it } from 'vitest';

import {
  countReFoundBaselines,
  findRecallIntegrityViolations,
  meetsGraduateGate,
  recallReport,
  type GraduateGate,
  type RecallFraction,
  type RecallReport,
} from './aggregation-recall.js';
import type { Baseline, RecallMatch, RecallVerdict } from './recall-schemas.js';

function recallMatch(verdict: RecallVerdict, index: number): RecallMatch {
  if (verdict === 'missed') {
    return { baselineId: `b${index}`, verdict, note: 'not surfaced' };
  }
  return { baselineId: `b${index}`, verdict, matchedCandidateId: `c${index}`, note: 're-found' };
}

function baseline(id: string, population: Baseline['population']): Baseline {
  return {
    id,
    statement: `baseline ${id}`,
    kind: population === 'emergent' ? 'recurrence' : 'behavioural',
    population,
    sourceCitations: [{ synthesis: 'historical-napkin-synthesis-2026-05-13.md', locator: '§x' }],
  };
}

describe('countReFoundBaselines', () => {
  it('counts 5 strict of 10 re-found (the exact judgment the v1 meta agent got wrong)', () => {
    // The v1 run: 10 re-found (loose), of which 5 strict. The meta agent reported 0.72;
    // the data said 5 strict / 10 loose. This is the test that would have caught it.
    const matches: RecallMatch[] = [
      recallMatch('subsumes', 1),
      recallMatch('refines', 2),
      recallMatch('equal', 3),
      recallMatch('subsumes', 4),
      recallMatch('refines', 5),
      recallMatch('partial', 6),
      recallMatch('partial', 7),
      recallMatch('partial', 8),
      recallMatch('partial', 9),
      recallMatch('partial', 10),
    ];
    expect(countReFoundBaselines(matches)).toEqual({ strict: 5, loose: 10 });
  });

  it('excludes missed baselines from both totals', () => {
    const matches = [recallMatch('equal', 1), recallMatch('missed', 2), recallMatch('partial', 3)];
    expect(countReFoundBaselines(matches)).toEqual({ strict: 1, loose: 2 });
  });

  it('returns zero counts for no matches', () => {
    expect(countReFoundBaselines([])).toEqual({ strict: 0, loose: 0 });
  });

  it('counts a baseline once even if it was matched twice (no duplicate inflation)', () => {
    const matches = [
      { baselineId: 'b1', verdict: 'subsumes' as const, matchedCandidateId: 'c1', note: 'a' },
      { baselineId: 'b1', verdict: 'equal' as const, matchedCandidateId: 'c2', note: 'b' },
    ];
    expect(countReFoundBaselines(matches)).toEqual({ strict: 1, loose: 1 });
  });
});

describe('recallReport', () => {
  it('reproduces the corrected v1 recall and stratifies emergent vs single-window', () => {
    const baselines: Baseline[] = [
      ...Array.from({ length: 10 }, (_unused, index) => baseline(`b${index + 1}`, 'emergent')),
      ...Array.from({ length: 8 }, (_unused, index) => baseline(`b${index + 11}`, 'single-window')),
    ];
    const matches: RecallMatch[] = [
      recallMatch('subsumes', 1),
      recallMatch('refines', 2),
      recallMatch('equal', 3),
      recallMatch('subsumes', 4),
      recallMatch('refines', 5),
      recallMatch('partial', 6),
      recallMatch('partial', 7),
      recallMatch('partial', 8),
      recallMatch('partial', 9),
      recallMatch('partial', 10),
      ...Array.from({ length: 8 }, (_unused, index) => recallMatch('missed', index + 11)),
    ];

    const report = recallReport({ matches, baselines });

    expect(report.strictOverall).toEqual({ numerator: 5, denominator: 18, value: 5 / 18 });
    expect(report.looseOverall).toEqual({ numerator: 10, denominator: 18, value: 10 / 18 });
    expect(report.strictWithinRemit).toEqual({ numerator: 5, denominator: 10, value: 0.5 });
    expect(report.looseWithinRemit).toEqual({ numerator: 10, denominator: 10, value: 1 });
    // 0.28 strict / 0.56 lenient overall — the corrected figures.
    expect(report.strictOverall.value).toBeCloseTo(0.28, 2);
    expect(report.looseOverall.value).toBeCloseTo(0.56, 2);
  });

  it('treats a zero emergent denominator as recall 0, not a divide-by-zero', () => {
    const baselines = [baseline('b1', 'single-window')];
    const report = recallReport({ matches: [recallMatch('missed', 1)], baselines });
    expect(report.strictWithinRemit).toEqual({ numerator: 0, denominator: 0, value: 0 });
  });

  it('ignores a match whose baseline is not in the fixture (no phantom contribution)', () => {
    const baselines = [baseline('b1', 'emergent')];
    const matches = [recallMatch('equal', 1), recallMatch('subsumes', 99)];
    const report = recallReport({ matches, baselines });
    const expected: RecallFraction = { numerator: 1, denominator: 1, value: 1 };
    expect(report.strictOverall).toEqual(expected);
  });

  it('penalises an emergent baseline that no match judged (it stays in the denominator)', () => {
    const baselines = [baseline('b1', 'emergent'), baseline('b2', 'emergent')];
    const report = recallReport({ matches: [recallMatch('equal', 1)], baselines });
    expect(report.strictWithinRemit).toEqual({ numerator: 1, denominator: 2, value: 0.5 });
  });

  it('cannot exceed 1.0 when a baseline is matched more than once', () => {
    const baselines = [baseline('b1', 'emergent')];
    const matches = [recallMatch('subsumes', 1), recallMatch('equal', 1)];
    const report = recallReport({ matches, baselines });
    expect(report.strictWithinRemit).toEqual({ numerator: 1, denominator: 1, value: 1 });
  });
});

describe('meetsGraduateGate', () => {
  // Choice B (owner-confirmed 2026-06-29): strict within-remit >= 0.6 AND lenient >= 0.85.
  const choiceB: GraduateGate = { minStrictWithinRemit: 0.6, minLooseWithinRemit: 0.85 };
  const reportAt = (strict: number, loose: number): RecallReport => ({
    strictOverall: { numerator: 0, denominator: 0, value: 0 },
    looseOverall: { numerator: 0, denominator: 0, value: 0 },
    strictWithinRemit: { numerator: 0, denominator: 10, value: strict },
    looseWithinRemit: { numerator: 0, denominator: 10, value: loose },
  });

  it('graduates only when both the strict and lenient floors are cleared', () => {
    expect(meetsGraduateGate(reportAt(0.7, 0.9), choiceB)).toBe(true);
  });

  it('refuses to graduate when the strict fidelity floor is missed (the v1 verdict)', () => {
    // v1 within-remit was 0.5 strict / 1.0 lenient — clears coverage, misses fidelity by 0.1.
    expect(meetsGraduateGate(reportAt(0.5, 1), choiceB)).toBe(false);
  });

  it('refuses to graduate when the lenient coverage floor is missed', () => {
    expect(meetsGraduateGate(reportAt(0.9, 0.8), choiceB)).toBe(false);
  });

  it('is an engine — it honours whatever thresholds it is given, not Choice B specifically', () => {
    const lenientGate: GraduateGate = { minStrictWithinRemit: 0.5, minLooseWithinRemit: 0.85 };
    expect(meetsGraduateGate(reportAt(0.5, 1), lenientGate)).toBe(true);
  });
});

describe('findRecallIntegrityViolations', () => {
  it('finds no violations in a clean fixture and match set', () => {
    const baselines = [baseline('b1', 'emergent'), baseline('b2', 'single-window')];
    const matches = [recallMatch('equal', 1), recallMatch('missed', 2)];
    expect(findRecallIntegrityViolations({ matches, baselines })).toEqual([]);
  });

  it('flags a baseline judged by more than one match', () => {
    const baselines = [baseline('b1', 'emergent')];
    const matches = [recallMatch('subsumes', 1), recallMatch('equal', 1)];
    expect(findRecallIntegrityViolations({ matches, baselines })).toContainEqual({
      kind: 'duplicate-match',
      baselineId: 'b1',
    });
  });

  it('flags a match referencing a baseline absent from the fixture', () => {
    const baselines = [baseline('b1', 'emergent')];
    const matches = [recallMatch('equal', 1), recallMatch('subsumes', 99)];
    expect(findRecallIntegrityViolations({ matches, baselines })).toContainEqual({
      kind: 'unknown-baseline',
      baselineId: 'b99',
    });
  });

  it('flags a duplicate baseline id in the fixture', () => {
    const baselines = [baseline('b1', 'emergent'), baseline('b1', 'single-window')];
    expect(findRecallIntegrityViolations({ matches: [], baselines })).toContainEqual({
      kind: 'duplicate-baseline-id',
      baselineId: 'b1',
    });
  });
});
