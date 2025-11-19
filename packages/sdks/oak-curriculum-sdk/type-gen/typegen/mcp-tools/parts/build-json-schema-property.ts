import type { ParamMetadata } from './param-metadata.js';
import type {
  JsonSchemaProperty,
  JsonSchemaPropertyString,
  JsonSchemaPropertyNumber,
  JsonSchemaPropertyBoolean,
  JsonSchemaPropertyArray,
} from './json-schema-types.js';

function buildCommon(meta: ParamMetadata): {
  readonly description?: string;
  readonly default?: unknown;
} {
  const out: { description?: string; default?: unknown } = {};
  if (meta.description !== undefined) {
    out.description = meta.description;
  }
  if (meta.default !== undefined) {
    out.default = meta.default;
  }
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

export function jsonSchemaFromPrimitive(meta: ParamMetadata): JsonSchemaProperty {
  const t = meta.typePrimitive;
  if (t === 'string') {
    return buildStringProperty(meta);
  }
  if (t === 'number') {
    return buildNumberProperty(meta);
  }
  if (t === 'boolean') {
    return buildBooleanProperty(meta);
  }
  if (t === 'string[]') {
    return buildArrayProperty('string', meta);
  }
  if (t === 'number[]') {
    return buildArrayProperty('number', meta);
  }
  return buildArrayProperty('boolean', meta);
}
