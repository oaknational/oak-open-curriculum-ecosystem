/**
 * Unit tests for lifecycle cleanup pure functions (ADR-130).
 *
 * Tests for extractVersionFromIndexName and identifyOrphanedVersions.
 * Pure functions only — no mocks, no I/O (ADR-078).
 */

import { describe, it, expect } from 'vitest';
import { extractVersionFromIndexName, identifyOrphanedVersions } from './lifecycle-cleanup.js';

describe('extractVersionFromIndexName', () => {
  it('extracts version from a primary index name', () => {
    expect(extractVersionFromIndexName('oak_lessons_v2026-03-07-143022')).toBe(
      'v2026-03-07-143022',
    );
  });

  it('extracts version from a sandbox index name', () => {
    expect(extractVersionFromIndexName('oak_lessons_sandbox_v2026-03-07-143022')).toBe(
      'v2026-03-07-143022',
    );
  });

  it('returns null for a name without a version suffix', () => {
    expect(extractVersionFromIndexName('oak_lessons')).toBeNull();
  });

  it('returns null for an alias name', () => {
    expect(extractVersionFromIndexName('oak_lessons_sandbox')).toBeNull();
  });
});

describe('identifyOrphanedVersions', () => {
  it('returns empty when all versions are alias targets or previous_version', () => {
    const result = identifyOrphanedVersions(new Set(['v2026-03-23-100000']), 'v2026-03-22-100000', [
      'oak_lessons_v2026-03-23-100000',
      'oak_units_v2026-03-23-100000',
      'oak_lessons_v2026-03-22-100000',
      'oak_units_v2026-03-22-100000',
    ]);

    expect(result).toEqual([]);
  });

  it('identifies versions not in alias targets or previous_version', () => {
    const result = identifyOrphanedVersions(new Set(['v2026-03-24-100000']), 'v2026-03-23-100000', [
      'oak_lessons_v2026-03-24-100000',
      'oak_lessons_v2026-03-23-100000',
      'oak_lessons_v2026-03-20-100000', // orphan
    ]);

    expect(result).toEqual([
      {
        version: 'v2026-03-20-100000',
        indexNames: ['oak_lessons_v2026-03-20-100000'],
      },
    ]);
  });

  it('handles null previous_version', () => {
    const result = identifyOrphanedVersions(new Set(['v2026-03-24-100000']), null, [
      'oak_lessons_v2026-03-24-100000',
      'oak_lessons_v2026-03-20-100000', // orphan
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.version).toBe('v2026-03-20-100000');
  });

  it('deduplicates versions across index kinds', () => {
    const result = identifyOrphanedVersions(new Set(['v2026-03-24-100000']), null, [
      'oak_lessons_v2026-03-20-100000',
      'oak_units_v2026-03-20-100000',
      'oak_sequences_v2026-03-20-100000',
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]?.indexNames).toHaveLength(3);
  });
});
