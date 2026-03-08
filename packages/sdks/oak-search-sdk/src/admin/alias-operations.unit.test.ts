/**
 * Unit tests for Elasticsearch alias operations (ADR-130).
 *
 * Tests use simple fake ES client objects injected as arguments —
 * no vi.mock, no vi.stubGlobal (ADR-078).
 */

import { describe, it, expect, vi } from 'vitest';
import {
  atomicAliasSwap,
  resolveCurrentAliasTargets,
  listVersionedIndexes,
  deleteVersionedIndex,
} from './alias-operations.js';
import type { AliasSwap } from '../types/index-lifecycle-types.js';
import type { Client } from '@elastic/elasticsearch';

/** Create a minimal fake ES client with the methods alias-operations uses. */
function createFakeClient(
  overrides: {
    updateAliases?: ReturnType<typeof vi.fn>;
    existsAlias?: ReturnType<typeof vi.fn>;
    getAlias?: ReturnType<typeof vi.fn>;
    catIndices?: ReturnType<typeof vi.fn>;
    deleteIndex?: ReturnType<typeof vi.fn>;
  } = {},
) {
  return {
    indices: {
      updateAliases: overrides.updateAliases ?? vi.fn().mockResolvedValue({ acknowledged: true }),
      existsAlias: overrides.existsAlias ?? vi.fn().mockResolvedValue(false),
      getAlias: overrides.getAlias ?? vi.fn().mockResolvedValue({}),
      delete: overrides.deleteIndex ?? vi.fn().mockResolvedValue({ acknowledged: true }),
    },
    cat: {
      indices: overrides.catIndices ?? vi.fn().mockResolvedValue([]),
    },
  } as unknown as Client;
}

describe('atomicAliasSwap', () => {
  it('sends a single POST /_aliases with remove+add for existing aliases', async () => {
    const updateAliases = vi.fn().mockResolvedValue({ acknowledged: true });
    const client = createFakeClient({ updateAliases });

    const swaps: readonly AliasSwap[] = [
      { fromIndex: 'oak_lessons_v1', toIndex: 'oak_lessons_v2', alias: 'oak_lessons' },
      { fromIndex: 'oak_units_v1', toIndex: 'oak_units_v2', alias: 'oak_units' },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(true);
    expect(updateAliases).toHaveBeenCalledOnce();

    expect(updateAliases).toHaveBeenCalledWith({
      actions: [
        { remove: { index: 'oak_lessons_v1', alias: 'oak_lessons' } },
        { add: { index: 'oak_lessons_v2', alias: 'oak_lessons' } },
        { remove: { index: 'oak_units_v1', alias: 'oak_units' } },
        { add: { index: 'oak_units_v2', alias: 'oak_units' } },
      ],
    });
  });

  it('skips remove action when fromIndex is null (first-run case)', async () => {
    const updateAliases = vi.fn().mockResolvedValue({ acknowledged: true });
    const client = createFakeClient({ updateAliases });

    const swaps: readonly AliasSwap[] = [
      { fromIndex: null, toIndex: 'oak_lessons_v1', alias: 'oak_lessons' },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(true);
    expect(updateAliases).toHaveBeenCalledWith({
      actions: [{ add: { index: 'oak_lessons_v1', alias: 'oak_lessons' } }],
    });
  });

  it('returns err when ES throws', async () => {
    const updateAliases = vi.fn().mockRejectedValue(new Error('cluster unavailable'));
    const client = createFakeClient({ updateAliases });

    const swaps: readonly AliasSwap[] = [
      { fromIndex: null, toIndex: 'oak_lessons_v1', alias: 'oak_lessons' },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
  });
});

describe('resolveCurrentAliasTargets', () => {
  it('returns kind-keyed map with isAlias true for existing aliases', async () => {
    const existsAlias = vi.fn().mockResolvedValue(true);
    const getAlias = vi.fn().mockImplementation(({ name }: { name: string }) => {
      return Promise.resolve({ [`${name}_v1`]: { aliases: { [name]: {} } } });
    });
    const client = createFakeClient({ existsAlias, getAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(true);
      expect(result.value.lessons.targetIndex).toBe('oak_lessons_v1');
      expect(result.value.units.isAlias).toBe(true);
      expect(result.value.threads.isAlias).toBe(true);
    }
  });

  it('returns isAlias false when names are not aliases', async () => {
    const existsAlias = vi.fn().mockResolvedValue(false);
    const client = createFakeClient({ existsAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(false);
      expect(result.value.lessons.targetIndex).toBeNull();
    }
  });

  it('returns err when ES throws', async () => {
    const existsAlias = vi.fn().mockRejectedValue(new Error('network error'));
    const client = createFakeClient({ existsAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
  });
});

describe('listVersionedIndexes', () => {
  it('returns matching versioned indexes for primary target', async () => {
    const catIndices = vi
      .fn()
      .mockResolvedValue([
        { index: 'oak_lessons_v2026-03-01-120000' },
        { index: 'oak_lessons_v2026-03-07-143022' },
        { index: 'oak_lessons_sandbox_v2026-03-07-143022' },
      ]);
    const client = createFakeClient({ catIndices });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([
        'oak_lessons_v2026-03-01-120000',
        'oak_lessons_v2026-03-07-143022',
      ]);
    }
  });

  it('returns matching versioned indexes for sandbox target', async () => {
    const catIndices = vi
      .fn()
      .mockResolvedValue([
        { index: 'oak_lessons_v2026-03-07-143022' },
        { index: 'oak_lessons_sandbox_v2026-03-07-143022' },
      ]);
    const client = createFakeClient({ catIndices });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'sandbox');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual(['oak_lessons_sandbox_v2026-03-07-143022']);
    }
  });

  it('returns err when ES throws', async () => {
    const catIndices = vi.fn().mockRejectedValue(new Error('timeout'));
    const client = createFakeClient({ catIndices });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(result.ok).toBe(false);
  });
});

describe('deleteVersionedIndex', () => {
  it('deletes the named index successfully', async () => {
    const deleteIndex = vi.fn().mockResolvedValue({ acknowledged: true });
    const client = createFakeClient({ deleteIndex });

    const result = await deleteVersionedIndex(client, 'oak_lessons_v2026-03-01-120000');

    expect(result.ok).toBe(true);
    expect(deleteIndex).toHaveBeenCalledWith({ index: 'oak_lessons_v2026-03-01-120000' });
  });

  it('treats 404 as success (index already deleted)', async () => {
    const error = new Error('index_not_found_exception');
    Object.assign(error, { statusCode: 404 });
    const deleteIndex = vi.fn().mockRejectedValue(error);
    const client = createFakeClient({ deleteIndex });

    const result = await deleteVersionedIndex(client, 'oak_lessons_v_old');

    expect(result.ok).toBe(true);
  });

  it('returns err for non-404 errors', async () => {
    const error = new Error('permission denied');
    Object.assign(error, { statusCode: 403 });
    const deleteIndex = vi.fn().mockRejectedValue(error);
    const client = createFakeClient({ deleteIndex });

    const result = await deleteVersionedIndex(client, 'oak_lessons_v_old');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
  });
});
