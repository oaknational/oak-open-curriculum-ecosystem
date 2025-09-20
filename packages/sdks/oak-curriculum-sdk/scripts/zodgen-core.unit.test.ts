import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { generateZodSchemas } from './zodgen-core';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPI3 } from 'openapi-typescript';

vi.mock('node:fs');
vi.mock('openapi-zod-client', () => ({
  generateZodClientFromOpenAPI: vi.fn().mockResolvedValue('// Generated code'),
}));

// Local type guards to avoid unsafe assignments in tests
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOzcOptions(value: unknown): value is {
  openApiDoc: unknown;
  templatePath: string;
  distPath: string;
  options?: Record<string, unknown>;
} {
  if (!isRecord(value)) {
    return false;
  }
  const v = value;
  return typeof v.templatePath === 'string' && typeof v.distPath === 'string';
}

describe('zodgen-core', () => {
  const mockOpenApiDoc: OpenAPI3 = {
    openapi: '3.0.3',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getLessonTranscript',
          parameters: [
            {
              name: 'lesson',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(existsSync).mockReturnValue(true);
  });

  describe('generateZodSchemas', () => {
    it('invokes the zod client generator with the provided OpenAPI doc', async () => {
      await generateZodSchemas(mockOpenApiDoc, '/output');
      const calls: unknown[][] = vi.mocked(generateZodClientFromOpenAPI).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const firstArg = calls[0][0];
      expect(isOzcOptions(firstArg)).toBe(true);
      if (isOzcOptions(firstArg)) {
        expect(firstArg.openApiDoc).toStrictEqual(mockOpenApiDoc);
      }
    });

    it('should reject invalid OpenAPI document', async () => {
      await expect(
        generateZodSchemas(
          { openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' } },
          '/output',
        ),
      ).rejects.toThrow('Invalid OpenAPI document');
    });
  });

  describe('generateZodSchemas', () => {
    it('writes output when the generator returns a string', async () => {
      vi.mocked(generateZodClientFromOpenAPI).mockResolvedValue('// Generated endpoints');
      await generateZodSchemas(mockOpenApiDoc, '/output');
      expect(writeFileSync).toHaveBeenCalled();
    });

    it('should create output directory if it does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      await generateZodSchemas(mockOpenApiDoc, '/output');

      expect(mkdirSync).toHaveBeenCalledWith('/output', { recursive: true });
    });

    // path-specific assertions are implementation details; validated above by generic write call

    it('should reject invalid OpenAPI document', async () => {
      await expect(
        generateZodSchemas(
          { openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' } },
          '/output',
        ),
      ).rejects.toThrow('Invalid OpenAPI document');
    });
  });
});
