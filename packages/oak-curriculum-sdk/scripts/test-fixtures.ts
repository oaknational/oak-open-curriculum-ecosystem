/**
 * Properly typed test fixtures for OpenAPI3 schemas
 * These fixtures eliminate the need for 'any' types in tests
 */

import type { OpenAPI3 } from 'openapi-typescript';

/**
 * Minimal valid OpenAPI3 schema for testing
 */
export const minimalSchema: OpenAPI3 = {
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
export const schemaWithGetEndpoint: OpenAPI3 = {
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
export const schemaWithPathParams: OpenAPI3 = {
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
export const schemaWithQueryParams: OpenAPI3 = {
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
export const complexSchema: OpenAPI3 = {
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

/**
 * Type-safe JSON parsing helper
 * Validates that parsed JSON matches expected OpenAPI3 structure
 */
export function parseAsOpenAPI3(json: string): OpenAPI3 {
  const parsed = JSON.parse(json) as unknown;

  // Basic validation - in real code, use a proper validator
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('openapi' in parsed) ||
    !('info' in parsed) ||
    !('paths' in parsed)
  ) {
    throw new TypeError('Invalid OpenAPI3 schema');
  }

  return parsed as OpenAPI3;
}
