import { describe, expect, it } from 'vitest';

import { extractBodyFindings } from '../../src/pr-tally/findings.js';
import { parseRecordedHarvest } from '../../src/pr-tally/harvest.js';
import { readBarMarker } from '../../src/pr-tally/markers.js';
import { buildRows } from '../../src/pr-tally/rows.js';
import { verdict } from '../../src/pr-tally/verdict.js';
import pr135 from './fixtures/pr-135-harvest.json' with { type: 'json' };
import pr136 from './fixtures/pr-136-harvest.json' with { type: 'json' };
import pr138 from './fixtures/pr-138-harvest.json' with { type: 'json' };

// The recorded corpora read end to end — parse, rows, verdict — the seat's
// own tallies as the composed instrument reads them. No IO: the recordings
// are imported. Each unit's own suite proves it in isolation.
const COPILOT = 'copilot-pull-request-reviewer';
const CODEX = 'chatgpt-codex-connector';
const EXPECTED = [COPILOT, CODEX];

describe('the recorded corpora through the whole instrument', () => {
  it('reads the #135 corpus as open: nothing in it is signed to the predicate, so nothing is dispositioned', () => {
    const result = verdict(
      buildRows({ harvest: parseRecordedHarvest(pr135), expectedReviewers: EXPECTED }),
      {},
    );
    expect(result.kind).toBe('open');
    expect(result.evidence.join('\n')).toMatch(/undispositioned/u);
  });

  it('reads the #138 corpus as open at its final head: one suppressed item without a one-line disposition', () => {
    const result = verdict(
      buildRows({ harvest: parseRecordedHarvest(pr138), expectedReviewers: EXPECTED }),
      { classFixHeads: ['a1ec078e2'] },
    );
    expect(result.kind).toBe('open');
    expect(result.epoch).toBe(2);
    expect(result.counts).toStrictEqual([9, 3, 1, 0]);
  });

  it('reads the #136 corpus as open with the counts of epoch three at 3, 2, 1, 0 — the tally the seat kept', () => {
    const result = verdict(
      buildRows({ harvest: parseRecordedHarvest(pr136), expectedReviewers: EXPECTED }),
      { classFixHeads: ['1ca90fece', 'bc6370624'] },
    );
    expect(result.kind).toBe('open');
    expect(result.epoch).toBe(3);
    expect(result.counts).toStrictEqual([3, 2, 1, 0]);
  });

  it('reads every seat reply in the recorded #135 corpus: fourteen over-bar, three below-bar', () => {
    const harvest = parseRecordedHarvest(pr135);
    const markers = harvest.reviewThreads
      .flatMap((thread) => thread.comments)
      .filter((comment) => comment.author === 'el-graphael')
      .map((comment) => readBarMarker(comment.body));
    expect(markers.filter((marker) => marker === 'over-bar')).toHaveLength(14);
    expect(markers.filter((marker) => marker === 'below-bar')).toHaveLength(3);
    expect(markers).not.toContain(null);
  });

  it.each([
    ['#135', pr135, 37],
    ['#136', pr136, 8],
    ['#138', pr138, 23],
  ])(
    'reads every Copilot suppressed block in the %s corpus with counts equal to the declared totals',
    (_label, fixture, expectedTotal) => {
      const harvest = parseRecordedHarvest(fixture);
      const copilot = harvest.reviews.filter((review) => review.author === COPILOT);
      const results = copilot.map((review) => extractBodyFindings(review));
      expect(results.every((result) => !result.manual)).toBe(true);
      const declared = copilot
        .map((review) => /Suppressed comments \((\d+)\)/u.exec(review.body))
        .map((match) => (match === null ? 0 : Number(match[1])));
      expect(results.map((result) => result.items.length)).toStrictEqual(declared);
      expect(results.reduce((sum, result) => sum + result.items.length, 0)).toBe(expectedTotal);
    },
  );

  it('reads every Codex review body in the corpora as boilerplate: no body-only Codex item is recorded', () => {
    for (const fixture of [pr135, pr136, pr138]) {
      const codex = parseRecordedHarvest(fixture).reviews.filter(
        (review) => review.author === CODEX,
      );
      expect(codex.length).toBeGreaterThan(0);
      for (const review of codex) {
        expect(extractBodyFindings(review)).toStrictEqual({ items: [], manual: false });
      }
    }
  });
});
