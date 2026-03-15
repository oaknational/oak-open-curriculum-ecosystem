/**
 * Integration tests for index metadata management with injected ES client fakes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errors } from '@elastic/elasticsearch';
import type { DiagnosticResult } from '@elastic/transport';
import { isOk, isErr } from '@oaknational/result';
import { IndexMetaDocSchema } from '@oaknational/sdk-codegen/search';
import type { IndexMetaDoc } from '@oaknational/sdk-codegen/search';
import {
  readIndexMeta,
  writeIndexMeta,
  INDEX_META_INDEX,
  INDEX_VERSION_DOC_ID,
} from './index-meta.js';
import { createFakeEsClient } from './test-helpers.js';

function createResponseError(statusCode: number, message: string): errors.ResponseError {
  const diagnosticResult: DiagnosticResult = {
    statusCode,
    headers: {},
    warnings: null,
    meta: {
      context: null,
      name: 'index-meta.integration.test',
      request: {
        params: {
          method: 'GET',
          path: '/',
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

function createValidIndexMetaDoc(overrides?: Partial<IndexMetaDoc>): IndexMetaDoc {
  return {
    version: 'v2024-01-01-120000',
    ingested_at: '2024-01-01T12:00:00Z',
    subjects: ['maths'],
    key_stages: ['ks1'],
    duration_ms: 5000,
    doc_counts: { lessons: 100, units: 10 },
    previous_version: 'v2023-12-31-235959',
    ...overrides,
  };
}

describe('readIndexMeta', () => {
  let mockClient: ReturnType<typeof createFakeEsClient>;

  beforeEach(() => {
    mockClient = createFakeEsClient();
  });

  it('returns Ok(null) when document not found', async () => {
    const error = createResponseError(404, 'Not Found');
    vi.spyOn(mockClient, 'get').mockRejectedValue(error);

    const result = await readIndexMeta(mockClient);

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBeNull();
    }
  });

  it('returns Ok with valid metadata doc', async () => {
    const validDoc = createValidIndexMetaDoc({ previous_version: undefined });

    vi.spyOn(mockClient, 'get').mockResolvedValue({
      _index: INDEX_META_INDEX,
      _id: INDEX_VERSION_DOC_ID,
      found: true,
      _source: validDoc,
    });

    const result = await readIndexMeta(mockClient);

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toEqual(validDoc);
    }
  });

  it('returns validation_error for invalid doc structure', async () => {
    const invalidDoc = {
      version: 'v2024-01-01-120000',
    };

    vi.spyOn(mockClient, 'get').mockResolvedValue({
      _index: INDEX_META_INDEX,
      _id: INDEX_VERSION_DOC_ID,
      found: true,
      _source: invalidDoc,
    });

    const result = await readIndexMeta(mockClient);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('validation_error');
    }
  });

  it('returns error for network failures', async () => {
    const error = createResponseError(503, 'Connection timeout');
    vi.spyOn(mockClient, 'get').mockRejectedValue(error);

    const result = await readIndexMeta(mockClient);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('network_error');
    }
  });
});

describe('writeIndexMeta', () => {
  let mockClient: ReturnType<typeof createFakeEsClient>;

  beforeEach(() => {
    mockClient = createFakeEsClient();
  });

  it('returns Ok(void) for valid metadata doc', async () => {
    const validDoc = createValidIndexMetaDoc();

    vi.spyOn(mockClient.indices, 'getMapping').mockResolvedValue({
      [INDEX_META_INDEX]: {
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

    vi.spyOn(mockClient, 'index').mockResolvedValue({
      _id: INDEX_VERSION_DOC_ID,
      _index: INDEX_META_INDEX,
      result: 'created',
      _shards: { total: 1, successful: 1, failed: 0 },
      _version: 1,
    });

    const result = await writeIndexMeta(mockClient, validDoc);

    expect(isOk(result)).toBe(true);
  });

  it('returns validation_error for incomplete metadata documents', async () => {
    const incomplete = { version: 'v2024-01-01-120000' };
    const parsed = IndexMetaDocSchema.safeParse(incomplete);
    expect(parsed.success).toBe(false);

    const result = await writeIndexMeta(mockClient, incomplete);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('validation_error');
    }
  });

  it('returns mapping_error for strict_dynamic_mapping_exception', async () => {
    const validDoc = createValidIndexMetaDoc({ previous_version: undefined });

    vi.spyOn(mockClient.indices, 'getMapping').mockResolvedValue({
      [INDEX_META_INDEX]: {
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

    vi.spyOn(mockClient, 'index').mockRejectedValue(
      new Error('strict_dynamic_mapping_exception: introduction of [bad_field] is not allowed'),
    );

    const result = await writeIndexMeta(mockClient, validDoc);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('mapping_error');
    }
  });

  it('returns mapping_error when required mapping field is missing', async () => {
    const validDoc = createValidIndexMetaDoc({ previous_version: undefined });

    vi.spyOn(mockClient.indices, 'getMapping').mockResolvedValue({
      [INDEX_META_INDEX]: {
        mappings: {
          properties: {
            version: { type: 'keyword' },
            ingested_at: { type: 'date' },
            subjects: { type: 'keyword' },
            key_stages: { type: 'keyword' },
            duration_ms: { type: 'integer' },
            doc_counts: { type: 'object' },
          },
        },
      },
    });

    const result = await writeIndexMeta(mockClient, validDoc);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('mapping_error');
      if (result.error.type === 'mapping_error') {
        expect(result.error.message).toContain('generated constraints');
      }
    }
  });
});
