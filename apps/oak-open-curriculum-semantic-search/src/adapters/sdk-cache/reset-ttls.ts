/**
 * @module sdk-cache/reset-ttls
 * @description DEV TOOL: Reset TTLs on existing cached SDK responses.
 *
 * Updates TTLs on all cached entries to the current TTL setting with jitter,
 * without re-downloading the data. Useful when TTL configuration changes.
 *
 * **NOT FOR PRODUCTION USE** - This is a development convenience tool.
 *
 * @example
 * ```bash
 * cd apps/oak-open-curriculum-semantic-search
 * pnpm cache:reset-ttls
 * ```
 */

import type Redis from 'ioredis';
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRedisClient } from './redis-connection.js';
import { calculateTtlWithJitter } from './ttl-jitter.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(thisDir, '../../../.env.local') });

/** Cache key prefix - must match oak-adapter-cached.ts */
const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

interface ResetResult {
  readonly totalKeys: number;
  readonly updatedKeys: number;
  readonly failedKeys: number;
  readonly newTtlRange: { min: number; max: number };
}

interface TtlStats {
  min: number;
  max: number;
}

/** Update TTL on a single key, returns true on success. */
async function updateKeyTtl(redis: Redis, key: string, baseTtlDays: number): Promise<number> {
  const ttl = calculateTtlWithJitter(baseTtlDays);
  const result = await redis.expire(key, ttl);
  return result === 1 ? ttl : -1;
}

/** Update TTLs on all keys, collecting stats. */
async function updateAllKeyTtls(
  redis: Redis,
  keys: readonly string[],
  baseTtlDays: number,
): Promise<{ updated: number; failed: number; stats: TtlStats }> {
  let updated = 0;
  let failed = 0;
  const stats: TtlStats = { min: Infinity, max: 0 };

  for (const key of keys) {
    const ttl = await updateKeyTtl(redis, key, baseTtlDays).catch(() => -1);
    if (ttl > 0) {
      updated++;
      stats.min = Math.min(stats.min, ttl);
      stats.max = Math.max(stats.max, ttl);
    } else {
      failed++;
    }
  }

  return { updated, failed, stats };
}

/** Reset TTLs on all cached SDK entries. */
async function resetCacheTtls(baseTtlDays: number): Promise<ResetResult> {
  const redisUrl = process.env.SDK_CACHE_REDIS_URL;
  if (!redisUrl) {
    throw new Error('SDK_CACHE_REDIS_URL not set in environment');
  }

  const redis = await createRedisClient(redisUrl);
  if (!redis) {
    throw new Error('Failed to connect to Redis');
  }

  try {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    if (keys.length === 0) {
      console.log('No cached entries found');
      return { totalKeys: 0, updatedKeys: 0, failedKeys: 0, newTtlRange: { min: 0, max: 0 } };
    }

    console.log(`Found ${keys.length} cached entries`);
    const { updated, failed, stats } = await updateAllKeyTtls(redis, keys, baseTtlDays);

    return {
      totalKeys: keys.length,
      updatedKeys: updated,
      failedKeys: failed,
      newTtlRange: stats,
    };
  } finally {
    await redis.quit();
  }
}

function formatDays(seconds: number): string {
  const days = seconds / 86400;
  return `${days.toFixed(1)} days`;
}

async function main(): Promise<void> {
  const ttlDaysEnv = process.env.SDK_CACHE_TTL_DAYS;
  const baseTtlDays = ttlDaysEnv ? parseInt(ttlDaysEnv, 10) : 14;

  console.log('='.repeat(60));
  console.log('SDK Cache TTL Reset (DEV TOOL)');
  console.log('='.repeat(60));
  console.log(`Base TTL: ${baseTtlDays} days`);
  console.log(`Jitter: ±12 hours`);
  console.log('');

  const result = await resetCacheTtls(baseTtlDays);

  console.log('');
  console.log('Results:');
  console.log(`  Total keys:   ${result.totalKeys}`);
  console.log(`  Updated:      ${result.updatedKeys}`);
  console.log(`  Failed:       ${result.failedKeys}`);
  if (result.totalKeys > 0) {
    console.log(
      `  New TTL range: ${formatDays(result.newTtlRange.min)} - ${formatDays(result.newTtlRange.max)}`,
    );
  }
  console.log('='.repeat(60));
}

main().catch((err: unknown) => {
  console.error('Failed to reset cache TTLs:', err);
  process.exit(1);
});
