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
  | JsonSchemaPropertyArray<'string' | 'number' | 'boolean'>;

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
  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];

  for (const [name, meta] of Object.entries(pathParams)) {
    properties[name] = jsonSchemaFromPrimitive(meta);
    if (meta.required) {
      required.push(name);
    }
  }

  for (const [name, meta] of Object.entries(queryParams)) {
    properties[name] = jsonSchemaFromPrimitive(meta);
    if (meta.required) {
      required.push(name);
    }
  }

  const base: JsonSchemaObject = {
    type: 'object',
    properties,
    additionalProperties: false,
  };

  return required.length > 0 ? { ...base, required } : base;
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
  const queryRequired = queryEntries.some(([, meta]) => meta.required);
  const paramsOptional = !hasPath && !queryRequired;

  const paramsShape: string[] = [];

  if (hasPath) {
    const fields = buildZodFields(pathEntries).join(', ');
    paramsShape.push(`path: z.object({ ${fields} })`);
  }

  if (hasQuery) {
    const fields = buildZodFields(queryEntries).join(', ');
    const maybeOptional = queryRequired ? '' : '.optional()';
    paramsShape.push(`query: z.object({ ${fields} })${maybeOptional}`);
  }

  const paramsSchema =
    paramsShape.length > 0 ? `z.object({ ${paramsShape.join(', ')} })` : 'z.object({})';
  const paramsField = paramsOptional
    ? `params: ${paramsSchema}.optional()`
    : `params: ${paramsSchema}`;

  return `z.object({ ${paramsField} })`;
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
