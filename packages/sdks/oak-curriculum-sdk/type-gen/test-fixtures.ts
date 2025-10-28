/**
 * Properly typed test fixtures for OpenAPI schemas
 * These fixtures eliminate the need for 'any' types in tests
 */

import type { OpenAPIObject } from 'openapi3-ts/oas31';

/**
 * Minimal valid OpenAPI schema for testing
 */
export const minimalSchema: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  paths: {},
};

/**
 * Schema with a simple GET endpoint
 */
export const schemaWithGetEndpoint: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Test API with Endpoint',
    version: '1.0.0',
  },
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

/**
 * Schema with path parameters
 */
export const schemaWithPathParams: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Test API with Parameters',
    version: '1.0.0',
  },
  paths: {
    '/lessons/{lesson}/transcript': {
      get: {
        operationId: 'getLessonTranscript',
        parameters: [
          {
            name: 'lesson',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

/**
 * Schema with query parameters and enums
 */
export const schemaWithQueryParams: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Test API with Query Parameters',
    version: '1.0.0',
  },
  paths: {
    '/lessons': {
      get: {
        operationId: 'getLessons',
        parameters: [
          {
            name: 'keyStage',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['ks1', 'ks2', 'ks3', 'ks4'],
            },
          },
          {
            name: 'subject',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['maths', 'english', 'science'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

/**
 * Complex schema with multiple operations
 */
export const complexSchema: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Complex Test API',
    version: '2.0.0',
  },
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      post: {
        operationId: 'createUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created',
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        operationId: 'getUser',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

export const schemaWithNestedResponses: OpenAPIObject = {
  openapi: '3.0.3',
  info: {
    title: 'Nested Response API',
    version: '1.0.0',
  },
  paths: {
    '/lessons/{lesson}/transcript': {
      get: {
        operationId: 'getLessonTranscript',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TranscriptResponseSchema',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TranscriptResponseSchema: {
        type: 'object',
        properties: {
          transcript: { type: 'string' },
          vtt: { type: 'string' },
        },
      },
      SearchResponse: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/LessonResponse',
            },
          },
          summary: {
            type: 'object',
            anyOf: [
              {
                $ref: '#/components/schemas/LessonResponse',
              },
              {
                $ref: '#/components/schemas/UnitResponse',
              },
            ],
          },
        },
      },
      LessonResponse: {
        type: 'object',
        properties: {
          title: { type: 'string' },
        },
      },
      UnitResponse: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          lessons: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/LessonResponse',
            },
          },
        },
      },
      MetaInfo: {
        type: 'object',
        properties: {
          generatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

/**
 * Type-safe JSON parsing helper
 * Validates that parsed JSON matches expected OpenAPI structure
 */
export function parseAsOpenAPIObject(json: string): OpenAPIObject {
  const parsed = JSON.parse(json) as unknown;

  // Basic validation - in real code, use a proper validator
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('openapi' in parsed) ||
    !('info' in parsed) ||
    !('paths' in parsed)
  ) {
    throw new TypeError('Invalid OpenAPI schema');
  }

  return parsed as OpenAPIObject;
}

export function buildSchemaWithEnumParam(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Enum param schema',
      version: '1.0.0',
    },
    paths: {
      '/courses': {
        get: {
          operationId: 'getCourses',
          parameters: [
            {
              name: 'courseId',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['CourseA', 'CourseB'],
              },
            },
          ],
          responses: {
            '200': {
              description: 'Success',
            },
          },
        },
      },
    },
  };
}
