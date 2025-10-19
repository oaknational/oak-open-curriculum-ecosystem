import type { ReferenceObject, SchemaObject } from 'openapi3-ts/oas31';

export type ResolveReference = (ref: string) => SchemaObject;

interface SamplerState {
  readonly resolveReference: ResolveReference;
  readonly visitedRefs: Set<string>;
}

function isReferenceObject(
  value: SchemaObject | ReferenceObject | undefined,
): value is ReferenceObject {
  return Boolean(value && typeof value === 'object' && '$ref' in value);
}

function sampleFromReferenceOrSchema(
  schemaOrRef: SchemaObject | ReferenceObject | undefined,
  state: SamplerState,
): unknown {
  if (!schemaOrRef) {
    return null;
  }

  if (isReferenceObject(schemaOrRef)) {
    const ref = schemaOrRef.$ref;
    if (state.visitedRefs.has(ref)) {
      return {};
    }
    state.visitedRefs.add(ref);
    try {
      const resolved = state.resolveReference(ref);
      return sampleResolvedSchema(resolved, state);
    } finally {
      state.visitedRefs.delete(ref);
    }
  }

  return sampleResolvedSchema(schemaOrRef, state);
}

function sampleResolvedSchema(schema: SchemaObject, state: SamplerState): unknown {
  if (schema.example !== undefined) {
    return schema.example;
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0] ?? null;
  }

  if (schema.default !== undefined) {
    return schema.default;
  }

  switch (schema.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'null':
      return null;
    case 'array':
      return sampleArray(schema, state);
    case 'object':
    case undefined:
      return sampleObject(schema, state);
    default:
      return null;
  }
}

function sampleArray(schema: SchemaObject, state: SamplerState): unknown[] {
  const items = schema.items;
  if (!items) {
    return [];
  }
  const sample = sampleFromReferenceOrSchema(items, state);
  return sample === undefined ? [] : [sample];
}

function sampleObject(schema: SchemaObject, state: SamplerState): unknown {
  const properties = schema.properties ?? {};
  const entries: [string, unknown][] = [];

  for (const [propertyName, propertySchema] of Object.entries(properties)) {
    entries.push([propertyName, sampleFromReferenceOrSchema(propertySchema, state)]);
  }

  return Object.fromEntries(entries);
}

export function sampleSchemaObject(
  schema: SchemaObject,
  resolveReference: ResolveReference,
): unknown {
  return sampleResolvedSchema(schema, {
    resolveReference,
    visitedRefs: new Set<string>(),
  });
}
