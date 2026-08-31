/**
 * Unit tests for `checkBulkDataFreshness`.
 *
 * Bulk DATA files are downloaded per-checkout and gitignored, while the
 * manifest and schema are tracked — so a clean checkout carries a manifest
 * whose listed data files are absent, and checkouts with data silently
 * diverge in vintage. These tests pin the freshness contract: an unreadable
 * or invalid manifest fails loud, listed-but-absent data files fail loud
 * (the tracked manifest cannot vouch for data it ships without), data older
 * than the named age fails loud, and a fresh complete bundle surfaces its
 * vintage. Deterministic `now` and injected readers — no real filesystem,
 * no ambient clock.
 */

import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import trackedManifest from '../../../bulk-downloads/manifest.json';
import {
  checkBulkDataFreshness,
  MAX_BULK_DATA_AGE_DAYS,
  type ManifestFsReader,
} from './bulk-freshness.js';

/**
 * A valid manifest exactly as `scripts/download-bulk.ts` writes it.
 * The shape is the downloader's output contract; the checker's schema is
 * pinned to it strictly so writer/reader drift fails loud here.
 */
const validManifest = {
  downloadedAt: '2026-08-01T08:00:00.000Z',
  source: 'https://open-api.thenational.academy/api/bulk',
  files: [{ file: 'maths-primary.json', sizeBytes: 123 }],
};

/**
 * Reader whose directory holds every file the manifest lists PLUS the
 * tracked non-data entries a real bundle directory always carries — a
 * discriminating fixture: presence means "listed files exist", never
 * "directory equals the list", and a strict-equality regression fails here.
 */
const readerFor = (
  content: string,
  present = ['maths-primary.json', 'manifest.json', 'schema.json'],
): ManifestFsReader => ({
  readFileSync: () => content,
  readdirSync: () => present,
});

const throwingReader: ManifestFsReader = {
  readFileSync: () => {
    throw new Error('ENOENT: no such file or directory');
  },
  readdirSync: () => [],
};

// Expressed via join so the fixture carries the host's separator form —
// the checker joins the manifest path onto this directory, and the joined
// product path only contains the directory when both share one form.
const bulkDir = join('/app', 'bulk-downloads');

