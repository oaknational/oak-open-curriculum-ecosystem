import { Client, errors } from '@elastic/elasticsearch';
import type { DiagnosticResult } from '@elastic/transport';
import { describe, expect, it, vi } from 'vitest';
import { ensureIndexMetaMappingContract } from './index-meta-mapping-contract.js';

function createResponseError(statusCode: number, message: string): errors.ResponseError {
  const diagnosticResult: DiagnosticResult = {
    statusCode,
    headers: {},
    warnings: null,
    meta: {
      context: null,
      name: 'index-meta-mapping-contract.integration.test',
      request: {
        params: {
          method: 'GET',
          path: '/_mapping',
          querystring: '',
        },
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

describe('ensureIndexMetaMappingContract', () => {
  it('returns ok when required mapping fields exist', async () => {
    const client = new Client({ node: 'http://localhost:9200' });
    vi.spyOn(client.indices, 'getMapping').mockResolvedValue({
      oak_meta: {
        mappings: {
          dynamic: 'strict',
          properties: {
            version: { type: 'keyword' },
            ingested_at: { type: 'date' },
            subjects: { type: 'keyword' },
            key_stages: { type: 'keyword' },
            duration_ms: { type: 'integer' },
            doc_counts: { type: 'object', enabled: false },
            previous_version: { type: 'keyword', normalizer: 'oak_lower' },
          },
        },
      },
    });

    const result = await ensureIndexMetaMappingContract(client, 'oak_meta');
    expect(result.ok).toBe(true);
  });

  it('returns mapping_error when required fields are missing', async () => {
    const client = new Client({ node: 'http://localhost:9200' });
    vi.spyOn(client.indices, 'getMapping').mockResolvedValue({
      oak_meta: {
        mappings: {
          dynamic: 'true',
          properties: {
            version: { type: 'keyword' },
          },
        },
      },
    });

    const result = await ensureIndexMetaMappingContract(client, 'oak_meta');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('mapping_error');
    }
  });

  it('returns not_found when mapping index is missing', async () => {
    const client = new Client({ node: 'http://localhost:9200' });
    vi.spyOn(client.indices, 'getMapping').mockRejectedValue(
      createResponseError(404, 'index not found'),
    );

    const result = await ensureIndexMetaMappingContract(client, 'oak_meta');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('not_found');
    }
  });
});
