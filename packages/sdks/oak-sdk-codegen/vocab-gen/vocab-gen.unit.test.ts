/**
 * Unit tests for the vocabulary mining pipeline orchestrator.
 *
 * @remarks
 * Tests pure functions for pipeline configuration and output formatting.
 * File system operations are in separate integration tests.
 */
import { describe, expect, it } from 'vitest';

import { createPipelineConfig, type PipelineResult } from './vocab-gen-config.js';
import { formatPipelineResult } from './vocab-gen-format.js';

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
  });

  it('overrides defaults with provided options', () => {
    const config = createPipelineConfig({
      bulkDataPath: '/path/to/bulk/data',
      outputPath: '/path/to/output',
      dryRun: true,
      verbose: true,
    });

    expect(config.dryRun).toBe(true);
    expect(config.verbose).toBe(true);
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
    outputFiles: [],
    durationMs: 5000,
    ...overrides,
  });

  it('formats successful result with all extraction stats', () => {
    const result = createResult({
      outputFiles: ['prerequisite-graph-data.ts', 'vocabulary-graph-data.ts'],
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
