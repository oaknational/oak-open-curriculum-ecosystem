import { describe, expect, it } from 'vitest';
import type { OpenAPIObject, PathItemObject } from 'openapi3-ts/oas31';

import { add404ResponsesWhereExpected } from './schema-enhancement-404.js';

function createBaseSchema(): OpenAPIObject & {
  paths: {
    '/lessons/{lesson}/transcript': PathItemObject & {
      get: NonNullable<PathItemObject['get']>;
    };
  };
} {
  return {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getLessonTranscript-getLessonTranscript',
          responses: {
            '200': { description: 'OK' },
          },
        },
      },
    },
  } satisfies OpenAPIObject & {
    paths: {
      '/lessons/{lesson}/transcript': PathItemObject & {
        get: NonNullable<PathItemObject['get']>;
      };
    };
  };
}

describe('add404ResponsesWhereExpected', () => {
  it('decorates configured endpoints with the standard 404 response', () => {
    const schema = createBaseSchema();

    const result = add404ResponsesWhereExpected(schema);

    const decoratedJson = JSON.stringify(result);
    expect(decoratedJson).toContain('"message"');
    expect(decoratedJson).toContain('"code"');
    expect(decoratedJson).toContain('"data"');
    expect(decoratedJson).toContain('Temporary: Documented locally');

    const originalJson = JSON.stringify(schema);
    expect(originalJson).not.toContain('Temporary: Documented locally');
  });

  it('accepts override descriptors so the decorator is not tied to the default list', () => {
    const schema = createBaseSchema();
    const example = {
      message: 'Not here',
      code: 'MISSING',
      data: {
        code: 'MISSING',
        httpStatus: 404,
        path: 'tests.override',
        zodError: null,
      },
    };

    const result = add404ResponsesWhereExpected(schema, [
      {
        method: 'get',
        path: '/lessons/{lesson}/transcript',
        reason: 'Custom test reason',
        upstreamReference: 'TEST-123',
        media: {
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
                },
              },
            },
          },
          example,
        },
      },
    ]);

    const decoratedJson = JSON.stringify(result);
    expect(decoratedJson).toContain('Custom test reason');
    expect(decoratedJson).toContain('TEST-123');
    expect(decoratedJson).toContain(JSON.stringify(example));
  });

  it('throws when the upstream schema already documents the response', () => {
    const schema = createBaseSchema();
    const transcriptPath = schema.paths['/lessons/{lesson}/transcript'];
    const transcriptGet = transcriptPath.get;
    const responses = transcriptGet.responses ?? (transcriptGet.responses = {});
    responses['404'] = {
      description: 'Already present',
    };

    expect(() => add404ResponsesWhereExpected(schema)).toThrowError(
      /Cannot add HTTP 404 response via add404ResponsesWhereExpected/,
    );
  });

  it('throws when a configured path is missing from the schema', () => {
    const schema = createBaseSchema();

    expect(() =>
      add404ResponsesWhereExpected(schema, [
        {
          method: 'get',
          path: '/missing',
          reason: 'Absent endpoint',
          upstreamReference: 'TEST-404',
          media: {
            schema: { type: 'object' },
            example: { message: 'Missing', code: 'NOT_FOUND', data: {} },
          },
        },
      ]),
    ).toThrowError(/was not found in the schema/);
  });
});
