/**
 * Unit tests for the vocabulary graph generator.
 *
 * @remarks
 * Tests the generation of vocabulary graph data from extracted keywords.
 * The graph provides a curated glossary for students and teachers.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedKeyword } from '../extractors/index.js';

import {
  generateVocabularyGraphData,
  serializeVocabularyGraph,
  type VocabularyGraph,
  type VocabularyNode,
} from './vocabulary-graph-generator.js';

/**
 * Creates a test keyword.
 */
function createKeyword(overrides: Partial<ExtractedKeyword> = {}): ExtractedKeyword {
  return {
    term: 'photosynthesis',
    definition: 'The process by which plants convert light into energy',
    frequency: 15,
    subjects: ['science'],
    firstYear: 3,
    lessonSlugs: ['lesson-1', 'lesson-2'],
    ...overrides,
  };
}

describe('generateVocabularyGraphData', () => {
  it('returns a VocabularyGraph structure', () => {
    const keywords: readonly ExtractedKeyword[] = [createKeyword()];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result).toBeDefined();
    expect(result.version).toBe('1.0.0');
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBe('2025-12-26');
    expect(result.stats).toBeDefined();
    expect(result.nodes).toBeDefined();
    expect(result.seeAlso).toBeDefined();
  });

  it('includes all keywords as nodes', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ term: 'term1' }),
      createKeyword({ term: 'term2' }),
      createKeyword({ term: 'term3' }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.nodes).toHaveLength(3);
    expect(result.stats.totalTerms).toBe(3);
  });

  it('preserves term and definition', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({
        term: 'mitosis',
        definition: 'Cell division process',
      }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.term).toBe('mitosis');
    expect(node?.definition).toBe('Cell division process');
  });

  it('preserves frequency data', () => {
    const keywords: readonly ExtractedKeyword[] = [createKeyword({ frequency: 42 })];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.frequency).toBe(42);
  });

  it('preserves subject distribution', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ subjects: ['maths', 'science', 'computing'] }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.subjects).toContain('maths');
    expect(node?.subjects).toContain('science');
    expect(node?.subjects).toContain('computing');
  });

  it('preserves first year introduced', () => {
    const keywords: readonly ExtractedKeyword[] = [createKeyword({ firstYear: 5 })];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.firstYear).toBe(5);
  });

  it('flags cross-subject terms', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ term: 'single-subject', subjects: ['maths'] }),
      createKeyword({ term: 'cross-subject', subjects: ['maths', 'science'] }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    const singleNode = result.nodes.find((n) => n.term === 'single-subject');
    const crossNode = result.nodes.find((n) => n.term === 'cross-subject');
    expect(singleNode?.isCrossSubject).toBe(false);
    expect(crossNode?.isCrossSubject).toBe(true);
  });

  it('calculates statistics by subject', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ subjects: ['science'] }),
      createKeyword({ subjects: ['science'] }),
      createKeyword({ subjects: ['maths'] }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.stats.bySubject['science']).toBe(2);
    expect(result.stats.bySubject['maths']).toBe(1);
  });

  it('calculates cross-subject term count', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ subjects: ['maths'] }),
      createKeyword({ subjects: ['maths', 'science'] }),
      createKeyword({ subjects: ['maths', 'science', 'computing'] }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.stats.crossSubjectTermCount).toBe(2);
  });

  it('lists subjects covered', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword({ subjects: ['science'] }),
      createKeyword({ subjects: ['maths'] }),
      createKeyword({ subjects: ['english'] }),
    ];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.stats.subjectsCovered).toContain('science');
    expect(result.stats.subjectsCovered).toContain('maths');
    expect(result.stats.subjectsCovered).toContain('english');
  });
});

describe('VocabularyNode type', () => {
  it('has all required fields', () => {
    const keywords: readonly ExtractedKeyword[] = [createKeyword()];

    const result = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.nodes[0]).toBeDefined();
    const node = result.nodes[0];
    if (!node) {
      throw new Error('Expected node');
    }

    const typedNode: VocabularyNode = node;
    expect(typeof typedNode.term).toBe('string');
    expect(typeof typedNode.definition).toBe('string');
    expect(typeof typedNode.frequency).toBe('number');
    expect(Array.isArray(typedNode.subjects)).toBe(true);
    expect(typeof typedNode.firstYear).toBe('number');
    expect(typeof typedNode.isCrossSubject).toBe('boolean');
  });
});

describe('VocabularyGraph type', () => {
  it('has all required fields', () => {
    const keywords: readonly ExtractedKeyword[] = [createKeyword()];

    const result: VocabularyGraph = generateVocabularyGraphData(keywords, '2025-12-26');

    expect(result.version).toBeDefined();
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.stats.totalTerms).toBeDefined();
    expect(result.stats.crossSubjectTermCount).toBeDefined();
    expect(result.stats.bySubject).toBeDefined();
    expect(result.stats.subjectsCovered).toBeDefined();
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(result.seeAlso).toBeDefined();
  });
});

describe('serializeVocabularyGraph', () => {
  it('does not emit eslint-disable directives in generated output', () => {
    const graph = generateVocabularyGraphData([createKeyword()], '2025-12-26');

    const serialized = serializeVocabularyGraph(graph);

    expect(serialized).toContain('export const vocabularyGraph: VocabularyGraph = {');
    expect(serialized).not.toContain('eslint-disable');
  });
});
