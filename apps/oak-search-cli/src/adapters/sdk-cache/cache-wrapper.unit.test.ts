/**
 * Unit tests for cache wrapper functions.
 *
 * Tests pure caching logic with injected dependencies (no real Redis).
 *
 * @remarks
 * These tests verify caching behaviour without IO:
 * - Cache hits return cached values
 * - Cache misses call the underlying function
 * - Stats are updated correctly
 * - Negative caching (404s) works correctly
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { SdkNotFoundError } from '@oaknational/curriculum-sdk';
import {
  withCache,
  withCacheAndNegative,
  buildCacheKey,
  type CacheStats,
  type CacheOperations,
} from './cache-wrapper';
import { type TranscriptCacheEntry, serializeTranscriptCacheEntry } from './transcript-cache-types';

// =============================================================================
// Test Helpers
// =============================================================================

/** Creates a fake cache operations object for testing. */
function createFakeCacheOps(cache = new Map<string, string>()): CacheOperations {
  return {
    get: vi.fn(async (key: string) => cache.get(key) ?? null),
    setex: vi.fn(async (key: string, ttlSeconds: number, value: string) => {
      cache.set(key, value);
      cache.set(`${key}:ttl`, String(ttlSeconds));
    }),
  };
}

/** Creates a stats object for tracking cache hits/misses. */
function createStats(): CacheStats {
  return { hits: 0, misses: 0 };
}

/** Type guard for string values (used in tests). */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// =============================================================================
// buildCacheKey tests
// =============================================================================

describe('buildCacheKey', () => {
  it('should create a key with prefix, resource type, and id', () => {
    const key = buildCacheKey('lesson-summary', 'adding-fractions');
    expect(key).toBe('oak-sdk:v1:lesson-summary:adding-fractions');
  });

  it('should handle special characters in id', () => {
    const key = buildCacheKey('transcript', 'lesson-with-special:chars/here');
    expect(key).toBe('oak-sdk:v1:transcript:lesson-with-special:chars/here');
  });
});

// =============================================================================
// withCache tests
// =============================================================================

describe('withCache', () => {
  it('should return cached value on cache hit', async () => {
    const cache = new Map([['oak-sdk:v1:test:id1', JSON.stringify('cached-value')]]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCache(underlying, ops, 'test', 14, stats, isString, () => 86400);

    const result = await wrapped('id1');

    expect(result).toEqual(ok('cached-value'));
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(0);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should call underlying function on cache miss', async () => {
    const ops = createFakeCacheOps();
    const stats = createStats();
    const underlying = vi.fn().mockResolvedValue(ok('fresh-value'));

    const wrapped = withCache(underlying, ops, 'test', 14, stats, isString, () => 86400);

    const result = await wrapped('id1');

    expect(result).toEqual(ok('fresh-value'));
    expect(stats.hits).toBe(0);
    expect(stats.misses).toBe(1);
    expect(underlying).toHaveBeenCalledWith('id1');
  });

  it('should write to cache after successful fetch', async () => {
    const ops = createFakeCacheOps();
    const stats = createStats();
    const underlying = vi.fn().mockResolvedValue(ok('fresh-value'));

    const wrapped = withCache(underlying, ops, 'test', 14, stats, isString, () => 86400);

    await wrapped('id1');

    expect(ops.setex).toHaveBeenCalledWith(
      'oak-sdk:v1:test:id1',
      86400,
      JSON.stringify('fresh-value'),
    );
  });

  it('should not write to cache on error result', async () => {
    const ops = createFakeCacheOps();
    const stats = createStats();
    const error: SdkNotFoundError = { kind: 'not_found', resource: 'id1', resourceType: 'lesson' };
    const underlying = vi.fn().mockResolvedValue(err(error));

    const wrapped = withCache(underlying, ops, 'test', 14, stats, isString, () => 86400);

    const result = await wrapped('id1');

    expect(result.ok).toBe(false);
    expect(ops.setex).not.toHaveBeenCalled();
  });
});

// =============================================================================
// withCacheAndNegative tests
// =============================================================================

describe('withCacheAndNegative', () => {
  it('should return cached value on cache hit', async () => {
    const cache = new Map([['oak-sdk:v1:transcript:lesson1', JSON.stringify('cached-transcript')]]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result).toEqual(ok('cached-transcript'));
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should return not_found error on cached not_found entry', async () => {
    const notFoundEntry = serializeTranscriptCacheEntry({ status: 'not_found' });
    const cache = new Map([['oak-sdk:v1:transcript:lesson1', notFoundEntry]]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
    }
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should return not_found error on cached no_video entry', async () => {
    const noVideoEntry = serializeTranscriptCacheEntry({ status: 'no_video' });
    const cache = new Map([['oak-sdk:v1:transcript:lesson1', noVideoEntry]]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
    }
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should bypass cached not_found when ignoreCached404 is true', async () => {
    const notFoundEntry = serializeTranscriptCacheEntry({ status: 'not_found' });
    const cache = new Map([['oak-sdk:v1:transcript:lesson1', notFoundEntry]]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn().mockResolvedValue(ok('fresh-transcript'));

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      true,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result).toEqual(ok('fresh-transcript'));
    expect(stats.misses).toBe(1);
    expect(underlying).toHaveBeenCalledWith('lesson1');
  });

  it('should cache 404 responses with structured not_found entry', async () => {
    const ops = createFakeCacheOps();
    const stats = createStats();
    const error: SdkNotFoundError = {
      kind: 'not_found',
      resource: 'lesson1',
      resourceType: 'transcript',
    };
    const underlying = vi.fn().mockResolvedValue(err(error));

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      false,
      () => 86400,
    );

    await wrapped('lesson1');

    const expectedValue = serializeTranscriptCacheEntry({ status: 'not_found' });
    expect(ops.setex).toHaveBeenCalledWith('oak-sdk:v1:transcript:lesson1', 86400, expectedValue);
  });

  it('should write success to cache', async () => {
    const ops = createFakeCacheOps();
    const stats = createStats();
    const underlying = vi.fn().mockResolvedValue(ok('transcript-content'));

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isString,
      false,
      () => 86400,
    );

    await wrapped('lesson1');

    expect(ops.setex).toHaveBeenCalledWith(
      'oak-sdk:v1:transcript:lesson1',
      86400,
      JSON.stringify('transcript-content'),
    );
  });
});

