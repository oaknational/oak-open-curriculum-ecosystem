/**
 * Unit tests for the vocabulary mining pipeline orchestrator.
 *
 * @remarks
 * Tests pure functions for pipeline configuration and output formatting.
 * File system operations are in separate integration tests.
 */
import { describe, expect, it } from 'vitest';

import { bulkDownloadFileSchema, type BulkFileResult } from '../src/bulk.js';
import { createLessonInput, createUnitInput, type LessonInput } from '../src/bulk/test-fixtures.js';
import { runPipeline } from './vocab-gen.js';
import { toBulkDataInputs } from './vocab-gen-inputs.js';
import { createPipelineConfig, type PipelineResult } from './vocab-gen-config.js';
import { formatPipelineResult } from './vocab-gen-format.js';

/** Wraps lessons and a referencing unit into a read bulk-file result */
function createFileResult(lessons: readonly LessonInput[]): BulkFileResult {
  const data = bulkDownloadFileSchema.parse({
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Maths',
    sequence: [
      createUnitInput({
        unitLessons: lessons.map((lesson, index) => ({
          lessonSlug: lesson.lessonSlug,
          lessonTitle: lesson.lessonTitle,
          lessonOrder: index + 1,
          state: 'published',
        })),
      }),
    ],
    lessons,
  });
  return {
    filename: 'maths-primary.json',
    subjectPhase: { subject: 'maths', phase: 'primary' },
    data,
  };
}

