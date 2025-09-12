import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi-typescript';
import { emitSchema, type ParamMetadata } from './emit-schema.js';

function op(): OperationObject {
  // Minimal valid operation object for our emitters
  return { responses: {} };
}

describe('emitSchema header (ValidRequestParams shape emission)', () => {
  it('emits required path shape when path params exist', () => {
    const pathMeta: Record<string, ParamMetadata> = {
      lesson: { typePrimitive: 'string', valueConstraint: false, required: true },
    };
    const queryMeta: Record<string, ParamMetadata> = {};
    const code = emitSchema(op(), pathMeta, queryMeta);

    expect(code).toContain('type PathParamsShape =');
    expect(code).toContain('path: PathParamsShape;');
    expect(code).not.toContain('type QueryParamsShape =');
  });

  it('emits required query shape when any query param is required', () => {
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
    const code = emitSchema(op(), pathMeta, queryMeta);

    expect(code).toContain('type QueryParamsShape =');
    expect(code).toContain('query: QueryParamsShape;');
    expect(code).toContain("'ks1' | 'ks2'");
    expect(code).not.toContain('PathParamsShape');
  });

  it('emits optional query shape when all query params are optional', () => {
    const pathMeta: Record<string, ParamMetadata> = {};
    const queryMeta: Record<string, ParamMetadata> = {
      subject: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['maths', 'english'] as const,
      },
    };
    const code = emitSchema(op(), pathMeta, queryMeta);

    expect(code).toContain('type QueryParamsShape =');
    expect(code).toContain('query?: QueryParamsShape;');
    expect(code).toContain("'maths' | 'english'");
    expect(code).not.toContain('PathParamsShape');
  });
});
