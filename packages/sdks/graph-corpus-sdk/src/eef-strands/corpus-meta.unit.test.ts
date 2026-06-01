import { describe, expect, it } from 'vitest';

import { corpusMeta, corpusCaveats, corpusMethodology, lastUpdated } from './corpus-meta.js';

describe('corpus-meta', () => {
  it('exposes the corpus provenance from meta.source', () => {
    expect(corpusMeta.source.name).toBe('EEF Teaching and Learning Toolkit');
    expect(corpusMeta.source.organisation).toBe('Education Endowment Foundation');
  });

  it('exposes the corpus-level caveats as global provenance', () => {
    expect(corpusCaveats.length).toBeGreaterThan(0);
    expect(corpusCaveats[0]).toContain('population averages');
  });

  it('exposes the methodology measures used to interpret the metrics', () => {
    expect(corpusMethodology.impact_measure.unit).toBe('months');
    expect(corpusMethodology.cost_measure.scale['1'].label).toBe('Very low');
  });

  it('exposes the snapshot last-updated date', () => {
    expect(lastUpdated).toBe('2026-04-02');
  });
});
