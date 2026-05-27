import { describe, expect, it } from 'vitest';

import { loadEefCorpus } from './loader.js';
import { DEFAULT_THRESHOLD_DAYS } from './freshness.js';

// A reference time within the 180-day window of the snapshot's
// `meta.last_updated` (2026-04-02), injected so the freshness gate is
// deterministic and never reads the system clock.
const FRESH_NOW = new Date('2026-05-01T00:00:00.000Z');

describe('loadEefCorpus (real EEF corpus)', () => {
  it('loads, validates, and freshness-gates the real snapshot into a GraphView', () => {
    const result = loadEefCorpus({
      now: FRESH_NOW,
      freshnessThresholdDays: DEFAULT_THRESHOLD_DAYS,
    });
    expect(result.ok).toBe(true);
  });

  it('reports the real corpus shape in the manifest (30 strands, 37 edges, 13 sparse)', () => {
    const result = loadEefCorpus({ now: FRESH_NOW });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const manifest = result.value.manifest();
      expect(manifest.nodeCount).toBe(30);
      expect(manifest.edgeCount).toBe(37);
      expect(manifest.edgeTypes).toEqual(['related_strand']);
      expect(manifest.sparseRelationsByNodeId).toHaveLength(13);
      expect(manifest.version).toBe('0.2.0');
      expect(manifest.lastUpdated).toBe('2026-04-02');
    }
  });

  it('answers a real subgraph query over the loaded corpus', () => {
    const result = loadEefCorpus({ now: FRESH_NOW });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const subgraph = result.value.subgraph({
        rootIds: ['eef-tl-arts-participation'],
        depth: 1,
      });
      expect(subgraph.ok).toBe(true);
      if (subgraph.ok) {
        expect(subgraph.value.nodes.map((node) => node.id)).toEqual([
          'eef-tl-arts-participation',
          'eef-tl-collaborative-learning',
          'eef-tl-oral-language-interventions',
        ]);
        expect(subgraph.value.edges).toEqual([
          {
            source: 'eef-tl-arts-participation',
            type: 'related_strand',
            target: 'eef-tl-collaborative-learning',
          },
          {
            source: 'eef-tl-arts-participation',
            type: 'related_strand',
            target: 'eef-tl-oral-language-interventions',
          },
        ]);
      }
    }
  });

  it('fails closed with stale-data when the snapshot is past the freshness window', () => {
    const result = loadEefCorpus({ now: new Date('2027-01-01T00:00:00.000Z') });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatchObject({ kind: 'stale-data' });
    }
  });

  it('honours a caller-supplied freshness threshold', () => {
    const result = loadEefCorpus({ now: FRESH_NOW, freshnessThresholdDays: 7 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatchObject({ kind: 'stale-data', thresholdDays: 7 });
    }
  });
});
