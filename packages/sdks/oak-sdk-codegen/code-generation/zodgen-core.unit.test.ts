import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateZodSchemas, type ZodgenIO } from './zodgen-core.js';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(thisDir, '__zod-test-output');

const fakeZodOutput = `import { z } from "zod";
const endpoints = ([
  {
    method: "get",
    path: "/changelog",
    response: z.object({}),
  },
]);
export const schemas = {
  changelog_changelog_200: z.object({}),
};
`;

function createFakeIO(): ZodgenIO & {
  readonly existsSyncSpy: ReturnType<typeof vi.fn<ZodgenIO['existsSync']>>;
  readonly mkdirSyncSpy: ReturnType<typeof vi.fn<ZodgenIO['mkdirSync']>>;
  readonly writeFileSyncSpy: ReturnType<typeof vi.fn<ZodgenIO['writeFileSync']>>;
  readonly generateSpy: ReturnType<typeof vi.fn<ZodgenIO['generateZodSchemasFromOpenAPI']>>;
} {
  const existsSyncSpy = vi.fn<ZodgenIO['existsSync']>(() => true);
  const mkdirSyncSpy = vi.fn<ZodgenIO['mkdirSync']>();
  const writeFileSyncSpy = vi.fn<ZodgenIO['writeFileSync']>();
  const generateSpy = vi
    .fn<ZodgenIO['generateZodSchemasFromOpenAPI']>()
    .mockResolvedValue({ output: fakeZodOutput });

  return {
    existsSync: existsSyncSpy,
    mkdirSync: mkdirSyncSpy,
    writeFileSync: writeFileSyncSpy,
    generateZodSchemasFromOpenAPI: generateSpy,
    existsSyncSpy,
    mkdirSyncSpy,
    writeFileSyncSpy,
    generateSpy,
  };
}

const minimalSchema: OpenAPIObject = {
  openapi: '3.0.3',
  info: { title: 'Test API', version: '1.0.0' },
  paths: {
    '/ping': {
      get: {
        operationId: 'ping',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
};

describe('generateZodSchemas', () => {
  let fakeIO: ReturnType<typeof createFakeIO>;

  beforeEach(() => {
    fakeIO = createFakeIO();
  });

  it('passes the schema (with paths guaranteed) to the adapter', async () => {
    await generateZodSchemas(minimalSchema, outDir, fakeIO);

    expect(fakeIO.generateSpy).toHaveBeenCalledTimes(1);
    const { openApiDoc } = fakeIO.generateSpy.mock.calls[0][0];
    expect(openApiDoc).toStrictEqual(minimalSchema);
  });

  it('creates the output directory when it does not exist', async () => {
    fakeIO.existsSyncSpy.mockReturnValueOnce(false);

    await generateZodSchemas(minimalSchema, outDir, fakeIO);

    expect(fakeIO.mkdirSyncSpy).toHaveBeenCalledWith(outDir, { recursive: true });
  });

  it('writes the generated file to disk', async () => {
    await generateZodSchemas(minimalSchema, outDir, fakeIO);

    expect(fakeIO.writeFileSyncSpy).toHaveBeenCalledWith(
      expect.stringContaining('curriculumZodSchemas.ts'),
      expect.any(String),
    );
  });

  it('emits endpoints before curriculumSchemas to keep ordering valid', async () => {
    await generateZodSchemas(minimalSchema, outDir, fakeIO);

    const [, content] = fakeIO.writeFileSyncSpy.mock.lastCall ?? [];
    if (typeof content !== 'string') {
      throw new Error('Content is not a string');
    }
    const endpointsIndex = content.indexOf('export const endpoints:');
    const curriculumIndex = content.indexOf(
      'export const curriculumSchemas = curriculumSchemaCollection',
    );
    expect(endpointsIndex).toBeGreaterThanOrEqual(0);
    expect(curriculumIndex).toBeGreaterThanOrEqual(0);
    expect(endpointsIndex).toBeLessThan(curriculumIndex);
  });
});
