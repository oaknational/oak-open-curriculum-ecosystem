/**
 * Unit tests for lifecycle swap builders (ADR-130).
 *
 * Pure function tests — no IO, no mocks.
 */

import { describe, it, expect } from 'vitest';
import type { AliasTargetInfo, AliasTargetMap } from '../types/index-lifecycle-types.js';
import {
  resolveAliasNames,
  buildSwapActions,
  buildRollbackSwaps,
  buildVersionSwapActions,
  assessAliasHealth,
  validateRollbackMeta,
  buildIngestMeta,
  buildPromoteMeta,
} from './lifecycle-swap-builders.js';

describe('resolveAliasNames', () => {
  it('returns 6 primary alias names without suffix', () => {
    const names = resolveAliasNames('primary');
    expect(names).toHaveLength(6);
    expect(names).toContain('oak_lessons');
    expect(names).toContain('oak_units');
    expect(names).toContain('oak_threads');
    // Primary names should NOT have _sandbox suffix
    expect(names.every((n) => !n.includes('sandbox'))).toBe(true);
  });

  it('returns 6 sandbox alias names with _sandbox suffix', () => {
    const names = resolveAliasNames('sandbox');
    expect(names).toHaveLength(6);
    expect(names.every((n) => n.includes('sandbox'))).toBe(true);
  });
});

describe('buildSwapActions', () => {
  it('builds add-only swaps when no aliases exist (fresh cluster)', () => {
    const noAliases: AliasTargetMap = {
      lessons: { isAlias: false, targetIndex: null, isBareIndex: false },
      units: { isAlias: false, targetIndex: null, isBareIndex: false },
      unit_rollup: { isAlias: false, targetIndex: null, isBareIndex: false },
      sequences: { isAlias: false, targetIndex: null, isBareIndex: false },
      sequence_facets: { isAlias: false, targetIndex: null, isBareIndex: false },
      threads: { isAlias: false, targetIndex: null, isBareIndex: false },
    };

    const swaps = buildSwapActions(noAliases, 'v2026-03-07-143022', 'primary');

    expect(swaps).toHaveLength(6);
    expect(swaps.every((s) => s.fromIndex === null)).toBe(true);
    expect(swaps.every((s) => s.bareIndexToRemove === undefined)).toBe(true);
    expect(swaps[0]?.toIndex).toBe('oak_lessons_v2026-03-07-143022');
  });

  it('includes remove action when aliases already exist', () => {
    const existing: AliasTargetMap = {
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v1', isBareIndex: false },
      units: { isAlias: true, targetIndex: 'oak_units_v1', isBareIndex: false },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1', isBareIndex: false },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1', isBareIndex: false },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1', isBareIndex: false },
    };

    const swaps = buildSwapActions(existing, 'v2026-03-07-143022', 'primary');

    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.fromIndex).toBe('oak_lessons_v1');
    expect(lessonsSwap?.toIndex).toBe('oak_lessons_v2026-03-07-143022');
    expect(lessonsSwap?.bareIndexToRemove).toBeUndefined();
  });

  it('sets bareIndexToRemove when bare concrete indexes exist (first-run migration)', () => {
    const bareIndexes: AliasTargetMap = {
      lessons: { isAlias: false, targetIndex: null, isBareIndex: true },
      units: { isAlias: false, targetIndex: null, isBareIndex: true },
      unit_rollup: { isAlias: false, targetIndex: null, isBareIndex: true },
      sequences: { isAlias: false, targetIndex: null, isBareIndex: true },
      sequence_facets: { isAlias: false, targetIndex: null, isBareIndex: true },
      threads: { isAlias: false, targetIndex: null, isBareIndex: true },
    };

    const swaps = buildSwapActions(bareIndexes, 'v2026-03-08-100000', 'primary');

    expect(swaps).toHaveLength(6);
    expect(swaps.every((s) => s.fromIndex === null)).toBe(true);
    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.bareIndexToRemove).toBe('oak_lessons');
    const unitsSwap = swaps.find((s) => s.alias === 'oak_units');
    expect(unitsSwap?.bareIndexToRemove).toBe('oak_units');
  });

  it('handles mixed targets (some bare, some alias, some fresh)', () => {
    const mixed: AliasTargetMap = {
      lessons: { isAlias: false, targetIndex: null, isBareIndex: true },
      units: { isAlias: true, targetIndex: 'oak_units_v1', isBareIndex: false },
      unit_rollup: { isAlias: false, targetIndex: null, isBareIndex: false },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
      sequence_facets: { isAlias: false, targetIndex: null, isBareIndex: true },
      threads: { isAlias: false, targetIndex: null, isBareIndex: false },
    };

    const swaps = buildSwapActions(mixed, 'v2026-03-08-100000', 'primary');

    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.bareIndexToRemove).toBe('oak_lessons');
    expect(lessonsSwap?.fromIndex).toBeNull();

    const unitsSwap = swaps.find((s) => s.alias === 'oak_units');
    expect(unitsSwap?.bareIndexToRemove).toBeUndefined();
    expect(unitsSwap?.fromIndex).toBe('oak_units_v1');

    const rollupSwap = swaps.find((s) => s.alias === 'oak_unit_rollup');
    expect(rollupSwap?.bareIndexToRemove).toBeUndefined();
    expect(rollupSwap?.fromIndex).toBeNull();
  });
});

