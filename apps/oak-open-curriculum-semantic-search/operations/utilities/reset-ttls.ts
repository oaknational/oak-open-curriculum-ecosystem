/**
 * DEV TOOL: Reset TTLs on existing cached SDK responses.
 *
 * Usage: pnpm cache:reset-ttls
 */
import type Redis from 'ioredis';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAppEnv } from '../../src/lib/elasticsearch/setup/load-app-env.js';
import { env } from '../../src/lib/env.js';
import { createRedisClient } from '../../src/adapters/sdk-cache/redis-connection.js';
import { calculateTtlWithJitter } from '../../src/adapters/sdk-cache/ttl-jitter.js';

loadAppEnv(dirname(fileURLToPath(import.meta.url)));

const CACHE_KEY_PREFIX = 'oak-sdk:v1:';

async function updateAllKeyTtls(
  redis: Redis,
  keys: readonly string[],
  baseTtlDays: number,
): Promise<{ updated: number; failed: number; min: number; max: number }> {
  let updated = 0;
  let failed = 0;
  let min = Infinity;
  let max = 0;
  for (const key of keys) {
    const ttl = calculateTtlWithJitter(baseTtlDays);
    const ok = await redis.expire(key, ttl).catch(() => 0);
    if (ok === 1) {
      updated++;
      min = Math.min(min, ttl);
      max = Math.max(max, ttl);
    } else {
      failed++;
    }
  }
  return { updated, failed, min, max };
}

async function resetCacheTtls(redisUrl: string, baseTtlDays: number): Promise<void> {
  const redis = await createRedisClient(redisUrl);
  if (!redis) {
    throw new Error('Failed to connect to Redis');
  }
  try {
    const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
    if (keys.length === 0) {
      console.log('No cached entries found');
      return;
    }
    console.log(`Found ${keys.length} cached entries`);
    const r = await updateAllKeyTtls(redis, keys, baseTtlDays);
    console.log(`Updated: ${r.updated}  Failed: ${r.failed}`);
    if (r.updated > 0) {
      const fmtMin = (r.min / 86400).toFixed(1);
      const fmtMax = (r.max / 86400).toFixed(1);
      console.log(`TTL range: ${fmtMin}d - ${fmtMax}d`);
    }
  } finally {
    await redis.quit();
  }
}

async function main(): Promise<void> {
  const config = env();
  console.log('SDK Cache TTL Reset (DEV TOOL)');
  console.log(`Base TTL: ${config.SDK_CACHE_TTL_DAYS} days`);
  await resetCacheTtls(config.SDK_CACHE_REDIS_URL, config.SDK_CACHE_TTL_DAYS);
}

main().catch((err: unknown) => {
  console.error('Failed to reset cache TTLs:', err);
  process.exitCode = 1;
});
