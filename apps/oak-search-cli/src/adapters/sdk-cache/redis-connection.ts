/**
 * Redis connection helpers for SDK caching.
 */

import Redis from 'ioredis';
import { cacheLogger } from '../../lib/logger';

/**
 * Create Redis client with error handling, returns null if unavailable.
 *
 * @param url - Redis connection URL
 * @returns Connected Redis client or null if connection failed
 */
export async function createRedisClient(url: string): Promise<Redis | null> {
  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
      lazyConnect: true,
      // ioredis 6 defaults to RESP3 and, on a server that cannot speak it,
      // auto-falls back to RESP2 (its connection handler catches NOPROTO /
      // unknown-command HELLO and retries — verified in 6.0.0's
      // event_handler). The pin therefore prevents no failure; it keeps the
      // wire behaviour DETERMINISTIC across the major: v5 semantics verbatim,
      // no negotiate-then-fallback dance whose outcome depends on the
      // deployed server. Lift by adopting RESP3 deliberately, with the
      // deployed server version verified >= 6 and the reply-shape surface
      // re-checked.
      protocol: 2,
    });
    await client.connect();
    await client.ping();
    cacheLogger.info('Connected to Redis', { url });
    return client;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    cacheLogger.warn('Redis connection failed, continuing without cache', { error: msg });
    return null;
  }
}

/**
 * Execute an operation with a Redis connection, ensuring cleanup.
 *
 * Creates a connection, runs the operation, and ensures the connection
 * is closed regardless of success or failure.
 *
 * @typeParam T - Return type of the operation
 * @param url - Redis connection URL
 * @param fallback - Value to return if connection fails
 * @param operation - Function to execute with the Redis client
 * @returns Result of operation, or fallback if connection failed
 */
export async function withRedisConnection<T>(
  url: string,
  fallback: T,
  operation: (redis: Redis) => Promise<T>,
): Promise<T> {
  cacheLogger.debug('Running Redis connection operation');
  const redis = await createRedisClient(url);
  if (!redis) {
    return fallback;
  }

  try {
    return await operation(redis);
  } finally {
    await redis.quit();
  }
}
