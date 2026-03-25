/**
 * Integration tests for lifecycle cleanup (ADR-130).
 *
 * Tests cleanup logic with injected fakes — no vi.mock,
 * no vi.stubGlobal (ADR-078).
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import type { AdminError } from '../types/admin-types.js';
import { cleanupOldGenerations, cleanupOrphanedIndexes } from './lifecycle-cleanup.js';

/** Build minimal deps for cleanup tests. Only the deps used by cleanup are needed. */
function createCleanupDeps(overrides: Partial<IndexLifecycleDeps> = {}): IndexLifecycleDeps {
  return {
    createVersionedIndexes: vi.fn().mockResolvedValue(ok(undefined)),
    runVersionedIngest: vi.fn().mockResolvedValue(ok(undefined)),
    resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok({})),
    atomicAliasSwap: vi.fn().mockResolvedValue(ok(undefined)),
    readIndexMeta: vi.fn().mockResolvedValue(ok(null)),
    writeIndexMeta: vi.fn().mockResolvedValue(ok(undefined)),
    listVersionedIndexes: vi.fn().mockResolvedValue(ok([])),
    deleteVersionedIndex: vi.fn().mockResolvedValue(ok(undefined)),
    verifyDocCounts: vi.fn().mockResolvedValue(ok(undefined)),
    generateVersion: vi.fn().mockReturnValue('v2026-03-07-143022'),
    target: 'primary',
    logger: undefined,
    ...overrides,
  };
}

