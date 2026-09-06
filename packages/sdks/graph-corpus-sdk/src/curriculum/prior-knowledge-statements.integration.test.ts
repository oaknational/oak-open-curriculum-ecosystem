/**
 * Integration tests for the prior-knowledge statements view.
 *
 * @remarks
 * Integration, not unit: the view reads the compile-time graph corpus, whose
 * module loads `data.json` at import time (IO). Fixtures are chosen
 * deterministically from the corpus so the tests describe behaviour over any
 * valid corpus rather than pinning content.
 */

import { graphCorpus } from '@oaknational/sdk-codegen/graph-corpus';
import { describe, it, expect } from 'vitest';
import { priorKnowledgeStatements } from './prior-knowledge-statements.js';
import { required } from './test-helpers.js';

/** The corpus's unit nodes, the fixture pool. */
const unitNodes = graphCorpus.nodes.filter((node) => node.kind === 'unit');
const firstUnit = [...unitNodes].sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))[0];
if (firstUnit === undefined) {
  throw new Error('corpus has no unit nodes to anchor the view tests');
}
const knownSlug: string = firstUnit.unitSlug;

describe('priorKnowledgeStatements', () => {
  it('returns the anchor unit with its stated prior knowledge and thread memberships', () => {
    const result = priorKnowledgeStatements([knownSlug]);

    expect(result.resolvedAnchors).toStrictEqual([`unit:${knownSlug}`]);
    expect(result.unknownAnchors).toStrictEqual([]);
    expect(result.units).toHaveLength(1);
    const unit = result.units[0];
    expect(unit?.unitSlug).toBe(knownSlug);
    // The fields the statements contract serves. priorKnowledge is compared
    // against the deduped corpus values — the view's contract collapses exact
    // duplicates, so raw-equality would be fragile on a corpus where this unit
    // gains repeats (threadSlugs are served verbatim).
    expect(unit?.priorKnowledge).toStrictEqual([...new Set(firstUnit.priorKnowledge)]);
    expect(unit?.threadSlugs).toStrictEqual(firstUnit.threadSlugs);
  });

  it('collapses duplicate anchors with set semantics, first occurrence kept', () => {
    const result = priorKnowledgeStatements([knownSlug, knownSlug]);

    expect(result.resolvedAnchors).toStrictEqual([`unit:${knownSlug}`]);
    expect(result.units).toHaveLength(1);
  });

  it('collapses exact-duplicate statements within a unit, first occurrence kept', () => {
    // Deterministic fixture: the lexicographically-first unit whose corpus
    // statements contain a duplicate, so the assertion actually exercises the
    // collapse. `required` fails loudly if the corpus ever holds no such unit,
    // rather than letting this test pass vacuously against clean data.
    const dupUnit = required(
      [...unitNodes]
        .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))
        .find((node) => new Set(node.priorKnowledge).size !== node.priorKnowledge.length),
      'corpus has no unit with duplicate prior-knowledge statements to exercise the collapse',
    );

    const result = priorKnowledgeStatements([dupUnit.unitSlug]);
    const served = required(result.units[0], 'anchor unit did not resolve').priorKnowledge;

    // Collapsed: no internal duplicates, and shorter than the raw duplicated list.
    expect(new Set(served).size).toBe(served.length);
    expect(served.length).toBeLessThan(dupUnit.priorKnowledge.length);
    // First-occurrence order preserved.
    expect(served).toStrictEqual([...new Set(dupUnit.priorKnowledge)]);
  });

  it('returns a known unit that records no statements as empty, not as unknown', () => {
    // Deterministic fixture: the lexicographically-first unit whose corpus
    // statements are empty. The contract distinguishes "known, states none"
    // (resolved, empty list) from "unknown anchor" (reported), so filtering
    // such units out must not regress unnoticed. `required` fails loudly if
    // the corpus ever holds no such unit.
    const emptyUnit = required(
      [...unitNodes]
        .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))
        .find((node) => node.priorKnowledge.length === 0),
      'corpus has no unit with an empty prior-knowledge list to exercise the known-empty case',
    );

    const result = priorKnowledgeStatements([emptyUnit.unitSlug]);

    expect(result.resolvedAnchors).toStrictEqual([`unit:${emptyUnit.unitSlug}`]);
    expect(result.unknownAnchors).toStrictEqual([]);
    expect(result.units[0]?.priorKnowledge).toStrictEqual([]);
  });

  it('reports unknown slugs verbatim, never as an error', () => {
    const result = priorKnowledgeStatements([knownSlug, 'no-such-unit-anywhere']);

    expect(result.unknownAnchors).toStrictEqual(['no-such-unit-anywhere']);
    expect(result.units).toHaveLength(1);
  });

  it('returns a well-formed empty result for an empty anchor list', () => {
    const result = priorKnowledgeStatements([]);

    expect(result.units).toStrictEqual([]);
    expect(result.resolvedAnchors).toStrictEqual([]);
    expect(result.unknownAnchors).toStrictEqual([]);
  });

  it('keeps units in resolved-anchor order for multi-anchor calls', () => {
    const secondUnit = required(
      [...unitNodes]
        .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))
        .find((node) => node.unitSlug !== knownSlug),
      'corpus has fewer than two unit nodes',
    );

    const result = priorKnowledgeStatements([secondUnit.unitSlug, knownSlug]);

    expect(result.units.map((unit) => unit.unitSlug)).toStrictEqual([
      secondUnit.unitSlug,
      knownSlug,
    ]);
  });
});
