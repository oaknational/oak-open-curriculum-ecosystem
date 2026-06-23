/**
 * Unit tests for the graph-corpus keyword node builder (G4b).
 *
 * @remarks
 * TDD: these tests specify the keyword half of the emitted corpus — lean
 * keyword nodes minted as `keyword:<normalised-term>` (lc+trim) carrying the
 * first-occurrence display casing, the bulk description, the unique-lesson
 * frequency, the key-stage-derived firstYear, and the subject distribution;
 * plus the lesson→keyword edge endpoints (one per unique lesson placement).
 * Richness arrives via edge traversal on the one-graph substrate, never via
 * a fat node (plan `graph-tools-value-redesign`, deliverable G4b).
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedKeyword } from '../extractors/index.js';

import { buildKeywordNodes } from './graph-corpus-keyword-nodes.js';

function makeKeyword(overrides: Partial<ExtractedKeyword> = {}): ExtractedKeyword {
  return {
    term: 'photosynthesis',
    displayTerm: 'Photosynthesis',
    definition: 'The process plants use to make food from light.',
    frequency: 2,
    subjects: ['science'],
    firstYear: 7,
    lessonSlugs: ['plants-make-food', 'leaf-structure'],
    ...overrides,
  };
}

describe('buildKeywordNodes', () => {
  it('emits a lean keyword node with the kind-qualified normalised-term id', () => {
    const build = buildKeywordNodes([makeKeyword()]);

    expect(build.nodes).toHaveLength(1);
    expect(build.nodes[0]).toEqual({
      kind: 'keyword',
      id: 'keyword:photosynthesis',
      term: 'Photosynthesis',
      description: 'The process plants use to make food from light.',
      frequency: 2,
      firstYear: 7,
      subjects: ['science'],
    });
  });

  it('derives frequency from the unique-lesson set, never the occurrence count', () => {
    // The extractor's frequency counts occurrences (a lesson repeating a
    // keyword counts twice); the node's frequency is the unique-lesson count
    // (the ratified spec: frequency = lessonSlugs.size).
    const build = buildKeywordNodes([
      makeKeyword({ frequency: 5, lessonSlugs: ['lesson-a', 'lesson-b'] }),
    ]);

    expect(build.nodes[0]?.frequency).toBe(2);
  });

  it('emits keyword nodes id-sorted (deterministic artefact order)', () => {
    const build = buildKeywordNodes([
      makeKeyword({ term: 'zygote', displayTerm: 'Zygote', lessonSlugs: ['cells'] }),
      makeKeyword({ term: 'allele', displayTerm: 'Allele', lessonSlugs: ['genes'] }),
      makeKeyword({ term: 'mitosis', displayTerm: 'Mitosis', lessonSlugs: ['cells'] }),
    ]);

    expect(build.nodes.map((node) => node.id)).toEqual([
      'keyword:allele',
      'keyword:mitosis',
      'keyword:zygote',
    ]);
  });

  it('emits one lesson→keyword edge pair per unique lesson placement', () => {
    const build = buildKeywordNodes([
      makeKeyword({ lessonSlugs: ['leaf-structure', 'plants-make-food'] }),
    ]);

    expect(build.edgePairs).toEqual([
      ['lesson:leaf-structure', 'keyword:photosynthesis'],
      ['lesson:plants-make-food', 'keyword:photosynthesis'],
    ]);
  });

  it('returns an empty build for empty input', () => {
    const build = buildKeywordNodes([]);

    expect(build.nodes).toEqual([]);
    expect(build.edgePairs).toEqual([]);
  });
});
