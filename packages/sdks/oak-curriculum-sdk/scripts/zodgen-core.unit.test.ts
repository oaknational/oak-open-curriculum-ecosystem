import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { generateZodSchemasArtifacts, generateZodEndpointsArtifacts } from './zodgen-core';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';

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
  if (!isRecord(value)) return false;
  const v = value;
  return typeof v.templatePath === 'string' && typeof v.distPath === 'string';
}

describe('zodgen-core', () => {
  const mockOpenApiDoc = {
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

  describe('generateZodSchemasArtifacts', () => {
    it('should generate response schemas using schemas-only template', async () => {
      await generateZodSchemasArtifacts(mockOpenApiDoc, '/output');
      const calls: unknown[][] = vi.mocked(generateZodClientFromOpenAPI).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const firstArg = calls[0][0];
      expect(isOzcOptions(firstArg)).toBe(true);
      if (isOzcOptions(firstArg)) {
        expect(firstArg.templatePath).toContain('schemas-only.hbs');
        expect(firstArg.distPath).toBe('/output/schemas.ts');
        expect(firstArg.openApiDoc).toStrictEqual(mockOpenApiDoc);
      }
    });

    it('should reject invalid OpenAPI document', async () => {
      await expect(generateZodSchemasArtifacts({}, '/output')).rejects.toThrow(
        'Invalid OpenAPI document',
      );
    });
  });

  describe('generateZodEndpointsArtifacts', () => {
    it('should generate endpoint schemas with parameters using default template', async () => {
      await generateZodEndpointsArtifacts(mockOpenApiDoc, '/output');
      const calls: unknown[][] = vi.mocked(generateZodClientFromOpenAPI).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const lastCall = calls[calls.length - 1];
      const firstArg = lastCall[0];
      expect(isOzcOptions(firstArg)).toBe(true);
      if (isOzcOptions(firstArg)) {
        expect(firstArg.templatePath).toContain('default.hbs');
        expect(firstArg.distPath).toBe('/output/endpoints.ts');
        expect(firstArg.openApiDoc).toStrictEqual(mockOpenApiDoc);
        if (firstArg.options && isRecord(firstArg.options)) {
          expect(firstArg.options.shouldExportAllSchemas).toBe(true);
          expect(firstArg.options.withAlias).toBe(false);
        }
      }
    });

    it('should create output directory if it does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      await generateZodEndpointsArtifacts(mockOpenApiDoc, '/output');

      expect(mkdirSync).toHaveBeenCalledWith('/output', { recursive: true });
    });

    it('should write output file when string is returned', async () => {
      vi.mocked(generateZodClientFromOpenAPI).mockResolvedValue('// Generated endpoints');

      await generateZodEndpointsArtifacts(mockOpenApiDoc, '/output');

      expect(writeFileSync).toHaveBeenCalledWith('/output/endpoints.ts', '// Generated endpoints');
    });

    it('should reject invalid OpenAPI document', async () => {
      await expect(generateZodEndpointsArtifacts({}, '/output')).rejects.toThrow(
        'Invalid OpenAPI document',
      );
    });
  });
});
