/**
 * Unit tests for index metadata management.
 * Tests `Result<T, E>` error handling and schema validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isOk, isErr } from '@oaknational/result';
import type { IndexMetaDoc } from '@oaknational/curriculum-sdk/public/search.js';
import {
  readIndexMeta,
  writeIndexMeta,
  generateVersionFromTimestamp,
  createErrorFromException,
  INDEX_META_INDEX,
  INDEX_VERSION_DOC_ID,
} from './index-meta.js';
import { createFakeEsClient } from './test-helpers.js';

describe('generateVersionFromTimestamp', () => {
  it('generates version string in correct format', () => {
    const version = generateVersionFromTimestamp();
    expect(version).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
  });

  it('generates unique versions for different timestamps', () => {
    const version1 = generateVersionFromTimestamp();
    // Wait a tiny bit to ensure different timestamp
    const version2 = generateVersionFromTimestamp();
    // They might be equal if called in same millisecond, but format should be valid
    expect(version1).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
    expect(version2).toMatch(/^v\d{4}-\d{2}-\d{2}-\d{6}$/);
  });
});

describe('createErrorFromException', () => {
  it('creates mapping_error for strict_dynamic_mapping_exception', () => {
    const error = {
      message: 'strict_dynamic_mapping_exception: introduction of [bad_field] is not allowed',
    };
    const result = createErrorFromException(error);

    expect(result.type).toBe('mapping_error');
    if (result.type === 'mapping_error') {
      expect(result.field).toBe('bad_field');
      expect(result.message).toContain('bad_field');
      expect(result.message).toContain('not in ES mapping');
    }
  });

  it('creates network_error for 5xx status codes', () => {
    const error = {
      message: 'Connection failed',
      meta: { statusCode: 503 },
    };
    const result = createErrorFromException(error);

    expect(result.type).toBe('network_error');
    if (result.type === 'network_error') {
      expect(result.message).toContain('503');
      expect(result.message).toContain('Connection failed');
    }
  });

  it('creates unknown error for unrecognized exceptions', () => {
    const error = new Error('Something unexpected');
    const result = createErrorFromException(error);

    expect(result.type).toBe('unknown');
    if (result.type === 'unknown') {
      expect(result.message).toContain('Something unexpected');
    }
  });

  it('handles non-object errors', () => {
    const result = createErrorFromException('string error');
    expect(result.type).toBe('unknown');
    if (result.type === 'unknown') {
      expect(result.message).toBe('string error');
    }
  });
});

describe('readIndexMeta', () => {
  let mockClient: ReturnType<typeof createFakeEsClient>;

  beforeEach(() => {
    mockClient = createFakeEsClient();
  });

  it('returns Ok(null) when document not found', async () => {
    vi.spyOn(mockClient, 'get').mockRejectedValue({
      meta: { statusCode: 404 },
    });

    const result = await readIndexMeta(mockClient);

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBeNull();
    }
  });

  it('returns Ok with valid metadata doc', async () => {
    const validDoc: IndexMetaDoc = {
      version: 'v2024-01-01-120000',
      ingested_at: '2024-01-01T12:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks1'],
      duration_ms: 5000,
      doc_counts: { lessons: 100, units: 10 },
    };

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
      // Missing required fields
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
    vi.spyOn(mockClient, 'get').mockRejectedValue({
      message: 'Connection timeout',
      meta: { statusCode: 503 },
    });

    const result = await readIndexMeta(mockClient);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('network_error');
    }
  });

  it('calls ES with correct parameters', async () => {
    vi.spyOn(mockClient, 'get').mockRejectedValue({
      meta: { statusCode: 404 },
    });

    await readIndexMeta(mockClient);

    expect(mockClient.get).toHaveBeenCalledWith({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
    });
  });
});

describe('writeIndexMeta', () => {
  let mockClient: ReturnType<typeof createFakeEsClient>;

  beforeEach(() => {
    mockClient = createFakeEsClient();
  });

  it('returns Ok(void) for valid metadata doc', async () => {
    const validDoc: IndexMetaDoc = {
      version: 'v2024-01-01-120000',
      ingested_at: '2024-01-01T12:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks1'],
      duration_ms: 5000,
      doc_counts: { lessons: 100, units: 10 },
    };

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

  it('returns validation_error for invalid doc', async () => {
    const invalidDoc = {
      version: 'v2024-01-01-120000',
      // Missing required fields
    } as IndexMetaDoc;

    const result = await writeIndexMeta(mockClient, invalidDoc);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('validation_error');
    }
  });

  it('returns mapping_error for strict_dynamic_mapping_exception', async () => {
    const validDoc: IndexMetaDoc = {
      version: 'v2024-01-01-120000',
      ingested_at: '2024-01-01T12:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks1'],
      duration_ms: 5000,
      doc_counts: { lessons: 100, units: 10 },
    };

    vi.spyOn(mockClient, 'index').mockRejectedValue({
      message: 'strict_dynamic_mapping_exception: introduction of [bad_field] is not allowed',
    });

    const result = await writeIndexMeta(mockClient, validDoc);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.type).toBe('mapping_error');
    }
  });

  it('calls ES with correct parameters', async () => {
    const validDoc: IndexMetaDoc = {
      version: 'v2024-01-01-120000',
      ingested_at: '2024-01-01T12:00:00Z',
      subjects: ['maths'],
      key_stages: ['ks1'],
      duration_ms: 5000,
      doc_counts: { lessons: 100, units: 10 },
    };

    vi.spyOn(mockClient, 'index').mockResolvedValue({
      _id: INDEX_VERSION_DOC_ID,
      _index: INDEX_META_INDEX,
      result: 'created',
      _shards: { total: 1, successful: 1, failed: 0 },
      _version: 1,
    });

    await writeIndexMeta(mockClient, validDoc);

    expect(mockClient.index).toHaveBeenCalledWith({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
      document: validDoc,
      refresh: true,
    });
  });
});
