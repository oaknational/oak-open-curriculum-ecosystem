import { describe, it, expect, beforeEach } from 'vitest';
import { rmSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

import { generateZodSchemasArtifacts } from '../../scripts/zodgen-core';

function assertNoForbiddenAssertions(content: string): void {
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.includes(' as ')) continue;
    const matches = line.match(/\sas\s+(\w+)/g) ?? [];
    for (const match of matches) {
      const type = match.trim().split(/\s+/)[1];
      if (type !== 'const') {
        throw new Error(`Found forbidden type assertion 'as ${type}' in generated code`);
      }
    }
  }
}

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

describe('zod generator - functionality tests', () => {
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

  it('generates a schemas.ts file', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    expect(existsSync(outFile)).toBe(true);
  });

  it('generates valid TypeScript that imports zod', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    const content = readFileSync(outFile, 'utf-8');

    // Test that it imports zod somehow
    expect(content).toMatch(/import.*from.*['"]zod['"]/);

    // Test that it's valid TypeScript by compiling it
    const tsConfig = {
      compilerOptions: {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        moduleResolution: 'node',
        esModuleInterop: true,
        module: 'ESNext',
        target: 'ES2020',
      },
      include: ['./schemas.ts'],
    };

    const tsConfigPath = path.join(outDir, 'tsconfig.json');
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));

    try {
      execSync('npx tsc', { cwd: outDir, stdio: 'pipe' });
      // If we get here, compilation succeeded
      expect(true).toBe(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generated Zod schemas failed to compile: ${errorMessage}`);
    }
  });

  it('generates schemas for components', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    const content = readFileSync(outFile, 'utf-8');

    // Test that the Thing schema is generated (in some form)
    expect(content).toContain('Thing');

    // Test that it exports schemas
    expect(content).toContain('export');
    expect(content).toContain('schemas');
  });

  it('does not use type assertions except as const', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    const content = readFileSync(outFile, 'utf-8');

    assertNoForbiddenAssertions(content);
    expect(true).toBe(true);
  });

  it('generates importable and usable Zod schemas', async () => {
    await generateZodSchemasArtifacts(minimalOpenApi, outDir);

    // Create a test file that imports and uses the generated schemas
    const testContent = `
      import { schemas } from './schemas.js';
      import { z } from 'zod';
      
      // Test that we can use the schemas
      const testSchemas = schemas;
      
      // Create a type from the schema (if Thing exists)
      if ('Thing' in schemas) {
        type ThingType = z.infer<typeof schemas.Thing>;
        console.log('Schema is usable');
      }
      
      console.log('Import successful');
    `;

    const testFilePath = path.join(outDir, 'test-usage.ts');
    writeFileSync(testFilePath, testContent);

    // Create package.json for module resolution
    const packageJson = {
      type: 'module',
    };
    writeFileSync(path.join(outDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Test that the usage file compiles
    const tsConfig = {
      compilerOptions: {
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        moduleResolution: 'node',
        esModuleInterop: true,
        module: 'ESNext',
        target: 'ES2020',
      },
      include: ['./test-usage.ts'],
    };

    writeFileSync(path.join(outDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

    try {
      execSync('npx tsc', { cwd: outDir, stdio: 'pipe' });
      expect(true).toBe(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generated Zod schemas are not usable: ${errorMessage}`);
    }
  });
});
