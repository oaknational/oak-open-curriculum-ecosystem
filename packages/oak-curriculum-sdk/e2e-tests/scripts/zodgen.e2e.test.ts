import { describe, it, expect, beforeEach } from 'vitest';
import { rmSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { generateZodSchemasArtifacts } from '../../scripts/zodgen-core';

// Minimal OpenAPI v3 doc with a single component schema to keep the test light
const minimalOpenApi = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  servers: [{ url: 'https://example.com' }],
  paths: {},
  components: {
    schemas: {
      Thing: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
} as const;

describe('ozc generator - schemas only', () => {
  const outDir = path.resolve(__dirname, '../../test-cache/zod-out');
  const outFile = path.join(outDir, 'schemas.ts');

  beforeEach(() => {
    // clean output directory between runs
    try {
      rmSync(outDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
  });

  it('generates a schemas.ts file exporting zod schemas without assertions', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    expect(existsSync(outFile)).toBe(true);
    const content = readFileSync(outFile, 'utf-8');

    // basic shape checks
    expect(/import\s+\{\s*z\s*\}\s+from\s+['"]zod['"];?/.test(content)).toBe(true);
    // allow newlines between `z` and `.object(`
    expect(/const\s+Thing\s*=\s*z\s*\.\s*object\s*\(/s.test(content)).toBe(true);
    expect(/export\s+const\s+schemas\s*=/.test(content)).toBe(true);
    expect(/schemas\s*=\s*\{[\s\S]*Thing[\s\S]*\}/m.test(content)).toBe(true);

    // ensure no banned type assertions are present other than `as const`
    const hasIllegalAssertion = /\sas\s(?!const)/.test(content);
    expect(hasIllegalAssertion).toBe(false);
  });
});
