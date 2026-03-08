/**
 * Integration tests for the index lifecycle service (ADR-130).
 *
 * Covers versionedIngest, rollback, and validateAliases phases.
 * Stage and promote tests live in lifecycle-stage-promote.integration.test.ts.
 *
 * Uses injected fakes — no vi.mock, no vi.stubGlobal (ADR-078).
 * Each dependency is a simple function passed via the deps object.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { AliasSwap } from '../types/index-lifecycle-types.js';
import { createIndexLifecycleService } from './index-lifecycle-service.js';
import type { AdminError } from '../types/admin-types.js';
import {
  STUB_INGEST_RESULT,
  DEFAULT_ALIAS_TARGETS,
  NO_ALIAS_TARGETS,
  createFakeLogger,
  createFakeDeps,
} from './lifecycle-test-helpers.js';

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
        lessons: {
          isAlias: true,
          targetIndex: 'oak_lessons_v2026-03-07-143022',
          isBareIndex: false,
        },
        units: { isAlias: true, targetIndex: 'oak_units_v2026-03-07-143022', isBareIndex: false },
        unit_rollup: {
          isAlias: true,
          targetIndex: 'oak_unit_rollup_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequences: {
          isAlias: true,
          targetIndex: 'oak_sequences_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
          isBareIndex: false,
        },
        threads: {
          isAlias: true,
          targetIndex: 'oak_threads_v2026-03-07-143022',
          isBareIndex: false,
        },
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

    it('attempts alias reversal when writeIndexMeta fails during rollback', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'meta write failed' };
      const currentTargets = {
        lessons: {
          isAlias: true,
          targetIndex: 'oak_lessons_v2026-03-07-143022',
          isBareIndex: false,
        },
        units: { isAlias: true, targetIndex: 'oak_units_v2026-03-07-143022', isBareIndex: false },
        unit_rollup: {
          isAlias: true,
          targetIndex: 'oak_unit_rollup_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequences: {
          isAlias: true,
          targetIndex: 'oak_sequences_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
          isBareIndex: false,
        },
        threads: {
          isAlias: true,
          targetIndex: 'oak_threads_v2026-03-07-143022',
          isBareIndex: false,
        },
      };
      const atomicAliasSwap = vi.fn().mockResolvedValue(ok(undefined));
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
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('meta write failed');
      }
      expect(atomicAliasSwap).toHaveBeenCalledTimes(2);
    });

    it('returns critical error when both rollback meta write and reversal swap fail', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'meta write failed' };
      const reversalError: AdminError = { type: 'es_error', message: 'reversal swap failed' };
      const currentTargets = {
        lessons: {
          isAlias: true,
          targetIndex: 'oak_lessons_v2026-03-07-143022',
          isBareIndex: false,
        },
        units: { isAlias: true, targetIndex: 'oak_units_v2026-03-07-143022', isBareIndex: false },
        unit_rollup: {
          isAlias: true,
          targetIndex: 'oak_unit_rollup_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequences: {
          isAlias: true,
          targetIndex: 'oak_sequences_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
          isBareIndex: false,
        },
        threads: {
          isAlias: true,
          targetIndex: 'oak_threads_v2026-03-07-143022',
          isBareIndex: false,
        },
      };
      const atomicAliasSwap = vi
        .fn()
        .mockResolvedValueOnce(ok(undefined))
        .mockResolvedValueOnce(err(reversalError));
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
        atomicAliasSwap,
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
        expect(result.error.message).toContain('CRITICAL');
        expect(result.error.message).toContain('Manual intervention required');
      }
      expect(atomicAliasSwap).toHaveBeenCalledTimes(2);
    });

    it('returns err when an alias has no target during rollback', async () => {
      const missingAliasTargets = {
        lessons: {
          isAlias: true,
          targetIndex: 'oak_lessons_v2026-03-07-143022',
          isBareIndex: false,
        },
        units: { isAlias: false, targetIndex: null, isBareIndex: false },
        unit_rollup: {
          isAlias: true,
          targetIndex: 'oak_unit_rollup_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequences: {
          isAlias: true,
          targetIndex: 'oak_sequences_v2026-03-07-143022',
          isBareIndex: false,
        },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v2026-03-07-143022',
          isBareIndex: false,
        },
        threads: {
          isAlias: true,
          targetIndex: 'oak_threads_v2026-03-07-143022',
          isBareIndex: false,
        },
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
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(missingAliasTargets)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.rollback();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('units');
        expect(result.error.message).toContain('bare index');
      }
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
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
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v1', isBareIndex: false },
        units: { isAlias: true, targetIndex: 'oak_units_v1', isBareIndex: false },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1', isBareIndex: false },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v1',
          isBareIndex: false,
        },
        threads: { isAlias: true, targetIndex: 'oak_threads_v1', isBareIndex: false },
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
        lessons: { isAlias: true, targetIndex: 'oak_lessons_v1', isBareIndex: false },
        units: { isAlias: false, targetIndex: null, isBareIndex: false },
        unit_rollup: { isAlias: true, targetIndex: 'oak_unit_rollup_v1', isBareIndex: false },
        sequences: { isAlias: true, targetIndex: 'oak_sequences_v1', isBareIndex: false },
        sequence_facets: {
          isAlias: true,
          targetIndex: 'oak_sequence_facets_v1',
          isBareIndex: false,
        },
        threads: { isAlias: true, targetIndex: 'oak_threads_v1', isBareIndex: false },
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
