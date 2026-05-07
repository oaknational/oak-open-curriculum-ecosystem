import { describe, it, expect } from 'vitest';
import { emitSchema } from './emit-schema.js';
import type { ParamMetadata } from './param-metadata.js';

describe('emitSchema header', () => {
  it('emits required path params type when path params exist', () => {
    const pathMeta: Record<string, ParamMetadata> = {
      lesson: { typePrimitive: 'string', valueConstraint: false, required: true },
    };
    const queryMeta: Record<string, ParamMetadata> = {};
    const code = emitSchema(pathMeta, queryMeta);

    expect(code).toContain('export interface ToolPathParams');
    expect(code).toContain('readonly lesson: string;');
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly path: ToolPathParams;');
    expect(code).not.toContain('ToolQueryParams');
    expect(code).toContain('export interface ToolArgs { readonly params: ToolParams; }');
  });

  it('emits required query params type when any query param is required', () => {
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
    const code = emitSchema(pathMeta, queryMeta);

    expect(code).toContain('export interface ToolQueryParams');
    expect(code).toContain('readonly q: string;');
    expect(code).toContain("readonly keyStage?: 'ks1' | 'ks2';");
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly query: ToolQueryParams;');
    expect(code).not.toContain('ToolPathParams');
  });

  it('emits optional query params type when all query params are optional', () => {
    const pathMeta: Record<string, ParamMetadata> = {};
    const queryMeta: Record<string, ParamMetadata> = {
      subject: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['maths', 'english'] as const,
      },
    };
    const code = emitSchema(pathMeta, queryMeta);

    expect(code).toContain('export interface ToolQueryParams');
    expect(code).toContain("readonly subject?: 'maths' | 'english';");
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly query?: ToolQueryParams;');
    expect(code).toContain('export interface ToolArgs { readonly params: ToolParams; }');
  });

  it('emits sentinel ToolParams shape when no params exist', () => {
    const code = emitSchema({}, {});
    expect(code).toContain('export interface ToolParams');
    expect(code).toContain('readonly __noParams?: never;');
    expect(code).toContain('transformFlatToNestedArgs(flatArgs');
    expect(code).toContain('toolMcpFlatInputSchema.parse(flatArgs);');
    expect(code).toContain('return { params: {} };');
    expect(code).not.toContain('void flatArgs');
    expect(code).not.toContain('_flatArgs');
  });

  it('preserves canonical path param name in ToolPathParams but normalises in flat transform', () => {
    const pathMeta: Record<string, ParamMetadata> = {
      threadSlug: { typePrimitive: 'string', valueConstraint: false, required: true },
    };
    const code = emitSchema(pathMeta, {});

    expect(code).toContain('readonly threadSlug: string;');
    expect(code).toContain('threadSlug: flatArgs.thread,');
  });
});
