import type { ReferenceObject, ResponseObject, SchemaObject } from 'openapi3-ts/oas31';

export function isResponseObject(value: unknown): value is ResponseObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return 'description' in value || 'content' in value;
}

export function extractComponentNameFromRef(ref: string): string | undefined {
  const parts = ref.split('/');
  const name = parts[parts.length - 1];
  return name && name.length > 0 ? name : undefined;
}

export function sanitizeIdentifier(value: string): string {
  return value.replace(/[^A-Za-z0-9_]/g, '_');
}

export function toColonPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

export interface ResponseInfo {
  readonly name: string;
  readonly source: 'component' | 'inline';
  readonly schema: SchemaObject;
}

export function isReferenceObject(value: unknown): value is ReferenceObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return '$ref' in value && typeof value.$ref === 'string';
}

export function isSchemaObject(value: unknown): value is SchemaObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return !isReferenceObject(value);
}

export function cloneSchema(schema: SchemaObject): SchemaObject {
  const cloned = structuredClone(schema);
  if (!isSchemaObject(cloned)) {
    throw new Error('Failed to clone schema.');
  }
  return cloned;
}

export function ensureInlineMetadata(
  schema: SchemaObject,
  opId: string,
  status: string,
): SchemaObject {
  const next = cloneSchema(schema);
  next.type ??= 'object';
  next.title ??= `${opId} ${status} response`;
  return next;
}

export function createComponentResolver(
  components: Record<string, SchemaObject | ReferenceObject | undefined>,
): { resolve: (name: string) => SchemaObject | undefined } {
  const cache = new Map<string, SchemaObject | null>();
  const resolving = new Set<string>();

  function resolve(name: string): SchemaObject | undefined {
    if (cache.has(name)) {
      const cached = cache.get(name);
      return cached ?? undefined;
    }
    if (resolving.has(name)) {
      return undefined;
    }
    resolving.add(name);
    const definition = components[name];
    let resolved: SchemaObject | undefined;
    if (isSchemaObject(definition)) {
      resolved = cloneSchema(definition);
    } else if (isReferenceObject(definition)) {
      const refName = extractComponentNameFromRef(definition.$ref);
      if (refName && refName !== name) {
        const nested = resolve(refName);
        if (nested !== undefined) {
          resolved = cloneSchema(nested);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  return { resolve };
}

export function getJsonResponseInfo(
  resp: ResponseObject,
  opId: string,
  status: string,
  resolveComponent: (name: string) => SchemaObject | undefined,
): ResponseInfo | undefined {
  const json = resp.content?.['application/json'];
  if (typeof json !== 'object' || Array.isArray(json)) {
    return undefined;
  }
  const schema = 'schema' in json ? json.schema : undefined;
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return undefined;
  }
  if (isReferenceObject(schema)) {
    const name = extractComponentNameFromRef(schema.$ref);
    if (name) {
      const resolved = resolveComponent(name);
      if (resolved !== undefined) {
        return { name, source: 'component', schema: cloneSchema(resolved) };
      }
      return undefined;
    }
  }
  if (!isSchemaObject(schema)) {
    return undefined;
  }
  const name = sanitizeIdentifier(`${opId}_${status}`);
  return {
    name,
    source: 'inline',
    schema: ensureInlineMetadata(schema, opId, status),
  };
}
