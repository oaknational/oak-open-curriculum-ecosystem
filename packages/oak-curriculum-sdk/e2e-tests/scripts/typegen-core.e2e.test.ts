import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateSchemaArtifacts } from '../../scripts/typegen-core';
import type { OpenAPI3 } from 'openapi-typescript';

describe('generateSchemaArtifacts characterisation tests', () => {
  const testDir = path.join(__dirname, 'test-output');

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

    await generateSchemaArtifacts(schema, testDir);

    // Check that all expected files are created
    expect(fs.existsSync(path.join(testDir, 'api-schema.json'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'api-schema.ts'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'api-paths-types.ts'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'path-parameters.ts'))).toBe(true);
  });

  it('should generate correct JSON schema file', async () => {
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

    await generateSchemaArtifacts(schema, testDir);

    const jsonContent = fs.readFileSync(path.join(testDir, 'api-schema.json'), 'utf-8');
    const parsed: unknown = JSON.parse(jsonContent);

    // Type guard for the parsed content
    expect(parsed).toBeDefined();
    expect(typeof parsed).toBe('object');
    expect(parsed).not.toBeNull();

    // Now we can safely cast since we've checked it
    const schemaObj = parsed as OpenAPI3;
    // The generated schema may have additional fields like components
    expect(schemaObj.openapi).toEqual(schema.openapi);
    expect(schemaObj.info).toEqual(schema.info);
    expect(schemaObj.paths).toEqual(schema.paths);
    expect(schemaObj.openapi).toBe('3.0.0');
    expect(schemaObj.info.title).toBe('Test API');
    if (schemaObj.paths) {
      expect(schemaObj.paths['/api/test']).toBeDefined();
    }
  });

  it('should generate TypeScript schema export', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {},
    };

    await generateSchemaArtifacts(schema, testDir);

    const tsContent = fs.readFileSync(path.join(testDir, 'api-schema.ts'), 'utf-8');

    expect(tsContent).toContain('export const schema =');
    expect(tsContent).toContain('as const');
    expect(tsContent).toContain('export type Schema = typeof schema');
    expect(tsContent).toContain('The API schema');
  });

  it('should generate path parameters file with correct structure', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/users': {
          get: {
            responses: { '200': { description: 'OK' } },
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
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // Check header
    expect(pathParamsContent).toContain('GENERATED FILE - DO NOT EDIT');
    expect(pathParamsContent).toContain('import type { paths as Paths }');
    expect(pathParamsContent).toContain('import type { Schema }');
    expect(pathParamsContent).toContain('import { schema }');

    // Check PATHS constant
    expect(pathParamsContent).toContain('export const PATHS = {');
    expect(pathParamsContent).toContain("'/api/items/{id}': '/api/items/{id}'");
    expect(pathParamsContent).toContain("'/api/users': '/api/users'");

    // Check type guards
    expect(pathParamsContent).toContain(
      'export function isValidPath(value: string): value is ValidPath',
    );
    expect(pathParamsContent).toContain('export function isAllowedMethod');

    // Check parameter constants (even if empty)
    expect(pathParamsContent).toContain('export const KEY_STAGES');
    expect(pathParamsContent).toContain('export const SUBJECTS');

    // Check valid paths by parameters
    expect(pathParamsContent).toContain('export const VALID_PATHS_BY_PARAMETERS');
  });

  it('should handle paths with multiple parameters', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/items/{id}/details/{type}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
              },
              {
                name: 'type',
                in: 'path',
                required: true,
                schema: {
                  type: 'string',
                  enum: ['basic', 'detailed'],
                },
              },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    await generateSchemaArtifacts(schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // Check that the path is included
    expect(pathParamsContent).toContain("'/api/items/{id}/details/{type}'");

    // Check that parameter grouping exists
    expect(pathParamsContent).toContain('VALID_PATHS_BY_PARAMETERS');
    expect(pathParamsContent).toContain('id_type');
  });

  it('should handle query parameters correctly', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/search': {
          get: {
            parameters: [
              {
                name: 'query',
                in: 'query',
                required: false,
                schema: { type: 'string' },
              },
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

    await generateSchemaArtifacts(schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // Query parameters should be extracted as constants - check values are present
    expect(pathParamsContent).toContain('export const KEY_STAGES');
    expect(pathParamsContent).toContain('ks1');
    expect(pathParamsContent).toContain('ks2');
    expect(pathParamsContent).toContain('ks3');
    expect(pathParamsContent).toContain('ks4');

    // Type guard should be generated
    expect(pathParamsContent).toContain('export function isKeyStage');
  });

  it('should preserve original behaviour for complex schema', async () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Complex API', version: '1.0.0' },
      paths: {
        '/api/lessons': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                schema: { type: 'string', enum: ['ks1', 'ks2'] },
              },
              {
                name: 'subject',
                in: 'query',
                schema: { type: 'string', enum: ['maths', 'english'] },
              },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
        '/api/lessons/{lessonSlug}': {
          get: {
            parameters: [
              {
                name: 'lessonSlug',
                in: 'path',
                required: true,
                schema: { type: 'string' },
              },
            ],
            responses: { '200': { description: 'OK' } },
          },
        },
        '/api/units/{unitSlug}/lessons': {
          get: {
            parameters: [
              {
                name: 'unitSlug',
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

    await generateSchemaArtifacts(schema, testDir);

    const pathParamsContent = fs.readFileSync(path.join(testDir, 'path-parameters.ts'), 'utf-8');

    // All paths should be present and sorted
    expect(pathParamsContent).toContain("'/api/lessons': '/api/lessons'");
    expect(pathParamsContent).toContain("'/api/lessons/{lessonSlug}': '/api/lessons/{lessonSlug}'");
    expect(pathParamsContent).toContain(
      "'/api/units/{unitSlug}/lessons': '/api/units/{unitSlug}/lessons'",
    );

    // Parameters should be extracted - check the values are present
    expect(pathParamsContent).toContain('KEY_STAGES');
    expect(pathParamsContent).toContain('ks1');
    expect(pathParamsContent).toContain('ks2');
    expect(pathParamsContent).toContain('SUBJECTS');
    expect(pathParamsContent).toContain('maths');
    expect(pathParamsContent).toContain('english');

    // Valid paths by parameters should include proper groupings
    expect(pathParamsContent).toContain('VALID_PATHS_BY_PARAMETERS');
    expect(pathParamsContent).toContain('NO_PARAMS');
    expect(pathParamsContent).toContain('lessonSlug');
    expect(pathParamsContent).toContain('unitSlug');
  });
});
