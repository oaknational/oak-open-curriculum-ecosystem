import path from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateZodSchemas, type ZodgenIO } from './zodgen-core.js';

let lastWrittenPath: string | undefined;
let lastWrittenContent: string | undefined;

function createFakeIO(): ZodgenIO {
  const fakeOutput = `import { z } from "zod";
const endpoints = ([]);
export const schemas = {
  "getLessonTranscript_getLessonTranscript_200": {} as const,
};
`;

  return {
    existsSync: vi.fn(() => false),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn((writePath: string, data: string) => {
      lastWrittenPath = writePath;
      lastWrittenContent = data;
    }),
    generateZodSchemasFromOpenAPI: vi.fn().mockResolvedValue({ output: fakeOutput }),
  };
}

function createSchemaWithMultipleStatuses(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getLessonTranscript-getLessonTranscript',
          responses: {
            '200': {
              description: 'Transcript located',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LessonTranscriptResponse' },
                },
              },
            },
            '404': {
              description: 'Transcript missing',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Server exploded',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                    required: ['message'],
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
        LessonTranscriptResponse: {
          type: 'object',
          properties: {
            transcript: { type: 'string' },
          },
          required: ['transcript'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
          required: ['statusCode', 'message', 'error'],
        },
      },
    },
  } satisfies OpenAPIObject;
}

describe('generateZodSchemas (integration)', () => {
  let fakeIO: ZodgenIO;

  beforeEach(() => {
    lastWrittenPath = undefined;
    lastWrittenContent = undefined;
    fakeIO = createFakeIO();
  });

  it('emits curriculum schema entries for every documented response status', async () => {
    const schema = createSchemaWithMultipleStatuses();
    const outDir = '/tmp/test-zod-gen';

    await generateZodSchemas(schema, outDir, fakeIO);

    expect(fakeIO.generateZodSchemasFromOpenAPI).toHaveBeenCalled();
    expect(fakeIO.mkdirSync).toHaveBeenCalledWith(outDir, { recursive: true });
    expect(fakeIO.writeFileSync).toHaveBeenCalledTimes(1);
    expect(lastWrittenPath).toBe(path.join(outDir, 'curriculumZodSchemas.ts'));
    if (typeof lastWrittenContent !== 'string') {
      throw new Error('Expected writeFileSync to capture string content');
    }
    expect(lastWrittenContent.includes('curriculumSchemas')).toBe(true);
    expect(lastWrittenContent.includes('OPERATION_ID_BY_METHOD_AND_PATH')).toBe(true);
    expect(lastWrittenContent.includes('PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID')).toBe(true);
    expect(lastWrittenContent.includes('const statusSchemas')).toBe(true);
    expect(lastWrittenContent.includes('statusSchemas[primaryKey] = endpoint.response;')).toBe(
      true,
    );
    expect(lastWrittenContent.includes('statusSchemas[errorKey] = error.schema;')).toBe(true);
  });
});
