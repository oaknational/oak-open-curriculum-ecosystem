import { describe, it, expect, vi } from 'vitest';
import { Client, errors } from '@elastic/elasticsearch';
import type { DiagnosticResult } from '@elastic/transport';
import {
  renewLease,
  acquireLease,
  forceReleaseLease,
  inspectLease,
} from './lifecycle-lease-infra.js';
import type { LifecycleLease } from './lifecycle-lease-infra.js';

function createResponseError(statusCode: number, message: string): errors.ResponseError {
  const diagnosticResult: DiagnosticResult = {
    statusCode,
    headers: {},
    warnings: null,
    meta: {
      context: null,
      name: 'lifecycle-lease-infra.unit.test',
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
  return client;
}

function buildLease(overrides?: Partial<LifecycleLease>): LifecycleLease {
  return {
    docId: 'lifecycle_lease_primary',
    holder: 'test-holder',
    target: 'primary',
    runId: 'test-holder-1000',
    ttlMs: 120_000,
    seqNo: 7,
    primaryTerm: 3,
    ...overrides,
  };
}

describe('renewLease', () => {
  it('renews successfully with valid OCC metadata', async () => {
    const client = setupClient();
    vi.spyOn(client, 'index').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      _version: 2,
      _shards: { total: 1, successful: 1, failed: 0 },
      _seq_no: 8,
      _primary_term: 3,
      result: 'updated',
    });

    const result = await renewLease(client, buildLease());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seqNo).toBe(8);
    }
  });

  it('retries on OCC 409 by re-reading the document', async () => {
    const client = setupClient();
    const lease = buildLease();

    vi.spyOn(client, 'index')
      .mockRejectedValueOnce(createResponseError(409, 'version conflict'))
      .mockResolvedValueOnce({
        _index: 'oak_lifecycle_leases',
        _id: 'lifecycle_lease_primary',
        _version: 3,
        _shards: { total: 1, successful: 1, failed: 0 },
        _seq_no: 9,
        _primary_term: 4,
        result: 'updated',
      });

    vi.spyOn(client, 'get').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      found: true,
      _version: 2,
      _seq_no: 8,
      _primary_term: 4,
      _source: {
        run_id: lease.runId,
        holder: lease.holder,
        target: 'primary',
        acquired_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      },
    });

    const result = await renewLease(client, lease);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seqNo).toBe(9);
      expect(result.value.primaryTerm).toBe(4);
    }
  });

  it('returns error when OCC retry finds a different run_id', async () => {
    const client = setupClient();
    const lease = buildLease();

    vi.spyOn(client, 'index').mockRejectedValueOnce(createResponseError(409, 'version conflict'));

    vi.spyOn(client, 'get').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      found: true,
      _version: 2,
      _seq_no: 8,
      _primary_term: 4,
      _source: {
        run_id: 'different-holder-999',
        holder: 'different-holder',
        target: 'primary',
        acquired_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      },
    });

    const result = await renewLease(client, lease);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('superseded');
    }
  });

  it('returns error for non-409 failures without retrying', async () => {
    const client = setupClient();
    vi.spyOn(client, 'index').mockRejectedValueOnce(createResponseError(503, 'unavailable'));

    const result = await renewLease(client, buildLease());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('es_error');
      expect(result.error.message).toContain('Halting operation');
    }
  });
});

describe('acquireLease', () => {
  it('supersedes an expired lease on 409', async () => {
    const client = setupClient();

    vi.spyOn(client, 'index')
      .mockRejectedValueOnce(createResponseError(409, 'document already exists'))
      .mockResolvedValueOnce({
        _index: 'oak_lifecycle_leases',
        _id: 'lifecycle_lease_primary',
        _version: 3,
        _shards: { total: 1, successful: 1, failed: 0 },
        _seq_no: 10,
        _primary_term: 3,
        result: 'updated',
      });

    vi.spyOn(client, 'get').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      found: true,
      _version: 2,
      _seq_no: 5,
      _primary_term: 3,
      _source: {
        run_id: 'dead-process-1234',
        holder: 'dead-process',
        target: 'primary',
        acquired_at: new Date(Date.now() - 300_000).toISOString(),
        expires_at: new Date(Date.now() - 180_000).toISOString(),
      },
    });

    const result = await acquireLease(client, 'primary', 'new-holder', 120_000);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seqNo).toBe(10);
      expect(result.value.holder).toBe('new-holder');
    }
  });

  it('rejects acquisition when existing lease has not expired', async () => {
    const client = setupClient();

    vi.spyOn(client, 'index').mockRejectedValueOnce(
      createResponseError(409, 'document already exists'),
    );

    vi.spyOn(client, 'get').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      found: true,
      _version: 2,
      _seq_no: 5,
      _primary_term: 3,
      _source: {
        run_id: 'active-process-1234',
        holder: 'active-process',
        target: 'primary',
        acquired_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      },
    });

    const result = await acquireLease(client, 'primary', 'new-holder', 120_000);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('validation_error');
      expect(result.error.message).toContain('active-process');
      expect(result.error.message).toContain('release-lease');
    }
  });
});

describe('forceReleaseLease', () => {
  it('deletes the lease document without OCC checks', async () => {
    const client = setupClient();
    vi.spyOn(client, 'delete').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      _version: 1,
      _shards: { total: 1, successful: 1, failed: 0 },
      _seq_no: 10,
      _primary_term: 3,
      result: 'deleted',
    });

    const result = await forceReleaseLease(client, 'primary');

    expect(result.ok).toBe(true);
    expect(client.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 'oak_lifecycle_leases',
        id: 'lifecycle_lease_primary',
      }),
    );
    const deleteCallArg = vi.mocked(client.delete).mock.calls[0]?.[0];
    expect(deleteCallArg).toBeDefined();
    expect(deleteCallArg).not.toHaveProperty('if_seq_no');
  });

  it('succeeds when no lease exists', async () => {
    const client = setupClient();
    vi.spyOn(client, 'delete').mockRejectedValueOnce(createResponseError(404, 'not found'));

    const result = await forceReleaseLease(client, 'primary');

    expect(result.ok).toBe(true);
  });
});

describe('inspectLease', () => {
  it('returns held=false when no lease exists', async () => {
    const client = setupClient();
    vi.spyOn(client, 'get').mockRejectedValueOnce(createResponseError(404, 'not found'));

    const result = await inspectLease(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.held).toBe(false);
    }
  });

  it('returns lease details with expired flag when lease has expired', async () => {
    const client = setupClient();
    vi.spyOn(client, 'get').mockResolvedValueOnce({
      _index: 'oak_lifecycle_leases',
      _id: 'lifecycle_lease_primary',
      found: true,
      _version: 1,
      _seq_no: 5,
      _primary_term: 3,
      _source: {
        run_id: 'dead-holder-1234',
        holder: 'dead-holder',
        target: 'primary',
        acquired_at: '2026-03-24T09:30:00.000Z',
        expires_at: '2026-03-24T09:32:00.000Z',
      },
    });

    const result = await inspectLease(client, 'primary');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.held).toBe(true);
      expect(result.value.holder).toBe('dead-holder');
      expect(result.value.expired).toBe(true);
    }
  });
});
