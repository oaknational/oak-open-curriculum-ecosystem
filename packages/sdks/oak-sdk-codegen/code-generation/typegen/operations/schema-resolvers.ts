import type {
  ComponentsObject,
  ParameterObject,
  ReferenceObject,
  SchemaObject,
} from 'openapi3-ts/oas31';

export function isReferenceObject(value: unknown): value is ReferenceObject {
  return Boolean(value && typeof value === 'object' && '$ref' in value);
}

function extractRefName(ref: string): string | undefined {
  const parts = ref.split('/');
  const name = parts[parts.length - 1];
  return name && name.length > 0 ? name : undefined;
}

function isSchemaObject(value: unknown): value is SchemaObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return !isReferenceObject(value);
}

function cloneSchema(schema: SchemaObject): SchemaObject {
  const cloned = structuredClone(schema);
  if (!isSchemaObject(cloned)) {
    throw new TypeError('Failed to clone schema object.');
  }
  return cloned;
}

export type ResolveSchemaFn = (
  schema: SchemaObject | ReferenceObject | undefined,
) => SchemaObject | undefined;

export type ResolveParameterFn = (
  parameter: ParameterObject | ReferenceObject,
) => ParameterObject | undefined;

export function createSchemaResolver(components: ComponentsObject | undefined): ResolveSchemaFn {
  const schemas = components?.schemas ?? {};
  const cache = new Map<string, SchemaObject | null>();
  const resolving = new Set<string>();

  function resolveByName(name: string): SchemaObject | undefined {
    if (cache.has(name)) {
      const cached = cache.get(name);
      return cached ?? undefined;
    }
    if (resolving.has(name)) {
      return undefined;
    }
    resolving.add(name);
    const target = schemas[name];
    let resolved: SchemaObject | undefined;
    if (isSchemaObject(target)) {
      resolved = cloneSchema(target);
    } else if (isReferenceObject(target)) {
      const refName = extractRefName(target.$ref);
      if (refName && refName !== name) {
        const nested = resolveByName(refName);
        if (nested !== undefined) {
          resolved = cloneSchema(nested);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  return (schema) => {
    if (!schema) {
      return undefined;
    }
    if (isReferenceObject(schema)) {
      const name = extractRefName(schema.$ref);
      if (!name) {
        return undefined;
      }
      const resolved = resolveByName(name);
      return resolved ? cloneSchema(resolved) : undefined;
    }
    return cloneSchema(schema);
  };
}

export function createParameterResolver(components: ComponentsObject | undefined): {
  resolveParameter: ResolveParameterFn;
  resolveSchema: ResolveSchemaFn;
} {
  const parameters = components?.parameters ?? {};
  const schemaResolver = createSchemaResolver(components);
  const cache = new Map<string, ParameterObject | null>();
  const resolving = new Set<string>();

  function resolveByName(name: string): ParameterObject | undefined {
    if (cache.has(name)) {
      const cached = cache.get(name);
      return cached ?? undefined;
    }
    if (resolving.has(name)) {
      return undefined;
    }
    resolving.add(name);
    const target = parameters[name];
    let resolved: ParameterObject | undefined;
    if (typeof target === 'object' && !Array.isArray(target) && 'name' in target) {
      resolved = structuredClone(target);
    } else if (isReferenceObject(target)) {
      const nestedName = extractRefName(target.$ref);
      if (nestedName && nestedName !== name) {
        const nested = resolveByName(nestedName);
        if (nested !== undefined) {
          resolved = structuredClone(nested);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  const resolveParameter: ResolveParameterFn = (parameter) => {
    if (isReferenceObject(parameter)) {
      const name = extractRefName(parameter.$ref);
      if (!name) {
        return undefined;
      }
      return resolveByName(name);
    }
    return structuredClone(parameter);
  };

  return { resolveParameter, resolveSchema: schemaResolver };
}
