import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { buildResponseMapData } from './build-response-map.js';

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
