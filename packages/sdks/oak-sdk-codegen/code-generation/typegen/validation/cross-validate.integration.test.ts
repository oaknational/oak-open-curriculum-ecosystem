import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { buildResponseMapData } from '../response-map/build-response-map.js';
import { crossValidateResponseMap } from './cross-validate.js';

/**
 * Creates a realistic multi-endpoint schema that mirrors the upstream Oak API
 * shape: all endpoints share the same dotted `$ref` error components for 400,
 * 401, and 404. The builder sanitises dotted names and emits wildcards; the
 * cross-validator must accept both per-operation and wildcard entries.
 */
function createRealisticErrorSchema(): OpenAPIObject {
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
    info: { title: 'Realistic API', version: '0.6.0' },
    paths: {
      '/lessons/{lesson}/summary': {
        get: {
          operationId: 'getLessons-getSummary',
          responses: {
            '200': {
              description: 'ok',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LessonSummary' },
                },
              },
            },
            '400': errorRef('error.BAD_REQUEST'),
            '401': errorRef('error.UNAUTHORIZED'),
            '404': errorRef('error.NOT_FOUND'),
          },
        },
      },
      '/units/{unit}/summary': {
        get: {
          operationId: 'getUnits-getSummary',
          responses: {
            '200': {
              description: 'ok',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UnitSummary' },
                },
              },
            },
            '400': errorRef('error.BAD_REQUEST'),
            '401': errorRef('error.UNAUTHORIZED'),
            '404': errorRef('error.NOT_FOUND'),
          },
        },
      },
      '/subjects': {
        get: {
          operationId: 'getSubjects-list',
          responses: {
            '200': {
              description: 'ok',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SubjectList' },
                },
              },
            },
            '400': errorRef('error.BAD_REQUEST'),
            '401': errorRef('error.UNAUTHORIZED'),
            '404': errorRef('error.NOT_FOUND'),
          },
        },
      },
    },
    components: {
      schemas: {
        LessonSummary: { type: 'object', properties: { title: { type: 'string' } } },
        UnitSummary: { type: 'object', properties: { title: { type: 'string' } } },
        SubjectList: { type: 'object', properties: { subjects: { type: 'array' } } },
        'error.BAD_REQUEST': {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' },
            issues: { type: 'array', items: { type: 'object' } },
          },
        },
        'error.UNAUTHORIZED': {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' },
            issues: { type: 'array', items: { type: 'object' } },
          },
        },
        'error.NOT_FOUND': {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' },
            issues: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  } satisfies OpenAPIObject;
}

describe('builder + cross-validator pipeline (integration)', () => {
  it('accepts builder output including wildcards for shared dotted error components', () => {
    const schema = createRealisticErrorSchema();
    const entries = buildResponseMapData(schema);

    expect(() => {
      crossValidateResponseMap(schema, entries);
    }).not.toThrow();
  });

  it('builder produces wildcard entries that the cross-validator expects', () => {
    const schema = createRealisticErrorSchema();
    const entries = buildResponseMapData(schema);

    const wildcards = entries.filter((e) => e.operationId === '*');
    expect(wildcards).toHaveLength(3);

    const wildcardKeys = new Set(wildcards.map((e) => `*:${e.status}`));
    expect(wildcardKeys.has('*:400')).toBe(true);
    expect(wildcardKeys.has('*:401')).toBe(true);
    expect(wildcardKeys.has('*:404')).toBe(true);

    expect(() => {
      crossValidateResponseMap(schema, entries);
    }).not.toThrow();
  });
});
