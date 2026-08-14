/**
 * Tests for the restricted-lesson exclusion at the bulk-data boundary.
 *
 * @remarks
 * The filter enforces the MCP-204 ruling: lessons flagged `restricted: true`
 * by upstream are excluded from every generated surface at generation time,
 * and their `unitLessons` references are pruned so restricted slugs and
 * titles do not survive through unit-derived documents.
 */
import { describe, expect, it } from 'vitest';
import { bulkDownloadFileSchema, type BulkDownloadFile } from '../types/generated/bulk/index.js';
import type { BulkFileResult } from './reader.js';
import {
  excludeRestrictedLessons,
  excludeRestrictedLessonsFromFile,
} from './restricted-lesson-filter.js';
import {
  createLessonInput,
  createUnitInput,
  type LessonInput,
  type UnitInput,
} from './test-fixtures.js';

/** Builds a unitLessons entry referencing a lesson slug */
function createUnitLessonRef(lessonSlug: string, lessonOrder: number) {
  return { lessonSlug, lessonTitle: `Title of ${lessonSlug}`, lessonOrder, state: 'published' };
}

/** Parses a complete bulk file from input-shaped parts */
function createFile(
  units: readonly UnitInput[],
  lessons: readonly LessonInput[],
): BulkDownloadFile {
  return bulkDownloadFileSchema.parse({
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Maths',
    sequence: units,
    lessons,
  });
}

/** Wraps parsed data in the reader's BulkFileResult shape */
function createFileResult(filename: string, data: BulkDownloadFile): BulkFileResult {
  return { filename, subjectPhase: { subject: 'maths', phase: 'primary' }, data };
}

