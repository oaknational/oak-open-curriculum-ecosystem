/**
 * Integration tests: loading the sitemap reference through the file-system
 * port and validating canonical URL construction patterns against it.
 *
 * @see validate-canonical-urls.ts for the implementation
 * @see ADR-132 for the sitemap scanner design and known coverage gaps
 */

import { describe, expect, it } from 'vitest';

import { createInMemoryFileSystem } from '../../../src/io/test-helpers/in-memory-file-system.js';
import {
  loadSitemapReference,
  validateGeneratedUrls,
  runSitemapValidation,
} from './validate-canonical-urls.js';

const REF_PATH = '/reference/canonical-url-map.json';

interface ReferenceOverrides {
  readonly teacherPaths?: readonly string[];
  readonly lessonSlugs?: readonly string[];
  readonly sequenceSlugs?: readonly string[];
  readonly programmeSlugs?: readonly string[];
}

const DEFAULT_TEACHER_PATHS = [
  '/teachers/curriculum/english-secondary-ks4-foundation-l/units',
  '/teachers/curriculum/math-secondary-ks4-foundation-l/units',
  '/teachers/programmes/english-secondary-ks4-foundation-l/units',
  '/teachers/programmes/math-secondary-ks4-foundation-l/units',
];
const DEFAULT_SLUGS = ['english-secondary-ks4-foundation-l', 'math-secondary-ks4-foundation-l'];

/** A complete reference document in the shape the sitemap scanner writes. */
function referenceDocument(overrides: ReferenceOverrides = {}): Record<string, unknown> {
  const teacherPaths = overrides.teacherPaths ?? DEFAULT_TEACHER_PATHS;
  const lessonSlugs = overrides.lessonSlugs ?? ['sample-lesson-one', 'sample-lesson-two'];
  const sequenceSlugs = overrides.sequenceSlugs ?? DEFAULT_SLUGS;
  const programmeSlugs = overrides.programmeSlugs ?? DEFAULT_SLUGS;
  return {
    generatedAt: '2026-01-01T00:00:00Z',
    base: 'https://www.thenational.academy',
    teacherPaths,
    totals: {
      teacherUrls: teacherPaths.length,
      lessons: lessonSlugs.length,
      programmes: programmeSlugs.length,
      sequences: sequenceSlugs.length,
      units: 0,
      specialistProgrammes: 0,
      betaProgrammes: 0,
      uniqueSubjects: 0,
    },
    lessonSlugs,
    programmeSlugs,
    sequenceSlugs,
    specialistProgrammeSlugs: [],
    betaProgrammeSlugs: [],
    unitToProgramme: {},
    lessonToProgrammeUnit: {},
    subjectToKeyStages: {},
  };
}

/** A file system holding one reference file with the given raw content. */
function fileSystemWithReference(raw: string) {
  return createInMemoryFileSystem({ [REF_PATH]: raw });
}

describe('loadSitemapReference', () => {
  it('returns file_not_found for an absent file', async () => {
    const result = await loadSitemapReference(REF_PATH, createInMemoryFileSystem());

    expect(result).toMatchObject({ ok: false, error: { kind: 'file_not_found', path: REF_PATH } });
  });

  it('returns invalid_json for a file that is not JSON', async () => {
    const result = await loadSitemapReference(REF_PATH, fileSystemWithReference('not json {{'));

    expect(result).toMatchObject({ ok: false, error: { kind: 'invalid_json', path: REF_PATH } });
  });

  it('returns schema_mismatch when teacherPaths is missing', async () => {
    const fs = fileSystemWithReference(JSON.stringify({ generatedAt: '2026-01-01' }));

    const result = await loadSitemapReference(REF_PATH, fs);

    expect(result).toMatchObject({ ok: false, error: { kind: 'schema_mismatch' } });
  });

  it('returns schema_mismatch when sequenceSlugs is missing', async () => {
    const fs = fileSystemWithReference(
      JSON.stringify({
        teacherPaths: ['/teachers/lessons/foo'],
        generatedAt: '2026-01-01T00:00:00Z',
        lessonSlugs: ['foo'],
        programmeSlugs: [],
      }),
    );

    const result = await loadSitemapReference(REF_PATH, fs);

    expect(result).toMatchObject({ ok: false, error: { kind: 'schema_mismatch' } });
  });

  it('returns schema_mismatch when an array field holds non-string values', async () => {
    const fs = fileSystemWithReference(
      JSON.stringify({
        teacherPaths: [123],
        generatedAt: '2026-01-01T00:00:00Z',
        lessonSlugs: [],
        programmeSlugs: [],
        sequenceSlugs: [],
      }),
    );

    const result = await loadSitemapReference(REF_PATH, fs);

    expect(result).toMatchObject({ ok: false, error: { kind: 'schema_mismatch' } });
  });

  it('returns unsorted_paths when teacherPaths is not sorted', async () => {
    const fs = fileSystemWithReference(
      JSON.stringify(
        referenceDocument({
          teacherPaths: ['/teachers/lessons/zzz', '/teachers/lessons/aaa'],
          lessonSlugs: ['zzz', 'aaa'],
          programmeSlugs: [],
          sequenceSlugs: [],
        }),
      ),
    );

    const result = await loadSitemapReference(REF_PATH, fs);

    expect(result).toMatchObject({ ok: false, error: { kind: 'unsorted_paths' } });
  });

  it('returns the parsed reference for a valid file', async () => {
    const fs = fileSystemWithReference(JSON.stringify(referenceDocument()));

    const result = await loadSitemapReference(REF_PATH, fs);

    expect(result).toMatchObject({
      ok: true,
      value: {
        generatedAt: '2026-01-01T00:00:00Z',
        teacherPaths: DEFAULT_TEACHER_PATHS,
        sequenceSlugs: DEFAULT_SLUGS,
      },
    });
  });
});

