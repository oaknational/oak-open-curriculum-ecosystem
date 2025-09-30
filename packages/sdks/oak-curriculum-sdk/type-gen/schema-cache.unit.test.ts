import { beforeEach, describe, expect, it, vi } from 'vitest';

import path from 'node:path';
import {
  extractSchemaVersion,
  readSchemaCacheOrNull,
  writeSchemaCacheIfChanged,
} from './schema-cache.js';

vi.mock('node:fs', async (importOriginal) => {
  const mod = await importOriginal<unknown>();
  const existsSync = (p: string) => {
    const s = (globalThis as unknown as { __schemaStore?: Map<string, string> }).__schemaStore;
    return s?.has(p) ?? false;
  };
  return {
    ...(mod as object),
    existsSync,
  };
});

// Refactor the underlying code to use dependency injection for the file system, so we can get rid of this mock
vi.mock('node:fs/promises', async (importOriginal) => {
  const mod = await importOriginal<unknown>();
  const readFile = (p: string) => {
    const s = (globalThis as unknown as { __schemaStore?: Map<string, string> }).__schemaStore;
    const val = s?.get(p);
    if (val === undefined) {
      throw new Error('ENOENT');
    }
    return Promise.resolve(val);
  };
  const writeFile = (p: string, data: string) => {
    let s = (globalThis as unknown as { __schemaStore?: Map<string, string> }).__schemaStore;
    if (!s) {
      s = new Map<string, string>();
      (globalThis as unknown as { __schemaStore?: Map<string, string> }).__schemaStore = s;
    }
    s.set(p, data);
    return Promise.resolve();
  };
  return {
    ...(mod as object),
    readFile,
    writeFile,
  };
});

const rootDir = '/repo/packages/sdks/oak-curriculum-sdk';
const cachePath = path.resolve(rootDir, 'schema-cache/api-schema.json');

function makeSchema(version: string): object {
  return {
    openapi: '3.0.0',
    info: { title: 'Oak API', version },
    paths: {},
  } as const;
}

describe('schema cache helpers', () => {
  beforeEach(() => {
    (globalThis as unknown as { __schemaStore?: Map<string, string> }).__schemaStore = new Map();
  });

  it('extractSchemaVersion returns version when present', () => {
    expect(extractSchemaVersion(makeSchema('1.2.3'))).toBe('1.2.3');
  });

  it('readSchemaCacheOrNull returns null when missing', async () => {
    const got = await readSchemaCacheOrNull(cachePath);
    expect(got).toBeNull();
  });

  it('writeSchemaCacheIfChanged writes when no cache exists', async () => {
    const wrote = await writeSchemaCacheIfChanged(cachePath, makeSchema('1.0.0'));
    expect(wrote).toBe(true);
    const got = await readSchemaCacheOrNull(cachePath);
    expect(extractSchemaVersion(got)).toBe('1.0.0');
  });

  it('writeSchemaCacheIfChanged writes when version differs', async () => {
    await writeSchemaCacheIfChanged(cachePath, makeSchema('1.0.0'));
    const wrote = await writeSchemaCacheIfChanged(cachePath, makeSchema('1.1.0'));
    expect(wrote).toBe(true);
    const got = await readSchemaCacheOrNull(cachePath);
    expect(extractSchemaVersion(got)).toBe('1.1.0');
  });

  it('writeSchemaCacheIfChanged skips when version is same', async () => {
    await writeSchemaCacheIfChanged(cachePath, makeSchema('2.0.0'));
    const wrote = await writeSchemaCacheIfChanged(cachePath, makeSchema('2.0.0'));
    expect(wrote).toBe(false);
  });
});
