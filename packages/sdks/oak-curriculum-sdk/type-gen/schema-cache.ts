import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

export function extractSchemaVersion(schema: OpenAPIObject): string {
  return schema.info.version;
}

export async function readSchemaCacheOrNull(cachePath: string): Promise<OpenAPIObject | null> {
  if (!existsSync(cachePath)) {
    return null;
  }
  try {
    const raw = await readFile(cachePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    const info =
      typeof parsed === 'object' && parsed !== null && 'info' in parsed ? parsed.info : null;
    const version =
      typeof info === 'object' && info !== null && 'version' in info ? info.version : null;
    if (version === null) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- JC: allowing at incoming external boundary
    return parsed as OpenAPIObject;
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