describe('excludeRestrictedLessonsFromFile', () => {
  it.each([
    ['restricted: true', { restricted: true }, 0, 1],
    ['restricted: false', { restricted: false }, 1, 0],
    ['no restricted field', {}, 1, 0],
  ])(
    'keeps a lesson unless restricted is exactly true (%s)',
    (_label, overrides, keptLessons, excludedCount) => {
      const file = createFile([createUnitInput()], [createLessonInput(overrides)]);

      const result = excludeRestrictedLessonsFromFile(file);

      expect(result.data.lessons).toHaveLength(keptLessons);
      expect(result.restrictedLessonsExcluded).toBe(excludedCount);
    },
  );

  it('prunes the restricted lesson from its unit lesson list and keeps the rest', () => {
    const unit = createUnitInput({
      unitLessons: [createUnitLessonRef('kept-lesson', 1), createUnitLessonRef('hidden-lesson', 2)],
    });
    const file = createFile(
      [unit],
      [
        createLessonInput({ lessonSlug: 'kept-lesson' }),
        createLessonInput({ lessonSlug: 'hidden-lesson', restricted: true }),
      ],
    );

    const result = excludeRestrictedLessonsFromFile(file);

    expect(result.data.lessons.map((l) => l.lessonSlug)).toEqual(['kept-lesson']);
    expect(result.data.sequence[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual(['kept-lesson']);
    expect(result.restrictedLessonsExcluded).toBe(1);
  });

  it('keeps a unit whose every lesson is restricted, with an empty lesson list', () => {
    const unit = createUnitInput({
      unitLessons: [createUnitLessonRef('hidden-a', 1), createUnitLessonRef('hidden-b', 2)],
    });
    const file = createFile(
      [unit],
      [
        createLessonInput({ lessonSlug: 'hidden-a', restricted: true }),
        createLessonInput({ lessonSlug: 'hidden-b', restricted: true }),
      ],
    );

    const result = excludeRestrictedLessonsFromFile(file);

    expect(result.data.sequence.map((u) => u.unitSlug)).toEqual(['test-unit']);
    expect(result.data.sequence[0]?.unitLessons).toEqual([]);
    expect(result.data.lessons).toEqual([]);
    expect(result.restrictedLessonsExcluded).toBe(2);
  });

  it('counts lesson records, not distinct slugs, when a slug repeats within a file', () => {
    const file = createFile(
      [createUnitInput()],
      [
        createLessonInput({ lessonSlug: 'tiered-lesson', restricted: true }),
        createLessonInput({ lessonSlug: 'tiered-lesson', restricted: true }),
      ],
    );

    const result = excludeRestrictedLessonsFromFile(file);

    expect(result.data.lessons).toEqual([]);
    expect(result.restrictedLessonsExcluded).toBe(2);
  });

  it('leaves the caller input unchanged', () => {
    const unit = createUnitInput({ unitLessons: [createUnitLessonRef('hidden-lesson', 1)] });
    const file = createFile(
      [unit],
      [createLessonInput({ lessonSlug: 'hidden-lesson', restricted: true })],
    );

    excludeRestrictedLessonsFromFile(file);

    expect(file.lessons.map((l) => l.lessonSlug)).toEqual(['hidden-lesson']);
    expect(file.sequence[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual(['hidden-lesson']);
  });
});

describe('excludeRestrictedLessons', () => {
  it('reports the number of lesson records removed across every file', () => {
    const fileA = createFile(
      [createUnitInput()],
      [
        createLessonInput({ lessonSlug: 'a-kept' }),
        createLessonInput({ lessonSlug: 'a-hidden-1', restricted: true }),
        createLessonInput({ lessonSlug: 'a-hidden-2', restricted: true }),
        createLessonInput({ lessonSlug: 'a-hidden-3', restricted: true }),
      ],
    );
    const fileB = createFile(
      [createUnitInput()],
      [
        createLessonInput({ lessonSlug: 'b-kept-1' }),
        createLessonInput({ lessonSlug: 'b-hidden', restricted: true }),
        createLessonInput({ lessonSlug: 'b-kept-2' }),
      ],
    );

    const result = excludeRestrictedLessons([
      createFileResult('maths-primary.json', fileA),
      createFileResult('maths-secondary.json', fileB),
    ]);

    expect(result.restrictedLessonsExcluded).toBe(4);
    expect(result.files.map((f) => f.filename)).toEqual([
      'maths-primary.json',
      'maths-secondary.json',
    ]);
    expect(result.files[0]?.data.lessons.map((l) => l.lessonSlug)).toEqual(['a-kept']);
    expect(result.files[1]?.data.lessons.map((l) => l.lessonSlug)).toEqual([
      'b-kept-1',
      'b-kept-2',
    ]);
  });

  it('scopes the restricted set per file: a slug restricted in one file survives unrestricted in another', () => {
    const unitWithShared = createUnitInput({
      unitLessons: [createUnitLessonRef('shared-lesson', 1)],
    });
    const fileA = createFile(
      [unitWithShared],
      [createLessonInput({ lessonSlug: 'shared-lesson', restricted: true })],
    );
    const fileB = createFile(
      [unitWithShared],
      [createLessonInput({ lessonSlug: 'shared-lesson' })],
    );

    const result = excludeRestrictedLessons([
      createFileResult('maths-primary.json', fileA),
      createFileResult('maths-secondary.json', fileB),
    ]);

    expect(result.files[0]?.data.lessons).toEqual([]);
    expect(result.files[0]?.data.sequence[0]?.unitLessons).toEqual([]);
    expect(result.files[1]?.data.lessons.map((l) => l.lessonSlug)).toEqual(['shared-lesson']);
    expect(result.files[1]?.data.sequence[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual([
      'shared-lesson',
    ]);
    expect(result.restrictedLessonsExcluded).toBe(1);
  });

  it('reports a zero count when no lesson is restricted', () => {
    const file = createFile([createUnitInput()], [createLessonInput()]);

    const result = excludeRestrictedLessons([createFileResult('maths-primary.json', file)]);

    expect(result.restrictedLessonsExcluded).toBe(0);
    expect(result.files[0]?.data.lessons).toHaveLength(1);
  });

  it('defaults to excluding restricted lessons when no option is given', () => {
    const unit = createUnitInput({
      unitLessons: [createUnitLessonRef('kept', 1), createUnitLessonRef('hidden', 2)],
    });
    const file = createFile(
      [unit],
      [
        createLessonInput({ lessonSlug: 'kept' }),
        createLessonInput({ lessonSlug: 'hidden', restricted: true }),
      ],
    );

    const result = excludeRestrictedLessons([createFileResult('maths-primary.json', file)]);

    expect(result.files[0]?.data.lessons.map((l) => l.lessonSlug)).toEqual(['kept']);
    expect(result.restrictedLessonsExcluded).toBe(1);
  });

  it('retains restricted lessons and their unit references when includeRestricted is true', () => {
    const unit = createUnitInput({
      unitLessons: [createUnitLessonRef('kept', 1), createUnitLessonRef('hidden', 2)],
    });
    const file = createFile(
      [unit],
      [
        createLessonInput({ lessonSlug: 'kept' }),
        createLessonInput({ lessonSlug: 'hidden', restricted: true }),
      ],
    );

    const result = excludeRestrictedLessons([createFileResult('maths-primary.json', file)], {
      includeRestricted: true,
    });

    expect(result.files[0]?.data.lessons.map((l) => l.lessonSlug)).toEqual(['kept', 'hidden']);
    expect(result.files[0]?.data.sequence[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual([
      'kept',
      'hidden',
    ]);
    expect(result.restrictedLessonsExcluded).toBe(0);
  });
});
