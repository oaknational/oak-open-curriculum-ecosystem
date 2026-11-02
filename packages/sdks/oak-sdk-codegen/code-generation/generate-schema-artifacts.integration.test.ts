/**
 * Integration tests for `generateSchemaArtifacts`: the whole generation
 * pipeline run in-process from a small schema, written through the in-memory
 * file system, asserting the artefacts it produces.
 */
import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import {
  createInMemoryFileSystem,
  type InMemoryFileSystem,
} from '../src/io/test-helpers/in-memory-file-system.js';
import { generateSchemaArtifacts } from './codegen-core.js';

const OUT = '/out';

function schemaWithPaths(paths: OpenAPIObject['paths']): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths,
  };
}

const okResponse = { '200': { description: 'OK' } };

async function generate(schema: OpenAPIObject): Promise<InMemoryFileSystem> {
  const fs = createInMemoryFileSystem();
  await generateSchemaArtifacts(schema, schema, OUT, fs);
  return fs;
}

function fileOrThrow(fs: InMemoryFileSystem, name: string): string {
  const content = fs.files.get(`${OUT}/${name}`);
  if (content === undefined) {
    throw new Error(`Expected ${name} to be generated; have ${[...fs.files.keys()].join(', ')}`);
  }
  return content;
}

describe('generateSchemaArtifacts', () => {
  it('writes the schema JSON artefacts, the OpenAPI-TS types and the path parameters module', async () => {
    const fs = await generate(
      schemaWithPaths({
        '/api/users': { get: { responses: okResponse } },
        '/api/items/{id}': {
          get: {
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: okResponse,
          },
        },
      }),
    );

    for (const name of [
      'api-schema-original.json',
      'api-schema-sdk.json',
      'api-schema-base.ts',
      'api-paths-types.ts',
      'path-parameters.ts',
    ]) {
      expect(fs.files.has(`${OUT}/${name}`), name).toBe(true);
    }
  });

  it('writes the SDK schema as JSON carrying the schema paths', async () => {
    const fs = await generate(schemaWithPaths({ '/api/test': { get: { responses: okResponse } } }));

    const sdkSchema: unknown = JSON.parse(fileOrThrow(fs, 'api-schema-sdk.json'));

    expect(sdkSchema).toMatchObject({ openapi: '3.0.0', info: { title: 'Test API' } });
    expect(sdkSchema).toHaveProperty(['paths', '/api/test']);
  });

  it('emits the schema base, the PascalCase root types and the path constants', async () => {
    const fs = await generate(schemaWithPaths({ '/api/test': { get: { responses: okResponse } } }));

    const schemaBase = fileOrThrow(fs, 'api-schema-base.ts');
    expect(schemaBase).toContain('export const schema');
    expect(schemaBase).toContain('export type Schema');

    const pathsTypes = fileOrThrow(fs, 'api-paths-types.ts');
    expect(pathsTypes).toContain('export interface Paths');
    expect(pathsTypes).toMatch(/export (?:interface|type) Operations\b/);
    expect(pathsTypes).not.toMatch(/export (?:interface|type) (?:paths|components|operations)\b/);

    const pathParameters = fileOrThrow(fs, 'path-parameters.ts');
    expect(pathParameters).toContain('export const PATHS');
    expect(pathParameters).toContain('export function');
    expect(pathParameters).toContain("import type { Paths } from");
  });

  it('carries a parameterised path and its enum values into the path parameters module', async () => {
    const fs = await generate(
      schemaWithPaths({
        '/api/items/{id}': {
          get: {
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: okResponse,
          },
        },
        '/api/search': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                required: false,
                schema: { type: 'string', enum: ['ks1', 'ks2', 'ks3', 'ks4'] },
              },
            ],
            responses: okResponse,
          },
        },
      }),
    );

    const pathParameters = fileOrThrow(fs, 'path-parameters.ts');
    expect(pathParameters).toContain('/api/items/{id}');
    for (const keyStage of ['ks1', 'ks2', 'ks3', 'ks4']) {
      expect(pathParameters).toContain(keyStage);
    }
  });
});
