/**
 * Unit tests for the misconception graph generator.
 *
 * @remarks
 * Tests the generation of misconception graph data from extracted misconceptions.
 * The graph helps teachers identify common mistakes and AI agents provide tutoring support.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedMisconception } from '../extractors/index.js';

import {
  generateMisconceptionGraphData,
  type MisconceptionGraph,
  type MisconceptionNode,
} from './misconception-graph-generator.js';

/**
 * Creates a test misconception.
 */
function createMisconception(
  overrides: Partial<ExtractedMisconception> = {},
): ExtractedMisconception {
  return {
    misconception: 'Plants get food from the soil',
    response: 'Plants make their own food through photosynthesis',
    subject: 'science',
    keyStage: 'ks2',
    lessonSlug: 'photosynthesis-basics',
    lessonTitle: 'Understanding Photosynthesis',
    ...overrides,
  };
}

describe('generateMisconceptionGraphData', () => {
  it('returns a MisconceptionGraph structure', () => {
    const misconceptions: readonly ExtractedMisconception[] = [createMisconception()];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result).toBeDefined();
    expect(result.version).toBe('1.0.0');
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBe('2025-12-26');
    expect(result.stats).toBeDefined();
    expect(result.nodes).toBeDefined();
    expect(result.seeAlso).toBeDefined();
  });

  it('includes all misconceptions as nodes', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({ misconception: 'Misconception 1' }),
      createMisconception({ misconception: 'Misconception 2' }),
      createMisconception({ misconception: 'Misconception 3' }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.nodes).toHaveLength(3);
    expect(result.stats.totalMisconceptions).toBe(3);
  });

  it('preserves misconception and response fields', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({
        misconception: 'Test misconception text',
        response: 'Test response text',
      }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.misconception).toBe('Test misconception text');
    expect(node?.response).toBe('Test response text');
  });

  it('preserves lesson context', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({
        lessonSlug: 'my-lesson-slug',
        lessonTitle: 'My Lesson Title',
      }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.lessonSlug).toBe('my-lesson-slug');
    expect(node?.lessonTitle).toBe('My Lesson Title');
  });

  it('tracks subject and key stage', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({ subject: 'maths', keyStage: 'ks3' }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.subject).toBe('maths');
    expect(node?.keyStage).toBe('ks3');
  });

  it('calculates statistics by subject', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({ subject: 'science' }),
      createMisconception({ subject: 'science' }),
      createMisconception({ subject: 'maths' }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.stats.bySubject['science']).toBe(2);
    expect(result.stats.bySubject['maths']).toBe(1);
  });

  it('calculates statistics by key stage', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({ keyStage: 'ks2' }),
      createMisconception({ keyStage: 'ks2' }),
      createMisconception({ keyStage: 'ks3' }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.stats.byKeyStage['ks2']).toBe(2);
    expect(result.stats.byKeyStage['ks3']).toBe(1);
  });

  it('lists subjects covered', () => {
    const misconceptions: readonly ExtractedMisconception[] = [
      createMisconception({ subject: 'science' }),
      createMisconception({ subject: 'maths' }),
      createMisconception({ subject: 'english' }),
    ];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.stats.subjectsCovered).toContain('science');
    expect(result.stats.subjectsCovered).toContain('maths');
    expect(result.stats.subjectsCovered).toContain('english');
    expect(result.stats.subjectsCovered).toHaveLength(3);
  });
});

describe('MisconceptionNode type', () => {
  it('has all required fields', () => {
    const misconceptions: readonly ExtractedMisconception[] = [createMisconception()];

    const result = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.nodes[0]).toBeDefined();
    const node = result.nodes[0];
    if (!node) {
      throw new Error('Expected node');
    }

    const typedNode: MisconceptionNode = node;
    expect(typeof typedNode.misconception).toBe('string');
    expect(typeof typedNode.response).toBe('string');
    expect(typeof typedNode.subject).toBe('string');
    expect(typeof typedNode.keyStage).toBe('string');
    expect(typeof typedNode.lessonSlug).toBe('string');
    expect(typeof typedNode.lessonTitle).toBe('string');
  });
});

describe('MisconceptionGraph type', () => {
  it('has all required fields', () => {
    const misconceptions: readonly ExtractedMisconception[] = [createMisconception()];

    const result: MisconceptionGraph = generateMisconceptionGraphData(misconceptions, '2025-12-26');

    expect(result.version).toBeDefined();
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.stats.totalMisconceptions).toBeDefined();
    expect(result.stats.bySubject).toBeDefined();
    expect(result.stats.byKeyStage).toBeDefined();
    expect(result.stats.subjectsCovered).toBeDefined();
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(result.seeAlso).toBeDefined();
  });
});
