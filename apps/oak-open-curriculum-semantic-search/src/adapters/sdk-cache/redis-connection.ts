/**
 * @module redis-connection
 * @description Redis connection helpers for SDK caching.
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
