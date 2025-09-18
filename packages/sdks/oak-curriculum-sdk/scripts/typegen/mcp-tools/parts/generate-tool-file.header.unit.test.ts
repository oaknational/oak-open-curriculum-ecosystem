import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi-typescript';
import { generateToolFile, type ParamMetadata } from './generate-tool-file.js';

function op(): OperationObject {
  return { responses: {} };
}

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

    expect(code).toContain('type PathParamsShape =');
    expect(code).toContain('lesson: string;');
    expect(code).toContain('path: PathParamsShape;');
    expect(code).not.toContain('type QueryParamsShape =');
    expect(code).toContain('const invoke = async (client: OakApiPathBasedClient');
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

    expect(code).toContain('type QueryParamsShape =');
    expect(code).toContain('q: string;');
    expect(code).toContain("keyStage?: 'ks1' | 'ks2'");
    expect(code).toContain('query: QueryParamsShape;');
    expect(code).not.toContain('PathParamsShape');
    expect(code).toContain('const invoke = async (client: OakApiPathBasedClient');
  });
});
