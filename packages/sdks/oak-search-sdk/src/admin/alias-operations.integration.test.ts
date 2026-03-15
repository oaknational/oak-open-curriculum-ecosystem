/**
 * Integration tests for Elasticsearch alias operations (ADR-130).
 *
 * These test async IO functions with injected ES client fakes —
 * integration level per the project testing taxonomy (T4).
 * No vi.mock, no vi.stubGlobal (ADR-078).
 */

import { describe, it, expect, vi } from 'vitest';
import {
  atomicAliasSwap,
  resolveCurrentAliasTargets,
  listVersionedIndexes,
  deleteVersionedIndex,
} from './alias-operations.js';
import type { AliasSwap } from '../types/index-lifecycle-types.js';
import { Client } from '@elastic/elasticsearch';

class EsClientLikeError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'EsClientLikeError';
    this.statusCode = statusCode;
  }
}

/**
 * Create a 404 error matching the ES client pattern.
 * Used for alias-not-found and index-not-found cases (E1/E3).
 */
function create404Error(message = 'index_not_found_exception'): Error {
  return new EsClientLikeError(message, 404);
}

/** Create a minimal fake ES client with the methods alias-operations uses. */
function createFakeClient(
  overrides: {
    updateAliases?: (
      ...args: Parameters<Client['indices']['updateAliases']>
    ) => ReturnType<Client['indices']['updateAliases']>;
    getAlias?: (
      ...args: Parameters<Client['indices']['getAlias']>
    ) => ReturnType<Client['indices']['getAlias']>;
    get?: (...args: Parameters<Client['indices']['get']>) => ReturnType<Client['indices']['get']>;
    deleteIndex?: (
      ...args: Parameters<Client['indices']['delete']>
    ) => ReturnType<Client['indices']['delete']>;
    resolveIndex?: (
      ...args: Parameters<Client['indices']['resolveIndex']>
    ) => ReturnType<Client['indices']['resolveIndex']>;
  } = {},
): Client {
  const client = new Client({ node: 'http://localhost:9200' });
  vi.spyOn(client.indices, 'updateAliases').mockImplementation(async (...args) => {
    if (overrides.updateAliases !== undefined) {
      return overrides.updateAliases(...args);
    }
    return { acknowledged: true };
  });
  vi.spyOn(client.indices, 'getAlias').mockImplementation(async (...args) => {
    if (overrides.getAlias !== undefined) {
      return overrides.getAlias(...args);
    }
    throw create404Error();
  });
  vi.spyOn(client.indices, 'get').mockImplementation(async (...args) => {
    if (overrides.get !== undefined) {
      return overrides.get(...args);
    }
    throw create404Error();
  });
  vi.spyOn(client.indices, 'delete').mockImplementation(async (...args) => {
    if (overrides.deleteIndex !== undefined) {
      return overrides.deleteIndex(...args);
    }
    return { acknowledged: true };
  });
  vi.spyOn(client.indices, 'resolveIndex').mockImplementation(async (...args) => {
    if (overrides.resolveIndex !== undefined) {
      return overrides.resolveIndex(...args);
    }
    throw create404Error();
  });
  return client;
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
        { remove: { index: 'oak_lessons_v1', alias: 'oak_lessons', must_exist: true } },
        { add: { index: 'oak_lessons_v2', alias: 'oak_lessons' } },
        { remove: { index: 'oak_units_v1', alias: 'oak_units', must_exist: true } },
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

  it('includes remove_index action for bare index migration', async () => {
    const updateAliases = vi.fn().mockResolvedValue({ acknowledged: true });
    const client = createFakeClient({ updateAliases });

    const swaps: readonly AliasSwap[] = [
      {
        fromIndex: null,
        toIndex: 'oak_lessons_v1',
        alias: 'oak_lessons',
        bareIndexToRemove: 'oak_lessons',
      },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(true);
    expect(updateAliases).toHaveBeenCalledWith({
      actions: [
        { remove_index: { index: 'oak_lessons' } },
        { add: { index: 'oak_lessons_v1', alias: 'oak_lessons' } },
      ],
    });
  });

  it('generates correct actions for mixed bare and alias swaps', async () => {
    const updateAliases = vi.fn().mockResolvedValue({ acknowledged: true });
    const client = createFakeClient({ updateAliases });

    const swaps: readonly AliasSwap[] = [
      {
        fromIndex: null,
        toIndex: 'oak_lessons_v1',
        alias: 'oak_lessons',
        bareIndexToRemove: 'oak_lessons',
      },
      { fromIndex: 'oak_units_v1', toIndex: 'oak_units_v2', alias: 'oak_units' },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(true);
    expect(updateAliases).toHaveBeenCalledWith({
      actions: [
        { remove_index: { index: 'oak_lessons' } },
        { add: { index: 'oak_lessons_v1', alias: 'oak_lessons' } },
        { remove: { index: 'oak_units_v1', alias: 'oak_units', must_exist: true } },
        { add: { index: 'oak_units_v2', alias: 'oak_units' } },
      ],
    });
  });

  it('returns validation_error when ES alias API reports partial action failures', async () => {
    const updateAliases = vi.fn().mockResolvedValue({
      acknowledged: true,
      errors: true,
    });
    const client = createFakeClient({ updateAliases });
    const swaps: readonly AliasSwap[] = [
      { fromIndex: 'oak_lessons_v1', toIndex: 'oak_lessons_v2', alias: 'oak_lessons' },
    ];

    const result = await atomicAliasSwap(client, swaps);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('partial failures');
    }
  });
});

