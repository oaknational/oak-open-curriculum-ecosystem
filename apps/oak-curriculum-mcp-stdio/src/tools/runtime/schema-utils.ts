/**
 * JSON Schema helper utilities for MCP tool inputs
 */

type JsonPrimitiveType = 'string' | 'number';

export interface JsonSchemaProperty {
  type: JsonPrimitiveType;
  enum?: readonly (string | number)[];
  description?: string;
}

export type McpJsonSchemaObject = {
  type: 'object';
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
} & Record<string, unknown>;

export interface ParamMetadataLike {
  typePrimitive: 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]';
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
}

function normaliseAllowedValues(
  typePrimitive: ParamMetadataLike['typePrimitive'],
  allowedValues?: readonly unknown[],
): readonly (string | number)[] | undefined {
  if (!allowedValues || allowedValues.length === 0) return undefined;
  if (typePrimitive === 'number' || typePrimitive === 'number[]') {
    return allowedValues.filter((v): v is number => typeof v === 'number');
  }
  // booleans are not currently emitted into enums; default to string for safety
  return allowedValues
    .map((v) => (typeof v === 'string' || typeof v === 'number' ? v : undefined))
    .filter((v): v is string | number => v !== undefined);
}

export function toJsonSchemaProperty(meta: ParamMetadataLike): JsonSchemaProperty {
  const type: JsonPrimitiveType =
    meta.typePrimitive === 'number' || meta.typePrimitive === 'number[]' ? 'number' : 'string';
  const normalisedEnum = normaliseAllowedValues(meta.typePrimitive, meta.allowedValues);
  return {
    type,
    enum: normalisedEnum,
    description:
      meta.valueConstraint && normalisedEnum && normalisedEnum.length > 0
        ? 'One of: ' + normalisedEnum.join(', ')
        : undefined,
  } satisfies JsonSchemaProperty;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isParamMetadataLike(value: unknown): value is ParamMetadataLike {
  if (!isPlainRecord(value)) return false;
  const v = value;
  return (
    'typePrimitive' in v &&
    'valueConstraint' in v &&
    'required' in v &&
    (v.allowedValues === undefined || Array.isArray(v.allowedValues))
  );
}

export function addParamsToSchema(
  properties: Record<string, JsonSchemaProperty>,
  required: string[],
  entries: readonly (readonly [string, unknown])[],
): void {
  for (const [name, meta] of entries) {
    if (!isParamMetadataLike(meta)) continue;
    properties[name] = toJsonSchemaProperty(meta);
    if (meta.required) required.push(name);
  }
}

export function buildInputObjectSchema(
  pathEntries: readonly (readonly [string, unknown])[],
  queryEntries: readonly (readonly [string, unknown])[],
): McpJsonSchemaObject {
  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];
  addParamsToSchema(properties, required, pathEntries);
  addParamsToSchema(properties, required, queryEntries);
  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  } satisfies McpJsonSchemaObject;
}
