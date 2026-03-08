/**
 * Unit tests for the index lifecycle service (ADR-130).
 *
 * Tests orchestration logic using injected fakes — no vi.mock,
 * no vi.stubGlobal (ADR-078). Each dependency is a simple function
 * passed via the deps object.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { IndexLifecycleDeps } from '../types/index-lifecycle-types.js';
import { createIndexLifecycleService } from './index-lifecycle-service.js';
import type { IngestResult, AdminError } from '../types/admin-types.js';

/** Minimal ingest result for test stubs. */
const STUB_INGEST_RESULT: IngestResult = {
  filesProcessed: 6,
  lessonsIndexed: 100,
  unitsIndexed: 50,
  rollupsIndexed: 50,
  threadsIndexed: 20,
  sequencesIndexed: 10,
  sequenceFacetsIndexed: 10,
};

/** Default alias targets keyed by SearchIndexKind (existing alias state). */
const DEFAULT_ALIAS_TARGETS = {
  lessons: { isAlias: true, targetIndex: 'oak_lessons_v2026-03-01-120000' },
  units: { isAlias: true, targetIndex: 'oak_units_v2026-03-01-120000' },
  unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v2026-03-01-120000' },
  sequences: { isAlias: true, targetIndex: 'oak_sequences_v2026-03-01-120000' },
  sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v2026-03-01-120000' },
  threads: { isAlias: true, targetIndex: 'oak_threads_v2026-03-01-120000' },
};

/** Build a complete set of default fakes that all return success. */
function buildDefaultFakes(): IndexLifecycleDeps {
  return {
    createVersionedIndexes: vi.fn().mockResolvedValue(ok(undefined)),
    runVersionedIngest: vi.fn().mockResolvedValue(ok(STUB_INGEST_RESULT)),
    resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
    atomicAliasSwap: vi.fn().mockResolvedValue(ok(undefined)),
    readIndexMeta: vi.fn().mockResolvedValue(ok(null)),
    writeIndexMeta: vi.fn().mockResolvedValue(ok(undefined)),
    listVersionedIndexes: vi.fn().mockResolvedValue(ok([])),
    deleteVersionedIndex: vi.fn().mockResolvedValue(ok(undefined)),
    verifyDocCounts: vi.fn().mockResolvedValue(ok(undefined)),
    generateVersion: vi.fn().mockReturnValue('v2026-03-07-143022'),
    target: 'primary',
    logger: undefined,
  };
}

/** Create a deps object with all fakes defaulting to success, overriding specific deps. */
function createFakeDeps(overrides: Partial<IndexLifecycleDeps> = {}): IndexLifecycleDeps {
  return { ...buildDefaultFakes(), ...overrides };
}