describe('cleanupOldGenerations', () => {
  it('deletes nothing when fewer than MAX_GENERATIONS indexes exist', async () => {
    const deps = createCleanupDeps({
      listVersionedIndexes: vi.fn().mockResolvedValue(ok(['oak_lessons_v2026-03-07-143022'])),
    });

    const result = await cleanupOldGenerations(deps);

    expect(result.deleted).toBe(0);
    expect(result.failed).toBe(0);
    expect(deps.deleteVersionedIndex).not.toHaveBeenCalled();
  });

  it('deletes nothing when exactly MAX_GENERATIONS indexes exist', async () => {
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok(['oak_lessons_v2026-03-01-120000', 'oak_lessons_v2026-03-07-143022']),
        ),
    });

    const result = await cleanupOldGenerations(deps);

    expect(result.deleted).toBe(0);
    expect(result.failed).toBe(0);
  });

  it('deletes oldest indexes when more than MAX_GENERATIONS exist', async () => {
    const deleteVersionedIndex = vi.fn().mockResolvedValue(ok(undefined));
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok([
            'oak_lessons_v2026-01-01-000000',
            'oak_lessons_v2026-02-01-000000',
            'oak_lessons_v2026-03-07-143022',
          ]),
        ),
      deleteVersionedIndex,
    });

    const result = await cleanupOldGenerations(deps);

    // 1 deletion per kind × 6 kinds = 6 total
    expect(result.deleted).toBe(6);
    expect(deleteVersionedIndex).toHaveBeenCalledWith('oak_lessons_v2026-01-01-000000');
  });

  it('treats listing failure as zero cleanup (best-effort)', async () => {
    const listError: AdminError = { type: 'es_error', message: 'listing failed' };
    const deps = createCleanupDeps({
      listVersionedIndexes: vi.fn().mockResolvedValue(err(listError)),
    });

    const result = await cleanupOldGenerations(deps);

    expect(result.deleted).toBe(0);
    expect(result.failed).toBe(0);
    expect(deps.deleteVersionedIndex).not.toHaveBeenCalled();
  });

  it('counts deletion failures separately from successes', async () => {
    const deleteError: AdminError = { type: 'es_error', message: 'delete failed' };
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok([
            'oak_lessons_v2026-01-01-000000',
            'oak_lessons_v2026-02-01-000000',
            'oak_lessons_v2026-03-07-143022',
          ]),
        ),
      deleteVersionedIndex: vi.fn().mockResolvedValue(err(deleteError)),
    });

    const result = await cleanupOldGenerations(deps);

    // 1 failed deletion per kind × 6 kinds = 6 total
    expect(result.failed).toBe(6);
    expect(result.deleted).toBe(0);
  });

  it('aggregates cleanup across all 6 index kinds', async () => {
    const deleteVersionedIndex = vi.fn().mockResolvedValue(ok(undefined));
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok([
            'prefix_v2026-01-01-000000',
            'prefix_v2026-02-01-000000',
            'prefix_v2026-03-07-143022',
          ]),
        ),
      deleteVersionedIndex,
    });

    const result = await cleanupOldGenerations(deps);

    // 6 kinds x 1 deletion each = 6 total deletions
    expect(result.deleted).toBe(6);
    expect(result.failed).toBe(0);
  });

  it('does not delete protected versions even when evicted by generation limit', async () => {
    // Scenario: 4 versions exist. Without protection, cleanup keeps newest 2
    // (v2026-03-23, v2026-03-24) and deletes v2026-01-15 AND v2026-02-21.
    // But v2026-02-21 is the rollback target — it must be protected.
    const deleteVersionedIndex = vi.fn().mockResolvedValue(ok(undefined));
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok([
            'oak_lessons_v2026-01-15-100000',
            'oak_lessons_v2026-02-21-100000',
            'oak_lessons_v2026-03-23-100000',
            'oak_lessons_v2026-03-24-100000',
          ]),
        ),
      deleteVersionedIndex,
    });

    const protectedVersions = new Set(['v2026-02-21-100000']);
    const result = await cleanupOldGenerations(deps, protectedVersions);

    // v2026-01-15 should be deleted (not protected, oldest)
    // v2026-02-21 should be preserved (protected)
    // v2026-03-23 and v2026-03-24 kept as newest MAX_GENERATIONS
    expect(deleteVersionedIndex).toHaveBeenCalledWith('oak_lessons_v2026-01-15-100000');
    expect(deleteVersionedIndex).not.toHaveBeenCalledWith('oak_lessons_v2026-02-21-100000');
    // 1 deletion per kind × 6 kinds = 6 total
    expect(result.deleted).toBe(6);
  });

  it('defaults to no protection when protectedVersions is omitted', async () => {
    // Existing behaviour: without protectedVersions, cleanup deletes oldest beyond MAX_GENERATIONS
    const deleteVersionedIndex = vi.fn().mockResolvedValue(ok(undefined));
    const deps = createCleanupDeps({
      listVersionedIndexes: vi
        .fn()
        .mockResolvedValue(
          ok([
            'oak_lessons_v2026-01-01-000000',
            'oak_lessons_v2026-02-01-000000',
            'oak_lessons_v2026-03-07-143022',
          ]),
        ),
      deleteVersionedIndex,
    });

    // No protectedVersions argument — must behave identically to before
    const result = await cleanupOldGenerations(deps);

    // 1 deletion per kind × 6 kinds = 6 total
    expect(result.deleted).toBe(6);
    expect(deleteVersionedIndex).toHaveBeenCalledWith('oak_lessons_v2026-01-01-000000');
  });
});

describe('cleanupOrphanedIndexes', () => {
  it('deletes all 6 index kinds for a given version', async () => {
    const deleteVersionedIndex = vi.fn().mockResolvedValue(ok(undefined));
    const deps = { deleteVersionedIndex, target: 'primary' as const, logger: undefined };

    await cleanupOrphanedIndexes(deps, 'v2026-03-07-143022');

    expect(deleteVersionedIndex).toHaveBeenCalledTimes(6);
    expect(deleteVersionedIndex).toHaveBeenCalledWith('oak_lessons_v2026-03-07-143022');
  });

  it('logs warnings for failed deletions but does not throw', async () => {
    const deleteError: AdminError = { type: 'es_error', message: 'delete failed' };
    const deleteVersionedIndex = vi.fn().mockResolvedValue(err(deleteError));
    const warn = vi.fn();
    const deps = {
      deleteVersionedIndex,
      target: 'primary' as const,
      logger: {
        warn,
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        trace: vi.fn(),
        fatal: vi.fn(),
      },
    };

    await cleanupOrphanedIndexes(deps, 'v2026-03-07-143022');

    expect(warn).toHaveBeenCalledTimes(6);
    expect(deleteVersionedIndex).toHaveBeenCalledTimes(6);
  });
});
