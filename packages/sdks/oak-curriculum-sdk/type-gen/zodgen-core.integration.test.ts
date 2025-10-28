import path from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateZodSchemas } from './zodgen-core.js';

let lastWrittenPath: string | undefined;
let lastWrittenContent: string | undefined;
const writeFileSyncSpy = vi.hoisted(() =>
  vi.fn((path: string, data: string) => {
    lastWrittenPath = path;
    lastWrittenContent = data;
  }),
);
const mkdirSyncSpy = vi.hoisted(() =>
  vi.fn((dirPath: string, options?: { readonly recursive?: boolean }) => {
    void dirPath;
    void options;
  }),
);
const existsSyncSpy = vi.hoisted(() =>
  vi.fn((dirPath: string) => {
    void dirPath;
    return false;
  }),
);

vi.mock('node:fs', () => ({
  existsSync: existsSyncSpy,
  mkdirSync: mkdirSyncSpy,
  writeFileSync: writeFileSyncSpy,
}));

const generateZodClientFromOpenAPISpy = vi.hoisted(() =>
  vi.fn().mockResolvedValue(`import { z } from "zod";
const endpoints = makeApi([]);
export const schemas = {
  "getLessonTranscript_getLessonTranscript_200": {} as const,
};
export const api = new Zodios(endpoints);
`),
);

vi.mock('openapi-zod-client', () => ({
  generateZodClientFromOpenAPI: generateZodClientFromOpenAPISpy,
}));

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
  beforeEach(() => {
    writeFileSyncSpy.mockClear();
    mkdirSyncSpy.mockClear();
    existsSyncSpy.mockClear();
    existsSyncSpy.mockReturnValue(false);
    generateZodClientFromOpenAPISpy.mockClear();
    lastWrittenPath = undefined;
    lastWrittenContent = undefined;
  });

  it('emits curriculum schema entries for every documented response status', async () => {
    const schema = createSchemaWithMultipleStatuses();
    const outDir = '/tmp/test-zod-gen';

    await generateZodSchemas(schema, outDir);

    expect(generateZodClientFromOpenAPISpy).toHaveBeenCalled();

    expect(mkdirSyncSpy).toHaveBeenCalledWith(outDir, { recursive: true });

    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
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
