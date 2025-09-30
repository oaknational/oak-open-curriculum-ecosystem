import { describe, it, expect } from 'vitest';
import { extractPathParameters } from './typegen-extraction';
import type { OpenAPI3 } from 'openapi-typescript';

describe('extractPathParameters', () => {
  it('should extract query parameters with enum values', () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/search': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                schema: {
                  type: 'string',
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

    const result = extractPathParameters(schema);

    // This test should pass - query parameters should be extracted
    expect(result.parameters).toHaveProperty('keyStage');
    expect(result.parameters.keyStage).toEqual(['ks1', 'ks2', 'ks3', 'ks4']);
  });

  it('should extract both path and query parameters', () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/lessons/{lessonId}': {
          get: {
            parameters: [
              {
                name: 'lessonId',
                in: 'path',
                required: true,
                schema: {
                  type: 'string',
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

    const result = extractPathParameters(schema);

    // Path parameters should be extracted (even without enum)
    expect(result.parameters).toHaveProperty('lessonId');

    // Query parameters with enum should be extracted
    expect(result.parameters).toHaveProperty('subject');
    expect(result.parameters.subject).toEqual(['maths', 'english', 'science']);
  });

  it('should handle multiple query parameters from different operations', () => {
    const schema: OpenAPI3 = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/api/lessons': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                schema: {
                  type: 'string',
                  enum: ['ks1', 'ks2'],
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
        '/api/units': {
          get: {
            parameters: [
              {
                name: 'keyStage',
                in: 'query',
                schema: {
                  type: 'string',
                  enum: ['ks3', 'ks4'],
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

    const result = extractPathParameters(schema);

    // Should combine enum values from both operations
    expect(result.parameters).toHaveProperty('keyStage');
    expect(result.parameters.keyStage).toContain('ks1');
    expect(result.parameters.keyStage).toContain('ks2');
    expect(result.parameters.keyStage).toContain('ks3');
    expect(result.parameters.keyStage).toContain('ks4');
  });
});
