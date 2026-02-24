/**
 * Unit tests for thread extraction.
 */
import { describe, expect, it } from 'vitest';

import type { Unit } from '../lib/index.js';

import { extractThreads } from './thread-extractor.js';

describe('extractThreads', () => {
  const createUnit = (overrides: Partial<Unit>): Unit => ({
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    threads: [],
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: '',
    yearSlug: 'year-4',
    year: 4,
    keyStageSlug: 'ks2',
    unitLessons: [],
    ...overrides,
  });

  it('extracts threads from units', () => {
    const units = [
      {
        unit: createUnit({
          unitSlug: 'fractions-y4',
          unitTitle: 'Fractions Year 4',
          threads: [{ slug: 'number-fractions', order: 3, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('number-fractions');
    expect(result[0].title).toBe('Number: Fractions');
  });

  it('aggregates multiple units into same thread', () => {
    const units = [
      {
        unit: createUnit({
          unitSlug: 'fractions-y3',
          year: 3,
          threads: [{ slug: 'number-fractions', order: 2, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'fractions-y4',
          year: 4,
          threads: [{ slug: 'number-fractions', order: 3, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result).toHaveLength(1);
    expect(result[0].units).toHaveLength(2);
  });

  it('orders units within thread by order field', () => {
    const units = [
      {
        unit: createUnit({
          unitSlug: 'fractions-y4',
          threads: [{ slug: 'number-fractions', order: 3, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'fractions-y3',
          threads: [{ slug: 'number-fractions', order: 2, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result[0].units[0].unitSlug).toBe('fractions-y3');
    expect(result[0].units[1].unitSlug).toBe('fractions-y4');
  });

  it('calculates year span', () => {
    const units = [
      {
        unit: createUnit({
          unitSlug: 'fractions-y3',
          year: 3,
          threads: [{ slug: 'number-fractions', order: 1, title: 'Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'fractions-y6',
          year: 6,
          threads: [{ slug: 'number-fractions', order: 4, title: 'Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result[0].firstYear).toBe(3);
    expect(result[0].lastYear).toBe(6);
  });

  it('handles units with no threads', () => {
    const units = [
      {
        unit: createUnit({ threads: [] }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result).toHaveLength(0);
  });
});