// =============================================================================
// Structured transcript cache entry tests (ADR-092)
// =============================================================================

describe('withCacheAndNegative with structured TranscriptCacheEntry format', () => {
  /**
   * Type guard for transcript cache entry.
   */
  function isTranscriptCacheData(value: unknown): value is TranscriptCacheEntry {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    if (!('status' in value)) {
      return false;
    }
    const obj: { status: unknown; transcript?: unknown; vtt?: unknown } = value;
    if (obj.status === 'available') {
      return typeof obj.transcript === 'string' && typeof obj.vtt === 'string';
    }
    if (obj.status === 'no_video' || obj.status === 'not_found') {
      return true;
    }
    return false;
  }

  it('should handle structured "available" cache format', async () => {
    const entry: TranscriptCacheEntry = {
      status: 'available',
      transcript: 'Hello world',
      vtt: 'WEBVTT',
    };
    const cache = new Map([
      ['oak-sdk:v1:transcript:lesson1', serializeTranscriptCacheEntry(entry)],
    ]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isTranscriptCacheData,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual(entry);
    }
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should return not_found status entries as negative cache hits', async () => {
    const entry: TranscriptCacheEntry = { status: 'not_found' };
    const cache = new Map([
      ['oak-sdk:v1:transcript:lesson1', serializeTranscriptCacheEntry(entry)],
    ]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isTranscriptCacheData,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    // Negative cache entries (not_found, no_video) return as errors
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
    }
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });

  it('should return no_video status entries as negative cache hits', async () => {
    const entry: TranscriptCacheEntry = { status: 'no_video' };
    const cache = new Map([
      ['oak-sdk:v1:transcript:lesson1', serializeTranscriptCacheEntry(entry)],
    ]);
    const ops = createFakeCacheOps(cache);
    const stats = createStats();
    const underlying = vi.fn();

    const wrapped = withCacheAndNegative(
      underlying,
      ops,
      'transcript',
      14,
      stats,
      isTranscriptCacheData,
      false,
      () => 86400,
    );

    const result = await wrapped('lesson1');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('not_found');
    }
    expect(stats.hits).toBe(1);
    expect(underlying).not.toHaveBeenCalled();
  });
});
