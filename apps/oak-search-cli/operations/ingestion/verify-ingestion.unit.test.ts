/**
 * Unit tests for ingestion verification pure functions.
 *
 * These tests verify the core verification logic for comparing
 * bulk download lessons against indexed lessons in Elasticsearch.
 */

import { describe, it, expect } from 'vitest';
import {
  extractLessonsFromBulkDownload,
  findMissingLessons,
  generateVerificationReport,
  isBulkDownloadData,
  resolveBulkDownloadPath,
  type BulkDownloadData,
} from './verify-ingestion-lib';

describe('extractLessonsFromBulkDownload', () => {
  it('extracts lesson slugs for a specific key stage', () => {
    const data: BulkDownloadData = {
      lessons: [
        { lessonSlug: 'lesson-1', keyStageSlug: 'ks4' },
        { lessonSlug: 'lesson-2', keyStageSlug: 'ks3' },
        { lessonSlug: 'lesson-3', keyStageSlug: 'ks4' },
      ],
    };

    const result = extractLessonsFromBulkDownload(data, 'ks4');

    expect(result).toEqual(['lesson-1', 'lesson-3']);
  });

  it('returns empty array when no lessons match key stage', () => {
    const data: BulkDownloadData = {
      lessons: [
        { lessonSlug: 'lesson-1', keyStageSlug: 'ks3' },
        { lessonSlug: 'lesson-2', keyStageSlug: 'ks3' },
      ],
    };

    const result = extractLessonsFromBulkDownload(data, 'ks4');

    expect(result).toEqual([]);
  });

  it('handles empty lessons array', () => {
    const data: BulkDownloadData = { lessons: [] };

    const result = extractLessonsFromBulkDownload(data, 'ks4');

    expect(result).toEqual([]);
  });
});

describe('findMissingLessons', () => {
  it('identifies lessons in expected but not in indexed', () => {
    const expected = ['lesson-1', 'lesson-2', 'lesson-3'];
    const indexed = ['lesson-1', 'lesson-3'];

    const result = findMissingLessons(expected, indexed);

    expect(result).toEqual(['lesson-2']);
  });

  it('returns empty array when all expected lessons are indexed', () => {
    const expected = ['lesson-1', 'lesson-2'];
    const indexed = ['lesson-1', 'lesson-2', 'lesson-3'];

    const result = findMissingLessons(expected, indexed);

    expect(result).toEqual([]);
  });

  it('returns all expected when none are indexed', () => {
    const expected = ['lesson-1', 'lesson-2'];
    const indexed: string[] = [];

    const result = findMissingLessons(expected, indexed);

    expect(result).toEqual(['lesson-1', 'lesson-2']);
  });
});

describe('generateVerificationReport', () => {
  it('generates PASSED report when no missing lessons', () => {
    const report = generateVerificationReport({
      subject: 'maths',
      keyStage: 'ks4',
      expectedCount: 100,
      indexedCount: 100,
      missingLessons: [],
    });

    expect(report).toContain('Verification: PASSED');
    expect(report).toContain('maths');
    expect(report).toContain('ks4');
    expect(report).toContain('Expected: 100');
    expect(report).toContain('Indexed: 100');
  });

  it('generates FAILED report when lessons are missing', () => {
    const report = generateVerificationReport({
      subject: 'maths',
      keyStage: 'ks4',
      expectedCount: 100,
      indexedCount: 98,
      missingLessons: ['lesson-1', 'lesson-2'],
    });

    expect(report).toContain('Verification: FAILED');
    expect(report).toContain('Missing: 2');
    expect(report).toContain('lesson-1');
    expect(report).toContain('lesson-2');
  });

  it('truncates missing lessons list when more than 20', () => {
    const manyMissing = Array.from({ length: 25 }, (_, i) => `lesson-${i + 1}`);

    const report = generateVerificationReport({
      subject: 'maths',
      keyStage: 'ks4',
      expectedCount: 100,
      indexedCount: 75,
      missingLessons: manyMissing,
    });

    expect(report).toContain('lesson-1');
    expect(report).toContain('lesson-20');
    expect(report).toContain('... and 5 more');
    expect(report).not.toContain('lesson-25');
  });
});

describe('resolveBulkDownloadPath: explicit input', () => {
  it('returns the exact path provided by caller', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: './bulk-downloads/maths-secondary.json',
      bulkDownloadDirFromEnv: './ignored-env-dir',
      subject: 'maths',
      keyStage: 'ks4',
    });

    expect(result).toEqual({
      ok: true,
      value: './bulk-downloads/maths-secondary.json',
    });
  });
});

describe('resolveBulkDownloadPath: BULK_DOWNLOAD_DIR resolution', () => {
  it('resolves from BULK_DOWNLOAD_DIR for maths ks4', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: '',
      bulkDownloadDirFromEnv: './bulk-downloads',
      subject: 'maths',
      keyStage: 'ks4',
    });

    expect(result).toEqual({
      ok: true,
      value: './bulk-downloads/maths-secondary.json',
    });
  });

  it('resolves from BULK_DOWNLOAD_DIR for maths ks3', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: '',
      bulkDownloadDirFromEnv: './bulk-downloads',
      subject: 'maths',
      keyStage: 'ks3',
    });

    expect(result).toEqual({
      ok: true,
      value: './bulk-downloads/maths-primary.json',
    });
  });

  it('resolves from BULK_DOWNLOAD_DIR for non-maths subjects', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: '',
      bulkDownloadDirFromEnv: './bulk-downloads',
      subject: 'science',
      keyStage: 'ks4',
    });

    expect(result).toEqual({
      ok: true,
      value: './bulk-downloads/science.json',
    });
  });
});

describe('resolveBulkDownloadPath: missing source', () => {
  it('fails when neither flag nor env bulk dir is provided', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: '',
      bulkDownloadDirFromEnv: undefined,
      subject: 'maths',
      keyStage: 'ks4',
    });

    expect(result).toEqual({
      ok: false,
      error:
        'Missing bulk download source. Provide --bulk-download <file> or set BULK_DOWNLOAD_DIR in env.',
    });
  });

  it('fails when BULK_DOWNLOAD_DIR is an empty string', () => {
    const result = resolveBulkDownloadPath({
      bulkDownloadPathArg: '',
      bulkDownloadDirFromEnv: '',
      subject: 'maths',
      keyStage: 'ks4',
    });

    expect(result).toEqual({
      ok: false,
      error:
        'Missing bulk download source. Provide --bulk-download <file> or set BULK_DOWNLOAD_DIR in env.',
    });
  });
});

describe('isBulkDownloadData', () => {
  it('accepts valid lesson payload structure', () => {
    const payload = {
      lessons: [{ lessonSlug: 'algebra-1', keyStageSlug: 'ks4' }],
    };

    expect(isBulkDownloadData(payload)).toBe(true);
  });

  it('rejects lessons with non-string lessonSlug', () => {
    const payload = {
      lessons: [{ lessonSlug: 123, keyStageSlug: 'ks4' }],
    };

    expect(isBulkDownloadData(payload)).toBe(false);
  });

  it('rejects lessons with non-string keyStageSlug', () => {
    const payload = {
      lessons: [{ lessonSlug: 'algebra-1', keyStageSlug: null }],
    };

    expect(isBulkDownloadData(payload)).toBe(false);
  });
});
