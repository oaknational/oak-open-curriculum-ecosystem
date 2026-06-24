/**
 * Integration tests over the committed graph-corpus dataset (G2 + G4b
 * contract — the real-corpus count guards).
 *
 * @remarks
 * The generator unit tests prove the rules on synthetic fixtures; these
 * guards pin the rules' outcome on the committed corpus artefact itself, so
 * a regeneration that changes the dedup or integrity behaviour surfaces as a
 * visible diff in BOTH the data and this expectation (a conscious contract
 * amendment, never silent drift). The G2 expected values are the first-hand
 * measurements recorded in the G2 mint-rule design verdict
 * (`.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md`) and
 * re-verified at G2 execution start against the 2026-06-10 bulk snapshot;
 * the G4b keyword values (13,452 keyword nodes / 43,660 containsKeyword
 * edges) are the first-hand jq recomputations from the same snapshot,
 * re-verified at G4b execution start (readiness synthesis, 2026-06-11).
 */
import { describe, expect, it } from 'vitest';

import { graphCorpus } from '../../generated/vocab/graph-corpus/index.js';

describe('committed graph corpus (G2 + G4b real-corpus count guards)', () => {
  it('collapses exactly the 473 multi-placement identical misconception pairs', () => {
    expect(graphCorpus.stats.collapsedIdenticalMisconceptions).toBe(473);
  });

  it('drops zero duplicates (no same-text-different-response pair within one lesson)', () => {
    expect(graphCorpus.droppedDuplicates).toEqual([]);
  });

  it('drops zero edges (every endpoint resolves)', () => {
    expect(graphCorpus.droppedEdges).toEqual([]);
  });

  it('emits the expected node-kind counts for the pinned snapshot', () => {
    expect(graphCorpus.stats.nodeKindCounts).toEqual({
      unit: 1624,
      thread: 164,
      lesson: 12391,
      misconception: 12385,
      keyword: 13452,
    });
  });

  it('emits one containsKeyword edge per unique lesson placement (G4b pinned snapshot)', () => {
    expect(graphCorpus.stats.edgeTypeCounts.containsKeyword).toBe(43660);
  });

  it('emits keyword nodes id-sorted (deterministic artefact order)', () => {
    const ids = graphCorpus.nodes.filter((node) => node.kind === 'keyword').map((node) => node.id);
    expect(ids.length).toBeGreaterThan(0);
    const sorted = [...ids].sort((a, b) => a.localeCompare(b));
    expect(ids).toEqual(sorted);
  });

  it('stats node-kind counts match a direct recount of the emitted nodes', () => {
    // The stats block must describe the artefact, not merely record what the
    // generator believed at write time (validators recompute, never just read).
    const counts: Record<string, number> = {};
    for (const node of graphCorpus.nodes) {
      counts[node.kind] = (counts[node.kind] ?? 0) + 1;
    }
    expect(counts).toEqual(graphCorpus.stats.nodeKindCounts);
  });

  it('stats edge-type counts match a direct recount of the emitted edges', () => {
    const counts: Record<string, number> = {};
    for (const edge of graphCorpus.edges) {
      counts[edge.type] = (counts[edge.type] ?? 0) + 1;
    }
    expect(counts).toEqual(graphCorpus.stats.edgeTypeCounts);
  });

  it('emits one addressesMisconception edge per misconception node', () => {
    expect(graphCorpus.stats.edgeTypeCounts.addressesMisconception).toBe(
      graphCorpus.stats.nodeKindCounts.misconception,
    );
  });

  it('emits misconception nodes id-sorted (deterministic artefact order)', () => {
    const ids = graphCorpus.nodes
      .filter((node) => node.kind === 'misconception')
      .map((node) => node.id);
    const sorted = [...ids].sort((a, b) => a.localeCompare(b));
    expect(ids).toEqual(sorted);
  });

  it('resolves every edge endpoint to an emitted node (zero dangling, all kinds)', () => {
    const ids = new Set(graphCorpus.nodes.map((node) => node.id));
    const dangling = graphCorpus.edges.filter(
      (edge) => !ids.has(edge.source) || !ids.has(edge.target),
    );
    expect(dangling).toEqual([]);
  });
});
