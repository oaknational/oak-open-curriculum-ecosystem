import type { ParameterObject } from 'openapi-typescript';

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]';

function hasEnumSchema(param: ParameterObject): boolean {
  const schema = param.schema;
  if (!schema || typeof schema !== 'object') {
    return false;
  }
  const desc = 'enum' in schema ? { value: schema.enum } : undefined;
  return Boolean(desc && Array.isArray(desc.value));
}

function primitiveFromEnum(param: ParameterObject): PrimitiveType | undefined {
  if (!hasEnumSchema(param)) {
    return undefined;
  }
  const schema = param.schema;
  if (!schema || typeof schema !== 'object') {
    return undefined;
  }
  const desc = 'enum' in schema ? { value: schema.enum } : undefined;
  if (!desc || !Array.isArray(desc.value)) {
    return undefined;
  }
  if (typeof desc.value[0] === 'number') {
    return 'number';
  }
  if (typeof desc.value[0] === 'boolean') {
    return 'boolean';
  }
  return 'string';
}

function primitiveFromType(param: ParameterObject): PrimitiveType | undefined {
  const schema = param.schema;
  if (!schema || typeof schema !== 'object') {
    return undefined;
  }
  const typeDesc = 'type' in schema ? { value: schema.type } : undefined;
  const t = typeof typeDesc?.value === 'string' ? typeDesc.value : undefined;
  const map: Readonly<Record<string, PrimitiveType>> = {
    integer: 'number',
    number: 'number',
    boolean: 'boolean',
    array: 'string[]',
  };
  return t ? map[t] : undefined;
}

export function getParameterPrimitiveType(param: ParameterObject): PrimitiveType {
  return primitiveFromEnum(param) ?? primitiveFromType(param) ?? 'string';
}
