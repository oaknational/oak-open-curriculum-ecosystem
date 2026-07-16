import { describe, expect, it } from 'vitest';

import { parseReviewDecision } from '../../src/codex-hook-review/verdict.js';

describe('parseReviewDecision', () => {
  it.each([
    [
      '{"verdict":"pass","kind":"none","change_index":0}',
      { verdict: 'pass', kind: 'none', change_index: 0 },
    ],
    [
      '{"verdict":"uncertain","kind":"none","change_index":0}',
      { verdict: 'uncertain', kind: 'none', change_index: 0 },
    ],
    [
      '{"verdict":"concern","kind":"runtime","change_index":2}',
      { verdict: 'concern', kind: 'runtime', change_index: 2 },
    ],
  ] as const)('accepts the exact decision contract', (text, expected) => {
    expect(parseReviewDecision(text, 2)).toStrictEqual({ ok: true, value: expected });
  });

  it.each([
    'not json',
    '```json\n{"verdict":"pass","kind":"none","change_index":0}\n```',
    '{"verdict":"pass","kind":"none","change_index":0,"reason":"looks good"}',
    '{"verdict":"pass","kind":"runtime","change_index":0}',
    '{"verdict":"concern","kind":"none","change_index":1}',
    '{"verdict":"concern","kind":"security","change_index":0}',
    '{"verdict":"warning","kind":"runtime","change_index":1}',
  ])('rejects malformed decisions and any model prose: %s', (text) => {
    expect(parseReviewDecision(text, 2)).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-decision' },
    });
  });

  it('rejects a concern index outside the actual bounded batch', () => {
    expect(
      parseReviewDecision('{"verdict":"concern","kind":"logic","change_index":3}', 2),
    ).toStrictEqual({ ok: false, error: { kind: 'change-index-out-of-range' } });
  });

  it.each([0, 4, 1.5])('rejects invalid actual change count %s', (changeCount) => {
    expect(
      parseReviewDecision('{"verdict":"pass","kind":"none","change_index":0}', changeCount),
    ).toStrictEqual({ ok: false, error: { kind: 'invalid-change-count' } });
  });
});
