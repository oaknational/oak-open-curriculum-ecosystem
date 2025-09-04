import { describe, it, expect } from 'vitest';
import type { OperationObject, ParameterObject } from 'openapi-typescript';
import { emitHeader, emitParams, emitSchema, emitIndex } from './emitters.js';
import type { ParamMetadata } from './generate-tool-file.js';

function makeOp(params: ParameterObject[]): OperationObject {
  return {
    operationId: 'get-pets-id',
    parameters: params,
    responses: {},
  } as unknown as OperationObject;
}

describe('emitters', () => {
  it('emits header with constants and import', () => {
    const out = emitHeader('get-pets-id', '/pets/{id}', 'get', 'get-pets-id');
    expect(out).toContain('GENERATED FILE - DO NOT EDIT');
    expect(out).toContain(
      'import type { OakApiPathBasedClient } from "../../../../../client/index.js";',
    );
    expect(out).toContain("const operationId= 'get-pets-id' as const;");
    expect(out).toContain("const method= 'GET' as const;");
  });

  it('emits params with enum guards and maps', () => {
    const params: ParameterObject[] = [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { enum: [1, 2, 3], type: 'integer' },
      } as unknown as ParameterObject,
      {
        name: 'q',
        in: 'query',
        required: false,
        schema: { type: 'string' },
      } as unknown as ParameterObject,
    ];
    const op = makeOp(params);

    const pathParamMetadata: Record<string, ParamMetadata> = {
      id: {
        typePrimitive: 'number',
        valueConstraint: true,
        required: true,
        allowedValues: [1, 2, 3],
      },
    };
    const queryParamMetadata: Record<string, ParamMetadata> = {
      q: { typePrimitive: 'string', valueConstraint: false, required: false },
    };

    const out = emitParams(op, pathParamMetadata, queryParamMetadata);
    expect(out).toContain('const allowedIdValues= [1,2,3] as const;');
    expect(out).toContain('const pathParams= {');
    expect(out).toContain('const queryParams= {');
  });

  it('emits schema block with types and guards', () => {
    const params: ParameterObject[] = [
      {
        name: 'q',
        in: 'query',
        required: false,
        schema: { type: 'string' },
      } as unknown as ParameterObject,
    ];
    const op = makeOp(params);
    const out = emitSchema(
      op,
      {},
      { q: { typePrimitive: 'string', valueConstraint: false, required: false } },
    );
    expect(out).toContain('type ValidRequestParams= {params: {');
    expect(out).toContain('function isValidRequestParams(');
    expect(out).toContain('const getValidRequestParamsDescription= () => {');
  });

  it('emits index/executor block exporting tool', () => {
    const params: ParameterObject[] = [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
      } as unknown as ParameterObject,
    ];
    const op = makeOp(params);
    const out = emitIndex('get-pets-id', '/pets/{id}', 'get', op, ['id'], []);
    expect(out).toContain('const executor= (client: OakApiPathBasedClient');
    expect(out).toContain('export const getPetsId = {');
    expect(out).toContain('getExecutorFromGenericRequestParams');
  });
});
