/**
 * Integration tests for the index lifecycle service (ADR-130).
 *
 * Tests orchestration logic using injected fakes — no vi.mock,
 * no vi.stubGlobal (ADR-078). Each dependency is a simple function
 * passed via the deps object.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { IndexLifecycleDeps, AliasSwap } from '../types/index-lifecycle-types.js';
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

/** Alias targets with null targetIndex (no existing aliases — first run). */
const NO_ALIAS_TARGETS = {
  lessons: { isAlias: false, targetIndex: null },
  units: { isAlias: false, targetIndex: null },
  unit_rollup: { isAlias: false, targetIndex: null },
  sequences: { isAlias: false, targetIndex: null },
  sequence_facets: { isAlias: false, targetIndex: null },
  threads: { isAlias: false, targetIndex: null },
};

/** Fake logger for tests that need to assert on log calls. */
function createFakeLogger() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };
}

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
        expect(result.value.cleanupFailures).toBe(0);
      }
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
      expect(deps.atomicAliasSwap).toHaveBeenCalledTimes(2);
    });

    it('skips remove action on first-run (no existing aliases)', async () => {
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
      const deps = createFakeDeps({
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(NO_ALIAS_TARGETS)),
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      expect(atomicAliasSwap).toHaveBeenCalledOnce();
      expect(atomicAliasSwap).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ fromIndex: null })]),
      );
      const swapArg = atomicAliasSwap.mock.calls[0][0] as readonly AliasSwap[];
      expect(swapArg).toHaveLength(6);
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

    it('returns err if ingest fails', async () => {
      const ingestError: AdminError = { type: 'es_error', message: 'ingest failed' };
      const deps = createFakeDeps({
        runVersionedIngest: vi.fn().mockResolvedValue(err(ingestError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(deps.verifyDocCounts).not.toHaveBeenCalled();
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
    });

    it('returns err if alias swap fails during versionedIngest', async () => {
      const swapError: AdminError = { type: 'es_error', message: 'swap failed' };
      const deps = createFakeDeps({
        atomicAliasSwap: vi.fn().mockResolvedValue(err(swapError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(deps.writeIndexMeta).not.toHaveBeenCalled();
    });

    it('rollback swap toIndex values match previous-version pattern', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(atomicAliasSwap).toHaveBeenCalledTimes(2);
      const rollbackSwaps = atomicAliasSwap.mock.calls[1][0] as readonly AliasSwap[];
      for (const swap of rollbackSwaps) {
        expect(swap.toIndex).toContain('v2026-03-01-120000');
        expect(swap.fromIndex).toContain('v2026-03-07-143022');
      }
    });

    it('returns critical error when both metadata write and rollback swap fail', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const rollbackError: AdminError = { type: 'es_error', message: 'rollback swap failed' };
      const logger = createFakeLogger();
      const atomicAliasSwap = vi
        .fn()
        .mockResolvedValueOnce(ok(undefined))
        .mockResolvedValueOnce(err(rollbackError));
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
        atomicAliasSwap,
        logger,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
        expect(result.error.message).toContain('CRITICAL');
        expect(result.error.message).toContain('Manual intervention required');
      }
      expect(atomicAliasSwap).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('rollback swap also failed'),
        expect.any(Object),
      );
    });

    it('returns critical error when rollback swaps cannot be built (null targets)', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const logger = createFakeLogger();
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(NO_ALIAS_TARGETS)),
        atomicAliasSwap,
        logger,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
        expect(result.error.message).toContain('CRITICAL');
        expect(result.error.message).toContain('rollback swaps cannot be built');
      }
      expect(atomicAliasSwap).toHaveBeenCalledOnce();
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cannot build rollback swaps'),
        expect.any(Object),
      );
    });

    it('reports cleanup failures in result', async () => {
      const deleteError: AdminError = { type: 'es_error', message: 'delete failed' };
      const deps = createFakeDeps({
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
      const service = createIndexLifecycleService(deps);

      const result = await service.versionedIngest({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.cleanupFailures).toBeGreaterThan(0);
      }
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

    it('returns err when previous version indexes do not exist', async () => {
      const verifyError: AdminError = {
        type: 'es_error',
        message: 'index_not_found_exception',
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
        verifyDocCounts: vi.fn().mockResolvedValue(err(verifyError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Cannot rollback to version');
        expect(result.error.message).toContain('do not exist or are empty');
      }
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
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

    it('returns err when alias resolution fails during rollback', async () => {
      const aliasError: AdminError = { type: 'es_error', message: 'alias resolution failed' };
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
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(err(aliasError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
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

    it('returns err when alias resolution fails', async () => {
      const aliasError: AdminError = { type: 'es_error', message: 'ES unavailable' };
      const deps = createFakeDeps({
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(err(aliasError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.validateAliases();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('ES unavailable');
      }
    });
  });
});
