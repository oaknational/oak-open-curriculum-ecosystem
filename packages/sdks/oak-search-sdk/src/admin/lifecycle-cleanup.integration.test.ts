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
import { cleanupOldGenerations } from './lifecycle-cleanup.js';

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

    expect(result.deleted).toBeGreaterThan(0);
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

    expect(result.failed).toBeGreaterThan(0);
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
});
