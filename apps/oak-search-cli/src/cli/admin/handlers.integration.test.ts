/**
 * Integration tests for admin CLI handlers.
 *
 * Tests the SDK-mapped admin operations. Complex orchestration
 * operations (ingest, verify, etc.) are tested separately.
 */

import { describe, it, expect, vi } from 'vitest';
import type { AdminService } from '@oaknational/oak-search-sdk';
import { ok } from '@oaknational/result';
import {
  handleSetup,
  handleReset,
  handleStatus,
  handleSynonyms,
  handleGetMeta,
  handleSetMeta,
} from './handlers.js';

/** Create a mock admin service returning ok() Results for all methods. */
function createMockAdmin(): AdminService {
  return {
    setup: vi.fn().mockResolvedValue(
      ok({
        synonymsCreated: true,
        synonymCount: 42,
        indexResults: [],
      }),
    ),
    reset: vi.fn().mockResolvedValue(
      ok({
        synonymsCreated: true,
        synonymCount: 42,
        indexResults: [],
      }),
    ),
    verifyConnection: vi.fn().mockResolvedValue(
      ok({
        clusterName: 'test-cluster',
        version: '8.17.0',
      }),
    ),
    listIndexes: vi.fn().mockResolvedValue(
      ok([
        { index: 'oak_lessons', health: 'green', docsCount: 12833 },
        { index: 'oak_unit_rollup', health: 'green', docsCount: 1665 },
      ]),
    ),
    updateSynonyms: vi.fn().mockResolvedValue(
      ok({
        count: 42,
      }),
    ),
    ingest: vi.fn().mockResolvedValue(
      ok({
        filesProcessed: 1,
        lessonsIndexed: 100,
        unitsIndexed: 10,
        rollupsIndexed: 10,
        threadsIndexed: 5,
        sequencesIndexed: 2,
        sequenceFacetsIndexed: 2,
      }),
    ),
    getIndexMeta: vi.fn().mockResolvedValue(ok(null)),
    setIndexMeta: vi.fn().mockResolvedValue(ok(undefined)),
  };
}

describe('handleSetup', () => {
  it('calls admin.setup with options', async () => {
    const admin = createMockAdmin();

    await handleSetup(admin, { verbose: true });

    expect(admin.setup).toHaveBeenCalledWith({ verbose: true });
  });

  it('returns ok with the setup result', async () => {
    const admin = createMockAdmin();

    const result = await handleSetup(admin);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ synonymsCreated: true, synonymCount: 42, indexResults: [] });
    }
  });
});

describe('handleReset', () => {
  it('calls admin.reset with options', async () => {
    const admin = createMockAdmin();

    await handleReset(admin, { verbose: true });

    expect(admin.reset).toHaveBeenCalledWith({ verbose: true });
  });
});

describe('handleStatus', () => {
  it('returns ok with connection status and index list', async () => {
    const admin = createMockAdmin();

    const result = await handleStatus(admin);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.connection).toEqual({
        clusterName: 'test-cluster',
        version: '8.17.0',
      });
      expect(result.value.indexes).toHaveLength(2);
    }
  });
});

describe('handleSynonyms', () => {
  it('returns ok with synonym count', async () => {
    const admin = createMockAdmin();

    const result = await handleSynonyms(admin);

    expect(admin.updateSynonyms).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ count: 42 });
    }
  });
});

describe('handleGetMeta', () => {
  it('calls admin.getIndexMeta and returns the result', async () => {
    const admin = createMockAdmin();

    const result = await handleGetMeta(admin);

    expect(admin.getIndexMeta).toHaveBeenCalled();
    expect(result.ok).toBe(true);
  });
});

describe('handleSetMeta', () => {
  it('calls admin.setIndexMeta with the provided meta', async () => {
    const admin = createMockAdmin();
    const meta = {
      version: 'v2-test',
      ingested_at: '2026-02-11T00:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks3'],
      duration_ms: 1000,
      doc_counts: {},
    };

    await handleSetMeta(admin, meta);

    expect(admin.setIndexMeta).toHaveBeenCalledWith(meta);
  });
});
