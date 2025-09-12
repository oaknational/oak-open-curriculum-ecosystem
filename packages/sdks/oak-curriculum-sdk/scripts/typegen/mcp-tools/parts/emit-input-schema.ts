import type { PrimitiveType } from './param-utils.js';
import { typeSafeKeys } from '../../../../src/types/helpers.js';

/**
 * Parameter metadata describing a tool parameter extracted from OpenAPI.
 * This shape is intentionally minimal and compile-time friendly.
 */
export interface ParamMetadata {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyNumber {
  readonly type: 'number';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyBoolean {
  readonly type: 'boolean';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyArray<TItem extends 'string' | 'number' | 'boolean'> {
  readonly type: 'array';
  readonly items: { readonly type: TItem };
  readonly description?: string;
  readonly default?: unknown;
}

export type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray<'string' | 'number' | 'boolean'>;

export interface JsonSchemaObject {
  readonly type: 'object';
  readonly properties: Record<string, JsonSchemaProperty>;
  readonly required?: readonly string[];
  readonly additionalProperties: false;
}

function buildCommon(meta: ParamMetadata): {
  readonly description?: string;
  readonly default?: unknown;
} {
  const out: { description?: string; default?: unknown } = {};
  if (meta.description !== undefined) out.description = meta.description;
  if (meta.default !== undefined) out.default = meta.default;
  return out;
}

function buildStringProperty(meta: ParamMetadata): JsonSchemaPropertyString {
  const common = buildCommon(meta);
  const base: JsonSchemaPropertyString = { type: 'string', ...common };
  if (meta.valueConstraint && Array.isArray(meta.allowedValues)) {
    return { ...base, enum: meta.allowedValues };
  }
  return base;
}

function buildNumberProperty(meta: ParamMetadata): JsonSchemaPropertyNumber {
  const common = buildCommon(meta);
  const base: JsonSchemaPropertyNumber = { type: 'number', ...common };
  if (meta.valueConstraint && Array.isArray(meta.allowedValues)) {
    return { ...base, enum: meta.allowedValues };
  }
  return base;
}

function buildBooleanProperty(meta: ParamMetadata): JsonSchemaPropertyBoolean {
  const common = buildCommon(meta);
  const base: JsonSchemaPropertyBoolean = { type: 'boolean', ...common };
  if (meta.valueConstraint && Array.isArray(meta.allowedValues)) {
    return { ...base, enum: meta.allowedValues };
  }
  return base;
}

function buildArrayProperty(
  item: 'string' | 'number' | 'boolean',
  meta: ParamMetadata,
): JsonSchemaPropertyArray<'string' | 'number' | 'boolean'> {
  const common = buildCommon(meta);
  return { type: 'array', items: { type: item }, ...common };
}

function jsonSchemaFromPrimitive(meta: ParamMetadata): JsonSchemaProperty {
  const t = meta.typePrimitive;
  if (t === 'string') return buildStringProperty(meta);
  if (t === 'number') return buildNumberProperty(meta);
  if (t === 'boolean') return buildBooleanProperty(meta);
  if (t === 'string[]') return buildArrayProperty('string', meta);
  if (t === 'number[]') return buildArrayProperty('number', meta);
  return buildArrayProperty('boolean', meta);
}

/**
 * Build a JSON Schema object for a tool's parameters from path/query metadata.
 * Pure, compile-time friendly, no type assertions at call sites.
 */
export function buildInputSchemaObject(
  pathParams: Record<string, ParamMetadata>,
  queryParams: Record<string, ParamMetadata>,
): JsonSchemaObject {
  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];

  // Path params
  for (const key of typeSafeKeys(pathParams)) {
    const name = key;
    const meta = pathParams[name];
    properties[name] = jsonSchemaFromPrimitive(meta);
    if (meta.required) required.push(name);
  }

  // Query params
  for (const key of typeSafeKeys(queryParams)) {
    const name = key;
    const meta = queryParams[name];
    properties[name] = jsonSchemaFromPrimitive(meta);
    if (meta.required) required.push(name);
  }

  const base: JsonSchemaObject = {
    type: 'object',
    properties,
    additionalProperties: false,
  };

  return required.length > 0 ? { ...base, required } : base;
}
