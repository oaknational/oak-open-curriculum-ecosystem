/**
 * Unit tests for thread extraction.
 *
 * @remarks
 * A thread is a tag; a unit's curriculum position is its index in its bulk
 * sequence. These tests describe that each membership carries the unit's
 * subject, phase, and per-sequence index, and that the bulk's thread display
 * index never orders anything.
 */
import { describe, expect, it } from 'vitest';

import type { Unit } from '../../types/generated/bulk/index.js';

import { extractThreads } from './thread-extractor.js';

describe('extractThreads', () => {
  const createUnit = (overrides: Partial<Unit>): Unit => ({
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    canonicalUrl:
      'https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/test-unit/lessons',
    subjectSlug: 'maths',
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

  it('records each membership with the subject, sequence, and per-sequence index of its unit', () => {
    const units = [
      {
        unit: createUnit({ unitSlug: 'untagged-first', threads: [] }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'fractions-y3',
          threads: [{ slug: 'number-fractions', order: 9, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'ratio-y7',
          keyStageSlug: 'ks3',
          year: 7,
          threads: [{ slug: 'number-fractions', order: 9, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-secondary',
      },
    ];

    const result = extractThreads(units);

    expect(result[0].units).toEqual([
      {
        unitSlug: 'fractions-y3',
        unitTitle: 'Test Unit',
        subject: 'maths',
        sequenceSlug: 'maths-primary',
        sequenceIndex: 1,
        keyStage: 'ks2',
        year: 4,
      },
      {
        unitSlug: 'ratio-y7',
        unitTitle: 'Test Unit',
        subject: 'maths',
        sequenceSlug: 'maths-secondary',
        sequenceIndex: 0,
        keyStage: 'ks3',
        year: 7,
      },
    ]);
  });

  it('keeps units in bulk encounter order regardless of the thread display index', () => {
    const units = [
      {
        unit: createUnit({
          unitSlug: 'later-in-sequence-higher-index',
          threads: [{ slug: 'number-fractions', order: 3, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
      {
        unit: createUnit({
          unitSlug: 'earlier-in-sequence-lower-index',
          threads: [{ slug: 'number-fractions', order: 2, title: 'Number: Fractions' }],
        }),
        sequenceSlug: 'maths-primary',
      },
    ];

    const result = extractThreads(units);

    expect(result[0].units.map((unit) => unit.unitSlug)).toEqual([
      'later-in-sequence-higher-index',
      'earlier-in-sequence-lower-index',
    ]);
    expect(result[0].units.map((unit) => unit.sequenceIndex)).toEqual([0, 1]);
  });

  it('names the subject as the sequence slug without its phase suffix', () => {
    const units = [
      {
        unit: createUnit({
          threads: [{ slug: 'design', order: 1, title: 'Design' }],
        }),
        sequenceSlug: 'design-technology-secondary',
      },
    ];

    const result = extractThreads(units);

    expect(result[0].units[0].subject).toBe('design-technology');
    expect(result[0].units[0].sequenceSlug).toBe('design-technology-secondary');
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
