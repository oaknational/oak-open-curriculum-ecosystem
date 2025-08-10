/**
 * Schema fetching utilities
 *
 * Fetches OpenAPI schema from remote URL with local cache fallback
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { OpenAPI3 } from '../src/types/openapi';

/**
 * Check if value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Validate that the fetched object is a valid OpenAPI3 schema
 */
function validateOpenAPISchema(schema: unknown): schema is OpenAPI3 {
  if (!isObject(schema)) {
    return false;
  }

  // Check required fields
  if (typeof schema.openapi !== 'string') {
    return false;
  }

  if (!isObject(schema.info)) {
    return false;
  }

  const info = schema.info;
  if (typeof info.title !== 'string' || typeof info.version !== 'string') {
    return false;
  }

  return isObject(schema.paths);
}

/**
 * Read schema from local cache file
 */
function readCachedSchema(cachePath: string): OpenAPI3 | null {
  try {
    if (!existsSync(cachePath)) {
      return null;
    }

    const content = readFileSync(cachePath, 'utf-8');
    const schema = JSON.parse(content) as unknown;

    if (!validateOpenAPISchema(schema)) {
      console.warn('Cached schema is invalid');
      return null;
    }

    return schema;
  } catch (error) {
    console.warn('Failed to read cached schema:', error);
    return null;
  }
}

/**
 * Save schema to local cache file
 */
function saveCachedSchema(schema: OpenAPI3, cachePath: string): void {
  try {
    const dir = dirname(cachePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(cachePath, JSON.stringify(schema, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Failed to save schema to cache:', error);
  }
}

/**
 * Fetch OpenAPI schema from remote URL with local cache fallback
 *
 * @param url - The URL to fetch the schema from
 * @param cachePath - Optional path to cache the schema locally
 * @returns The parsed OpenAPI schema
 */
export async function fetchOpenAPISchema(url: string, cachePath?: string): Promise<OpenAPI3> {
  // Try to fetch from remote first
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
    }

    const schema = await response.json();

    if (!validateOpenAPISchema(schema)) {
      throw new Error('Invalid OpenAPI schema');
    }

    // Cache the fetched schema if cache path provided
    if (cachePath) {
      saveCachedSchema(schema, cachePath);
    }

    return schema;
  } catch (error) {
    console.warn(`Failed to fetch schema from ${url}:`, error);

    // Try to use cached version
    if (cachePath) {
      const cached = readCachedSchema(cachePath);
      if (cached) {
        console.info('Using cached schema');
        return cached;
      }
    }

    throw new Error(`Failed to fetch OpenAPI schema from ${url} and no valid cache available`);
  }
}
