import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

export function extractSchemaVersion(schema: OpenAPIObject): string {
  return schema.info.version;
}

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

export async function writeSchemaCacheIfChanged(
  cachePath: string,
  schema: OpenAPIObject,
): Promise<boolean> {
  const currentCachedSchema = await readSchemaCacheOrNull(cachePath);
  const newSchemaVersion = extractSchemaVersion(schema);
  if (currentCachedSchema === null) {
    await writeFile(cachePath, JSON.stringify(schema, undefined, 2));
    return true;
  }
  const currentSchemaVersion = extractSchemaVersion(currentCachedSchema);
  if (currentSchemaVersion === newSchemaVersion) {
    return false;
  }
  await writeFile(cachePath, JSON.stringify(schema, undefined, 2));
  return true;
}
