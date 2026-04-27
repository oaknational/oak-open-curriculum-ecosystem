import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { Logger } from '@oaknational/logger';

import { readSchemaCacheOrNull, writeSchemaCacheIfChanged } from './schema-cache.js';

interface CapturedWarning {
  readonly message: string;
  readonly context: unknown;
}

function createCapturingLogger(): {
  readonly logger: Pick<Logger, 'warn'>;
  readonly warnings: CapturedWarning[];
} {
  const warnings: CapturedWarning[] = [];
  const logger: Pick<Logger, 'warn'> = {
    warn(message, context) {
      warnings.push({ message, context });
    },
  };
  return { logger, warnings };
}

describe('schema cache helpers', () => {
  let cacheDirectory: string;
  let cachePath: string;
  let logger: Pick<Logger, 'warn'>;
  let warnings: CapturedWarning[];

  const baseSchema: OpenAPIObject = {
    openapi: '3.1.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {},
    components: { schemas: {} },
  };

  beforeEach(() => {
    cacheDirectory = mkdtempSync(path.join(tmpdir(), 'schema-cache-'));
    cachePath = path.join(cacheDirectory, 'api-schema.json');
    const captured = createCapturingLogger();
    logger = captured.logger;
    warnings = captured.warnings;
  });

  afterEach(() => {
    rmSync(cacheDirectory, { recursive: true, force: true });
  });

  it('writes the schema when no cache file exists', async () => {
    const wroteCache = await writeSchemaCacheIfChanged(cachePath, baseSchema, logger);

    expect(wroteCache).toBe(true);
    const cachedRaw = readFileSync(cachePath, 'utf8');
    expect(JSON.parse(cachedRaw)).toMatchObject({
      info: { version: '1.0.0' },
    });
  });

  it('skips writing when the content is identical', async () => {
    await writeSchemaCacheIfChanged(cachePath, baseSchema, logger);

    const wroteCache = await writeSchemaCacheIfChanged(cachePath, baseSchema, logger);

    expect(wroteCache).toBe(false);
  });

  it('writes when content differs even if version is unchanged', async () => {
    await writeSchemaCacheIfChanged(cachePath, baseSchema, logger);

    const wroteCache = await writeSchemaCacheIfChanged(
      cachePath,
      {
        ...baseSchema,
        info: { ...baseSchema.info, description: 'Fixed a description' },
      },
      logger,
    );

    expect(wroteCache).toBe(true);
    const cachedSchema = await readSchemaCacheOrNull(cachePath);
    expect(cachedSchema?.info.description).toBe('Fixed a description');
  });

  describe('validate-then-skip-with-warning (CodeQL #76/#77)', () => {
    it('skips the write when the schema fails structural validation', async () => {
      const invalidSchema: unknown = {
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
        // missing required `paths` — validateOpenApiDocument rejects.
      };

      const wroteCache = await writeSchemaCacheIfChanged(cachePath, invalidSchema, logger);

      expect(wroteCache).toBe(false);
      expect(existsSync(cachePath)).toBe(false);
      expect(warnings).toHaveLength(1);
      const warning = warnings[0];
      expect(warning).toBeDefined();
      expect(warning?.message).toContain('schema-cache: write skipped');
      expect(warning?.context).toBeDefined();
    });

    it('preserves an existing cache file when a subsequent write is rejected', async () => {
      await writeSchemaCacheIfChanged(cachePath, baseSchema, logger);
      const originalContent = readFileSync(cachePath, 'utf8');

      const invalidSchema: unknown = {
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
      };
      const wroteCache = await writeSchemaCacheIfChanged(cachePath, invalidSchema, logger);

      expect(wroteCache).toBe(false);
      expect(readFileSync(cachePath, 'utf8')).toBe(originalContent);
      expect(warnings).toHaveLength(1);
    });
  });
});
