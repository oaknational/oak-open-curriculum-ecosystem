import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { OperationObject } from 'openapi3-ts/oas31';
import { generateToolFile, type ParamMetadata } from './generate-tool-file.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

function op(): OperationObject {
  return { responses: {} } as OperationObject;
}

describe('buildImports path resolution', () => {
  it('client-types.ts import path resolves to an existing file', () => {
    const generatedToolDir = resolve(
      thisDir,
      '../../../../src/types/generated/api-schema/mcp-tools/tools',
    );
    const clientTypesPath = resolve(generatedToolDir, '../../client-types.ts');
    expect(existsSync(clientTypesPath)).toBe(true);
  });
});

describe('emitHeader TSDoc safety', () => {
  it('escapes braces in path template parameters', () => {
    const toolName = 'oak-get-lessons-transcript';
    const path = '/lessons/{lesson}/transcript';
    const method = 'GET';
    const pathMeta: Record<string, ParamMetadata> = {
      lesson: { typePrimitive: 'string', valueConstraint: false, required: true },
    };
    const code = generateToolFile(toolName, path, method, 'op-id', op(), pathMeta, {});

    // The doc comment Path line should have escaped braces
    expect(code).toContain('Path: /lessons/\\{lesson\\}/transcript');
    // The const assignment should still have unescaped braces
    expect(code).toContain("const path = '/lessons/{lesson}/transcript'");
  });
});

describe('generateToolFile header shapes and invoke wrapper', () => {
  it('emits required path only for transcript tool and includes invoke wrapper', () => {
    const toolName = 'oak-get-lessons-transcript';
    const path = '/lessons/{lesson}/transcript';
    const method = 'GET';
    const pathMeta: Record<string, ParamMetadata> = {
      lesson: { typePrimitive: 'string', valueConstraint: false, required: true },
    };
    const queryMeta: Record<string, ParamMetadata> = {};

    const code = generateToolFile(
      toolName,
      path,
      method,
      'getLessonTranscript-getLessonTranscript',
      op(),
      pathMeta,
      queryMeta,
    );

    expect(code).toContain("import { z } from 'zod';");
    expect(code).toContain('export interface ToolPathParams');
    expect(code).toContain('readonly lesson: string;');
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly path: ToolPathParams;');
    expect(code).not.toContain('ToolQueryParams');
    expect(code).toContain('export const toolInputJsonSchema');
    expect(code).toContain('export const toolZodSchema');
    expect(code).toContain('export const describeToolArgs = () =>');
    expect(code).toContain('invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {');
  });

  it('emits required query only for search lessons tool with q and includes literal unions', () => {
    const toolName = 'oak-get-search-lessons';
    const path = '/search/lessons';
    const method = 'GET';
    const pathMeta: Record<string, ParamMetadata> = {};
    const queryMeta: Record<string, ParamMetadata> = {
      q: { typePrimitive: 'string', valueConstraint: false, required: true },
      keyStage: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['ks1', 'ks2'] as const,
      },
    };

    const code = generateToolFile(
      toolName,
      path,
      method,
      'getLessons-searchByTextSimilarity',
      op(),
      pathMeta,
      queryMeta,
    );

    expect(code).toContain('export interface ToolQueryParams');
    expect(code).toContain('readonly q: string;');
    expect(code).toContain("readonly keyStage?: 'ks1' | 'ks2';");
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly query: ToolQueryParams;');
    expect(code).not.toContain('ToolPathParams');
    expect(code).toContain('export const toolInputJsonSchema');
    expect(code).toContain('export const toolZodSchema');
    expect(code).toContain('export const describeToolArgs = () =>');
  });
});
