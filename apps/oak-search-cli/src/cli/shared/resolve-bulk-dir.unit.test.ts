/**
 * Unit tests for `resolveBulkDir`.
 *
 * Tests the pure path resolution and validation logic using
 * injected FS predicates — no real filesystem access needed.
 */

import { describe, it, expect } from 'vitest';
import { resolveBulkDir, type FsPredicates } from './resolve-bulk-dir.js';

/** FS predicates that report a valid directory with JSON files. */
const validFs: FsPredicates = {
  existsSync: () => true,
  readdirSync: () => ['lessons.json', 'units.json'],
};

/** FS predicates that report directory does not exist. */
const missingFs: FsPredicates = {
  existsSync: () => false,
  readdirSync: () => [],
};

/** FS predicates that report directory exists but is empty. */
const emptyFs: FsPredicates = {
  existsSync: () => true,
  readdirSync: () => [],
};

const appRoot = '/app';

describe('resolveBulkDir', () => {
  it('returns err when raw path is empty or whitespace', () => {
    const result = resolveBulkDir('   ', appRoot, validFs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_dir_not_found');
      expect(result.error.message).toContain('cannot be empty');
    }
  });

  it('passes through an absolute path unchanged', () => {
    const result = resolveBulkDir('/absolute/bulk-downloads', appRoot, validFs);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('/absolute/bulk-downloads');
    }
  });

  it('resolves a relative path against appRoot', () => {
    const result = resolveBulkDir('bulk-downloads', appRoot, validFs);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('/app/bulk-downloads');
    }
  });

  it('returns err when directory does not exist', () => {
    const result = resolveBulkDir('/missing/dir', appRoot, missingFs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_dir_not_found');
      expect(result.error.message).toContain('/missing/dir');
    }
  });

  it('returns err when directory is empty (no JSON files)', () => {
    const result = resolveBulkDir('/empty/dir', appRoot, emptyFs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('bulk_dir_empty');
      expect(result.error.message).toContain('/empty/dir');
    }
  });

  it('includes actionable hint in not-found error', () => {
    const result = resolveBulkDir('./nope', appRoot, missingFs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('bulk:download');
    }
  });

  it('includes actionable hint in empty-dir error', () => {
    const result = resolveBulkDir('./empty', appRoot, emptyFs);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('bulk:download');
    }
  });
});
