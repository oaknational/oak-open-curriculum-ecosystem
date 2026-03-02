import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { describe, expect, it } from 'vitest';

import { extractPathOperations } from './operation-extraction.js';

describe('extractPathOperations', () => {
  it('resolves referenced parameters and their component schemas', () => {
    const schema: OpenAPIObject = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {
        '/lessons/{lesson}/summary': {
          parameters: [{ $ref: '#/components/parameters/LessonParam' }],
          get: {
            operationId: 'getLessonSummary',
            summary: 'Example',
            description: 'Example operation',
            parameters: [
              {
                name: 'verbose',
                in: 'query',
                schema: { type: 'boolean' },
              },
            ],
            responses: {
              '200': {
                description: 'ok',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: { ok: { type: 'boolean' } },
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
          LessonSlug: {
            type: 'string',
            pattern: '^[a-z-]+$',
            description: 'Lesson slug identifier',
          },
        },
        parameters: {
          LessonParam: {
            name: 'lesson',
            in: 'path',
            required: true,
            schema: { $ref: '#/components/schemas/LessonSlug' },
          },
        },
      },
    };

    const operations = extractPathOperations(schema);
    expect(operations).toHaveLength(1);

    const [operation] = operations;
    expect(operation.path).toBe('/lessons/{lesson}/summary');
    expect(operation.method).toBe('get');
    expect(operation.operationId).toBe('getLessonSummary');

    expect(operation.parameters).toHaveLength(2);

    const lessonParam = operation.parameters.find((param) => param.name === 'lesson');
    expect(lessonParam).toBeDefined();
    expect(lessonParam?.in).toBe('path');
    expect(lessonParam?.required).toBe(true);
    expect(lessonParam?.schema).toEqual({
      type: 'string',
      pattern: '^[a-z-]+$',
      description: 'Lesson slug identifier',
    });

    const verboseParam = operation.parameters.find((param) => param.name === 'verbose');
    expect(verboseParam).toBeDefined();
    expect(verboseParam?.in).toBe('query');
    expect(verboseParam?.schema).toEqual({ type: 'boolean' });
  });
});
