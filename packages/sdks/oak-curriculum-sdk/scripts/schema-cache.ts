import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { isOpenAPI3Schema } from './typegen-helpers.js';

export function extractSchemaVersion(schema: unknown): string | null {
  if (!isOpenAPI3Schema(schema)) return null;
  const info = schema.info;
  const v = info.version;
  return typeof v === 'string' ? v : null;
}

export async function readSchemaCacheOrNull(cachePath: string): Promise<object | null> {
  if (!existsSync(cachePath)) return null;
  try {
    const raw = await readFile(cachePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeSchemaCacheIfChanged(
  cachePath: string,
  schema: object,
): Promise<boolean> {
  const current = await readSchemaCacheOrNull(cachePath);
  const newVersion = extractSchemaVersion(schema);
  const currentVersion = extractSchemaVersion(current);
  if (current && newVersion && currentVersion === newVersion) return false;
  await writeFile(cachePath, JSON.stringify(schema, undefined, 2));
  return true;
}
