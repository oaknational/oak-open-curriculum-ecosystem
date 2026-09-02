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
    // The fields the statements contract serves — verbatim from the corpus.
    expect(unit?.priorKnowledge).toStrictEqual(firstUnit.priorKnowledge);
    expect(unit?.threadSlugs).toStrictEqual(firstUnit.threadSlugs);
  });

  it('collapses duplicate anchors with set semantics, first occurrence kept', () => {
    const result = priorKnowledgeStatements([knownSlug, knownSlug]);

    expect(result.resolvedAnchors).toStrictEqual([`unit:${knownSlug}`]);
    expect(result.units).toHaveLength(1);
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
    const secondUnit = [...unitNodes]
      .sort((a, b) => a.unitSlug.localeCompare(b.unitSlug))
      .find((node) => node.unitSlug !== knownSlug);
    if (secondUnit === undefined) {
      throw new Error('corpus has fewer than two unit nodes');
    }

    const result = priorKnowledgeStatements([secondUnit.unitSlug, knownSlug]);

    expect(result.units.map((unit) => unit.unitSlug)).toStrictEqual([
      secondUnit.unitSlug,
      knownSlug,
    ]);
  });
});
