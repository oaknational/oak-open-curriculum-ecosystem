import type { OperationObject, ParameterObject, ReferenceObject } from 'openapi-typescript';
import type { PrimitiveType } from './param-utils.js';

export interface ParamDetails {
  required: boolean;
  enumValues?: readonly unknown[];
  primitiveType: PrimitiveType;
  in: 'path' | 'query' | 'header' | 'cookie';
}

function isReferenceObject(p: ParameterObject | ReferenceObject): p is ReferenceObject {
  return '$ref' in p;
}

function isParameterObject(p: ParameterObject | ReferenceObject): p is ParameterObject {
  return !isReferenceObject(p);
}

function getEnumValuesFromSchema(schema: unknown): unknown[] | undefined {
  if (typeof schema !== 'object' || schema === null) return undefined;
  const desc = 'enum' in schema ? { value: schema.enum } : undefined;
  if (!desc || !Array.isArray(desc.value)) return undefined;
  // Create a shallow copy to avoid leaking the descriptor's any-typed value
  const out: unknown[] = [];
  for (const v of desc.value) out.push(v);
  return out;
}

function getSchemaType(schema: unknown): unknown {
  if (typeof schema !== 'object' || schema === null) return undefined;
  const typeDesc = 'type' in schema ? { value: schema.type } : undefined;
  return typeDesc?.value;
}

function toPrimitiveFromEnum(enumVals: readonly unknown[]): PrimitiveType {
  const first = enumVals[0];
  if (typeof first === 'number') return 'number';
  if (typeof first === 'boolean') return 'boolean';
  return 'string';
}

function determinePrimitiveType(schema: unknown): PrimitiveType {
  const enumVals = getEnumValuesFromSchema(schema);
  if (enumVals && enumVals.length > 0) return toPrimitiveFromEnum(enumVals);
  const t = getSchemaType(schema);
  if (t === 'integer' || t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  if (t === 'array') return 'string[]';
  return 'string';
}

export function buildParamDetailsMap(operation: OperationObject): Map<string, ParamDetails> {
  const map = new Map<string, ParamDetails>();
  const params = operation.parameters;
  if (!params || !Array.isArray(params)) return map;
  for (const p of params) {
    if (!isParameterObject(p)) continue;
    const primitiveType = determinePrimitiveType(p.schema);
    const enumValues = getEnumValuesFromSchema(p.schema);
    map.set(p.name, {
      required: p.required === true,
      enumValues,
      primitiveType,
      in: p.in,
    });
  }
  return map;
}
