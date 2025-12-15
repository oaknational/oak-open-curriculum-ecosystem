/**
 * Unit tests for KS4 context builder functions.
 *
 * These tests follow TDD RED phase - they are written BEFORE the implementation.
 * The tests specify the desired behaviour for building UnitContextMap from
 * sequence traversal data.
 *
 * @module ks4-context-builder.unit.test
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import { describe, expect, it } from 'vitest';
import {
  parseExamBoardFromSlug,
  buildUnitContextsFromSequenceResponse,
  mergeUnitContexts,
  type UnitContext,
  type UnitContextMap,
} from './ks4-context-builder';

describe('parseExamBoardFromSlug', () => {
  it('extracts aqa from science-secondary-aqa', () => {
    const result = parseExamBoardFromSlug('science-secondary-aqa');
    expect(result).toEqual({ slug: 'aqa', title: 'AQA' });
  });

  it('extracts edexcel from science-secondary-edexcel', () => {
    const result = parseExamBoardFromSlug('science-secondary-edexcel');
    expect(result).toEqual({ slug: 'edexcel', title: 'Edexcel' });
  });

  it('extracts ocr from science-secondary-ocr', () => {
    const result = parseExamBoardFromSlug('science-secondary-ocr');
    expect(result).toEqual({ slug: 'ocr', title: 'OCR' });
  });

  it('extracts eduqas from science-secondary-eduqas', () => {
    const result = parseExamBoardFromSlug('science-secondary-eduqas');
    expect(result).toEqual({ slug: 'eduqas', title: 'Eduqas' });
  });

  it('extracts edexcelb from science-secondary-edexcelb', () => {
    const result = parseExamBoardFromSlug('science-secondary-edexcelb');
    expect(result).toEqual({ slug: 'edexcelb', title: 'Edexcel B' });
  });

  it('returns null for maths-secondary (no exam board)', () => {
    const result = parseExamBoardFromSlug('maths-secondary');
    expect(result).toBeNull();
  });

  it('returns null for english-primary (not KS4)', () => {
    const result = parseExamBoardFromSlug('english-primary');
    expect(result).toBeNull();
  });

  it('handles case insensitivity', () => {
    const result = parseExamBoardFromSlug('Science-Secondary-AQA');
    expect(result).toEqual({ slug: 'aqa', title: 'AQA' });
  });
});

describe('buildUnitContextsFromSequenceResponse', () => {
  const ks4Option = { slug: 'gcse-maths', title: 'GCSE Maths' };

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

      const result = buildUnitContextsFromSequenceResponse(response, null, ks4Option);

      expect(result).toHaveLength(4);
      expect(result).toContainEqual({
        unitSlug: 'fractions-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examBoards: [],
        examBoardTitles: [],
        examSubjects: [],
        examSubjectTitles: [],
        ks4Options: ['gcse-maths'],
        ks4OptionTitles: ['GCSE Maths'],
      });
      expect(result).toContainEqual({
        unitSlug: 'fractions-higher',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examBoards: [],
        examBoardTitles: [],
        examSubjects: [],
        examSubjectTitles: [],
        ks4Options: ['gcse-maths'],
        ks4OptionTitles: ['GCSE Maths'],
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

      const result = buildUnitContextsFromSequenceResponse(response, null, ks4Option);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.unitSlug)).toContain('equations-a');
      expect(result.map((r) => r.unitSlug)).toContain('equations-b');
    });
  });

  describe('handles KS4 Sciences structure (year -> examSubjects -> tiers -> units)', () => {
    const examBoard = { slug: 'aqa', title: 'AQA' };
    const scienceKs4Option = { slug: 'aqa-gcse-science', title: 'AQA GCSE Science' };

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

      const result = buildUnitContextsFromSequenceResponse(response, examBoard, scienceKs4Option);

      expect(result).toHaveLength(3);

      const cellsFoundation = result.find((r) => r.unitSlug === 'cells-foundation');
      expect(cellsFoundation).toEqual({
        unitSlug: 'cells-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examBoards: ['aqa'],
        examBoardTitles: ['AQA'],
        examSubjects: ['biology'],
        examSubjectTitles: ['Biology'],
        ks4Options: ['aqa-gcse-science'],
        ks4OptionTitles: ['AQA GCSE Science'],
      });

      const atomsFoundation = result.find((r) => r.unitSlug === 'atoms-foundation');
      expect(atomsFoundation).toEqual({
        unitSlug: 'atoms-foundation',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examBoards: ['aqa'],
        examBoardTitles: ['AQA'],
        examSubjects: ['chemistry'],
        examSubjectTitles: ['Chemistry'],
        ks4Options: ['aqa-gcse-science'],
        ks4OptionTitles: ['AQA GCSE Science'],
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

      const result = buildUnitContextsFromSequenceResponse(response, null, null);

      expect(result).toEqual([]);
    });
  });

  describe('handles empty and edge cases', () => {
    it('returns empty array for empty response', () => {
      const result = buildUnitContextsFromSequenceResponse([], null, ks4Option);
      expect(result).toEqual([]);
    });

    it('returns empty array for null response', () => {
      const result = buildUnitContextsFromSequenceResponse(null, null, ks4Option);
      expect(result).toEqual([]);
    });

    it('returns empty array for undefined response', () => {
      const result = buildUnitContextsFromSequenceResponse(undefined, null, ks4Option);
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
        examBoards: ['aqa'],
        examBoardTitles: ['AQA'],
        examSubjects: ['biology'],
        examSubjectTitles: ['Biology'],
        ks4Options: ['aqa-gcse-science'],
        ks4OptionTitles: ['AQA GCSE Science'],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    expect(result.get('fractions')).toEqual({
      tiers: ['foundation'],
      tierTitles: ['Foundation'],
      examBoards: ['aqa'],
      examBoardTitles: ['AQA'],
      examSubjects: ['biology'],
      examSubjectTitles: ['Biology'],
      ks4Options: ['aqa-gcse-science'],
      ks4OptionTitles: ['AQA GCSE Science'],
    });
  });

  it('merges arrays for unit already in map (many-to-many)', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examBoards: ['aqa'],
          examBoardTitles: ['AQA'],
          examSubjects: ['biology'],
          examSubjectTitles: ['Biology'],
          ks4Options: ['aqa-gcse-science'],
          ks4OptionTitles: ['AQA GCSE Science'],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examBoards: ['aqa'],
        examBoardTitles: ['AQA'],
        examSubjects: ['chemistry'],
        examSubjectTitles: ['Chemistry'],
        ks4Options: ['aqa-gcse-science'],
        ks4OptionTitles: ['AQA GCSE Science'],
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
          examBoards: ['aqa'],
          examBoardTitles: ['AQA'],
          examSubjects: [],
          examSubjectTitles: [],
          ks4Options: ['gcse-maths'],
          ks4OptionTitles: ['GCSE Maths'],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['foundation'],
        tierTitles: ['Foundation'],
        examBoards: ['aqa'],
        examBoardTitles: ['AQA'],
        examSubjects: [],
        examSubjectTitles: [],
        ks4Options: ['gcse-maths'],
        ks4OptionTitles: ['GCSE Maths'],
      },
    ];

    const result = mergeUnitContexts(existingMap, newContexts);

    const merged = result.get('fractions');
    expect(merged?.tiers).toEqual(['foundation']);
    expect(merged?.examBoards).toEqual(['aqa']);
  });

  it('preserves existing entries when adding new units', () => {
    const existingMap: UnitContextMap = new Map([
      [
        'fractions',
        {
          tiers: ['foundation'],
          tierTitles: ['Foundation'],
          examBoards: [],
          examBoardTitles: [],
          examSubjects: [],
          examSubjectTitles: [],
          ks4Options: [],
          ks4OptionTitles: [],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'algebra',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examBoards: [],
        examBoardTitles: [],
        examSubjects: [],
        examSubjectTitles: [],
        ks4Options: [],
        ks4OptionTitles: [],
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
          examBoards: [],
          examBoardTitles: [],
          examSubjects: [],
          examSubjectTitles: [],
          ks4Options: [],
          ks4OptionTitles: [],
        },
      ],
    ]);

    const newContexts: UnitContext[] = [
      {
        unitSlug: 'fractions',
        tiers: ['higher'],
        tierTitles: ['Higher'],
        examBoards: [],
        examBoardTitles: [],
        examSubjects: [],
        examSubjectTitles: [],
        ks4Options: [],
        ks4OptionTitles: [],
      },
    ];

    mergeUnitContexts(existingMap, newContexts);

    // Original should be unchanged
    expect(existingMap.get('fractions')?.tiers).toEqual(['foundation']);
  });
});
