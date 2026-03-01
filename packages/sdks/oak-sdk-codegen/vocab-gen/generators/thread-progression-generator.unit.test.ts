/**
 * Unit tests for the thread progression generator.
 *
 * @remarks
 * Tests the pure function that transforms extracted thread data
 * into the static graph structure for MCP tools.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedThread } from '../extractors/index.js';

import { generateThreadProgressionData } from './thread-progression-generator.js';

/**
 * Creates a minimal valid ExtractedThread fixture.
 */
function createThread(overrides: Partial<ExtractedThread> = {}): ExtractedThread {
  return {
    slug: 'number-fractions',
    title: 'Number: Fractions',
    units: [
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        order: 1,
        subject: 'maths',
        keyStage: 'ks2',
        year: 3,
      },
      {
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        order: 2,
        subject: 'maths',
        keyStage: 'ks2',
        year: 4,
      },
    ],
    firstYear: 3,
    lastYear: 4,
    ...overrides,
  };
}

describe('generateThreadProgressionData', () => {
  it('generates graph structure with version and metadata', () => {
    const threads: readonly ExtractedThread[] = [createThread()];
    const sourceVersion = '2025-12-07T09:37:04.693Z';

    const result = generateThreadProgressionData(threads, sourceVersion);

    expect(result.version).toBe('1.0.0');
    expect(result.sourceVersion).toBe('2025-12-07T09:37:04.693Z');
    expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('includes stats for context', () => {
    const threads: readonly ExtractedThread[] = [
      createThread({ slug: 'thread-1' }),
      createThread({ slug: 'thread-2' }),
    ];

    const result = generateThreadProgressionData(threads, 'test');

    expect(result.stats.threadCount).toBe(2);
    expect(result.stats.subjectsCovered).toContain('maths');
  });

  it('maps threads to graph nodes', () => {
    const thread = createThread({
      slug: 'number-fractions',
      title: 'Number: Fractions',
      firstYear: 3,
      lastYear: 6,
    });
    const threads: readonly ExtractedThread[] = [thread];

    const result = generateThreadProgressionData(threads, 'test');

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0]).toEqual({
      slug: 'number-fractions',
      title: 'Number: Fractions',
      subjects: ['maths'],
      firstYear: 3,
      lastYear: 6,
      unitCount: 2,
      units: ['fractions-year-3', 'fractions-year-4'],
    });
  });

  it('sorts threads by slug for deterministic output', () => {
    const threads: readonly ExtractedThread[] = [
      createThread({ slug: 'z-thread' }),
      createThread({ slug: 'a-thread' }),
      createThread({ slug: 'm-thread' }),
    ];

    const result = generateThreadProgressionData(threads, 'test');

    expect(result.threads.map((t) => t.slug)).toEqual(['a-thread', 'm-thread', 'z-thread']);
  });

  it('handles threads with undefined years', () => {
    const thread = createThread({
      firstYear: undefined,
      lastYear: undefined,
      units: [
        {
          unitSlug: 'all-years-unit',
          unitTitle: 'All Years Unit',
          order: 1,
          subject: 'pe',
          keyStage: 'ks3',
          year: undefined,
        },
      ],
    });

    const result = generateThreadProgressionData([thread], 'test');

    expect(result.threads[0]?.firstYear).toBeUndefined();
    expect(result.threads[0]?.lastYear).toBeUndefined();
  });

  it('collects unique subjects across all threads', () => {
    const threads: readonly ExtractedThread[] = [
      createThread({
        slug: 'maths-thread',
        units: [
          {
            unitSlug: 'unit-1',
            unitTitle: 'Unit 1',
            order: 1,
            subject: 'maths',
            keyStage: 'ks2',
            year: 3,
          },
        ],
      }),
      createThread({
        slug: 'science-thread',
        units: [
          {
            unitSlug: 'unit-2',
            unitTitle: 'Unit 2',
            order: 1,
            subject: 'science',
            keyStage: 'ks2',
            year: 3,
          },
        ],
      }),
    ];

    const result = generateThreadProgressionData(threads, 'test');

    expect(result.stats.subjectsCovered).toHaveLength(2);
    expect(result.stats.subjectsCovered).toContain('maths');
    expect(result.stats.subjectsCovered).toContain('science');
  });

  it('collects subjects from all units when a thread spans multiple subjects', () => {
    const mflThread = createThread({
      slug: 'adjectives',
      title: 'Adjectives',
      units: [
        {
          unitSlug: 'french-adjectives-1',
          unitTitle: 'French Adjectives 1',
          order: 1,
          subject: 'french',
          keyStage: 'ks2',
          year: 3,
        },
        {
          unitSlug: 'german-adjectives-1',
          unitTitle: 'German Adjectives 1',
          order: 2,
          subject: 'german',
          keyStage: 'ks3',
          year: 7,
        },
        {
          unitSlug: 'spanish-adjectives-1',
          unitTitle: 'Spanish Adjectives 1',
          order: 3,
          subject: 'spanish',
          keyStage: 'ks3',
          year: 7,
        },
      ],
    });

    const result = generateThreadProgressionData([mflThread], 'test');

    expect(result.threads[0]?.subjects).toEqual(['french', 'german', 'spanish']);
    expect(result.stats.subjectsCovered).toEqual(['french', 'german', 'spanish']);
  });

  it('includes cross-reference to related tools', () => {
    const result = generateThreadProgressionData([createThread()], 'test');

    expect(result.seeAlso).toBeDefined();
    expect(result.seeAlso.length).toBeGreaterThan(0);
  });
});
