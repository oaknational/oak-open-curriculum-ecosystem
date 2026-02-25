import type {
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ReferenceObject,
  ResponseObject,
  SchemaObject,
} from 'openapi3-ts/oas31';

const SUCCESS_STATUS_CODES = ['200', '201', '202', '203', '204'] as const;
const JSON_MEDIA_TYPE_PRIORITY = [
  'application/json',
  'application/problem+json',
  'application/ld+json',
  'application/vnd.api+json',
  'text/json',
] as const;

function isReferenceObject(value: unknown): value is ReferenceObject {
  return Boolean(value && typeof value === 'object' && '$ref' in value);
}

export function createSchemaResolver(schema: OpenAPIObject): (ref: string) => SchemaObject {
  const components: Record<string, SchemaObject | ReferenceObject | undefined> =
    schema.components?.schemas ?? {};
  const cache = new Map<string, SchemaObject>();
  const resolving = new Set<string>();

  const resolveSchema = (ref: string): SchemaObject => {
    const cached = cache.get(ref);
    if (cached) {
      return cached;
    }
    if (!ref.startsWith('#/components/schemas/')) {
      throw new Error(`Unsupported schema reference: ${ref}`);
    }
    const key = ref.slice('#/components/schemas/'.length);
    const entry = components[key];
    if (!entry) {
      throw new Error(`Unknown schema reference: ${ref}`);
    }
    if (resolving.has(ref)) {
      throw new Error(`Circular schema reference detected: ${ref}`);
    }
    resolving.add(ref);
    try {
      if (isReferenceObject(entry)) {
        const resolved = resolveSchema(entry.$ref);
        cache.set(ref, resolved);
        return resolved;
      }
      cache.set(ref, entry);
      return entry;
    } finally {
      resolving.delete(ref);
    }
  };

  return resolveSchema;
}

function resolveResponseObject(
  schema: OpenAPIObject,
  candidate: ResponseObject | ReferenceObject | undefined,
): ResponseObject | undefined {
  if (!candidate) {
    return undefined;
  }
  if (!isReferenceObject(candidate)) {
    return candidate;
  }
  const components = schema.components;
  if (!components?.responses) {
    throw new Error(`Cannot resolve response reference without components: ${candidate.$ref}`);
  }
  if (!candidate.$ref.startsWith('#/components/responses/')) {
    throw new Error(`Unsupported response reference: ${candidate.$ref}`);
  }
  const responses: Record<string, ResponseObject | ReferenceObject | undefined> =
    components.responses;
  const key = candidate.$ref.slice('#/components/responses/'.length);
  const resolved = responses[key];
  if (!resolved) {
    throw new Error(`Unknown response reference: ${candidate.$ref}`);
  }
  if (resolved === candidate) {
    throw new Error(`Self-referential response reference detected: ${candidate.$ref}`);
  }
  return resolveResponseObject(schema, resolved);
}

function pickSchemaFromContent(
  content: Partial<Record<string, MediaTypeObject>> | undefined,
): SchemaObject | ReferenceObject | undefined {
  if (!content) {
    return undefined;
  }
  for (const mediaType of JSON_MEDIA_TYPE_PRIORITY) {
    const candidate = content[mediaType];
    if (candidate?.schema) {
      return candidate.schema;
    }
  }
  for (const key of Object.keys(content)) {
    const descriptor = content[key];
    if (key.includes('json') && descriptor?.schema) {
      return descriptor.schema;
    }
  }
  for (const key of Object.keys(content)) {
    const descriptor = content[key];
    if (descriptor?.schema) {
      return descriptor.schema;
    }
  }
  return undefined;
}

export function resolveResponseSchemaForOperation(
  schema: OpenAPIObject,
  operation: OperationObject,
  resolveSchemaRef: (ref: string) => SchemaObject,
): SchemaObject | undefined {
  if (!operation.responses) {
    return undefined;
  }

  const responses: Record<string, ResponseObject | ReferenceObject | undefined> =
    operation.responses;

  const lookupSchema = (
    entry: ResponseObject | ReferenceObject | undefined,
  ): SchemaObject | undefined => {
    const resolvedResponse = resolveResponseObject(schema, entry);
    if (!resolvedResponse) {
      return undefined;
    }
    const schemaOrReference = pickSchemaFromContent(resolvedResponse.content);
    if (!schemaOrReference) {
      return undefined;
    }
    if (isReferenceObject(schemaOrReference)) {
      return resolveSchemaRef(schemaOrReference.$ref);
    }
    return schemaOrReference;
  };

  for (const status of SUCCESS_STATUS_CODES) {
    const schemaObject = lookupSchema(responses[status]);
    if (schemaObject) {
      return schemaObject;
    }
  }

  for (const key of Object.keys(responses)) {
    const schemaObject = lookupSchema(responses[key]);
    if (schemaObject) {
      return schemaObject;
    }
  }

  return undefined;
}
