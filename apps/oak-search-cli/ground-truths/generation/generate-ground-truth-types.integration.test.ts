/**
 * Integration tests for the ground-truth type generator.
 *
 * The generator bakes the bundle's vintage into every artefact it emits,
 * so a silently stale or absent bundle must stop it BEFORE anything is
 * written — a half-written generated tree is worse than none. These tests
 * pin that order: an unreadable manifest and a stale bundle each refuse
 * without touching the output directory, and a fresh bundle writes the
 * full artefact set stamped with the injected clock.
 *
 * Filesystem and clock are injected (ADR-078) — no real filesystem, no
 * ambient clock, no generated tree written during a test run.
 */

import { sep } from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { generateGroundTruthTypes, type GeneratorFs } from './generate-ground-truth-types.js';

/**
 * Basename of a product-emitted path. The generator joins with the host
 * separator, so the fake's lookups and the assertions normalise to POSIX
 * form at this one choke point before taking the final segment.
 */
const basenameOf = (productPath: string): string =>
  productPath.split(sep).join('/').split('/').at(-1) ?? '';

const bulkDir = '/app/bulk-downloads';
const outputDir = '/app/ground-truths/generated';
const now = new Date('2026-08-03T12:00:00.000Z');

/** One bulk data file in the shape `parseBulkDataFile` accepts. */
const mathsPrimary = JSON.stringify({
  lessons: [
    {
      lessonSlug: 'adding-fractions',
      lessonTitle: 'Adding fractions',
      subjectSlug: 'maths',
      keyStageSlug: 'ks2',
      unitSlug: 'fractions-unit',
    },
    {
      lessonSlug: 'subtracting-fractions',
      lessonTitle: 'Subtracting fractions',
      subjectSlug: 'maths',
      keyStageSlug: 'ks2',
      unitSlug: 'fractions-unit',
    },
  ],
  sequenceSlug: 'maths-primary',
  subjectTitle: 'Maths',
});

/** A manifest exactly as `scripts/download-bulk.ts` writes it. */
const manifestDownloadedAt = (downloadedAt: string): string =>
  JSON.stringify({
    downloadedAt,
    source: 'https://open-api.thenational.academy/api/bulk',
    files: [{ file: 'maths-primary.json', sizeBytes: 123 }],
  });

/**
 * The listing a real bundle directory carries: the manifest's data file
 * plus the tracked non-data entries that travel with the repository.
 */
const bundleListing = ['maths-primary.json', 'manifest.json', 'schema.json'];

/** Every artefact a successful generation writes. */
const expectedArtefacts = [
  'lesson-slugs-by-subject.ts',
  'lesson-slugs-by-subject.types.ts',
  'lesson-slugs-by-subject.data.json',
  'ground-truth-schemas.ts',
  'bulk-data-manifest.ts',
  'index.ts',
];

/** The artefacts that stamp their generation time into their content. */
const timestampedArtefacts = [
  'lesson-slugs-by-subject.ts',
  'lesson-slugs-by-subject.data.json',
  'ground-truth-schemas.ts',
  'bulk-data-manifest.ts',
];

/**
 * A generator filesystem whose manifest read is caller-controlled and
 * whose writes are recorded rather than performed.
 */
function createFakeGeneratorFs(input: {
  readonly readManifest: () => string;
  readonly listing: readonly string[];
}) {
  const mkdirSync = vi.fn<(path: string) => void>();
  const writeFileSync = vi.fn<(path: string, content: string) => void>();
  // The bundle's contents by basename — a plain lookup, so the fake has no
  // branch of its own to get wrong.
  const dataFiles: Record<string, string> = { 'maths-primary.json': mathsPrimary };
  const fs: GeneratorFs = {
    readFileSync: (path) => {
      const basename = basenameOf(path);
      return dataFiles[basename] ?? input.readManifest();
    },
    readdirSync: () => [...input.listing],
    mkdirSync,
    writeFileSync,
  };
  return { fs, mkdirSync, writeFileSync };
}

describe('generateGroundTruthTypes', () => {
  it('refuses generation when the manifest is unreadable, writing nothing', async () => {
    const { fs, mkdirSync, writeFileSync } = createFakeGeneratorFs({
      readManifest: () => {
        throw new Error('ENOENT: no such file or directory');
      },
      listing: [],
    });

    const result = await generateGroundTruthTypes({ bulkDir, outputDir, verbose: false, now, fs });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('validation_error');
      expect(result.error.message).toContain('bulk:download');
    }
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('refuses generation on a stale bundle, writing nothing', async () => {
    // 60 days before `now` — well past the accepted maximum.
    const { fs, mkdirSync, writeFileSync } = createFakeGeneratorFs({
      readManifest: () => manifestDownloadedAt('2026-06-04T12:00:00.000Z'),
      listing: bundleListing,
    });

    const result = await generateGroundTruthTypes({ bulkDir, outputDir, verbose: false, now, fs });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('validation_error');
      expect(result.error.message).toContain('60');
      expect(result.error.message).toContain('14');
    }
    expect(writeFileSync).not.toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('writes every generated artefact from a fresh bundle', async () => {
    const { fs, mkdirSync, writeFileSync } = createFakeGeneratorFs({
      readManifest: () => manifestDownloadedAt('2026-08-01T08:00:00.000Z'),
      listing: bundleListing,
    });

    const result = await generateGroundTruthTypes({ bulkDir, outputDir, verbose: false, now, fs });

    expect(result.ok).toBe(true);
    if (result.ok) {
      // Membership, not emission order — the row pins WHICH artefacts the
      // generator produces, and the order they are written in is not a
      // promise the generator makes to anyone.
      const written = result.value.filesWritten.map((path) => basenameOf(path));
      expect(written).toEqual(expect.arrayContaining(expectedArtefacts));
      expect(written).toHaveLength(expectedArtefacts.length);
    }
    expect(mkdirSync).toHaveBeenCalledExactlyOnceWith(outputDir);

    // EVERY timestamped artefact carries the INJECTED clock. A single
    // un-threaded `new Date()` anywhere in the emitters fails here.
    const contentByName = new Map(
      writeFileSync.mock.calls.map(([path, content]) => [basenameOf(path), content]),
    );
    for (const artefact of timestampedArtefacts) {
      expect(contentByName.get(artefact)).toContain(now.toISOString());
    }
  });
});
