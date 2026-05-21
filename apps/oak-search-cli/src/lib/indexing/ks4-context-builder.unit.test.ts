/**
 * Unit tests for KS4 context builder functions.
 *
 * Builds `UnitContext` records by traversing the live-API sequence-units
 * response. Tier and exam-subject metadata is sourced here. Exam-board and
 * ks4-option metadata is owned by the bulk-data pipeline.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import { describe, expect, it } from 'vitest';
import {
  buildUnitContextsFromSequenceResponse,
  mergeUnitContexts,
  buildKs4ContextMap,
  type UnitContext,
  type UnitContextMap,
} from './ks4-context-builder';

describe('buildUnitContextsFromSequenceResponse', () => {
  describe('handles KS4 Maths structure (year -> tiers -> units)', () => {
    it('extracts unit contexts from tiered response without exam subjects', () => {
      const response = [
        {
          year: 10,
          tiers: [
            {
              tierSlug: 'foundation',
              tierTitle: 'Foundation',
              units: [
                {
                  unitSlug: 'fractions-foundation',
                  unitTitle: 'Fractions (Foundation)',
                  unitOrder: 1,
                },
                { unitSlug: 'algebra-foundation', unitTitle: 'Algebra (Foundation)', unitOrder: 2 },
              ],
            },
            {
              tierSlug: 'higher',
              tierTitle: 'Higher',
              units: [
                { unitSlug: 'fractions-higher', unitTitle: 'Fractions (Higher)', unitOrder: 1 },
                { unitSlug: 'algebra-higher', unitTitle: 'Algebra (Higher)', unitOrder: 2 },
              ],
            },
          ],
        },
      ];

      const result = buildUnitContextsFromSequenceResponse(response);

      expect(result).toHaveLength(4);
      expect(result).toContainEqual({
        unitSlug: 'fractions-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examSubjects: [],
        examSubjectTitles: [],
      });
      expect(result).toContainEqual({
        unitSlug: 'fractions-higher',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examSubjects: [],
        examSubjectTitles: [],
      });
    });

    it('handles units with unitOptions (explodes into multiple contexts)', () => {
      const response = [
        {
          year: 10,
          tiers: [
            {
              tierSlug: 'foundation',
              tierTitle: 'Foundation',
              units: [
                {
                  unitTitle: 'Equations',
                  unitOrder: 1,
                  unitOptions: [
                    { unitSlug: 'equations-a', unitTitle: 'Equations A' },
                    { unitSlug: 'equations-b', unitTitle: 'Equations B' },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = buildUnitContextsFromSequenceResponse(response);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.unitSlug)).toContain('equations-a');
      expect(result.map((r) => r.unitSlug)).toContain('equations-b');
    });
  });

  describe('handles KS4 Sciences structure (year -> examSubjects -> tiers -> units)', () => {
    it('extracts unit contexts from tiered response with exam subjects', () => {
      const response = [
        {
          year: 10,
          examSubjects: [
            {
              examSubjectSlug: 'biology',
              examSubjectTitle: 'Biology',
              tiers: [
                {
                  tierSlug: 'foundation',
                  tierTitle: 'Foundation',
                  units: [
                    { unitSlug: 'cells-foundation', unitTitle: 'Cells (Foundation)', unitOrder: 1 },
                  ],
                },
                {
                  tierSlug: 'higher',
                  tierTitle: 'Higher',
                  units: [{ unitSlug: 'cells-higher', unitTitle: 'Cells (Higher)', unitOrder: 1 }],
                },
              ],
            },
            {
              examSubjectSlug: 'chemistry',
              examSubjectTitle: 'Chemistry',
              tiers: [
                {
                  tierSlug: 'foundation',
                  tierTitle: 'Foundation',
                  units: [
                    { unitSlug: 'atoms-foundation', unitTitle: 'Atoms (Foundation)', unitOrder: 1 },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = buildUnitContextsFromSequenceResponse(response);

      expect(result).toHaveLength(3);

      const cellsFoundation = result.find((r) => r.unitSlug === 'cells-foundation');
      expect(cellsFoundation).toEqual({
        unitSlug: 'cells-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examSubjects: ['biology'],
        examSubjectTitles: ['Biology'],
      });

      const atomsFoundation = result.find((r) => r.unitSlug === 'atoms-foundation');
      expect(atomsFoundation).toEqual({
        unitSlug: 'atoms-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examSubjects: ['chemistry'],
        examSubjectTitles: ['Chemistry'],
      });
    });
  });

  describe('handles non-tiered structure (year -> units)', () => {
    it('returns empty array for non-tiered responses (no KS4 context)', () => {
      const response = [
        {
          year: 7,
          units: [{ unitSlug: 'intro-fractions', unitTitle: 'Intro to Fractions', unitOrder: 1 }],
        },
      ];

      const result = buildUnitContextsFromSequenceResponse(response);

      expect(result).toEqual([]);
    });
  });

  describe('handles empty and edge cases', () => {
    it('returns empty array for empty response', () => {
      const result = buildUnitContextsFromSequenceResponse([]);
      expect(result).toEqual([]);
    });

    it('returns empty array for null response', () => {
      const result = buildUnitContextsFromSequenceResponse(null);
      expect(result).toEqual([]);
    });

    it('returns empty array for undefined response', () => {
      const result = buildUnitContextsFromSequenceResponse(undefined);
      expect(result).toEqual([]);
    });
  });
});

describe('mergeUnitContexts', () => {
  it('creates new entry for unit not in map', () => {
    const existingMap: UnitContextMap = new Map();
    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examSubjects: ['biology'],
        examSubjectTitles: ['Biology'],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    expect(result.get('fractions')).toEqual({
      tiers: ['foundation'],
      tierTitles: ['Foundation'],
      examSubjects: ['biology'],
      examSubjectTitles: ['Biology'],
    });
  });

  it('merges arrays for unit already in map (many-to-many)', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examSubjects: ['biology'],
          examSubjectTitles: ['Biology'],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examSubjects: ['chemistry'],
        examSubjectTitles: ['Chemistry'],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    const merged = result.get('fractions');
    expect(merged?.tiers).toContain('foundation');
    expect(merged?.tiers).toContain('higher');
    expect(merged?.examSubjects).toContain('biology');
    expect(merged?.examSubjects).toContain('chemistry');
  });

  it('deduplicates values when merging', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examSubjects: [],
          examSubjectTitles: [],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examSubjects: [],
        examSubjectTitles: [],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    const merged = result.get('fractions');
    expect(merged?.tiers).toEqual(['foundation']);
  });

  it('preserves existing entries when adding new units', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examSubjects: [],
          examSubjectTitles: [],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'algebra',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examSubjects: [],
        examSubjectTitles: [],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    expect(result.has('fractions')).toBe(true);
    expect(result.has('algebra')).toBe(true);
    expect(result.size).toBe(2);
  });

  it('does not mutate the original map', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examSubjects: [],
          examSubjectTitles: [],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examSubjects: [],
        examSubjectTitles: [],
      },
    ];

    mergeUnitContexts(existingMap, newContexts);

    expect(existingMap.get('fractions')?.tiers).toEqual(['foundation']);
  });
});

describe('buildKs4ContextMap', () => {
  it('extracts tiers from Maths-style sequences (tiered years, no exam subjects)', async () => {
    const mathsSecondaryResponse = [
      {
        year: 7,
        units: [{ unitSlug: 'place-value', unitTitle: 'Place Value', unitOrder: 1 }],
      },
      {
        year: 10,
        tiers: [
          {
            tierSlug: 'foundation',
            tierTitle: 'Foundation',
            units: [
              {
                unitSlug: 'algebraic-manipulation',
                unitTitle: 'Algebraic Manipulation',
                unitOrder: 1,
              },
            ],
          },
          {
            tierSlug: 'higher',
            tierTitle: 'Higher',
            units: [
              {
                unitSlug: 'algebraic-manipulation',
                unitTitle: 'Algebraic Manipulation',
                unitOrder: 1,
              },
            ],
          },
        ],
      },
    ];

    const fetchSequenceUnits = async (slug: string): Promise<unknown> => {
      if (slug === 'maths-secondary') {
        return mathsSecondaryResponse;
      }
      return [];
    };

    const sequences = [{ sequenceSlug: 'maths-secondary' }];

    const result = await buildKs4ContextMap(fetchSequenceUnits, sequences);

    const algebraContext = result.get('algebraic-manipulation');
    expect(algebraContext).toBeDefined();
    expect(algebraContext?.tiers).toContain('foundation');
    expect(algebraContext?.tiers).toContain('higher');
    expect(algebraContext?.tierTitles).toContain('Foundation');
    expect(algebraContext?.tierTitles).toContain('Higher');
  });

  it('extracts tiers and exam subjects from Sciences-style sequences', async () => {
    const scienceAqaResponse = [
      {
        year: 10,
        examSubjects: [
          {
            examSubjectSlug: 'biology',
            examSubjectTitle: 'Biology',
            tiers: [
              {
                tierSlug: 'foundation',
                tierTitle: 'Foundation',
                units: [{ unitSlug: 'cells', unitTitle: 'Cells', unitOrder: 1 }],
              },
            ],
          },
        ],
      },
    ];

    const fetchSequenceUnits = async (slug: string): Promise<unknown> => {
      if (slug === 'science-secondary-aqa') {
        return scienceAqaResponse;
      }
      return [];
    };

    const sequences = [{ sequenceSlug: 'science-secondary-aqa' }];

    const result = await buildKs4ContextMap(fetchSequenceUnits, sequences);

    const cellsContext = result.get('cells');
    expect(cellsContext).toBeDefined();
    expect(cellsContext?.tiers).toContain('foundation');
    expect(cellsContext?.examSubjects).toContain('biology');
  });
});
