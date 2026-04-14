import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { readSchemaCacheOrNull, writeSchemaCacheIfChanged } from './schema-cache.js';

describe('schema cache helpers', () => {
  let cacheDirectory: string;
  let cachePath: string;

  const baseSchema: OpenAPIObject = {
    openapi: '3.1.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {},
    components: { schemas: {} },
  };

  beforeEach(() => {
    cacheDirectory = mkdtempSync(path.join(tmpdir(), 'schema-cache-'));
    cachePath = path.join(cacheDirectory, 'api-schema.json');
  });

  afterEach(() => {
    rmSync(cacheDirectory, { recursive: true, force: true });
  });

  it('writes the schema when no cache file exists', async () => {
    const wroteCache = await writeSchemaCacheIfChanged(cachePath, baseSchema);

    expect(wroteCache).toBe(true);
    const cachedRaw = readFileSync(cachePath, 'utf8');
    expect(JSON.parse(cachedRaw)).toMatchObject({
      info: { version: '1.0.0' },
    });
  });

  it('skips writing when the content is identical', async () => {
    await writeSchemaCacheIfChanged(cachePath, baseSchema);

    const wroteCache = await writeSchemaCacheIfChanged(cachePath, baseSchema);

    expect(wroteCache).toBe(false);
  });

  it('writes when content differs even if version is unchanged', async () => {
    await writeSchemaCacheIfChanged(cachePath, baseSchema);

    const wroteCache = await writeSchemaCacheIfChanged(cachePath, {
      ...baseSchema,
      info: { ...baseSchema.info, description: 'Fixed a description' },
    });

    expect(wroteCache).toBe(true);
    const cachedSchema = await readSchemaCacheOrNull(cachePath);
    expect(cachedSchema?.info.description).toBe('Fixed a description');
  });
});
