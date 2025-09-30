import { describe, it, expect } from 'vitest';
import type { OpenAPI3 } from 'openapi-typescript';
import { buildResponseMapData } from './build-response-map.js';

describe('buildResponseMapData', () => {
  it('extracts operationId, status, and component names from $ref JSON responses', () => {
    const schema: OpenAPI3 = {
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
      components: { schemas: {} },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        {
          operationId: 'getLessons-getLesson',
          status: '200',
          componentName: 'LessonSummaryResponseSchema',
          path: '/lessons/{lesson}/summary',
          method: 'get',
        },
      ]),
    );
  });

  it('includes non-200 $ref responses (e.g., 404, 500)', () => {
    const schema: OpenAPI3 = {
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
      components: { schemas: {} },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        {
          operationId: 'getThings-getThing',
          status: '200',
          componentName: 'Thing',
          path: '/things/{id}',
          method: 'get',
        },
        {
          operationId: 'getThings-getThing',
          status: '404',
          componentName: 'NotFound',
          path: '/things/{id}',
          method: 'get',
        },
        {
          operationId: 'getThings-getThing',
          status: '500',
          componentName: 'InternalError',
          path: '/things/{id}',
          method: 'get',
        },
      ]),
    );
  });
});
