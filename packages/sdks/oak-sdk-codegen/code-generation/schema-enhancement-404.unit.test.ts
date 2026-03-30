import { describe, expect, it } from 'vitest';
import type { OpenAPIObject, PathItemObject } from 'openapi3-ts/oas31';

import {
  add404ResponsesWhereExpected,
  ENDPOINTS_WITH_LEGITIMATE_404S,
} from './schema-enhancement-404.js';

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
  it('decorates configured endpoints with the supplied 404 response', () => {
    const schema = createBaseSchema();
    const descriptor: Parameters<typeof add404ResponsesWhereExpected>[1] = [
      {
        method: 'get',
        path: '/lessons/{lesson}/transcript',
        reason: 'Test reason for decoration',
        upstreamReference: 'TEST-REF',
        media: {
          schema: {
            type: 'object',
            required: ['message', 'code', 'data'],
            properties: {
              message: { type: 'string' },
              code: { type: 'string' },
              data: { type: 'object' },
            },
          },
          example: { message: 'Not found', code: 'NOT_FOUND', data: {} },
        },
      },
    ];

    const result = add404ResponsesWhereExpected(schema, descriptor);

    const decoratedJson = JSON.stringify(result);
    expect(decoratedJson).toContain('Test reason for decoration');
    expect(decoratedJson).toContain('TEST-REF');

    const originalJson = JSON.stringify(schema);
    expect(originalJson).not.toContain('Test reason for decoration');
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

  it('throws when a supplied descriptor targets a response already in the schema', () => {
    const schema = createBaseSchema();
    const transcriptPath = schema.paths['/lessons/{lesson}/transcript'];
    const transcriptGet = transcriptPath.get;
    const responses = transcriptGet.responses ?? (transcriptGet.responses = {});
    responses['404'] = {
      description: 'Already present',
    };

    expect(() =>
      add404ResponsesWhereExpected(schema, [
        {
          method: 'get',
          path: '/lessons/{lesson}/transcript',
          reason: 'Conflict test',
          upstreamReference: 'CONFLICT-TEST',
          media: {
            schema: { type: 'object' },
            example: { message: 'Conflict' },
          },
        },
      ]),
    ).toThrow(/Cannot add HTTP 404 response via add404ResponsesWhereExpected/);
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
    ).toThrow(/was not found in the schema/);
  });

  it('passes through a schema with upstream 404 responses using the default list', () => {
    const schema = createBaseSchema();
    const transcriptPath = schema.paths['/lessons/{lesson}/transcript'];
    transcriptPath.get.responses = {
      ...transcriptPath.get.responses,
      '404': { description: 'Upstream 404 response from API' },
    };

    const result = add404ResponsesWhereExpected(schema);

    expect(result).toBeDefined();
    expect(result.paths).toBeDefined();
  });

  describe('strictness enforcement', () => {
    it('default descriptors do not use additionalProperties: true alongside explicit properties', () => {
      // additionalProperties: true is equivalent to z.any() - violates principles.md "No type shortcuts"
      // When we have explicit properties defined, we should NOT allow arbitrary additional keys
      const schemaJson = JSON.stringify(ENDPOINTS_WITH_LEGITIMATE_404S);
      expect(schemaJson).not.toContain('"additionalProperties":true');
    });

    it('decorated 404 response schema uses strict validation', () => {
      const schema = createBaseSchema();
      const result = add404ResponsesWhereExpected(schema, [
        {
          method: 'get',
          path: '/lessons/{lesson}/transcript',
          reason: 'Strictness test',
          upstreamReference: 'STRICT-TEST',
          media: {
            schema: {
              type: 'object',
              required: ['message'],
              properties: { message: { type: 'string' } },
            },
            example: { message: 'Test' },
          },
        },
      ]);
      const resultJson = JSON.stringify(result);

      expect(resultJson).not.toContain('"additionalProperties":true');
    });
  });
});
