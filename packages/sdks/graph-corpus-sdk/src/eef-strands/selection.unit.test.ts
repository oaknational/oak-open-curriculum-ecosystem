import { describe, expect, it } from 'vitest';

import { loadEefCorpus } from './loader.js';
import { selectEefSeedIds } from './selection.js';
import type { EefStrand } from './strand-schema.js';

// Within the 180-day freshness window of the snapshot (last_updated 2026-04-02).
const FRESH_NOW = new Date('2026-05-01T00:00:00.000Z');

function loadStrands(): readonly EefStrand[] {
  const result = loadEefCorpus({ now: FRESH_NOW });
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`expected the real corpus to load: ${result.error.kind}`);
  }
  return result.value.strands;
}

function strandsById(strands: readonly EefStrand[]): ReadonlyMap<string, EefStrand> {
  return new Map(strands.map((strand) => [strand.id, strand]));
}

describe('selectEefSeedIds (real EEF corpus)', () => {
  it('narrows to strands carrying the requested focus priority', () => {
    const strands = loadStrands();
    const byId = strandsById(strands);

    const ids = selectEefSeedIds(strands, { focus: 'improving_behaviour' });

    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThan(strands.length);
    for (const id of ids) {
      expect(byId.get(id)?.school_context_relevance?.most_relevant_priorities).toContain(
        'improving_behaviour',
      );
    }
  });

  it('applies key-stage and focus together as conjunctive constraints', () => {
    const strands = loadStrands();
    const byId = strandsById(strands);

    const ids = selectEefSeedIds(strands, { focus: 'improving_maths', keyStage: 'KS2' });

    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const relevance = byId.get(id)?.school_context_relevance;
      expect(relevance?.most_relevant_priorities).toContain('improving_maths');
      expect(relevance?.most_relevant_key_stages).toContain('KS2');
    }
  });

  it('narrows to strands whose key stages include the requested key stage', () => {
    const strands = loadStrands();
    const byId = strandsById(strands);

    const ids = selectEefSeedIds(strands, { keyStage: 'KS4' });

    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const relevance = byId.get(id)?.school_context_relevance;
      // Only with-relevance strands can be selected by key stage alone (no
      // subject/topic is given, so the sparse path contributes nothing).
      expect(relevance?.most_relevant_key_stages).toContain('KS4');
    }
  });

  it('keeps a sparse strand (no relevance metadata) reachable via subject/topic overlap', () => {
    const strands = loadStrands();
    const sparse = strands.find((strand) => strand.school_context_relevance === undefined);
    if (sparse === undefined) {
      throw new Error('expected the corpus to contain at least one sparse strand');
    }

    const ids = selectEefSeedIds(strands, { topic: sparse.name });

    expect(ids).toContain(sparse.id);
  });

  it('returns the whole corpus when nothing matches the context (never empty)', () => {
    const strands = loadStrands();

    // `teacher_retention` is a valid priority no strand carries; the key stage
    // does not normalise; the subject/topic are non-overlapping gibberish.
    const ids = selectEefSeedIds(strands, {
      focus: 'teacher_retention',
      keyStage: 'reception-year',
      subject: 'zzzz',
      topic: 'qqqq',
    });

    expect(ids).toHaveLength(strands.length);
  });

  it('returns the whole corpus when no narrowing context is given (no signal)', () => {
    const strands = loadStrands();

    const ids = selectEefSeedIds(strands, {});

    expect(ids).toHaveLength(strands.length);
  });
});