describe('buildRollbackSwaps', () => {
  it('builds rollback swaps from original targets', () => {
    const originalTargets: AliasTargetMap = {
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v1', isBareIndex: false },
      units: { isAlias: true, targetIndex: 'oak_units_v1', isBareIndex: false },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1', isBareIndex: false },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1', isBareIndex: false },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1', isBareIndex: false },
    };

    const result = buildRollbackSwaps(originalTargets, 'v2026-03-07-143022', 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(6);
      const lessonsSwap = result.value.find((s) => s.alias === 'oak_lessons');
      expect(lessonsSwap?.fromIndex).toBe('oak_lessons_v2026-03-07-143022');
      expect(lessonsSwap?.toIndex).toBe('oak_lessons_v1');
    }
  });

  it('returns err when an alias has null targetIndex', () => {
    const targetsWithNull: AliasTargetMap = {
      lessons: { isAlias: false, targetIndex: null, isBareIndex: false },
      units: { isAlias: true, targetIndex: 'oak_units_v1', isBareIndex: false },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1', isBareIndex: false },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1', isBareIndex: false },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1', isBareIndex: false },
    };

    const result = buildRollbackSwaps(targetsWithNull, 'v2026-03-07-143022', 'primary');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('oak_lessons');
    }
  });
});

describe('buildVersionSwapActions', () => {
  it('builds swaps targeting a specific version', () => {
    const currentTargets: AliasTargetMap = {
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v2', isBareIndex: false },
      units: { isAlias: true, targetIndex: 'oak_units_v2', isBareIndex: false },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v2', isBareIndex: false },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v2', isBareIndex: false },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v2', isBareIndex: false },
      threads: { isAlias: true, targetIndex: 'oak_threads_v2', isBareIndex: false },
    };

    const swaps = buildVersionSwapActions(currentTargets, 'v1', 'primary');

    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.fromIndex).toBe('oak_lessons_v2');
    expect(lessonsSwap?.toIndex).toBe('oak_lessons_v1');
  });
});

describe('assessAliasHealth', () => {
  it('returns healthy when alias points to a valid index', () => {
    const info: AliasTargetInfo = {
      isAlias: true,
      targetIndex: 'oak_lessons_v1',
      isBareIndex: false,
    };
    const entry = assessAliasHealth('oak_lessons', info);
    expect(entry.healthy).toBe(true);
    expect(entry.targetIndex).toBe('oak_lessons_v1');
  });

  it('returns unhealthy when alias info is undefined', () => {
    const entry = assessAliasHealth('oak_lessons', undefined);
    expect(entry.healthy).toBe(false);
    expect(entry.issue).toContain('not found');
  });

  it('returns unhealthy when name is a bare index', () => {
    const info: AliasTargetInfo = { isAlias: false, targetIndex: null, isBareIndex: true };
    const entry = assessAliasHealth('oak_lessons', info);
    expect(entry.healthy).toBe(false);
    expect(entry.issue).toContain('bare index');
  });
});

describe('validateRollbackMeta', () => {
  it('returns ok with currentVersion and previousVersion when previous_version exists', () => {
    const meta = {
      version: 'v2026-03-07-143022',
      ingested_at: '2026-03-07T14:30:22Z',
      subjects: [],
      key_stages: [],
      duration_ms: 120000,
      doc_counts: {},
      previous_version: 'v2026-03-01-120000',
    };

    const result = validateRollbackMeta(meta);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.currentVersion).toBe('v2026-03-07-143022');
      expect(result.value.previousVersion).toBe('v2026-03-01-120000');
    }
  });

  it('returns err when previous_version is undefined', () => {
    const meta = {
      version: 'v2026-03-07-143022',
      ingested_at: '2026-03-07T14:30:22Z',
      subjects: [],
      key_stages: [],
      duration_ms: 120000,
      doc_counts: {},
    };

    const result = validateRollbackMeta(meta);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('not_found');
      expect(result.error.message).toContain('No previous version');
    }
  });
});

describe('buildIngestMeta', () => {
  it('includes previous_version when previousVersion is non-null', () => {
    const meta = buildIngestMeta('v2026-03-07-143022', 'v2026-03-01-120000', undefined, 5000);

    expect(meta.version).toBe('v2026-03-07-143022');
    expect(meta.previous_version).toBe('v2026-03-01-120000');
    expect(meta.duration_ms).toBe(5000);
    expect(meta.subjects).toEqual([]);
  });

  it('omits previous_version when previousVersion is null (first run)', () => {
    const meta = buildIngestMeta('v2026-03-07-143022', null, undefined, 3000);

    expect(meta.version).toBe('v2026-03-07-143022');
    expect(meta.previous_version).toBeUndefined();
    expect(meta.duration_ms).toBe(3000);
  });

  it('includes subject filter when provided', () => {
    const meta = buildIngestMeta('v2026-03-07-143022', null, ['maths', 'science'], 1000);

    expect(meta.subjects).toEqual(['maths', 'science']);
  });
});

describe('buildPromoteMeta', () => {
  it('includes previous_version when previousVersion is non-null', () => {
    const meta = buildPromoteMeta('v2026-03-07-143022', 'v2026-03-01-120000');

    expect(meta.version).toBe('v2026-03-07-143022');
    expect(meta.previous_version).toBe('v2026-03-01-120000');
    expect(meta.duration_ms).toBe(0);
    expect(meta.subjects).toEqual([]);
  });

  it('omits previous_version when previousVersion is null (first run)', () => {
    const meta = buildPromoteMeta('v2026-03-07-143022', null);

    expect(meta.version).toBe('v2026-03-07-143022');
    expect(meta.previous_version).toBeUndefined();
  });
});
