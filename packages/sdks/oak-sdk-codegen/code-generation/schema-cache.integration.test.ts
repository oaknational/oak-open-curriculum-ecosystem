import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import {
  createInMemoryFileSystem,
  type InMemoryFileSystem,
} from '../src/io/test-helpers/in-memory-file-system.js';
import {
  readSchemaCacheOrNull,
  writeSchemaCacheIfChanged,
  type SchemaCacheLogger,
} from './schema-cache.js';

interface CapturedWarning {
  readonly message: string;
  readonly context: unknown;
}

const CACHE_PATH = '/cache/api-schema.json';

const baseSchema: OpenAPIObject = {
  openapi: '3.1.0',
  info: { title: 'Test API', version: '1.0.0' },
  paths: {},
  components: { schemas: {} },
};

/** A schema that fails structural validation: `paths` is missing. */
const invalidSchema: unknown = {
  openapi: '3.1.0',
  info: { title: 'Test API', version: '1.0.0' },
};

function createCapturingLogger(): {
  readonly logger: SchemaCacheLogger;
  readonly warnings: CapturedWarning[];
} {
  const warnings: CapturedWarning[] = [];
  const logger: SchemaCacheLogger = {
    warn(message, context) {
      warnings.push({ message, context });
    },
  };
  return { logger, warnings };
}

/** A file system holding the cache directory, with the cache file absent. */
async function createCacheFileSystem(): Promise<InMemoryFileSystem> {
  const fs = createInMemoryFileSystem();
  await fs.mkdir('/cache');
  return fs;
}

describe('schema cache helpers', () => {
  it('writes the schema when no cache file exists', async () => {
    const fs = await createCacheFileSystem();
    const { logger } = createCapturingLogger();

    const wroteCache = await writeSchemaCacheIfChanged(CACHE_PATH, baseSchema, logger, fs);

    expect(wroteCache).toBe(true);
    expect(JSON.parse(fs.files.get(CACHE_PATH) ?? '')).toMatchObject({
      info: { version: '1.0.0' },
    });
  });

  it('skips writing when the content is identical', async () => {
    const fs = await createCacheFileSystem();
    const { logger } = createCapturingLogger();
    await writeSchemaCacheIfChanged(CACHE_PATH, baseSchema, logger, fs);

    const wroteCache = await writeSchemaCacheIfChanged(CACHE_PATH, baseSchema, logger, fs);

    expect(wroteCache).toBe(false);
  });

  it('writes when content differs even if version is unchanged', async () => {
    const fs = await createCacheFileSystem();
    const { logger } = createCapturingLogger();
    await writeSchemaCacheIfChanged(CACHE_PATH, baseSchema, logger, fs);

    const wroteCache = await writeSchemaCacheIfChanged(
      CACHE_PATH,
      {
        ...baseSchema,
        info: { ...baseSchema.info, description: 'Fixed a description' },
      },
      logger,
      fs,
    );

    expect(wroteCache).toBe(true);
    const cachedSchema = await readSchemaCacheOrNull(CACHE_PATH, fs);
    expect(cachedSchema?.info.description).toBe('Fixed a description');
  });

  it('reads null when the cache file is absent', async () => {
    const fs = await createCacheFileSystem();

    expect(await readSchemaCacheOrNull(CACHE_PATH, fs)).toBeNull();
  });

  describe('validate-then-skip-with-warning (CodeQL #76/#77)', () => {
    it('skips the write when the schema fails structural validation', async () => {
      const fs = await createCacheFileSystem();
      const { logger, warnings } = createCapturingLogger();

      const wroteCache = await writeSchemaCacheIfChanged(CACHE_PATH, invalidSchema, logger, fs);

      expect(wroteCache).toBe(false);
      expect(fs.files.has(CACHE_PATH)).toBe(false);
      expect(warnings).toHaveLength(1);
      expect(warnings[0]?.message).toContain('schema-cache: write skipped');
      expect(warnings[0]?.context).toBeDefined();
    });

    it('preserves an existing cache file when a subsequent write is rejected', async () => {
      const fs = await createCacheFileSystem();
      const { logger, warnings } = createCapturingLogger();
      await writeSchemaCacheIfChanged(CACHE_PATH, baseSchema, logger, fs);
      const originalContent = fs.files.get(CACHE_PATH);

      const wroteCache = await writeSchemaCacheIfChanged(CACHE_PATH, invalidSchema, logger, fs);

      expect(wroteCache).toBe(false);
      expect(fs.files.get(CACHE_PATH)).toBe(originalContent);
      expect(warnings).toHaveLength(1);
    });
  });
});