describe('resolveCurrentAliasTargets', () => {
  it('returns kind-keyed map with isAlias true for existing aliases', async () => {
    const getAlias = vi.fn().mockImplementation(({ name }: { name: string }) => {
      return Promise.resolve({ [`${name}_v1`]: { aliases: { [name]: {} } } });
    });
    const client = createFakeClient({ getAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(true);
      expect(result.value.lessons.targetIndex).toBe('oak_lessons_v1');
      expect(result.value.lessons.isBareIndex).toBe(false);
      expect(result.value.units.isAlias).toBe(true);
      expect(result.value.threads.isAlias).toBe(true);
    }
  });

  it('returns isAlias false when getAlias throws 404', async () => {
    const client = createFakeClient();

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(false);
      expect(result.value.lessons.targetIndex).toBeNull();
      expect(result.value.lessons.isBareIndex).toBe(false);
    }
  });

  it('returns all 6 kind keys in the result map', async () => {
    const getAlias = vi.fn().mockImplementation(({ name }: { name: string }) => {
      return Promise.resolve({ [`${name}_v1`]: { aliases: { [name]: {} } } });
    });
    const client = createFakeClient({ getAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      const kinds = ['lessons', 'units', 'unit_rollup', 'sequences', 'sequence_facets', 'threads'];
      for (const kind of kinds) {
        expect(result.value).toHaveProperty(kind);
      }
    }
  });

  it('returns isAlias false when getAlias returns empty object (CR-1)', async () => {
    const getAlias = vi.fn().mockResolvedValue({});
    const resolveIndex = vi.fn().mockRejectedValue(create404Error());
    const client = createFakeClient({ getAlias, resolveIndex });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(false);
      expect(result.value.lessons.targetIndex).toBeNull();
      expect(result.value.lessons.isBareIndex).toBe(false);
    }
    expect(resolveIndex).toHaveBeenCalled();
  });

  it('returns err when ES throws non-404 error', async () => {
    const getAlias = vi.fn().mockRejectedValue(new Error('network error'));
    const client = createFakeClient({ getAlias });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
  });

  it('sets isBareIndex true when concrete index exists but no alias', async () => {
    const getAlias = vi.fn().mockRejectedValue(create404Error());
    const resolveIndex = vi.fn().mockResolvedValue({
      indices: [{ name: 'oak_lessons', attributes: [] }],
      aliases: [],
      data_streams: [],
    });
    const client = createFakeClient({ getAlias, resolveIndex });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(false);
      expect(result.value.lessons.isBareIndex).toBe(true);
      expect(result.value.lessons.targetIndex).toBeNull();
    }
  });

  it('sets isBareIndex false when name does not exist at all', async () => {
    const getAlias = vi.fn().mockRejectedValue(create404Error());
    const resolveIndex = vi.fn().mockRejectedValue(create404Error());
    const client = createFakeClient({ getAlias, resolveIndex });

    const result = await resolveCurrentAliasTargets(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.lessons.isAlias).toBe(false);
      expect(result.value.lessons.isBareIndex).toBe(false);
    }
  });
});

describe('listVersionedIndexes', () => {
  it('returns matching versioned indexes for primary target', async () => {
    const get = vi.fn().mockResolvedValue({
      'oak_lessons_v2026-03-01-120000': {},
      'oak_lessons_v2026-03-07-143022': {},
    });
    const client = createFakeClient({ get });

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
    const get = vi.fn().mockResolvedValue({
      'oak_lessons_sandbox_v2026-03-07-143022': {},
    });
    const client = createFakeClient({ get });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'sandbox');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual(['oak_lessons_sandbox_v2026-03-07-143022']);
    }
  });

  it('returns empty array when no indexes match (404)', async () => {
    const client = createFakeClient();

    const result = await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([]);
    }
  });

  it('returns empty array when indices.get returns empty object (ES-1)', async () => {
    const get = vi.fn().mockResolvedValue({});
    const client = createFakeClient({ get });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([]);
    }
  });

  it('primary query uses prefix that excludes sandbox indexes (CR-3)', async () => {
    const get = vi.fn().mockResolvedValue({});
    const client = createFakeClient({ get });

    await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(get).toHaveBeenCalledWith({ index: 'oak_lessons_v*' });
  });

  it('sandbox query uses prefix that excludes primary indexes (CR-3)', async () => {
    const get = vi.fn().mockResolvedValue({});
    const client = createFakeClient({ get });

    await listVersionedIndexes(client, 'oak_lessons', 'sandbox');

    expect(get).toHaveBeenCalledWith({ index: 'oak_lessons_sandbox_v*' });
  });

  it('returns err when ES throws non-404 error', async () => {
    const get = vi.fn().mockRejectedValue(new Error('timeout'));
    const client = createFakeClient({ get });

    const result = await listVersionedIndexes(client, 'oak_lessons', 'primary');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
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
    const deleteIndex = vi.fn().mockRejectedValue(create404Error());
    const client = createFakeClient({ deleteIndex });

    const result = await deleteVersionedIndex(client, 'oak_lessons_v_old');

    expect(result.ok).toBe(true);
  });

  it('returns err for non-404 errors', async () => {
    const error = new EsClientLikeError('permission denied', 403);
    const deleteIndex = vi.fn().mockRejectedValue(error);
    const client = createFakeClient({ deleteIndex });

    const result = await deleteVersionedIndex(client, 'oak_lessons_v_old');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
    }
  });
});
