import type { ParamMetadata, ParamMetadataMap } from './param-metadata.js';

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
  | JsonSchemaPropertyArray<'string' | 'number' | 'boolean'>
  | JsonSchemaObject;

export interface JsonSchemaObject {
  readonly type: 'object';
  readonly properties: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties: false;
}

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

function jsonSchemaFromPrimitive(meta: ParamMetadata): JsonSchemaProperty {
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

/**
 * Build a JSON Schema object for a tool's parameters from path/query metadata.
 * Pure, compile-time friendly, no type assertions at call sites.
 */
export function buildInputSchemaObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): JsonSchemaObject {
  const buildSection = (
    entries: readonly (readonly [string, ParamMetadata])[],
  ): {
    readonly properties: Record<string, JsonSchemaProperty>;
    readonly required: readonly string[];
  } => {
    const properties: Record<string, JsonSchemaProperty> = {};
    const required: string[] = [];
    for (const [name, meta] of entries) {
      properties[name] = jsonSchemaFromPrimitive(meta);
      if (meta.required) {
        required.push(name);
      }
    }
    return { properties, required };
  };

  const pathEntries = Object.entries(pathParams);
  const queryEntries = Object.entries(queryParams);
  const pathSection = buildSection(pathEntries);
  const querySection = buildSection(queryEntries);

  const paramsProperties: Record<string, JsonSchemaProperty> = {};
  const paramsRequired: string[] = [];

  if (Object.keys(pathSection.properties).length > 0) {
    paramsProperties.path = {
      type: 'object',
      properties: pathSection.properties,
      additionalProperties: false,
      ...(pathSection.required.length > 0 ? { required: pathSection.required } : {}),
    };
    paramsRequired.push('path');
  }

  if (Object.keys(querySection.properties).length > 0) {
    paramsProperties.query = {
      type: 'object',
      properties: querySection.properties,
      additionalProperties: false,
      ...(querySection.required.length > 0 ? { required: querySection.required } : {}),
    };
    if (querySection.required.length > 0) {
      paramsRequired.push('query');
    }
  }

  const paramsSchema: JsonSchemaObject = {
    type: 'object',
    properties: paramsProperties,
    additionalProperties: false,
    ...(paramsRequired.length > 0 ? { required: paramsRequired } : {}),
  };

  return {
    type: 'object',
    properties: { params: paramsSchema },
    required: ['params'],
    additionalProperties: false,
  };
}

function buildZodFields(entries: [string, ParamMetadata][]): string[] {
  return entries.map(([name, meta]) => {
    const base = buildZodType(meta);
    return `${name}: ${base}${meta.required ? '' : '.optional()'}`;
  });
}

export function buildZodObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): string {
  const pathEntries = Object.entries(pathParams);
  const queryEntries = Object.entries(queryParams);
  const hasPath = pathEntries.length > 0;
  const hasQuery = queryEntries.length > 0;

  if (!hasPath && !hasQuery) {
    return 'z.object({ params: z.object({}) })';
  }

  const paramsShape: string[] = [];

  if (hasPath) {
    const fields = buildZodFields(pathEntries).join(', ');
    paramsShape.push(`path: z.object({ ${fields} })`);
  }

  if (hasQuery) {
    const fields = buildZodFields(queryEntries).join(', ');
    const maybeOptional = queryEntries.some(([, meta]) => meta.required) ? '' : '.optional()';
    paramsShape.push(`query: z.object({ ${fields} })${maybeOptional}`);
  }

  const paramsSchema =
    paramsShape.length > 0 ? `z.object({ ${paramsShape.join(', ')} })` : 'z.object({})';

  return `z.object({ params: ${paramsSchema} })`;
}

function buildZodType(meta: ParamMetadata): string {
  if (meta.allowedValues && meta.allowedValues.length > 0) {
    const literals = meta.allowedValues.map((value) => `z.literal(${JSON.stringify(value)})`);
    return `z.union([${literals.join(', ')}])`;
  }
  switch (meta.typePrimitive) {
    case 'string':
      return 'z.string()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'string[]':
      return 'z.array(z.string())';
    case 'number[]':
      return 'z.array(z.number())';
    case 'boolean[]':
      return 'z.array(z.boolean())';
    default:
      return 'z.unknown()';
  }
}
