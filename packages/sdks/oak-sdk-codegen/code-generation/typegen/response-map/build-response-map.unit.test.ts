import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { buildResponseMapData } from './build-response-map.js';

describe('buildResponseMapData', () => {
  it('extracts operationId, status, and component names from $ref JSON responses', () => {
    const schema: OpenAPIObject = {
      openapi: '3.0.0',
      info: { title: 't', version: '1' },
      paths: {
        '/lessons/{lesson}/summary': {
          get: {
            operationId: 'getLessons-getLesson',
            responses: {
              200: {
                description: 'ok',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/LessonSummaryResponseSchema' },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          LessonSummaryResponseSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operationId: 'getLessons-getLesson',
          status: '200',
          componentName: 'LessonSummaryResponseSchema',
          path: '/lessons/{lesson}/summary',
          method: 'get',
        }),
      ]),
    );
  });

  it('sanitises dotted component names from $ref to match Zod registry keys', () => {
    const schema: OpenAPIObject = {
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
                    schema: { $ref: '#/components/schemas/ThingResponse' },
                  },
                },
              },
              400: {
                description: 'bad request',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/error.BAD_REQUEST' },
                  },
                },
              },
              401: {
                description: 'unauthorised',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/error.UNAUTHORIZED' },
                  },
                },
              },
              404: {
                description: 'not found',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/error.NOT_FOUND' },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          ThingResponse: { type: 'object', properties: { id: { type: 'string' } } },
          'error.BAD_REQUEST': {
            type: 'object',
            properties: { message: { type: 'string' }, code: { type: 'string' } },
          },
          'error.UNAUTHORIZED': {
            type: 'object',
            properties: { message: { type: 'string' }, code: { type: 'string' } },
          },
          'error.NOT_FOUND': {
            type: 'object',
            properties: { message: { type: 'string' }, code: { type: 'string' } },
          },
        },
      },
    };

    const entries = buildResponseMapData(schema);

    const errorEntries = entries.filter(
      (e) => e.operationId === 'getThings-getThing' && e.status !== '200',
    );

    expect(errorEntries).toHaveLength(3);
    expect(errorEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: '400',
          componentName: 'error_BAD_REQUEST',
          source: 'component',
        }),
        expect.objectContaining({
          status: '401',
          componentName: 'error_UNAUTHORIZED',
          source: 'component',
        }),
        expect.objectContaining({
          status: '404',
          componentName: 'error_NOT_FOUND',
          source: 'component',
        }),
      ]),
    );
  });

  it('emits wildcard entries with sanitised component names for shared error schemas', () => {
    const schema: OpenAPIObject = {
      openapi: '3.0.0',
      info: { title: 't', version: '1' },
      paths: {
        '/alpha': {
          get: {
            operationId: 'getAlpha',
            responses: {
              200: {
                description: 'ok',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/AlphaResponse' },
                  },
                },
              },
              404: {
                description: 'not found',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/error.NOT_FOUND' },
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
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/BetaResponse' },
                  },
                },
              },
              404: {
                description: 'not found',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/error.NOT_FOUND' },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          AlphaResponse: { type: 'object', properties: { a: { type: 'string' } } },
          BetaResponse: { type: 'object', properties: { b: { type: 'string' } } },
          'error.NOT_FOUND': {
            type: 'object',
            properties: { message: { type: 'string' }, code: { type: 'string' } },
          },
        },
      },
    };

    const entries = buildResponseMapData(schema);

    const wildcardEntries = entries.filter((e) => e.operationId === '*');
    expect(wildcardEntries).toHaveLength(1);
    expect(wildcardEntries[0]).toEqual(
      expect.objectContaining({
        operationId: '*',
        status: '404',
        componentName: 'error_NOT_FOUND',
        source: 'component',
        method: '*',
      }),
    );
  });

  it('includes non-200 $ref responses (e.g., 404, 500)', () => {
    const schema: OpenAPIObject = {
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
              404: {
                description: 'not found',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/NotFound' },
                  },
                },
              },
              500: {
                description: 'error',
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
          Thing: { type: 'object', properties: { id: { type: 'string' } } },
          NotFound: { type: 'object', properties: { message: { type: 'string' } } },
          InternalError: { type: 'object', properties: { message: { type: 'string' } } },
        },
      },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '200',
          componentName: 'Thing',
          path: '/things/{id}',
          method: 'get',
        }),
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '404',
          componentName: 'NotFound',
          path: '/things/{id}',
          method: 'get',
        }),
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '500',
          componentName: 'InternalError',
          path: '/things/{id}',
          method: 'get',
        }),
      ]),
    );
  });
});
