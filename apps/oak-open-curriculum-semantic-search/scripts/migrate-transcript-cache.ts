#!/usr/bin/env npx tsx
/**
 * One-off migration: legacy transcript cache entries → structured format.
 *
 * Converts `__NOT_FOUND__` sentinel values to `{"status":"not_found"}`.
 * Run BEFORE ingestion to ensure clean cache state.
 *
 * ## Usage
 *
 * ```bash
 * # Dry run (preview changes) - uses local Docker Redis by default
 * npx tsx scripts/migrate-transcript-cache.ts
 *
 * # Execute migration
 * npx tsx scripts/migrate-transcript-cache.ts --execute
 *
 * # With custom Redis URL
 * SDK_CACHE_REDIS_URL="redis://custom:6379" npx tsx scripts/migrate-transcript-cache.ts
 * ```
 *
 * @see ADR-092 Transcript Cache Categorization Strategy
 */

import Redis from 'ioredis';

// =============================================================================
// Configuration (standalone, no imports from main codebase)
// =============================================================================

const LEGACY_SENTINEL = '__NOT_FOUND__';
const NEW_NOT_FOUND = '{"status":"not_found"}';
const KEY_PATTERN = 'oak-sdk:v1:transcript:*';
const SCAN_BATCH = 100;

// =============================================================================
// Types
// =============================================================================

interface Stats {
  scanned: number;
  legacy: number;
  migrated: number;
  newFormat: number;
  errors: number;
}

type KeyResult = 'migrated' | 'new' | 'error';

// =============================================================================
// Pure Functions
// =============================================================================

function needsMigration(value: string): boolean {
  return value === LEGACY_SENTINEL || value === `"${LEGACY_SENTINEL}"`;
}

function isNewFormat(value: string): boolean {
  if (needsMigration(value)) {
    return false;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null && 'status' in parsed;
  } catch {
    return false;
  }
}

function updateStats(stats: Stats, result: KeyResult, key: string, execute: boolean): void {
  if (result === 'migrated') {
    stats.legacy++;
    stats.migrated++;
    if (!execute) {
      console.log(`  Would migrate: ${key}`);
    }
  } else if (result === 'new') {
    stats.newFormat++;
  } else {
    stats.errors++;
  }
}

// =============================================================================
// Redis Operations
// =============================================================================

async function migrateKey(redis: Redis, key: string, execute: boolean): Promise<KeyResult> {
  const value = await redis.get(key);
  if (value === null) {
    return 'error';
  }
  if (isNewFormat(value)) {
    return 'new';
  }
  if (!needsMigration(value)) {
    console.warn(`Unknown format: ${key}`);
    return 'error';
  }
  if (execute) {
    const ttl = await redis.ttl(key);
    await (ttl > 0 ? redis.setex(key, ttl, NEW_NOT_FOUND) : redis.set(key, NEW_NOT_FOUND));
  }
  return 'migrated';
}

async function processKeys(
  redis: Redis,
  keys: string[],
  stats: Stats,
  execute: boolean,
): Promise<void> {
  for (const key of keys) {
    stats.scanned++;
    const result = await migrateKey(redis, key, execute);
    updateStats(stats, result, key, execute);
    if (stats.scanned % 100 === 0) {
      process.stdout.write(`\rScanned ${stats.scanned}...`);
    }
  }
}

async function scanAndMigrate(redis: Redis, stats: Stats, execute: boolean): Promise<void> {
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', KEY_PATTERN, 'COUNT', SCAN_BATCH);
    cursor = next;
    await processKeys(redis, keys, stats, execute);
  } while (cursor !== '0');
}

async function migrate(redisUrl: string, execute: boolean): Promise<Stats> {
  const stats: Stats = { scanned: 0, legacy: 0, migrated: 0, newFormat: 0, errors: 0 };
  console.log('Connecting to Redis...');
  const redis = new Redis(redisUrl, { maxRetriesPerRequest: 3 });

  try {
    await redis.ping();
    console.log(`Mode: ${execute ? 'EXECUTE' : 'DRY RUN'}\n`);
    await scanAndMigrate(redis, stats, execute);
    console.log('\n');
  } finally {
    await redis.quit();
  }
  return stats;
}

// =============================================================================
// Output
// =============================================================================

function printSummary(stats: Stats, execute: boolean): void {
  console.log('='.repeat(50));
  console.log(execute ? 'Migration Complete' : 'Dry Run Complete');
  console.log('='.repeat(50));
  console.log(`  Scanned:       ${stats.scanned}`);
  console.log(`  Legacy found:  ${stats.legacy}`);
  console.log(`  ${execute ? 'Migrated' : 'Would migrate'}: ${stats.migrated}`);
  console.log(`  New format:    ${stats.newFormat}`);
  console.log(`  Errors:        ${stats.errors}`);
  if (!execute && stats.legacy > 0) {
    console.log('\nRun with --execute to apply changes.');
  }
}

// =============================================================================
// CLI
// =============================================================================

async function main(): Promise<void> {
  const execute = process.argv.includes('--execute');
  const redisUrl = process.env['SDK_CACHE_REDIS_URL'] ?? 'redis://localhost:6379';

  console.log(`Using Redis: ${redisUrl}`);

  console.log('Transcript Cache Migration');
  console.log('Converts __NOT_FOUND__ → {"status":"not_found"}\n');

  const stats = await migrate(redisUrl, execute);
  printSummary(stats, execute);
  if (stats.errors > 0) {
    process.exit(1);
  }
}

main().catch((e: unknown) => {
  console.error('Migration failed:', e instanceof Error ? e.message : String(e));
  process.exit(1);
});
