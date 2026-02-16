import { describe, it, expect } from 'vitest';
import type { OperationObject, ParameterObject } from 'openapi3-ts/oas31';
import { createFakeOperationObject, createFakeParameterObject } from '../../../test-fakes.js';
import { emitHeader, emitSchema, emitIndex } from './emitters.js';

function makeOp(params: ParameterObject[]): OperationObject {
  return createFakeOperationObject({
    operationId: 'get-pets-id',
    parameters: params,
    responses: { '200': { description: 'ok' } },
  });
}

describe('emitters', () => {
  it('emits header with constants and import', () => {
    const out = emitHeader('get-pets-id', '/pets/{id}', 'get', 'get-pets-id');
    expect(out).toContain('GENERATED FILE - DO NOT EDIT');
    expect(out).not.toContain('import type { OakApiPathBasedClient }');
    expect(out).not.toContain('getDescriptorSchemaForEndpoint');
    expect(out).toContain('const operationId =');
    expect(out).toContain('const name =');
  });

  it('emits schema block with tool parameter types and helpers', () => {
    const params: ParameterObject[] = [
      createFakeParameterObject({
        name: 'q',
        in: 'query',
        required: false,
        schema: { type: 'string' },
      }),
    ];
    const op = makeOp(params);
    const out = emitSchema(
      op,
      {},
      { q: { typePrimitive: 'string', valueConstraint: false, required: false } },
    );
    expect(out).toContain('export interface ToolQueryParams');
    expect(out).toContain('readonly q?: string;');
    expect(out).toContain('export interface ToolArgs { readonly params: ToolParams; }');
    expect(out).toContain('export const toolInputJsonSchema');
    expect(out).toContain('export const toolZodSchema');
    expect(out).toContain('export const describeToolArgs = () =>');
  });

  it('emits index/executor block exporting tool', () => {
    const op = makeOp([]);
    op.summary = 'Get a pet by id';
    const out = emitIndex('get-pets-id', '/pets/{id}', 'get', 'get-pets-id', op);
    expect(out).not.toContain('import type { ToolDescriptor }');
    expect(out).toContain(
      'const responseDescriptors = getResponseDescriptorsByOperationId(operationId);',
    );
    expect(out).toContain("const documentedStatuses = ['200'] as const;");
    expect(out).toContain('export const getPetsId = {');
    expect(out).toContain('invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {');
    expect(out).toContain('toolOutputJsonSchema: primaryResponseDescriptor.json');
    expect(out).toContain('zodOutputSchema: primaryResponseDescriptor.zod');
  });
});
