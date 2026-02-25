import type { ReferenceObject, SchemaObject } from 'openapi3-ts/oas31';

export type ResolveReference = (ref: string) => SchemaObject;

interface SampleObject {
  [key: string]: SampleValue;
}

type SampleValue = string | number | boolean | null | SampleValue[] | SampleObject;

interface SamplerState {
  readonly resolveReference: ResolveReference;
  readonly visitedRefs: Set<string>;
}

function isSampleValue(value: unknown): value is SampleValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isSampleValue);
  }

  return isPlainObject(value);
}

function isPlainObject(value: unknown): value is SampleObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      continue;
    }
    const propValue: unknown = Object.getOwnPropertyDescriptor(value, key)?.value;
    if (!isSampleValue(propValue)) {
      return false;
    }
  }

  return true;
}

function isReferenceObject(
  value: SchemaObject | ReferenceObject | undefined,
): value is ReferenceObject {
  return Boolean(value && typeof value === 'object' && '$ref' in value);
}

function sampleFromReferenceOrSchema(
  schemaOrRef: SchemaObject | ReferenceObject | undefined,
  state: SamplerState,
): SampleValue {
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

function sampleResolvedSchema(schema: SchemaObject, state: SamplerState): SampleValue {
  if (schema.example !== undefined && isSampleValue(schema.example)) {
    return schema.example;
  }

  for (const candidate of normaliseEnumValues(schema.enum)) {
    if (isSampleValue(candidate)) {
      return candidate;
    }
  }

  if (schema.default !== undefined && isSampleValue(schema.default)) {
    return schema.default;
  }

  const compositeSample = sampleFromCombinators(schema, state);
  if (compositeSample !== undefined) {
    return compositeSample;
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

function sampleArray(schema: SchemaObject, state: SamplerState): SampleValue[] {
  const items = schema.items;
  if (!items) {
    return [];
  }
  const sample = sampleFromReferenceOrSchema(items, state);
  return [sample];
}

function sampleObject(schema: SchemaObject, state: SamplerState): SampleObject {
  const properties = schema.properties ?? {};
  const entries: [string, SampleValue][] = [];

  for (const [propertyName, propertySchema] of Object.entries(properties)) {
    entries.push([propertyName, sampleFromReferenceOrSchema(propertySchema, state)]);
  }

  return buildSampleObject(entries);
}

export function sampleSchemaObject(
  schema: SchemaObject,
  resolveReference: ResolveReference,
): SampleValue {
  return sampleResolvedSchema(schema, {
    resolveReference,
    visitedRefs: new Set<string>(),
  });
}

function sampleFromCombinators(schema: SchemaObject, state: SamplerState): SampleValue | undefined {
  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    return sampleAllOf(schema, state);
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return sampleOneOrAnyOf(schema, schema.oneOf, state);
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return sampleOneOrAnyOf(schema, schema.anyOf, state);
  }

  return undefined;
}

function sampleAllOf(schema: SchemaObject, state: SamplerState): SampleValue | undefined {
  const samples: SampleValue[] = [];
  const own = sampleOwnObjectProperties(schema, state);
  if (own) {
    samples.push(own);
  }

  for (const part of schema.allOf ?? []) {
    const sampled = sampleFromReferenceOrSchema(part, state);
    samples.push(sampled);
  }

  return materializeSamples(samples);
}

function sampleOneOrAnyOf(
  schema: SchemaObject,
  variants: (SchemaObject | ReferenceObject)[],
  state: SamplerState,
): SampleValue | undefined {
  const samples: SampleValue[] = [];
  const own = sampleOwnObjectProperties(schema, state);
  if (own) {
    samples.push(own);
  }

  const sampled = sampleFromReferenceOrSchema(variants[0], state);
  samples.push(sampled);

  return materializeSamples(samples);
}
function sampleOwnObjectProperties(
  schema: SchemaObject,
  state: SamplerState,
): SampleObject | undefined {
  if (!schema.properties || typeof schema.properties !== 'object') {
    return undefined;
  }

  const entries: [string, SampleValue][] = [];
  for (const [name, propertySchema] of Object.entries(schema.properties)) {
    entries.push([name, sampleFromReferenceOrSchema(propertySchema, state)]);
  }

  if (entries.length === 0) {
    return undefined;
  }

  return buildSampleObject(entries);
}

function materializeSamples(samples: SampleValue[]): SampleValue | undefined {
  if (samples.length === 0) {
    return undefined;
  }

  const merged: SampleObject = {};
  let mergedAny = false;

  for (const sample of samples) {
    if (isPlainObject(sample)) {
      Object.assign(merged, sample);
      mergedAny = true;
    }
  }

  if (mergedAny) {
    return merged;
  }

  return samples[samples.length - 1];
}

function buildSampleObject(entries: [string, SampleValue][]): SampleObject {
  const result: SampleObject = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
function normaliseEnumValues(values: SchemaObject['enum']): readonly unknown[] {
  return Array.isArray(values) ? values : [];
}
