import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

function isOpenAPIObject(value: unknown): value is OpenAPIObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'openapi' in value && 'info' in value && 'paths' in value;
}

export async function readSchemaCacheOrNull(cachePath: string): Promise<OpenAPIObject | null> {
  if (!existsSync(cachePath)) {
    return null;
  }
  try {
    const raw = await readFile(cachePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!isOpenAPIObject(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Writes the schema to the cache if the content has changed.
 *
 * Compares the full serialised content, not just the version string.
 * The upstream API can fix descriptions, add parameters, or change
 * metadata without bumping the version — a version-only check misses
 * those changes and leaves the cache stale.
 *
 * @returns true if the cache was updated, false if unchanged.
 */
export async function writeSchemaCacheIfChanged(
  cachePath: string,
  schema: OpenAPIObject,
): Promise<boolean> {
  const newContent = JSON.stringify(schema, undefined, 2);
  const currentCachedSchema = await readSchemaCacheOrNull(cachePath);
  if (currentCachedSchema === null) {
    await writeFile(cachePath, newContent);
    return true;
  }
  const currentContent = JSON.stringify(currentCachedSchema, undefined, 2);
  if (currentContent === newContent) {
    return false;
  }
  await writeFile(cachePath, newContent);
  return true;
}
