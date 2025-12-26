/**
 * Integration tests for bulk download file reader.
 *
 * @remarks
 * Tests file system operations against actual bulk download data.
 * These tests require the bulk download files to be present in reference/.
 */
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { discoverBulkFiles, parseBulkFile } from './bulk-reader.js';

/**
 * Resolves a path relative to the repository root.
 * The SDK package is at packages/sdks/oak-curriculum-sdk/
 */
function fromRepoRoot(relativePath: string): string {
  return join(__dirname, '..', '..', '..', '..', '..', relativePath);
}

const BULK_DATA_PATH = fromRepoRoot(
  'reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z',
);

describe('discoverBulkFiles', () => {
  it('returns file list for valid directory', async () => {
    const files = await discoverBulkFiles(BULK_DATA_PATH);

    expect(files.length).toBe(30);
    expect(files).toContain('maths-primary.json');
    expect(files).toContain('maths-secondary.json');
    expect(files).toContain('english-primary.json');
  });

  it('only includes .json files', async () => {
    const files = await discoverBulkFiles(BULK_DATA_PATH);

    for (const file of files) {
      expect(file).toMatch(/\.json$/);
    }
  });

  it('throws for non-existent directory', async () => {
    await expect(discoverBulkFiles('/non/existent/path')).rejects.toThrow();
  });
});

describe('parseBulkFile', () => {
  it('parses a real bulk download file', async () => {
    const result = await parseBulkFile(BULK_DATA_PATH, 'maths-primary.json');

    expect(result.sequenceSlug).toBe('maths-primary');
    expect(result.subjectTitle).toBe('Maths');
    expect(result.sequence.length).toBeGreaterThan(0);
    expect(result.lessons.length).toBeGreaterThan(0);
  });

  it('correctly parses lesson keywords', async () => {
    const result = await parseBulkFile(BULK_DATA_PATH, 'maths-primary.json');

    // Find a lesson with keywords
    const lessonWithKeywords = result.lessons.find((l) => l.lessonKeywords.length > 0);
    expect(lessonWithKeywords).toBeDefined();

    if (lessonWithKeywords) {
      const keyword = lessonWithKeywords.lessonKeywords[0];
      expect(keyword).toHaveProperty('keyword');
      expect(keyword).toHaveProperty('description');
      expect(typeof keyword.keyword).toBe('string');
    }
  });

  it('handles NULL sentinel values correctly', async () => {
    const result = await parseBulkFile(BULK_DATA_PATH, 'maths-primary.json');

    // Most lessons have NULL for contentGuidance - transformed to undefined
    const lessonWithNullGuidance = result.lessons.find((l) => l.contentGuidance === undefined);
    expect(lessonWithNullGuidance).toBeDefined();
  });

  it('parses secondary data with tier variants', async () => {
    const result = await parseBulkFile(BULK_DATA_PATH, 'maths-secondary.json');

    expect(result.sequenceSlug).toBe('maths-secondary');
    // Maths secondary has 98 units (including tier variants)
    expect(result.sequence.length).toBe(98);
    // But only 68 unique unit slugs due to foundation/higher tier variants
    const uniqueSlugs = new Set(result.sequence.map((u) => u.unitSlug));
    expect(uniqueSlugs.size).toBe(68);
  });
});
