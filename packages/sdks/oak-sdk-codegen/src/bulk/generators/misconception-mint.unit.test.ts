/**
 * Golden-vector tests for the misconception node-id mint (G2 contract test
 * part 4 — the stability-across-regenerations proof).
 *
 * @remarks
 * These vectors pin the normalisation (trim, whitespace-collapse, lowercase),
 * the hash (SHA-256) and the prefix length (16 hex). The same content must
 * hash identically forever: any deliberate future change to the mint is
 * forced to touch this file — a visible contract amendment, ADR-grade
 * (design verdict `.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md`).
 *
 * The NFC assertions pin the no-transform decision: the corpus is
 * NFC-normalised at source (measured 0/12,858 divergent), so the mint applies
 * no unicode transform and the vectors prove their own inputs are NFC-stable.
 */
import { describe, expect, it } from 'vitest';

import { mintMisconceptionId, normaliseMisconceptionText } from './misconception-mint.js';

describe('normaliseMisconceptionText', () => {
  it('trims, collapses internal whitespace runs, and lowercases', () => {
    expect(normaliseMisconceptionText('  Sound  travels faster\nin air than in water ')).toBe(
      'sound travels faster in air than in water',
    );
  });

  it('leaves already-normalised text unchanged', () => {
    expect(normaliseMisconceptionText('plants eat soil')).toBe('plants eat soil');
  });
});

describe('mintMisconceptionId — golden vectors', () => {
  const goldenVectors = [
    {
      name: 'plain ASCII text',
      lessonSlug: 'plants-eat-soil-lesson',
      text: 'Plants eat soil',
      id: 'misconception:plants-eat-soil-lesson#ab203e7769a24065',
    },
    {
      name: 'curly apostrophe and curly quotes (non-ASCII, NFC-stable)',
      lessonSlug: 'gravity-basics',
      text: 'A plant’s “food” comes from the soil',
      id: 'misconception:gravity-basics#ef8cae66c02f10b6',
    },
    {
      name: 'internal double space and newline collapse to one space',
      lessonSlug: 'sound-waves',
      text: 'Sound  travels faster\nin air than in water',
      id: 'misconception:sound-waves#2779ad88a59518ca',
    },
  ] as const;

  it.each(goldenVectors)('mints the pinned id for $name', ({ lessonSlug, text, id }) => {
    expect(mintMisconceptionId(lessonSlug, text)).toBe(id);
  });

  it.each(goldenVectors)(
    'vector input for $name is NFC-stable (assertion, not transform)',
    ({ text }) => {
      expect(text.normalize('NFC')).toBe(text);
    },
  );

  it('mints identical ids for occurrences differing only in whitespace/case', () => {
    const a = mintMisconceptionId('a-lesson', 'Plants eat soil');
    const b = mintMisconceptionId('a-lesson', '  plants  EAT soil ');
    expect(a).toBe(b);
  });

  it('mints distinct ids for the same text in different lessons (lesson scope)', () => {
    const a = mintMisconceptionId('lesson-one', 'Plants eat soil');
    const b = mintMisconceptionId('lesson-two', 'Plants eat soil');
    expect(a).not.toBe(b);
  });

  it('mints distinct ids for different texts in the same lesson (content hash)', () => {
    const a = mintMisconceptionId('a-lesson', 'Plants eat soil');
    const b = mintMisconceptionId('a-lesson', 'Plants drink soil');
    expect(a).not.toBe(b);
  });
});
