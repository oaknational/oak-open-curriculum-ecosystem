import type {
  OpenAPIObject,
  OperationObject,
  ResponseObject,
  PathItemObject,
  ResponsesObject,
  SchemaObject,
  ReferenceObject,
} from 'openapi3-ts/oas31';

export interface ResponseMapEntry {
  readonly operationId: string;
  readonly status: string;
  readonly componentName: string;
  readonly zodIdentifier?: string;
  readonly jsonSchema?: SchemaObject;
  readonly path: string;
  readonly colonPath: string;
  readonly method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | '*';
  readonly source: 'component' | 'inline' | 'void';
}

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return 'responses' in value;
}

function isResponseObject(value: unknown): value is ResponseObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return 'description' in value || 'content' in value;
}

function extractComponentNameFromRef(ref: string): string | undefined {
  // Expect format: #/components/schemas/Name
  const parts = ref.split('/');
  const name = parts[parts.length - 1];
  return name && name.length > 0 ? name : undefined;
}

function sanitizeIdentifier(value: string): string {
  return value.replace(/[^A-Za-z0-9_]/g, '_');
}

function toColonPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

interface ResponseInfo {
  readonly name: string;
  readonly source: 'component' | 'inline';
  readonly schema: SchemaObject;
}

function isReferenceObject(value: unknown): value is ReferenceObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return typeof (value as { $ref?: unknown }).$ref === 'string';
}

function isSchemaObject(value: unknown): value is SchemaObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return !isReferenceObject(value);
}

function cloneSchema(schema: SchemaObject): SchemaObject {
  const cloned = structuredClone(schema);
  if (!isSchemaObject(cloned)) {
    throw new Error('Failed to clone schema.');
  }
  return cloned;
}

function ensureInlineMetadata(schema: SchemaObject, opId: string, status: string): SchemaObject {
  const next = cloneSchema(schema);
  if (!next.type) {
    next.type = 'object';
  }
  if (!next.title) {
    next.title = `${opId} ${status} response`;
  }
  return next;
}

function createComponentResolver(
  components: Record<string, SchemaObject | ReferenceObject | undefined>,
) {
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
        resolved = resolve(refName);
        if (resolved) {
          resolved = cloneSchema(resolved);
        }
      }
    }
    resolving.delete(name);
    cache.set(name, resolved ?? null);
    return resolved;
  }

  return { resolve };
}

function getJsonResponseInfo(
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
      if (resolved) {
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

export function buildResponseMapData(schema: OpenAPIObject): readonly ResponseMapEntry[] {
  const out: ResponseMapEntry[] = [];
  const inlineCounts = new Map<string, number>();
  const resolver = createComponentResolver(schema.components?.schemas ?? {});
  const componentSchemas = new Map<string, SchemaObject>();
  const paths = schema.paths ?? {};
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;
  const emptyBodyStatuses = new Set(['204', '304']);

  for (const pathKey in paths) {
    if (!Object.prototype.hasOwnProperty.call(paths, pathKey)) {
      continue;
    }
    const pathItem = paths[pathKey];
    collectFromPathItem(
      pathKey,
      pathItem,
      methods,
      out,
      emptyBodyStatuses,
      inlineCounts,
      resolver.resolve,
      componentSchemas,
    );
  }

  // Emit wildcard entries for error statuses when a single schema is used across all operations
  const byStatus = new Map<string, Set<string>>();
  for (const entry of out) {
    if (entry.source !== 'component') {
      continue;
    }
    if (entry.componentName === '__VOID__') {
      continue;
    }
    const set = byStatus.get(entry.status) ?? new Set<string>();
    set.add(entry.componentName);
    byStatus.set(entry.status, set);
  }
  for (const [status, componentSet] of byStatus) {
    if (componentSet.size === 1) {
      const [componentName] = componentSet;
      const schemaForComponent = componentSchemas.get(componentName);
      if (!schemaForComponent) {
        continue;
      }
      out.push({
        operationId: '*',
        status,
        componentName,
        jsonSchema: cloneSchema(schemaForComponent),
        path: '*',
        colonPath: '*',
        method: '*',
        source: 'component',
      });
    }
  }

  return out;
}

function collectResponses(
  opId: string,
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options',
  responses: ResponsesObject | undefined,
  out: ResponseMapEntry[],
  emptyBodyStatuses: Set<string>,
  inlineCounts: Map<string, number>,
  resolveComponent: (name: string) => SchemaObject | undefined,
  componentSchemas: Map<string, SchemaObject>,
): void {
  if (!responses) {
    return;
  }
  for (const [status, response] of Object.entries(responses)) {
    if (!isResponseObject(response)) {
      continue;
    }
    const info = getJsonResponseInfo(response, opId, status, resolveComponent);
    if (info) {
      let componentName = info.name;
      let zodIdentifier: string | undefined;
      if (info.source === 'inline') {
        const baseName = sanitizeIdentifier(`${opId}_${status}`);
        const seen = inlineCounts.get(baseName) ?? 0;
        inlineCounts.set(baseName, seen + 1);
        componentName = seen === 0 ? baseName : `${baseName}_${String(seen)}`;
        zodIdentifier = componentName;
      }
      const jsonSchema = cloneSchema(info.schema);
      if (info.source === 'component') {
        componentSchemas.set(componentName, jsonSchema);
      }
      out.push({
        operationId: opId,
        status,
        componentName,
        zodIdentifier,
        jsonSchema,
        path,
        colonPath: toColonPath(path),
        method,
        source: info.source,
      });
      continue;
    }
    // If there is no JSON schema and status implies no content, emit a void entry
    if (emptyBodyStatuses.has(status)) {
      out.push({
        operationId: opId,
        status,
        componentName: '__VOID__',
        zodIdentifier: undefined,
        jsonSchema: undefined,
        path,
        colonPath: toColonPath(path),
        method,
        source: 'void',
      });
    }
  }
}

function collectFromPathItem(
  pathKey: string,
  pathItem: PathItemObject | undefined,
  methods: readonly ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
  out: ResponseMapEntry[],
  emptyBodyStatuses: Set<string>,
  inlineCounts: Map<string, number>,
  resolveComponent: (name: string) => SchemaObject | undefined,
  componentSchemas: Map<string, SchemaObject>,
): void {
  if (!isPathItemObject(pathItem)) {
    return;
  }

  for (const method of methods) {
    const operation = pathItem[method];
    if (!isOperationObject(operation)) {
      continue;
    }
    const opId = operation.operationId;
    if (typeof opId !== 'string') {
      continue;
    }
    collectResponses(
      opId,
      pathKey,
      method,
      operation.responses,
      out,
      emptyBodyStatuses,
      inlineCounts,
      resolveComponent,
      componentSchemas,
    );
  }
}

function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
