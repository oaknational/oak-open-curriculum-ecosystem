import { describe, it, expect, vi } from 'vitest';
import { Client, errors } from '@elastic/elasticsearch';
import type { DiagnosticResult } from '@elastic/transport';
import { ok, err, type Result } from '@oaknational/result';
import { withLifecycleLease } from './lifecycle-lease.js';
import type { AdminError } from '../types/admin-types.js';

function createResponseError(statusCode: number, message: string): errors.ResponseError {
  const diagnosticResult: DiagnosticResult = {
    statusCode,
    headers: {},
    warnings: null,
    meta: {
      context: null,
      name: 'lifecycle-lease.integration.test',
      request: {
        params: { method: 'POST', path: '/_test', querystring: '' },
        options: {},
        id: 'test-request-id',
      },
      connection: null,
      attempts: 1,
      aborted: false,
    },
  };
  const responseError = new errors.ResponseError(diagnosticResult);
  responseError.message = message;
  return responseError;
}

function setupClient(): Client {
  const client = new Client({ node: 'http://localhost:9200' });
  vi.spyOn(client.indices, 'resolveIndex').mockResolvedValue({
    indices: [{ name: 'oak_lifecycle_leases', attributes: [] }],
    aliases: [],
    data_streams: [],
  });
  vi.spyOn(client, 'index').mockResolvedValue({
    _index: 'oak_lifecycle_leases',
    _id: 'lifecycle_lease_primary',
    _version: 1,
    _shards: { total: 1, successful: 1, failed: 0 },
    _seq_no: 7,
    _primary_term: 3,
    result: 'created',
  });
  vi.spyOn(client, 'delete').mockResolvedValue({
    _index: 'oak_lifecycle_leases',
    _id: 'lifecycle_lease_primary',
    _version: 1,
    _shards: { total: 1, successful: 1, failed: 0 },
    _seq_no: 8,
    _primary_term: 3,
    result: 'deleted',
  });
  return client;
}

describe('withLifecycleLease', () => {
  it('returns validation error and skips ES calls for invalid TTL', async () => {
    const client = setupClient();
    const result = await withLifecycleLease(client, 'primary', async () => ok('done'), {
      ttlMs: 1_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(false);
    expect(client.index).not.toHaveBeenCalled();
    expect(client.delete).not.toHaveBeenCalled();
  });

  it('returns acquisition error when lease is already held', async () => {
    const client = setupClient();
    vi.spyOn(client, 'index').mockRejectedValue(createResponseError(409, 'version conflict'));

    const result = await withLifecycleLease(client, 'primary', async () => ok('done'), {
      ttlMs: 60_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
    }
    expect(client.delete).not.toHaveBeenCalled();
  });

  it('fails when lease resource exists as alias instead of concrete index', async () => {
    const client = setupClient();
    vi.spyOn(client.indices, 'resolveIndex').mockResolvedValue({
      indices: [],
      aliases: [{ name: 'oak_lifecycle_leases', indices: ['other_index'] }],
      data_streams: [],
    });

    const result = await withLifecycleLease(client, 'primary', async () => ok('done'), {
      ttlMs: 60_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('concrete index');
    }
    expect(client.index).not.toHaveBeenCalled();
  });

  it('releases lease when execution succeeds', async () => {
    const client = setupClient();
    const result = await withLifecycleLease(client, 'primary', async () => ok('done'), {
      ttlMs: 60_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(true);
    expect(client.delete).toHaveBeenCalledOnce();
  });

  it('does not release lease when execution fails', async () => {
    const client = setupClient();
    const executionError: AdminError = {
      type: 'validation_error',
      message: 'mutation failed',
    };
    const result = await withLifecycleLease(client, 'primary', async () => err(executionError), {
      ttlMs: 60_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(false);
    expect(client.delete).not.toHaveBeenCalled();
  });

  it('returns release error when release fails after successful execution', async () => {
    const client = setupClient();
    vi.spyOn(client, 'delete').mockRejectedValue(createResponseError(503, 'es unavailable'));

    const result = await withLifecycleLease(client, 'primary', async () => ok('done'), {
      ttlMs: 60_000,
      holder: 'test-holder',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('Failed to release lifecycle lease');
    }
  });

  it('returns renewal failure and skips release when renewal fails', async () => {
    const client = setupClient();
    vi.spyOn(client, 'index')
      .mockResolvedValueOnce({
        _index: 'oak_lifecycle_leases',
        _id: 'lifecycle_lease_primary',
        _version: 1,
        _shards: { total: 1, successful: 1, failed: 0 },
        _seq_no: 7,
        _primary_term: 3,
        result: 'created',
      })
      .mockRejectedValueOnce(createResponseError(503, 'renew failed'));

    const result = await withLifecycleLease(
      client,
      'primary',
      async () =>
        new Promise<Result<string, AdminError>>((resolve) => {
          setTimeout(() => resolve(ok('done')), 20);
        }),
      { ttlMs: 10_000, holder: 'test-holder', renewalEveryMs: 1 },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('renewal failed');
    }
    expect(client.delete).not.toHaveBeenCalled();
  });
});
