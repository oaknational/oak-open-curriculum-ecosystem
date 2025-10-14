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
      components: { schemas: {} },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operationId: 'getLessons-getLesson',
          status: '200',
          componentName: 'getLessons_getLesson_200',
          path: '/lessons/{lesson}/summary',
          method: 'get',
        }),
      ]),
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
      components: { schemas: {} },
    };

    const entries = buildResponseMapData(schema);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '200',
          componentName: 'getThings_getThing_200',
          path: '/things/{id}',
          method: 'get',
        }),
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '404',
          componentName: 'getThings_getThing_404',
          path: '/things/{id}',
          method: 'get',
        }),
        expect.objectContaining({
          operationId: 'getThings-getThing',
          status: '500',
          componentName: 'getThings_getThing_500',
          path: '/things/{id}',
          method: 'get',
        }),
      ]),
    );
  });
});
