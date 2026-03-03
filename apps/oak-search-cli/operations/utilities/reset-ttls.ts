/**
 * DEV TOOL: Reset TTLs on existing cached SDK responses.
 *
 * Usage: pnpm cache:reset-ttls
 */
import type Redis from 'ioredis';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { createRedisClient } from '../../src/adapters/sdk-cache/redis-connection.js';
import { calculateTtlWithJitter } from '../../src/adapters/sdk-cache/ttl-jitter.js';

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
      process.stdout.write('No cached entries found\n');
      return;
    }
    process.stdout.write(`Found ${keys.length} cached entries\n`);
    const r = await updateAllKeyTtls(redis, keys, baseTtlDays);
    process.stdout.write(`Updated: ${r.updated}  Failed: ${r.failed}\n`);
    if (r.updated > 0) {
      const fmtMin = (r.min / 86400).toFixed(1);
      const fmtMax = (r.max / 86400).toFixed(1);
      process.stdout.write(`TTL range: ${fmtMin}d - ${fmtMax}d\n`);
    }
  } finally {
    await redis.quit();
  }
}

async function main(): Promise<void> {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
    process.exit(1);
  }
  const config = configResult.value.env;
  process.stdout.write('SDK Cache TTL Reset (DEV TOOL)\n');
  process.stdout.write(`Base TTL: ${config.SDK_CACHE_TTL_DAYS} days\n`);
  await resetCacheTtls(config.SDK_CACHE_REDIS_URL, config.SDK_CACHE_TTL_DAYS);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Failed to reset cache TTLs: ${message}\n`);
  process.exitCode = 1;
});
