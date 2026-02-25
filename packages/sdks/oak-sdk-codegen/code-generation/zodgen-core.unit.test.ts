import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateZodSchemas } from './zodgen-core.js';

vi.mock('node:fs', async (original) => {
  const actual = await original();
  return Object.assign({}, actual, {
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  });
});

vi.mock('openapi-zod-client', () => ({
  generateZodClientFromOpenAPI: vi.fn().mockResolvedValue(
    `import { z } from "zod";
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
`,
  ),
}));

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(thisDir, '__zod-test-output');
const { existsSync, mkdirSync, writeFileSync } = await import('node:fs');
const { generateZodClientFromOpenAPI } = await import('openapi-zod-client');

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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(existsSync).mockReturnValue(true);
  });

  it('passes the schema (with paths guaranteed) to openapi-zod-client', async () => {
    await generateZodSchemas(minimalSchema, outDir);

    const calls = vi.mocked(generateZodClientFromOpenAPI).mock.calls;
    expect(calls).toHaveLength(1);
    const [{ openApiDoc }] = calls[0];
    expect(openApiDoc).toStrictEqual(minimalSchema);
  });

  it('creates the output directory when it does not exist', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(false);

    await generateZodSchemas(minimalSchema, outDir);

    expect(mkdirSync).toHaveBeenCalledWith(outDir, { recursive: true });
  });

  it('writes the generated file to disk', async () => {
    await generateZodSchemas(minimalSchema, outDir);

    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('curriculumZodSchemas.ts'),
      expect.any(String),
    );
  });

  it('emits endpoints before curriculumSchemas to keep ordering valid', async () => {
    await generateZodSchemas(minimalSchema, outDir);

    const [, content] = vi.mocked(writeFileSync).mock.lastCall ?? [];
    if (typeof content !== 'string') {
      throw new Error('Content is not a string');
    }
    // After Zod v4 migration, makeApi is removed and endpoints is a typed array
    const endpointsIndex = content.indexOf('export const endpoints:');
    const curriculumIndex = content.indexOf(
      'export const curriculumSchemas = curriculumSchemaCollection',
    );
    expect(endpointsIndex).toBeGreaterThanOrEqual(0);
    expect(curriculumIndex).toBeGreaterThanOrEqual(0);
    expect(endpointsIndex).toBeLessThan(curriculumIndex);
  });
});