describe('IndexLifecycleService', () => {
  describe('versionedIngest', () => {
    it('runs the full cycle: create → ingest → verify → swap → metadata → cleanup', async () => {
      const deps = createFakeDeps();
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe('v2026-03-07-143022');
        expect(result.value.ingestResult).toEqual(STUB_INGEST_RESULT);
        expect(result.value.previousVersion).toBeNull();
      }

      // Verify call order
      expect(deps.createVersionedIndexes).toHaveBeenCalledOnce();
      expect(deps.runVersionedIngest).toHaveBeenCalledOnce();
      expect(deps.verifyDocCounts).toHaveBeenCalledOnce();
      expect(deps.resolveCurrentAliasTargets).toHaveBeenCalledOnce();
      expect(deps.atomicAliasSwap).toHaveBeenCalledOnce();
      expect(deps.writeIndexMeta).toHaveBeenCalledOnce();
    });

    it('uses explicit version when provided', async () => {
      const deps = createFakeDeps();
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({
        bulkDir: '/tmp/bulk',
        version: 'v2026-03-07-custom',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe('v2026-03-07-custom');
      }
      // generateVersion should NOT have been called
      expect(deps.generateVersion).not.toHaveBeenCalled();
    });

    it('records previous version from existing metadata', async () => {
      const deps = createFakeDeps({
        readIndexMeta: vi.fn().mockResolvedValue(
          ok({
            version: 'v2026-03-01-120000',
            ingested_at: '2026-03-01T12:00:00Z',
            subjects: [],
            key_stages: [],
            duration_ms: 0,
            doc_counts: {},
          }),
        ),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.previousVersion).toBe('v2026-03-01-120000');
      }
    });

    it('returns err and does NOT swap if verification fails', async () => {
      const verifyError: AdminError = {
        type: 'validation_error',
        message: 'Doc count below threshold',
      };
      const deps = createFakeDeps({
        verifyDocCounts: vi.fn().mockResolvedValue(err(verifyError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
      }
      // Alias swap should NOT have been called
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
    });

    it('rolls back aliases if metadata write fails after swap', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      // atomicAliasSwap should have been called TWICE — once for swap, once for rollback
      expect(deps.atomicAliasSwap).toHaveBeenCalledTimes(2);
    });

    it('skips remove action on first-run (no existing aliases)', async () => {
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
      const noAliasTargets = {
        lessons: { isAlias: false, targetIndex: null },
        units: { isAlias: false, targetIndex: null },
        unit_rollup: { isAlias: false, targetIndex: null },
        sequences: { isAlias: false, targetIndex: null },
        sequence_facets: { isAlias: false, targetIndex: null },
        threads: { isAlias: false, targetIndex: null },
      };
      const deps = createFakeDeps({
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(noAliasTargets)),
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      // Verify atomicAliasSwap was called and every swap has null fromIndex
      expect(atomicAliasSwap).toHaveBeenCalledOnce();
      expect(atomicAliasSwap).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ fromIndex: null })]),
      );
      // Verify every swap has null fromIndex (first-run: no existing aliases)
      const swapArg = atomicAliasSwap.mock.calls[0]?.[0] as readonly { fromIndex: string | null }[];
      expect(swapArg.every((s) => s.fromIndex === null)).toBe(true);
    });

    it('returns err if index creation fails', async () => {
      const createError: AdminError = { type: 'es_error', message: 'cluster full' };
      const deps = createFakeDeps({
        createVersionedIndexes: vi.fn().mockResolvedValue(err(createError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(deps.runVersionedIngest).not.toHaveBeenCalled();
    });
  });

  describe('rollback', () => {
    it('swaps aliases back to previous version from metadata', async () => {
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
      const currentTargets = {
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v2026-03-07-143022' },
        units: { isAlias: true, targetIndex: 'oak_units_v2026-03-07-143022' },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v2026-03-07-143022' },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v2026-03-07-143022' },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
        },
        threads: { isAlias: true, targetIndex: 'oak_threads_v2026-03-07-143022' },
      };
      const deps = createFakeDeps({
        readIndexMeta: vi.fn().mockResolvedValue(
          ok({
            version: 'v2026-03-07-143022',
            ingested_at: '2026-03-07T14:30:22Z',
            subjects: [],
            key_stages: [],
            duration_ms: 0,
            doc_counts: {},
            previous_version: 'v2026-03-01-120000',
          }),
        ),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(currentTargets)),
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.rolledBackToVersion).toBe('v2026-03-01-120000');
        expect(result.value.rolledBackFromVersion).toBe('v2026-03-07-143022');
      }
      expect(atomicAliasSwap).toHaveBeenCalledOnce();
    });

    it('returns err when no metadata exists', async () => {
      const deps = createFakeDeps({
        readIndexMeta: vi.fn().mockResolvedValue(ok(null)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('No index metadata');
      }
    });

    it('returns err when writeIndexMeta fails during rollback', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'meta write failed' };
      const currentTargets = {
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v2026-03-07-143022' },
        units: { isAlias: true, targetIndex: 'oak_units_v2026-03-07-143022' },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v2026-03-07-143022' },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v2026-03-07-143022' },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
        },
        threads: { isAlias: true, targetIndex: 'oak_threads_v2026-03-07-143022' },
      };
      const deps = createFakeDeps({
        readIndexMeta: vi.fn().mockResolvedValue(
          ok({
            version: 'v2026-03-07-143022',
            ingested_at: '2026-03-07T14:30:22Z',
            subjects: [],
            key_stages: [],
            duration_ms: 0,
            doc_counts: {},
            previous_version: 'v2026-03-01-120000',
          }),
        ),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(currentTargets)),
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('meta write failed');
      }
    });

    it('logs compound failure when both writeIndexMeta and rollback swap fail', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const rollbackError: AdminError = { type: 'es_error', message: 'rollback swap failed' };
      const logger = {
        trace: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        fatal: vi.fn(),
      };
      let callCount = 0;
      const atomicAliasSwap = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(ok(undefined));
        }
        return Promise.resolve(err(rollbackError));
      });
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
        atomicAliasSwap,
        logger,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(atomicAliasSwap).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('rollback swap also failed'),
        expect.any(Object),
      );
    });

    it('returns err when no previous_version recorded', async () => {
      const deps = createFakeDeps({
        readIndexMeta: vi.fn().mockResolvedValue(
          ok({
            version: 'v2026-03-07-143022',
            ingested_at: '2026-03-07T14:30:22Z',
            subjects: [],
            key_stages: [],
            duration_ms: 0,
            doc_counts: {},
          }),
        ),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('No previous version');
      }
    });
  });

  describe('validateAliases', () => {
    it('returns allHealthy true when all aliases point to valid indexes', async () => {
      const healthyTargets = {
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v1' },
        units: { isAlias: true, targetIndex: 'oak_units_v1' },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1' },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v1' },
        sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1' },
        threads: { isAlias: true, targetIndex: 'oak_threads_v1' },
      };
      const deps = createFakeDeps({
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(healthyTargets)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.validateAliases();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.allHealthy).toBe(true);
        expect(result.value.entries).toHaveLength(6);
      }
    });

    it('returns allHealthy false when an alias is missing', async () => {
      const mixedTargets = {
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v1' },
        units: { isAlias: false, targetIndex: null },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1' },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v1' },
        sequence_facets: { isAlias: true, targetIndex: 'oak_sequence_facets_v1' },
        threads: { isAlias: true, targetIndex: 'oak_threads_v1' },
      };
      const deps = createFakeDeps({
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(mixedTargets)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.validateAliases();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.allHealthy).toBe(false);
        const unhealthy = result.value.entries.find((e) => !e.healthy);
        expect(unhealthy?.alias).toBe('oak_units');
      }
    });
  });
});
