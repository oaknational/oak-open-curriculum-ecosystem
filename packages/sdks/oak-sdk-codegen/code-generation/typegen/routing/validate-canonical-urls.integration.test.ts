/**
 * Integration tests: validate canonical URL construction patterns against
 * the sitemap reference data and test file-loading behaviour.
 *
 * Requires `pnpm scan:sitemap` to have been run so that
 * `reference/canonical-url-map.json` exists. Fails fast if absent.
 *
 * @see validate-canonical-urls.ts for the implementation
 * @see ADR-132 for the sitemap scanner design and known coverage gaps
 */

import path, { join } from 'node:path';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  loadSitemapReference,
  validateGeneratedUrls,
  runSitemapValidation,
} from './validate-canonical-urls.js';

const REF_PATH = path.resolve(import.meta.dirname, '../../../reference/canonical-url-map.json');

describe('loadSitemapReference (IO)', () => {
  it('returns file_not_found error for a non-existent file path', () => {
    const result = loadSitemapReference('/tmp/does-not-exist.json');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('file_not_found');
      expect(result.error.path).toBe('/tmp/does-not-exist.json');
    }
  });

  it('returns invalid_json error for a file with invalid JSON', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'bad-sitemap-ref-'));
    const filePath = join(tempDir, 'input.json');
    writeFileSync(filePath, 'not json {{');
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('invalid_json');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns schema_mismatch error when teacherPaths field is missing', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'missing-field-sitemap-'));
    const filePath = join(tempDir, 'input.json');
    writeFileSync(filePath, JSON.stringify({ generatedAt: '2026-01-01' }));
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('schema_mismatch');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns schema_mismatch when sequenceSlugs is missing', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'partial-sitemap-'));
    const filePath = join(tempDir, 'input.json');
    writeFileSync(
      filePath,
      JSON.stringify({
        teacherPaths: ['/teachers/lessons/foo'],
        generatedAt: '2026-01-01T00:00:00Z',
        lessonSlugs: ['foo'],
        programmeSlugs: [],
      }),
    );
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('schema_mismatch');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns schema_mismatch when array fields contain non-string values', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'wrong-array-types-sitemap-'));
    const filePath = join(tempDir, 'input.json');
    writeFileSync(
      filePath,
      JSON.stringify({
        teacherPaths: [123],
        generatedAt: '2026-01-01T00:00:00Z',
        lessonSlugs: ['foo'],
        programmeSlugs: [],
        sequenceSlugs: [],
      }),
    );
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('schema_mismatch');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns unsorted_paths error when teacherPaths is not sorted', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'unsorted-sitemap-'));
    const filePath = join(tempDir, 'input.json');
    const data = {
      generatedAt: '2026-01-01T00:00:00Z',
      base: 'https://www.thenational.academy',
      teacherPaths: ['/teachers/lessons/zzz', '/teachers/lessons/aaa'],
      totals: {
        teacherUrls: 2,
        lessons: 2,
        programmes: 0,
        sequences: 0,
        units: 0,
        specialistProgrammes: 0,
        betaProgrammes: 0,
        uniqueSubjects: 0,
      },
      lessonSlugs: ['zzz', 'aaa'],
      programmeSlugs: [],
      sequenceSlugs: [],
      specialistProgrammeSlugs: [],
      betaProgrammeSlugs: [],
      unitToProgramme: {},
      lessonToProgrammeUnit: {},
      subjectToKeyStages: {},
    };
    writeFileSync(filePath, JSON.stringify(data));
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('unsorted_paths');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns ok with SitemapScanOutput for a valid file', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'valid-sitemap-ref-'));
    const filePath = join(tempDir, 'input.json');
    const data = {
      generatedAt: '2026-01-01T00:00:00Z',
      base: 'https://www.thenational.academy',
      teacherPaths: ['/teachers/lessons/foo'],
      totals: {
        teacherUrls: 1,
        lessons: 1,
        programmes: 0,
        sequences: 0,
        units: 0,
        specialistProgrammes: 0,
        betaProgrammes: 0,
        uniqueSubjects: 0,
      },
      lessonSlugs: ['foo'],
      programmeSlugs: [],
      sequenceSlugs: [],
      specialistProgrammeSlugs: [],
      betaProgrammeSlugs: [],
      unitToProgramme: {},
      lessonToProgrammeUnit: {},
      subjectToKeyStages: {},
    };
    writeFileSync(filePath, JSON.stringify(data));
    try {
      const result = loadSitemapReference(filePath);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.teacherPaths).toEqual(['/teachers/lessons/foo']);
        expect(result.value.generatedAt).toBe('2026-01-01T00:00:00Z');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe('sitemap reference validation (integration)', () => {
  // Fail fast: reference file must exist for these tests to be meaningful
  const refResult = loadSitemapReference(REF_PATH);
  if (!refResult.ok) {
    throw new Error(
      `Integration tests require reference/canonical-url-map.json. ` +
        `Run 'pnpm -F @oaknational/sdk-codegen scan:sitemap' to generate it. ` +
        `Error kind: ${refResult.error.kind}, path: ${refResult.error.path}`,
    );
  }
  const ref = refResult.value;

  it('loads the reference map with non-empty teacher paths', () => {
    expect(ref.teacherPaths.length).toBeGreaterThan(0);
    expect(ref.generatedAt).toBeTruthy();
  });

  it('confirms lesson direct URLs are absent from sitemap (known gap ADR-132)', () => {
    const sample = ref.lessonSlugs.slice(0, 50);
    const urls = sample.map((slug) => `/teachers/lessons/${slug}`);
    const summary = validateGeneratedUrls(urls, ref.teacherPaths);

    // Direct /teachers/lessons/{slug} URLs are NOT in the sitemap — all should be invalid.
    // Lessons are only accessible via programme context in the sitemap.
    expect(summary.invalidCount).toBe(sample.length);
    expect(summary.validCount).toBe(0);
  });

  it('validates sequence URLs constructed from sitemap sequence slugs', () => {
    const urls = ref.sequenceSlugs.map((slug) => `/teachers/curriculum/${slug}/units`);
    const summary = validateGeneratedUrls(urls, ref.teacherPaths);

    expect(summary.validCount).toBe(ref.sequenceSlugs.length);
    expect(summary.invalidCount).toBe(0);
  });

  it('validates programme URLs constructed from sitemap programme slugs', () => {
    const sample = ref.programmeSlugs.slice(0, 50);
    const urls = sample.map((slug) => `/teachers/programmes/${slug}/units`);
    const summary = validateGeneratedUrls(urls, ref.teacherPaths);

    expect(summary.validCount).toBe(sample.length);
    expect(summary.invalidCount).toBe(0);
  });

  it('detects invalid URLs that are not in the sitemap', () => {
    const fakeUrls = [
      '/teachers/lessons/definitely-not-real-abc123',
      '/teachers/programmes/fake-programme-xyz/units',
    ];
    const summary = validateGeneratedUrls(fakeUrls, ref.teacherPaths);
    expect(summary.invalidCount).toBe(2);
  });
});

describe('runSitemapValidation', () => {
  it('returns a complete validation report with zero invalid counts', () => {
    const result = runSitemapValidation(REF_PATH);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error(`Expected ok Result, got error kind: ${result.error.kind}`);
    }

    const { sequenceValidation, programmeValidation, generatedAt } = result.value;
    expect(generatedAt).toBeTruthy();
    expect(sequenceValidation.total).toBeGreaterThan(0);
    expect(sequenceValidation.invalidCount).toBe(0);
    expect(programmeValidation.total).toBeGreaterThan(0);
    expect(programmeValidation.invalidCount).toBe(0);
  });

  it('returns file_not_found error for a non-existent reference file', () => {
    const result = runSitemapValidation('/tmp/nonexistent-ref.json');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('file_not_found');
    }
  });
});
