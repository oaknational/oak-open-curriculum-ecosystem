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
  it('builds add-only swaps when no aliases exist (first-run)', () => {
    const noAliases: AliasTargetMap = {
      lessons: { isAlias: false, targetIndex: null },
      units: { isAlias: false, targetIndex: null },
      unit_rollup: { isAlias: false, targetIndex: null },
      sequences: { isAlias: false, targetIndex: null },
      sequence_facets: { isAlias: false, targetIndex: null },
      threads: { isAlias: false, targetIndex: null },
    };

    const swaps = buildSwapActions(noAliases, 'v2026-03-07-143022', 'primary');

    expect(swaps).toHaveLength(6);
    expect(swaps.every((s) => s.fromIndex === null)).toBe(true);
    expect(swaps[0]?.toIndex).toBe('oak_lessons_v2026-03-07-143022');
  });

  it('includes remove action when aliases already exist', () => {
    const existing: AliasTargetMap = {
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v1' },
      units: { isAlias: true, targetIndex: 'oak_units_v1' },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1' },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1' },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1' },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1' },
    };

    const swaps = buildSwapActions(existing, 'v2026-03-07-143022', 'primary');

    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.fromIndex).toBe('oak_lessons_v1');
    expect(lessonsSwap?.toIndex).toBe('oak_lessons_v2026-03-07-143022');
  });
});

describe('buildRollbackSwaps', () => {
  it('builds rollback swaps from original targets', () => {
    const originalTargets: AliasTargetMap = {
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v1' },
      units: { isAlias: true, targetIndex: 'oak_units_v1' },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1' },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1' },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1' },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1' },
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
      lessons: { isAlias: true, targetIndex: null },
      units: { isAlias: true, targetIndex: 'oak_units_v1' },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1' },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v1' },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1' },
      threads: { isAlias: true, targetIndex: 'oak_threads_v1' },
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
      lessons: { isAlias: true, targetIndex: 'oak_lessons_v2' },
      units: { isAlias: true, targetIndex: 'oak_units_v2' },
      unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v2' },
      sequences: { isAlias: true, targetIndex: 'oak_sequences_v2' },
      sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v2' },
      threads: { isAlias: true, targetIndex: 'oak_threads_v2' },
    };

    const swaps = buildVersionSwapActions(currentTargets, 'v1', 'primary');

    const lessonsSwap = swaps.find((s) => s.alias === 'oak_lessons');
    expect(lessonsSwap?.fromIndex).toBe('oak_lessons_v2');
    expect(lessonsSwap?.toIndex).toBe('oak_lessons_v1');
  });
});

describe('assessAliasHealth', () => {
  it('returns healthy when alias points to a valid index', () => {
    const info: AliasTargetInfo = { isAlias: true, targetIndex: 'oak_lessons_v1' };
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
    const info: AliasTargetInfo = { isAlias: false, targetIndex: null };
    const entry = assessAliasHealth('oak_lessons', info);
    expect(entry.healthy).toBe(false);
    expect(entry.issue).toContain('bare index');
  });

  it('returns unhealthy when alias exists but has no target', () => {
    const info: AliasTargetInfo = { isAlias: true, targetIndex: null };
    const entry = assessAliasHealth('oak_lessons', info);
    expect(entry.healthy).toBe(false);
    expect(entry.issue).toContain('no target');
  });
});