describe('validateGeneratedUrls against the reference teacher paths', () => {
  it('rejects direct lesson URLs, which the sitemap never lists (known gap, ADR-132)', () => {
    const urls = ['sample-lesson-one', 'sample-lesson-two'].map(
      (slug) => `/teachers/lessons/${slug}`,
    );

    const summary = validateGeneratedUrls(urls, DEFAULT_TEACHER_PATHS);

    expect(summary).toMatchObject({ total: 2, validCount: 0, invalidCount: 2 });
  });

  it('accepts sequence URLs built from sequence slugs', () => {
    const urls = DEFAULT_SLUGS.map((slug) => `/teachers/curriculum/${slug}/units`);

    const summary = validateGeneratedUrls(urls, DEFAULT_TEACHER_PATHS);

    expect(summary).toMatchObject({ validCount: 2, invalidCount: 0 });
  });

  it('accepts programme URLs built from programme slugs', () => {
    const urls = DEFAULT_SLUGS.map((slug) => `/teachers/programmes/${slug}/units`);

    const summary = validateGeneratedUrls(urls, DEFAULT_TEACHER_PATHS);

    expect(summary).toMatchObject({ validCount: 2, invalidCount: 0 });
  });

  it('lists the URLs the sitemap does not know', () => {
    const fakeUrls = [
      '/teachers/lessons/definitely-not-real-abc123',
      '/teachers/programmes/fake-programme-xyz/units',
    ];

    const summary = validateGeneratedUrls(fakeUrls, DEFAULT_TEACHER_PATHS);

    expect(summary).toMatchObject({ invalidCount: 2, invalidUrls: fakeUrls });
  });
});

describe('runSitemapValidation', () => {
  it('returns a complete validation report with zero invalid counts', async () => {
    const fs = fileSystemWithReference(JSON.stringify(referenceDocument()));

    const result = await runSitemapValidation(REF_PATH, fs);

    expect(result).toMatchObject({
      ok: true,
      value: {
        generatedAt: '2026-01-01T00:00:00Z',
        sequenceValidation: { total: 2, invalidCount: 0 },
        programmeValidation: { total: 2, invalidCount: 0 },
      },
    });
  });

  it('returns file_not_found for an absent reference file', async () => {
    const result = await runSitemapValidation(REF_PATH, createInMemoryFileSystem());

    expect(result).toMatchObject({ ok: false, error: { kind: 'file_not_found' } });
  });

  it('validates no programme listings when the reference holds no programme listing slugs', async () => {
    const eyfsProgrammeSlug = 'maths-foundation-early-years-foundation-stage-l';
    const fs = fileSystemWithReference(
      JSON.stringify(
        referenceDocument({
          teacherPaths: [
            '/teachers/curriculum/english-secondary-ks4-foundation-l/units',
            '/teachers/eyfs/maths',
            `/teachers/programmes/${eyfsProgrammeSlug}/units/counting-and-cardinality/lessons`,
          ],
          programmeSlugs: [],
          sequenceSlugs: ['english-secondary-ks4-foundation-l'],
        }),
      ),
    );

    const result = await runSitemapValidation(REF_PATH, fs);

    expect(result).toMatchObject({
      ok: true,
      value: { programmeValidation: { total: 0, invalidCount: 0, validCount: 0 } },
    });
  });
});
