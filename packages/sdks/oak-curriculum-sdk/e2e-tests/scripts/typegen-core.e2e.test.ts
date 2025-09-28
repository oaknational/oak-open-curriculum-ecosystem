import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateSchemaArtifacts } from '../../type-gen/typegen-core';
import type { OpenAPI3 } from 'openapi-typescript';

describe('generateSchemaArtifacts functionality tests', () => {
  const testDir = path.resolve(__dirname, '../../test-cache/typegen-out');

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should generate all expected files', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/users': {
          get: {
            responses: {
              '200': {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: { type: 'array' },
                  },
                },
              },
            },
          },
        },
        '/api/items/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
              },
            ],
            responses: {
              '200': {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    // Check that all expected files are created
    expect(fs.existsSync(path.join(testDir, 'api-schema-original.json'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'api-schema-sdk.json'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'api-schema-base.ts'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'api-paths-types.ts'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'path-parameters.ts'))).toBe(true);
  });

  it('should generate valid JSON schema file', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/test': {
          get: {
            responses: {
              '200': { description: 'OK' },
            },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    // Test that JSON is valid and contains expected structure
    const jsonContent = fs.readFileSync(path.join(testDir, 'api-schema-sdk.json'), 'utf-8');
    const parsed: OpenAPI3 = JSON.parse(jsonContent) as OpenAPI3; // Will throw if invalid JSON

    expect(parsed).toBeDefined();
    expect(parsed.openapi).toBe('3.0.0');
    expect(parsed.info.title).toBe('Test API');
    expect(parsed.paths?.['/api/test']).toBeDefined();
  });

  it('should generate valid TypeScript files', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/users': {
          get: {
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    // Check that generated TypeScript files are syntactically valid
    // by verifying they contain expected TypeScript constructs
    const tsFiles = ['api-schema-base.ts', 'api-paths-types.ts', 'path-parameters.ts'];

    for (const file of tsFiles) {
      const content = fs.readFileSync(path.join(testDir, file), 'utf-8');

      // Basic validation that it's TypeScript
      expect(content).toBeTruthy();

      // Check for basic TypeScript syntax elements
      if (file === 'api-schema-base.ts') {
        expect(content).toContain('export');
        expect(content).toContain('const');
      } else if (file === 'api-paths-types.ts') {
        // openapi-typescript generates interface/type definitions
        expect(content).toMatch(/export (interface|type)/);
      } else if (file === 'path-parameters.ts') {
        expect(content).toContain('export');
        // Should have some constants or functions
        expect(content).toMatch(/(const|function)/);
      }
    }
  });

  it('should generate usable exports in TypeScript schema file', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {},
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    // Test that the file exports what we expect
    const tsContent = fs.readFileSync(path.join(testDir, 'api-schema-base.ts'), 'utf-8');

    // Just check that key exports exist, not their exact format
    expect(tsContent).toContain('export const schema');
    expect(tsContent).toContain('export type Schema');
  });

  it('should handle paths with parameters correctly', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/items/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
              },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // Test functionality, not exact format
    // The file should handle the parameterized path
    expect(pathParamsContent).toContain('/api/items/{id}');
    expect(pathParamsContent).toContain('export'); // Should have exports
  });

  it('should handle query parameters with enums', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/search': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                required: false,
                schema: {
                  type: 'string',
                  enum: ['ks1', 'ks2', 'ks3', 'ks4'],
                },
              },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // Test that enum values are captured somewhere in the file
    expect(pathParamsContent).toContain('ks1');
    expect(pathParamsContent).toContain('ks2');
    expect(pathParamsContent).toContain('ks3');
    expect(pathParamsContent).toContain('ks4');
  });

  it('should generate modules with proper exports', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/test': {
          get: {
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, schema, testDir);

    // Verify that generated files have proper module exports
    const schemaContent = fs.readFileSync(path.join(testDir, 'api-schema-base.ts'), 'utf-8');
    const pathsContent = fs.readFileSync(path.join(testDir, 'api-paths-types.ts'), 'utf-8');
    const paramsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // api-schema-base.ts should export a schema constant
    expect(schemaContent).toContain('export const schema');
    expect(schemaContent).toContain('export type Schema');

    // api-paths-types.ts should export types
    expect(pathsContent).toMatch(/export (interface|type) paths/);

    // path-parameters.ts should have various exports
    expect(paramsContent).toContain('export const PATHS');
    expect(paramsContent).toContain('export function');

    // Verify import statements are present where needed
    expect(paramsContent).toContain('import');
    expect(paramsContent).toContain('from');
  });
});
