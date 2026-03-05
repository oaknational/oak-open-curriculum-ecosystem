import { describe, it, expect, beforeEach } from 'vitest';
import { rmSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

import { generateZodSchemas } from '../../code-generation/zodgen-core';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { createCodegenLogger } from '../../code-generation/create-codegen-logger';

const logger = createCodegenLogger('zodgen-test');

// Minimal OpenAPI v3 doc with a single component schema to keep the test light
const minimalOpenApi: OpenAPIObject = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
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
};

describe('zod generator - functionality tests', () => {
  const outDir = path.resolve(__dirname, '../../test-cache/zod-out');
  const outFile = path.join(outDir, 'curriculumZodSchemas.ts');

  beforeEach(() => {
    rmSync(outDir, { recursive: true, force: true });
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
  });

  it('generates a schemas.ts file', async () => {
    await generateZodSchemas(minimalOpenApi, outDir, logger);

    expect(existsSync(outFile)).toBe(true);
  });

  it('generates valid TypeScript that imports zod', async () => {
    await generateZodSchemas(minimalOpenApi, outDir, logger);

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
      include: ['./curriculumZodSchemas.ts'],
    };

    const tsConfigPath = path.join(outDir, 'tsconfig.json');
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));

    try {
      execSync('npx tsc', { cwd: outDir, stdio: 'pipe' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generated Zod schemas failed to compile: ${errorMessage}`);
    }
  });

  it('generates schemas for components', async () => {
    await generateZodSchemas(minimalOpenApi, outDir, logger);

    const content = readFileSync(outFile, 'utf-8');

    // Test that the Thing schema is generated (in some form)
    expect(content).toContain('Thing');

    // Test that it exports schemas
    expect(content).toContain('export');
    expect(content).toContain('curriculumSchemas');
  });

  it('generates importable and usable Zod schemas', async () => {
    await generateZodSchemas(minimalOpenApi, outDir, logger);

    // Create a test file that imports and uses the generated schemas
    const testContent = `
      import { curriculumSchemas } from './curriculumZodSchemas.js';
      import { z } from 'zod';
      
      // Test that we can use the schemas
      const testSchemas = curriculumSchemas;
      
      // Create a type from the schema (if Thing exists)
      if ('Thing' in curriculumSchemas) {
        type ThingType = z.infer<typeof curriculumSchemas.Thing>;
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generated Zod schemas are not usable: ${errorMessage}`);
    }
  });
});
