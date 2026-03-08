/**
 * Integration tests for stage and promote lifecycle phases (ADR-130).
 *
 * Tests the two-step deployment workflow: stage indexes without
 * swapping aliases, then promote a staged version into production.
 * Uses injected fakes — no vi.mock, no vi.stubGlobal (ADR-078).
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { createIndexLifecycleService } from './index-lifecycle-service.js';
import type { AdminError } from '../types/admin-types.js';
import {
  STUB_INGEST_RESULT,
  DEFAULT_ALIAS_TARGETS,
  createFakeDeps,
} from './lifecycle-test-helpers.js';

describe('IndexLifecycleService — stage and promote', () => {
  describe('stage', () => {
    it('creates indexes, ingests, verifies — does NOT swap aliases or write metadata', async () => {
      const deps = createFakeDeps();
      const service = createIndexLifecycleService(deps);

      const result = await service.stage({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe('v2026-03-07-143022');
        expect(result.value.ingestResult).toEqual(STUB_INGEST_RESULT);
        expect(result.value.previousVersion).toBeNull();
      }
      expect(deps.createVersionedIndexes).toHaveBeenCalledOnce();
      expect(deps.runVersionedIngest).toHaveBeenCalledOnce();
      expect(deps.verifyDocCounts).toHaveBeenCalledOnce();
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
      expect(deps.writeIndexMeta).not.toHaveBeenCalled();
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

      const result = await service.stage({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.previousVersion).toBe('v2026-03-01-120000');
      }
    });

    it('returns err if creation fails — does not ingest', async () => {
      const createError: AdminError = { type: 'es_error', message: 'cluster full' };
      const deps = createFakeDeps({
        createVersionedIndexes: vi.fn().mockResolvedValue(err(createError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.stage({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(deps.runVersionedIngest).not.toHaveBeenCalled();
    });

    it('returns err if verification fails', async () => {
      const verifyError: AdminError = {
        type: 'validation_error',
        message: 'Doc count below threshold',
      };
      const deps = createFakeDeps({
        verifyDocCounts: vi.fn().mockResolvedValue(err(verifyError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.stage({ bulkDir: '/tmp/bulk' });

      expect(result.ok).toBe(false);
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
    });
  });

  describe('promote', () => {
    it('verifies doc counts, swaps aliases, writes metadata, and cleans up', async () => {
      const deps = createFakeDeps();
      const service = createIndexLifecycleService(deps);

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe('v2026-03-07-143022');
        expect(result.value.previousVersion).toBeNull();
        expect(result.value.indexesCleanedUp).toBe(0);
        expect(result.value.cleanupFailures).toBe(0);
      }
      expect(deps.verifyDocCounts).toHaveBeenCalledWith('v2026-03-07-143022', 1);
      expect(deps.atomicAliasSwap).toHaveBeenCalledOnce();
      expect(deps.writeIndexMeta).toHaveBeenCalledOnce();
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

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.previousVersion).toBe('v2026-03-01-120000');
      }
    });

    it('returns err if staged indexes do not exist', async () => {
      const verifyError: AdminError = {
        type: 'es_error',
        message: 'index_not_found_exception',
      };
      const deps = createFakeDeps({
        verifyDocCounts: vi.fn().mockResolvedValue(err(verifyError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('do not exist');
      }
      expect(deps.atomicAliasSwap).not.toHaveBeenCalled();
    });

    it('returns err if alias swap fails', async () => {
      const swapError: AdminError = { type: 'es_error', message: 'swap failed' };
      const deps = createFakeDeps({
        atomicAliasSwap: vi.fn().mockResolvedValue(err(swapError)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(false);
      expect(deps.writeIndexMeta).not.toHaveBeenCalled();
    });

    it('rolls back aliases if metadata write fails after swap', async () => {
      const writeError: AdminError = { type: 'es_error', message: 'write failed' };
      const deps = createFakeDeps({
        writeIndexMeta: vi.fn().mockResolvedValue(err(writeError)),
        resolveCurrentAliasTargets: vi.fn().mockResolvedValue(ok(DEFAULT_ALIAS_TARGETS)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(false);
      expect(deps.atomicAliasSwap).toHaveBeenCalledTimes(2);
    });

    it('reports cleanup stats in result', async () => {
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
        deleteVersionedIndex: vi.fn().mockResolvedValue(ok(undefined)),
      });
      const service = createIndexLifecycleService(deps);

      const result = await service.promote('v2026-03-07-143022');

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.indexesCleanedUp).toBeGreaterThan(0);
      }
    });
  });
});
