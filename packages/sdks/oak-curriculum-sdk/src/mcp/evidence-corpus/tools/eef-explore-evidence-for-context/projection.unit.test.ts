import { describe, expect, it } from 'vitest';

import { loadEefCorpus, type EefStrand } from '@oaknational/graph-corpus-sdk/eef-strands';

import { projectExploreNode } from './projection.js';

// Within the 180-day freshness window of the snapshot (last_updated 2026-04-02).
const FRESH_NOW = new Date('2026-05-01T00:00:00.000Z');

function loadStrands(): readonly EefStrand[] {
  const result = loadEefCorpus({ now: FRESH_NOW });
  if (!result.ok) {
    throw new Error(`expected the real corpus to load: ${result.error.kind}`);
  }
  return result.value.strands;
}

function firstStrand(): EefStrand {
  const [strand] = loadStrands();
  if (strand === undefined) {
    throw new Error('expected the corpus to contain at least one strand');
  }
  return strand;
}

describe('projectExploreNode', () => {
  it('keeps the evidence content the model selects on', () => {
    const strand = firstStrand();
    const projected = projectExploreNode(strand);

    expect(projected.id).toBe(strand.id);
    expect(projected.name).toBe(strand.name);
    expect(projected.slug).toBe(strand.slug);
    expect(projected.headline.headline_summary).toBe(strand.headline.headline_summary);
    expect(projected.headline.impact_months).toBe(strand.headline.impact_months);
    expect(projected.definition_short).toBe(strand.definition.short);
    expect(projected.tags).toEqual(strand.tags);
  });

  it('drops the heavy and depth fields that blow the token budget', () => {
    const keys = Object.keys(projectExploreNode(firstStrand()));

    // `definition.full`, `effectiveness`, `behind_the_average`,
    // `implementation`, `update_history` and the verbose `key_findings`
    // bullets are dropped; `eef_url` and the evidence caveats live in the
    // citation envelope (correlated by id).
    for (const dropped of [
      'definition',
      'effectiveness',
      'behind_the_average',
      'implementation',
      'update_history',
      'related_strands',
      'key_findings',
      'eef_url',
      'school_context_relevance',
    ]) {
      expect(keys).not.toContain(dropped);
    }
  });

  it('trims the headline to the four model-facing fields', () => {
    const projected = projectExploreNode(firstStrand());
    expect(Object.keys(projected.headline).toSorted((a, b) => a.localeCompare(b))).toEqual([
      'cost_label',
      'evidence_strength_label',
      'headline_summary',
      'impact_months',
    ]);
  });

  it('includes most_relevant_priorities only for strands carrying relevance metadata', () => {
    const strands = loadStrands();
    const withRelevance = strands.find(
      (strand) => strand.school_context_relevance?.most_relevant_priorities !== undefined,
    );
    const withoutRelevance = strands.find(
      (strand) => strand.school_context_relevance === undefined,
    );
    if (withRelevance === undefined || withoutRelevance === undefined) {
      throw new Error('expected both with- and without-relevance strands in the corpus');
    }

    expect(projectExploreNode(withRelevance).most_relevant_priorities).toBeDefined();
    expect(projectExploreNode(withoutRelevance).most_relevant_priorities).toBeUndefined();
  });
});
