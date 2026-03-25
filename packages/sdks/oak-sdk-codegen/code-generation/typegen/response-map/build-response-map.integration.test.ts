import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { buildResponseMapData } from './build-response-map.js';

/**
 * Creates a realistic multi-endpoint schema where all endpoints share the same
 * dotted error-response components (`error.BAD_REQUEST`, `error.UNAUTHORIZED`,
 * `error.NOT_FOUND`) via `$ref`. This mirrors the upstream Oak API shape that
 * triggered the original Cardinal Rule breach.
 */
function createSchemaWithDottedErrorComponents(): OpenAPIObject {
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
    info: { title: 'Multi-endpoint API', version: '1.0.0' },
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

function createSchema(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getLessonTranscript-getLessonTranscript',
          responses: {
            '200': {
              description: 'Transcript located',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LessonTranscript' },
                },
              },
            },
            '404': {
              description: 'Transcript missing',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['message', 'code', 'data'],
                    properties: {
                      message: { type: 'string' },
                      code: { type: 'string' },
                      data: {
                        type: 'object',
                        required: ['code', 'httpStatus'],
                        additionalProperties: true,
                        properties: {
                          code: { type: 'string' },
                          httpStatus: { type: 'integer' },
                          path: { type: 'string' },
                          zodError: { nullable: true },
                        },
                      },
                    },
                    additionalProperties: true,
                  },
                },
              },
            },
            '500': {
              description: 'Server exploded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/InternalError' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        LessonTranscript: {
          type: 'object',
          properties: {
            transcript: { type: 'string' },
          },
          required: ['transcript'],
        },
        InternalError: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
        },
      },
    },
  } satisfies OpenAPIObject;
}

describe('buildResponseMapData (integration)', () => {
  it('produces response entries for every documented status code', () => {
    const schema = createSchema();

    const entries = buildResponseMapData(schema);

    const descriptors = entries.filter(
      (entry) => entry.operationId === 'getLessonTranscript-getLessonTranscript',
    );
    const statuses = descriptors.map((entry) => entry.status);

    expect(statuses).toEqual(expect.arrayContaining(['200', '404', '500']));

    const inlineDescriptor = descriptors.find((entry) => entry.status === '404');
    expect(inlineDescriptor?.source).toBe('inline');
    const inlineSchemaJson = JSON.stringify(inlineDescriptor?.jsonSchema);
    expect(inlineSchemaJson).toBeDefined();
    if (!inlineSchemaJson) {
      throw new Error('Expected inline schema for 404 response');
    }
    expect(inlineSchemaJson).toContain('"message"');
    expect(inlineSchemaJson).toContain('"code"');
    expect(inlineSchemaJson).toContain('"data"');

    const componentDescriptor = descriptors.find((entry) => entry.status === '200');
    expect(componentDescriptor?.componentName).toBe('LessonTranscript');
    expect(componentDescriptor?.source).toBe('component');
    const componentSchemaJson = JSON.stringify(componentDescriptor?.jsonSchema);
    expect(componentSchemaJson).toBeDefined();
    if (!componentSchemaJson) {
      throw new Error('Expected schema for 200 response');
    }
    expect(componentSchemaJson).toContain('"transcript"');

    const errorDescriptor = descriptors.find((entry) => entry.status === '500');
    expect(errorDescriptor?.componentName).toBe('InternalError');
    expect(errorDescriptor?.source).toBe('component');
  });

  it('records inline schemas with deterministic identifiers', () => {
    const schema = createSchema();

    const entries = buildResponseMapData(schema);

    const inlineDescriptor = entries.find(
      (entry) =>
        entry.operationId === 'getLessonTranscript-getLessonTranscript' && entry.status === '404',
    );

    expect(inlineDescriptor).toBeDefined();
    if (!inlineDescriptor) {
      throw new Error('Expected inline descriptor for 404 response');
    }
    expect(inlineDescriptor.zodIdentifier).toBe('getLessonTranscript_getLessonTranscript_404');
  });
});

describe('buildResponseMapData with dotted error components (integration)', () => {
  it('sanitises all dotted component names across multiple endpoints', () => {
    const schema = createSchemaWithDottedErrorComponents();
    const entries = buildResponseMapData(schema);

    const allComponentNames = entries
      .filter((e) => e.source === 'component')
      .map((e) => e.componentName);

    for (const name of allComponentNames) {
      expect(name).not.toContain('.');
      expect(name).toMatch(/^[A-Za-z0-9_]+$/);
    }
  });

  it('emits wildcard entries for each shared error status when all endpoints use the same component', () => {
    const schema = createSchemaWithDottedErrorComponents();
    const entries = buildResponseMapData(schema);

    const wildcardEntries = entries.filter((e) => e.operationId === '*');

    expect(wildcardEntries).toHaveLength(3);
    const wildcardStatuses = wildcardEntries.map((e) => e.status).sort();
    expect(wildcardStatuses).toEqual(['400', '401', '404']);

    for (const wc of wildcardEntries) {
      expect(wc.componentName).not.toContain('.');
      expect(wc.method).toBe('*');
      expect(wc.path).toBe('*');
      expect(wc.source).toBe('component');
      expect(wc.jsonSchema).toBeDefined();
    }
  });

  it('does not emit wildcard for 200 when each endpoint has a different response component', () => {
    const schema = createSchemaWithDottedErrorComponents();
    const entries = buildResponseMapData(schema);

    const wildcard200 = entries.find((e) => e.operationId === '*' && e.status === '200');
    expect(wildcard200).toBeUndefined();
  });

  it('preserves per-operation entries alongside wildcard entries', () => {
    const schema = createSchemaWithDottedErrorComponents();
    const entries = buildResponseMapData(schema);

    const operationIds = ['getLessons-getSummary', 'getUnits-getSummary', 'getSubjects-list'];

    for (const opId of operationIds) {
      const opEntries = entries.filter((e) => e.operationId === opId);
      const statuses = opEntries.map((e) => e.status).sort();
      expect(statuses).toEqual(['200', '400', '401', '404']);
    }
  });
});
