/**
 * Integration tests over the committed graph-corpus dataset (G2 + G4b
 * contract — the real-corpus count guards).
 *
 * @remarks
 * The generator unit tests prove the rules on synthetic fixtures; these
 * guards pin the rules' outcome on the committed corpus artefact itself, so
 * a regeneration that changes the dedup or integrity behaviour surfaces as a
 * visible diff in BOTH the data and this expectation (a conscious contract
 * amendment, never silent drift). The original G2/G4b values were the
 * first-hand measurements against the 2026-06-10 bulk snapshot
 * (`.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md` and the
 * G4b readiness synthesis, 2026-06-11). CONSCIOUS AMENDMENT (2026-07-27,
 * MCP-153): the pins now record the 2026-07-27 bulk snapshot with the
 * MCP-204 restricted-lesson exclusion applied (3,372 restricted lesson
 * records / 2,641 distinct slugs removed before extraction) — each value
 * below re-measured first-hand from the regenerated artefact. CONSCIOUS
 * AMENDMENT (2026-09-03, thread sequences in curriculum order, MCP-681): the
 * pins now record the 2026-09-03 bulk snapshot (3,466 restricted lesson
 * records excluded), re-measured first-hand from the regenerated artefact.
 *
 * Read the 2026-09-03 movements honestly. The node, lesson, misconception and
 * keyword counts below moved because regeneration necessarily used a FRESH
 * bulk download (2026-08-12 → 2026-09-03), carrying three weeks of upstream
 * curriculum drift — the restricted-lesson count 3,372 → 3,466 is the
 * plainest evidence of it. NONE of those movements is caused by the
 * curriculum-order change, which reorders placements inside existing
 * sequences and adds `subject` to each. The bulk snapshot is not committed,
 * so an ordering-only regeneration is not reproducible after the fact; the
 * two effects arrive together by construction.
 */
import { describe, expect, it } from 'vitest';

import { graphCorpus } from '../../generated/vocab/graph-corpus/index.js';

describe('committed graph corpus (G2 + G4b real-corpus count guards)', () => {
  it('collapses exactly the 3,576 multi-placement identical misconception pairs', () => {
    expect(graphCorpus.stats.collapsedIdenticalMisconceptions).toBe(3576);
  });

  it('drops zero duplicates (no same-text-different-response pair within one lesson)', () => {
    expect(graphCorpus.droppedDuplicates).toEqual([]);
  });

  it('drops zero edges (every endpoint resolves)', () => {
    expect(graphCorpus.droppedEdges).toEqual([]);
  });

  it('emits the expected node-kind counts for the pinned snapshot', () => {
    expect(graphCorpus.stats.nodeKindCounts).toEqual({
      unit: 1835,
      thread: 160,
      lesson: 10941,
      misconception: 10937,
      keyword: 12204,
    });
  });

  // MCP-681/682 — the ordered sections, pinned on the real artefact. These
  // are the guards the second-round test audit found missing: the synthetic
  // fixtures prove the rules, but nothing had pinned their outcome on the
  // committed corpus.
  it('emits corpus version 1.5.0 (the ordered-sections shape)', () => {
    expect(graphCorpus.version).toBe('1.5.0');
  });

  it('emits one unit-lesson run per unit that places lessons (pinned snapshot)', () => {
    expect(graphCorpus.unitLessonRuns).toHaveLength(1722);
  });

  it('places in runs exactly the lessons the containsLesson edges place — membership is the edge set', () => {
    const placed = graphCorpus.unitLessonRuns.reduce((sum, run) => sum + run.lessonIds.length, 0);
    expect(placed).toBe(graphCorpus.stats.edgeTypeCounts.containsLesson);
    const byUnit = new Map<string, Set<string>>();
    for (const edge of graphCorpus.edges) {
      if (edge.type !== 'containsLesson') {
        continue;
      }
      const set = byUnit.get(edge.source) ?? new Set<string>();
      set.add(edge.target);
      byUnit.set(edge.source, set);
    }
    for (const run of graphCorpus.unitLessonRuns) {
      expect(new Set(run.lessonIds)).toEqual(byUnit.get(run.unitId));
    }
  });

  it('keeps every sequence placement inside its own subject, corpus-wide', () => {
    const subjectOf = new Map(
      graphCorpus.nodes.filter((n) => n.kind === 'unit').map((n) => [n.id, n.subject]),
    );
    for (const sequence of graphCorpus.sequences) {
      for (const placement of sequence.placements) {
        expect(subjectOf.get(placement.unitId)).toBe(sequence.subject);
      }
    }
  });

  it('reports zero units whose run fell back to id order on the pinned snapshot', () => {
    expect(graphCorpus.stats.unitsWithoutAuthoredLessonOrder).toBe(0);
  });

  it('emits one containsKeyword edge per unique lesson placement (G4b pinned snapshot)', () => {
    expect(graphCorpus.stats.edgeTypeCounts.containsKeyword).toBe(38381);
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