describe('toBulkDataInputs', () => {
  it('excludes restricted lessons and their unit references from the pipeline inputs', () => {
    const files = [
      createFileResult([
        createLessonInput({ lessonSlug: 'kept-lesson' }),
        createLessonInput({
          lessonSlug: 'hidden-lesson',
          restricted: true,
          lessonKeywords: [
            { keyword: 'sentinelrestrictedkeyword', description: 'A restricted definition.' },
          ],
        }),
      ]),
    ];

    const result = toBulkDataInputs(files);

    expect(result.inputs[0]?.lessons.map((l) => l.lessonSlug)).toEqual(['kept-lesson']);
    expect(result.inputs[0]?.units[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual([
      'kept-lesson',
    ]);
    expect(JSON.stringify(result.inputs)).not.toContain('sentinelrestrictedkeyword');
    expect(result.restrictedLessonsExcluded).toBe(1);
  });

  it('passes unrestricted data through with a zero count', () => {
    const files = [createFileResult([createLessonInput({ lessonSlug: 'kept-lesson' })])];

    const result = toBulkDataInputs(files);

    expect(result.inputs[0]?.lessons).toHaveLength(1);
    expect(result.inputs[0]?.sequenceSlug).toBe('maths-primary');
    expect(result.restrictedLessonsExcluded).toBe(0);
  });

  it('retains restricted lessons and their unit references when includeRestricted is true', () => {
    const files = [
      createFileResult([
        createLessonInput({ lessonSlug: 'kept-lesson' }),
        createLessonInput({ lessonSlug: 'hidden-lesson', restricted: true }),
      ]),
    ];

    const result = toBulkDataInputs(files, { includeRestricted: true });

    expect(result.inputs[0]?.lessons.map((l) => l.lessonSlug)).toEqual([
      'kept-lesson',
      'hidden-lesson',
    ]);
    expect(result.inputs[0]?.units[0]?.unitLessons.map((l) => l.lessonSlug)).toEqual([
      'kept-lesson',
      'hidden-lesson',
    ]);
    expect(result.restrictedLessonsExcluded).toBe(0);
  });
});

describe('createPipelineConfig', () => {
  it('creates config with default values', () => {
    const config = createPipelineConfig({
      bulkDataPath: '/path/to/bulk/data',
      outputPath: '/path/to/output',
    });

    expect(config.bulkDataPath).toBe('/path/to/bulk/data');
    expect(config.outputPath).toBe('/path/to/output');
    expect(config.dryRun).toBe(false);
    expect(config.verbose).toBe(false);
    expect(config.includeRestricted).toBe(false);
  });

  it('overrides defaults with provided options', () => {
    const config = createPipelineConfig({
      bulkDataPath: '/path/to/bulk/data',
      outputPath: '/path/to/output',
      dryRun: true,
      verbose: true,
      includeRestricted: true,
    });

    expect(config.dryRun).toBe(true);
    expect(config.verbose).toBe(true);
    expect(config.includeRestricted).toBe(true);
  });
});

describe('formatPipelineResult', () => {
  const createResult = (overrides: Partial<PipelineResult> = {}): PipelineResult => ({
    success: true,
    filesProcessed: 30,
    totalLessons: 10000,
    totalUnits: 500,
    uniqueKeywords: 13349,
    totalMisconceptions: 12777,
    totalLearningPoints: 51894,
    totalTeacherTips: 12774,
    totalPriorKnowledge: 5000,
    totalNCStatements: 3000,
    uniqueThreads: 200,
    restrictedLessonsExcluded: 250,
    outputFiles: [],
    durationMs: 5000,
    ...overrides,
  });

  it('renders a failed result as the failure, never as a zeroed clean run', () => {
    const formatted = formatPipelineResult(
      createResult({
        success: false,
        error: 'includeRestricted is not permitted for corpus-producing runs (ADR-224).',
      }),
    );

    expect(formatted).toContain('Pipeline failed:');
    expect(formatted).toContain('ADR-224');
    expect(formatted).not.toContain('Files processed');
    expect(formatted).not.toContain('restricted lessons excluded');
  });

  it('reports the restricted-lesson exclusion with its decision provenance', () => {
    const formatted = formatPipelineResult(createResult());

    expect(formatted).toContain('250 restricted lessons excluded');
    expect(formatted).toContain('MCP-204');
  });

  it('formats successful result with all extraction stats', () => {
    const result = createResult({
      outputFiles: ['prerequisite-graph', 'vocabulary-graph'],
    });

    const formatted = formatPipelineResult(result);

    expect(formatted).toContain('30');
    expect(formatted).toContain('10,000 lessons');
    expect(formatted).toContain('13,349 unique keywords');
    expect(formatted).toContain('12,777 misconceptions');
    expect(formatted).toContain('51,894 learning points');
    expect(formatted).toContain('12,774 teacher tips');
    expect(formatted).toContain('5,000 prior knowledge requirements');
    expect(formatted).toContain('3,000 NC statements');
    expect(formatted).toContain('200 unique threads');
    expect(formatted).toContain('5.00s');
  });

  it('formats dry run result', () => {
    const result = createResult({
      dryRun: true,
      durationMs: 1000,
    });

    const formatted = formatPipelineResult(result);

    expect(formatted).toContain('DRY RUN');
    expect(formatted).toContain('No files written');
  });

  it('lists output files when present', () => {
    const result = createResult({
      outputFiles: ['file1.ts', 'file2.ts'],
    });

    const formatted = formatPipelineResult(result);

    expect(formatted).toContain('Output files:');
    expect(formatted).toContain('file1.ts');
    expect(formatted).toContain('file2.ts');
  });
});

describe('runPipeline restricted-lesson exclusion policy (ADR-224)', () => {
  const files = [
    createFileResult([
      createLessonInput({
        lessonSlug: 'open-lesson',
        lessonKeywords: [{ keyword: 'photosynthesis', description: 'How plants make food' }],
      }),
      createLessonInput({
        lessonSlug: 'hidden-lesson',
        restricted: true,
        lessonKeywords: [{ keyword: 'restricted-osmosis', description: 'Movement of water' }],
      }),
    ]),
  ];
  const readAllBulkFiles = async () => files;

  it('excludes restricted lessons by default: only the open lesson feeds extraction', async () => {
    const config = createPipelineConfig({
      bulkDataPath: '/fixtures/bulk-data',
      outputPath: '/fixtures/vocab-out',
      dryRun: true,
    });

    const result = await runPipeline(config, undefined, { readAllBulkFiles });

    expect(result.success).toBe(true);
    expect(result.uniqueKeywords).toBe(1);
    expect(result.totalLessons).toBe(1);
    expect(result.restrictedLessonsExcluded).toBe(1);
  });

  it.each([[false], [true]])(
    'rejects includeRestricted before any bulk data is read (dryRun: %s) — the generated corpus is committed and MCP-consumed',
    async (dryRun) => {
      const readPaths: string[] = [];
      const recordingRead = async (bulkDataPath: string) => {
        readPaths.push(bulkDataPath);
        return files;
      };
      const config = createPipelineConfig({
        bulkDataPath: '/fixtures/bulk-data',
        outputPath: '/fixtures/vocab-out',
        dryRun,
        includeRestricted: true,
      });

      const result = await runPipeline(config, undefined, { readAllBulkFiles: recordingRead });

      expect(result.success).toBe(false);
      const message = result.error ?? '';
      expect(message).toContain('ADR-224');
      expect(message).toContain('labelled-serving');
      expect(result.outputFiles).toHaveLength(0);
      expect(readPaths).toHaveLength(0);
    },
  );
});
