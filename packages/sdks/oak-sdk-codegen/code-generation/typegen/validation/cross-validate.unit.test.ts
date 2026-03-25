import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { crossValidateResponseMap, crossValidatePaths } from './cross-validate.js';

/**
 * Creates a schema where all operations share the same `$ref` error component
 * for each error status code (400, 401, 404). This mirrors the upstream Oak
 * API pattern and should produce valid wildcard entries.
 */
function createSchemaWithSharedErrors(): OpenAPIObject {
  const errorRef = (name: string) => ({
    description: name,
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${name}` },
      },
    },
  });

  return {
    openapi: '3.0.0',
    info: { title: 'Shared errors API', version: '1' },
    paths: {
      '/alpha': {
        get: {
          operationId: 'getAlpha',
          responses: {
            200: {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Alpha' } } },
            },
            404: errorRef('NotFound'),
          },
        },
      },
      '/beta': {
        get: {
          operationId: 'getBeta',
          responses: {
            200: {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Beta' } } },
            },
            404: errorRef('NotFound'),
          },
        },
      },
    },
    components: {
      schemas: {
        Alpha: { type: 'object', properties: { a: { type: 'string' } } },
        Beta: { type: 'object', properties: { b: { type: 'string' } } },
        NotFound: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  } satisfies OpenAPIObject;
}

/**
 * Creates a schema where operations use DIFFERENT error components for
 * the same status code. Wildcards should NOT be expected in this case.
 */
function createSchemaWithDifferentErrors(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: { title: 'Different errors API', version: '1' },
    paths: {
      '/alpha': {
        get: {
          operationId: 'getAlpha',
          responses: {
            200: {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Alpha' } } },
            },
            404: {
              description: 'not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AlphaNotFound' },
                },
              },
            },
          },
        },
      },
      '/beta': {
        get: {
          operationId: 'getBeta',
          responses: {
            200: {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Beta' } } },
            },
            404: {
              description: 'not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BetaNotFound' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Alpha: { type: 'object', properties: { a: { type: 'string' } } },
        Beta: { type: 'object', properties: { b: { type: 'string' } } },
        AlphaNotFound: { type: 'object', properties: { message: { type: 'string' } } },
        BetaNotFound: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
  } satisfies OpenAPIObject;
}

describe('cross-validate', () => {
  const base: OpenAPIObject = {
    openapi: '3.0.0',
    info: { title: 't', version: '1' },
    paths: {
      '/things/{id}': {
        get: {
          operationId: 'getThings-getThing',
          responses: {
            200: {
              description: 'ok',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Thing' },
                },
              },
            },
          },
        },
      },
    },
    components: { schemas: {} },
  };

  it('validates reversible path transforms and allowed methods', () => {
    expect(() => {
      crossValidatePaths(base);
    }).not.toThrow();
  });

  it('validates response map completeness', () => {
    const ok = [
      {
        operationId: 'getThings-getThing',
        status: '200',
        componentName: 'Thing',
        path: '/things/{id}',
        colonPath: '/things/:id',
        method: 'get',
        source: 'component',
      },
    ] as const;
    expect(() => {
      crossValidateResponseMap(base, ok);
    }).not.toThrow();

    const missing = [] as const;
    expect(() => {
      crossValidateResponseMap(base, missing);
    }).toThrow();
  });

  it('fails when response map contains extra unexpected entries', () => {
    const extra = [
      {
        operationId: 'nonExistent-op',
        status: '200',
        componentName: 'Nope',
        path: '/nowhere',
        colonPath: '/nowhere',
        method: 'get',
        source: 'component',
      },
    ] as const;
    expect(() => {
      crossValidateResponseMap(base, extra);
    }).toThrow();
  });

  it('error message includes Missing/Extra summaries for easier debugging', () => {
    const missing: readonly never[] = [] as const;
    // Construct a set with one extra (not present in schema)
    const extra = [
      {
        operationId: 'nonExistent-op',
        status: '404',
        componentName: 'NotFound',
        path: '/nowhere',
        colonPath: '/nowhere',
        method: 'get',
        source: 'component',
      },
    ] as const;
    try {
      crossValidateResponseMap(base, extra);
      expect(false).toBe(true); // should not reach
    } catch (e) {
      const msg = String(e);
      expect(msg.includes('Response map cross‑validation failed.')).toBe(true);
      expect(msg.includes('Extra')).toBe(true);
      // Now trigger missing by providing empty entries where base expects one
      try {
        crossValidateResponseMap(base, missing);
        expect(false).toBe(true);
      } catch (e2) {
        const msg2 = String(e2);
        expect(msg2.includes('Missing')).toBe(true);
      }
    }
  });

  it('accepts wildcard entries when all operations share the same component for a status', () => {
    const schema = createSchemaWithSharedErrors();

    const entries = [
      {
        operationId: 'getAlpha',
        status: '200',
        componentName: 'Alpha',
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getAlpha',
        status: '404',
        componentName: 'NotFound',
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getBeta',
        status: '200',
        componentName: 'Beta',
        path: '/beta',
        colonPath: '/beta',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getBeta',
        status: '404',
        componentName: 'NotFound',
        path: '/beta',
        colonPath: '/beta',
        method: 'get',
        source: 'component',
      },
      {
        operationId: '*',
        status: '404',
        componentName: 'NotFound',
        path: '*',
        colonPath: '*',
        method: '*',
        source: 'component',
      },
    ] as const;

    expect(() => {
      crossValidateResponseMap(schema, entries);
    }).not.toThrow();
  });

  it('rejects wildcard entries when operations use different components for a status', () => {
    const schema = createSchemaWithDifferentErrors();

    const entries = [
      {
        operationId: 'getAlpha',
        status: '200',
        componentName: 'Alpha',
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getAlpha',
        status: '404',
        componentName: 'AlphaNotFound',
        path: '/alpha',
        colonPath: '/alpha',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getBeta',
        status: '200',
        componentName: 'Beta',
        path: '/beta',
        colonPath: '/beta',
        method: 'get',
        source: 'component',
      },
      {
        operationId: 'getBeta',
        status: '404',
        componentName: 'BetaNotFound',
        path: '/beta',
        colonPath: '/beta',
        method: 'get',
        source: 'component',
      },
      {
        operationId: '*',
        status: '404',
        componentName: 'NotFound',
        path: '*',
        colonPath: '*',
        method: '*',
        source: 'component',
      },
    ] as const;

    expect(() => {
      crossValidateResponseMap(schema, entries);
    }).toThrow(/Extra/);
  });
});
