import { ok, err, type Result } from '@oaknational/result';
import type {
  SdkFetchError,
  SdkLegallyRestrictedError,
  SdkNotFoundError,
} from '@oaknational/curriculum-sdk';
import { cacheLogger } from '../../lib/logger';
import type { CacheOperations, CacheStats } from './cache-wrapper-types';
import {
  deserializeTranscriptCacheEntry,
  serializeTranscriptCacheEntry,
} from './transcript-cache-types';

interface CachedNegativeResult<T> {
  readonly result: Result<T, SdkFetchError> | null;
  readonly statsUpdated: boolean;
}

export async function tryReadCache<T>(
  ops: CacheOperations,
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T | null> {
  try {
    const cached = await ops.get(key);
    if (cached === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(cached);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function tryWriteCache(
  ops: CacheOperations,
  key: string,
  ttl: number,
  value: unknown,
): Promise<void> {
  try {
    await ops.setex(key, ttl, JSON.stringify(value));
  } catch {
    // Ignore cache write failures - caching is opportunistic
  }
}

async function tryWriteRaw(
  ops: CacheOperations,
  key: string,
  ttl: number,
  value: string,
): Promise<void> {
  try {
    await ops.setex(key, ttl, value);
  } catch {
    // Ignore cache write failures - caching is opportunistic
  }
}

export async function tryReadRaw(ops: CacheOperations, key: string): Promise<string | null> {
  try {
    return await ops.get(key);
  } catch {
    return null;
  }
}

function createNotFoundError(id: string): SdkNotFoundError {
  return { kind: 'not_found', resource: id, resourceType: 'transcript' };
}

function createLegallyRestrictedError(id: string): SdkLegallyRestrictedError {
  return { kind: 'legally_restricted', resource: id, resourceType: 'transcript' };
}

export function handleCachedNegative<T>(
  rawCached: string,
  id: string,
  cacheKeyPrefix: string,
  ignoreCached404: boolean,
  stats: CacheStats,
): CachedNegativeResult<T> {
  const entry = deserializeTranscriptCacheEntry(rawCached);
  if (entry === null || entry.status === 'available') {
    return { result: null, statsUpdated: false };
  }
  if (ignoreCached404) {
    cacheLogger.debug(`Ignoring cached ${entry.status} (--ignore-cached-404)`, {
      cacheKeyPrefix,
      id,
    });
    stats.misses++;
    return { result: null, statsUpdated: true };
  }

  stats.hits++;
  cacheLogger.debug(`Negative cache hit (${entry.status})`, { cacheKeyPrefix, id });
  const error =
    entry.status === 'legally_restricted'
      ? createLegallyRestrictedError(id)
      : createNotFoundError(id);
  return { result: err(error), statsUpdated: true };
}

export function tryParseCachedValue<T>(
  rawCached: string,
  isValidCached: (value: unknown) => value is T,
  stats: CacheStats,
): Result<T, SdkFetchError> | null {
  try {
    const parsed: unknown = JSON.parse(rawCached);
    if (isValidCached(parsed)) {
      stats.hits++;
      return ok(parsed);
    }
  } catch {
    // Invalid JSON, treat as cache miss
  }
  return null;
}

export async function storeResultToCache<T>(
  result: Result<T, SdkFetchError>,
  ops: CacheOperations,
  key: string,
  ttl: number,
  cacheKeyPrefix: string,
  id: string,
): Promise<void> {
  if (result.ok) {
    await tryWriteCache(ops, key, ttl, result.value);
    return;
  }

  if (result.error.kind === 'not_found') {
    cacheLogger.debug('Caching 404 response', { cacheKeyPrefix, id, ttl });
    await tryWriteRaw(ops, key, ttl, serializeTranscriptCacheEntry({ status: 'not_found' }));
    return;
  }

  if (result.error.kind === 'legally_restricted') {
    cacheLogger.debug('Caching 451 response', { cacheKeyPrefix, id, ttl });
    await tryWriteRaw(
      ops,
      key,
      ttl,
      serializeTranscriptCacheEntry({ status: 'legally_restricted' }),
    );
  }
}
