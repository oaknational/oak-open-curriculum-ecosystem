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

/**
 * Schema with parameter description at the parameter level only.
 * OpenAPI allows descriptions at param.description (parameter-level).
 */
export function buildSchemaWithParamLevelDescription(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Param-level description schema',
      version: '1.0.0',
    },
    paths: {
      '/assets': {
        get: {
          operationId: 'getAssets',
          parameters: [
            {
              name: 'type',
              in: 'query',
              description: 'Asset type filter from parameter level',
              schema: {
                type: 'string',
                enum: ['slideDeck', 'worksheet', 'video'],
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

/**
 * Schema with parameter description at the schema level only.
 * OpenAPI also allows descriptions at param.schema.description (schema-level).
 */
export function buildSchemaWithSchemaLevelDescription(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Schema-level description schema',
      version: '1.0.0',
    },
    paths: {
      '/units': {
        get: {
          operationId: 'getUnits',
          parameters: [
            {
              name: 'keyStage',
              in: 'query',
              schema: {
                type: 'string',
                description: 'Key stage filter from schema level',
                enum: ['ks1', 'ks2', 'ks3', 'ks4'],
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

/**
 * Schema with parameter descriptions at BOTH levels.
 * Parameter-level should take precedence.
 */
export function buildSchemaWithBothDescriptionLevels(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Both description levels schema',
      version: '1.0.0',
    },
    paths: {
      '/search': {
        get: {
          operationId: 'search',
          parameters: [
            {
              name: 'subject',
              in: 'query',
              description: 'Parameter-level description takes precedence',
              schema: {
                type: 'string',
                description: 'Schema-level description is fallback',
                enum: ['maths', 'english'],
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

/**
 * Schema with parameter that has no description at any level.
 */
export function buildSchemaWithNoDescription(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'No description schema',
      version: '1.0.0',
    },
    paths: {
      '/items': {
        get: {
          operationId: 'getItems',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              schema: {
                type: 'number',
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

/**
 * Schema with parameter example at the parameter level (param.example).
 * OpenAPI allows examples at both parameter and schema levels.
 */
export function buildSchemaWithParamLevelExample(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Param-level example schema',
      version: '1.0.0',
    },
    paths: {
      '/sequences/{sequence}/units': {
        get: {
          operationId: 'getSequenceUnits',
          parameters: [
            {
              name: 'sequence',
              in: 'path',
              required: true,
              description: 'The sequence slug identifier',
              example: 'english-primary',
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
}

/**
 * Schema with parameter example at the schema level (param.schema.example).
 * Fallback location when param.example is not present.
 */
export function buildSchemaWithSchemaLevelExample(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Schema-level example schema',
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
              description: 'The lesson slug',
              schema: {
                type: 'string',
                example: 'checking-understanding-of-basic-transformations',
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

/**
 * Schema with parameter examples at BOTH levels.
 * Parameter-level should take precedence.
 */
export function buildSchemaWithBothExampleLevels(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Both example levels schema',
      version: '1.0.0',
    },
    paths: {
      '/units/{unit}': {
        get: {
          operationId: 'getUnit',
          parameters: [
            {
              name: 'unit',
              in: 'path',
              required: true,
              description: 'The unit slug',
              example: 'param-level-example',
              schema: {
                type: 'string',
                example: 'schema-level-example',
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

/**
 * Schema with parameter that has no example at any level.
 * The examples field should be omitted from output.
 */
export function buildSchemaWithNoExample(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'No example schema',
      version: '1.0.0',
    },
    paths: {
      '/subjects': {
        get: {
          operationId: 'getSubjects',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              description: 'Maximum number of results',
              schema: {
                type: 'number',
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