describe('checkBulkDataFreshness', () => {
  it('returns err manifest_missing with the download cure when the manifest is unreadable', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: throwingReader,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_missing');
      expect(result.error.message).toContain(bulkDir);
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('returns err manifest_invalid on unparseable JSON', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor('not json {'),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('returns err manifest_invalid when downloadedAt is absent', () => {
    const withoutDate = { source: validManifest.source, files: validManifest.files };
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify(withoutDate)),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
    }
  });

  it('returns err manifest_invalid on writer/reader shape drift (unknown top-level key)', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify({ ...validManifest, surprise: true })),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
    }
  });

  it('returns err manifest_invalid on a malformed downloadedAt', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify({ ...validManifest, downloadedAt: 'yesterday-ish' })),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
    }
  });

  it('returns err bulk_data_missing when listed data files are absent from the directory', () => {
    // The manifest is TRACKED, so a clean checkout that never downloaded
    // carries a manifest listing files that do not exist. The check must
    // refuse — this is exactly the absent-bundle state it exists to catch.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest), ['manifest.json', 'schema.json']),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_missing');
      expect(result.error.message).toContain('maths-primary.json');
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('reads the manifest at <bulkDir>/manifest.json and lists bulkDir itself', () => {
    const readPaths: string[] = [];
    const listedPaths: string[] = [];
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: {
        readFileSync: (path) => {
          readPaths.push(path);
          return JSON.stringify(validManifest);
        },
        readdirSync: (path) => {
          listedPaths.push(path);
          return ['maths-primary.json', 'manifest.json', 'schema.json'];
        },
      },
    });
    expect(result.ok).toBe(true);
    expect(readPaths).toEqual([join(bulkDir, 'manifest.json')]);
    expect(listedPaths).toEqual([bulkDir]);
  });

  it('reports a stale-AND-absent bundle as absent, never stale (presence runs before age)', () => {
    // The committed manifest ages with the repository, so a fresh clone can
    // be simultaneously past the age threshold and missing every data file.
    // The accurate diagnosis is "download the bundle", not "you trailed
    // upstream" — presence must win.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-10-01T08:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest), ['manifest.json', 'schema.json']),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_missing');
    }
  });

  it.each([
    ['a per-file unknown key', { file: 'maths-primary.json', sizeBytes: 123, sha256: 'abc' }],
    ['a string sizeBytes', { file: 'maths-primary.json', sizeBytes: '123' }],
  ])('returns err manifest_invalid on %s in a file entry', (_label, entry) => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify({ ...validManifest, files: [entry] })),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('returns err manifest_invalid when source is absent', () => {
    const withoutSource = { downloadedAt: validManifest.downloadedAt, files: validManifest.files };
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify(withoutSource)),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
    }
  });

  it('returns err bulk_data_missing when the bulk directory is unreadable', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: {
        readFileSync: () => JSON.stringify(validManifest),
        readdirSync: () => {
          throw new Error('EACCES: permission denied');
        },
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_missing');
    }
  });

  it('returns err bulk_data_stale past the named age, naming age, threshold, and cure', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify({ ...validManifest, downloadedAt: '2026-06-10T00:00:00.000Z' })),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_stale');
      expect(result.error.message).toContain('2026-06-10T00:00:00.000Z');
      expect(result.error.message).toContain('54');
      expect(result.error.message).toContain(String(MAX_BULK_DATA_AGE_DAYS));
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('treats data exactly at the named age as fresh (stale is strictly past it)', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-15T08:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.ageDays).toBe(MAX_BULK_DATA_AGE_DAYS);
    }
  });

  it('returns err bulk_data_stale one day past the named age', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-16T08:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_stale');
    }
  });

  it('surfaces the vintage on fresh data', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-03T12:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.downloadedAt).toBe('2026-08-01T08:00:00.000Z');
      expect(result.value.ageDays).toBe(2);
    }
  });

  it('stays fresh at exactly the maximum age', () => {
    // downloadedAt 2026-08-01T08:00 + exactly 14 days.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-15T08:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(true);
  });

  it('goes stale one millisecond past the maximum age', () => {
    // The contract is "strictly past 14 days"; a floored day-count would
    // ride until ~15 days, so the comparison must use exact elapsed time.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-15T08:00:00.001Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_data_stale');
    }
  });

  it('tolerates future skew inside the named window as age zero', () => {
    // now sits 4 minutes BEFORE downloadedAt — ordinary clock skew.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-08-01T07:56:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.ageDays).toBe(0);
    }
  });

  it('rejects a manifest dated beyond the tolerated future skew as invalid', () => {
    // A day-future timestamp would suppress the staleness guard for an
    // arbitrary period if clamped; it must fail as an invalid manifest.
    const result = checkBulkDataFreshness({
      bulkDir,
      now: new Date('2026-07-31T08:00:00.000Z'),
      fs: readerFor(JSON.stringify(validManifest)),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('manifest_invalid');
      expect(result.error.message).toContain('future');
      expect(result.error.message).toContain('bulk:download');
    }
  });

  // SHAPE AGREEMENT ONLY: the real tracked manifest against the strict
  // schema, so writer/checker drift fails at the commit that introduces
  // it. Presence and age are neutralised by construction (the listing is
  // derived from the manifest; now derives from its own downloadedAt).
  it('accepts the tracked manifest the downloader actually writes', () => {
    const result = checkBulkDataFreshness({
      bulkDir,
      // Anchored to the artefact's own vintage: the row proves shape
      // agreement with the real manifest and can never age into a failure.
      now: new Date(trackedManifest.downloadedAt),
      fs: {
        readFileSync: () => JSON.stringify(trackedManifest),
        readdirSync: () => trackedManifest.files.map((entry) => entry.file),
      },
    });
    expect(result.ok).toBe(true);
  });
});
