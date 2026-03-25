import { describe, expect, it } from 'vitest';

import { minimalSchema } from './test-fixtures.js';
import { validateOpenApiDocument } from './schema-validator.js';

describe('validateOpenApiDocument', () => {
  it('returns the original schema when it satisfies OpenAPI 3 structure', () => {
    const result = validateOpenApiDocument(minimalSchema);

    expect(result).toBe(minimalSchema);
  });

  it('rejects input without an OpenAPI version string', () => {
    const schemaWithoutVersion: unknown = {
      info: { title: 'Test API', version: '1.0.0' },
      paths: {},
    };

    expect(() => validateOpenApiDocument(schemaWithoutVersion)).toThrow(TypeError);
  });

  it('rejects input without info metadata', () => {
    const schemaWithoutInfo: unknown = {
      openapi: '3.0.0',
      paths: {},
    };

    expect(() => validateOpenApiDocument(schemaWithoutInfo)).toThrow(TypeError);
  });

  it('rejects schemas whose paths include invalid keys', () => {
    const schemaWithInvalidPathKey: unknown = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        users: {},
      },
    };

    expect(() => validateOpenApiDocument(schemaWithInvalidPathKey)).toThrow(TypeError);
  });

  it('rejects schemas with invalid operation structures', () => {
    const schemaWithInvalidOperation: unknown = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/users': {
          get: {
            responses: 'invalid',
          },
        },
      },
    };

    expect(() => validateOpenApiDocument(schemaWithInvalidOperation)).toThrow(TypeError);
  });

  it('rejects schemas with malformed path parameters', () => {
    const schemaWithInvalidParameter: unknown = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/items/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'invalid-location',
              },
            ],
            responses: {
              '200': { description: 'ok' },
            },
          },
        },
      },
    };

    expect(() => validateOpenApiDocument(schemaWithInvalidParameter)).toThrow(TypeError);
  });
});
