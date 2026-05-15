/**
 * Unit tests for the lesson-resource helpers that adopt the API's
 * structured `units[]` shape on lesson responses.
 */

import { describe, it, expect } from 'vitest';
import { extractLessonUnits, formatPrimaryUnit } from './lesson-resource-helpers.js';

describe('extractLessonUnits', () => {
  it('returns the lesson units array', () => {
    const lesson = {
      units: [{ unitSlug: 'fractions', unitTitle: 'Fractions' }],
    };
    expect(extractLessonUnits(lesson)).toEqual([{ unitSlug: 'fractions', unitTitle: 'Fractions' }]);
  });

  it('preserves programmeFactors on each unit entry', () => {
    const lesson = {
      units: [
        {
          unitSlug: 'algebraic-fractions',
          unitTitle: 'Algebraic fractions',
          programmeFactors: {
            tier: { slug: 'higher', title: 'Higher' },
            examBoard: { slug: 'aqa', title: 'AQA' },
          },
        },
      ],
    };
    expect(extractLessonUnits(lesson)).toEqual([
      {
        unitSlug: 'algebraic-fractions',
        unitTitle: 'Algebraic fractions',
        programmeFactors: {
          tier: { slug: 'higher', title: 'Higher' },
          examBoard: { slug: 'aqa', title: 'AQA' },
        },
      },
    ]);
  });

  it('returns multiple entries when a lesson spans programme variants', () => {
    const lesson = {
      units: [
        { unitSlug: 'cells', unitTitle: 'Cells (biology)' },
        { unitSlug: 'cells', unitTitle: 'Cells (combined science)' },
      ],
    };
    expect(extractLessonUnits(lesson)?.length).toBe(2);
  });

  it('returns undefined when units is absent', () => {
    expect(extractLessonUnits({})).toBeUndefined();
  });

  it('returns undefined when units is not an array shape', () => {
    expect(extractLessonUnits({ units: 'not-an-array' })).toBeUndefined();
  });

  it('returns undefined for null and non-object input', () => {
    expect(extractLessonUnits(null)).toBeUndefined();
    expect(extractLessonUnits(42)).toBeUndefined();
  });

  it('rejects element shapes that do not match the lesson unit entry schema', () => {
    expect(
      extractLessonUnits({ units: [{ unitSlug: 'a' /* unitTitle missing */ }] }),
    ).toBeUndefined();
  });
});

describe('formatPrimaryUnit', () => {
  it('returns the first unit element as the deterministic primary projection', () => {
    const lesson = {
      units: [
        { unitSlug: 'fractions', unitTitle: 'Fractions' },
        { unitSlug: 'decimals', unitTitle: 'Decimals' },
      ],
    };
    expect(formatPrimaryUnit(lesson)).toEqual({
      unitSlug: 'fractions',
      unitTitle: 'Fractions',
    });
  });

  it('returns the primary unit with its programmeFactors when present', () => {
    const lesson = {
      units: [
        {
          unitSlug: 'algebraic-fractions',
          unitTitle: 'Algebraic fractions',
          programmeFactors: { tier: { slug: 'higher', title: 'Higher' } },
        },
      ],
    };
    expect(formatPrimaryUnit(lesson)).toEqual({
      unitSlug: 'algebraic-fractions',
      unitTitle: 'Algebraic fractions',
      programmeFactors: { tier: { slug: 'higher', title: 'Higher' } },
    });
  });

  it('returns undefined when the units array is empty', () => {
    expect(formatPrimaryUnit({ units: [] })).toBeUndefined();
  });
});
