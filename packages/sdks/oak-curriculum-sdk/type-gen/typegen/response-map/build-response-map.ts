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

function cloneSchema<T>(schema: T): T {
  return JSON.parse(JSON.stringify(schema)) as T;
}

function getJsonResponseInfo(
  resp: ResponseObject,
  opId: string,
  status: string,
  components: Record<string, SchemaObject | undefined>,
): ResponseInfo | undefined {
  const json = resp.content?.['application/json'];
  if (typeof json !== 'object' || Array.isArray(json)) {
    return undefined;
  }
  const schema = 'schema' in json ? json.schema : undefined;
  if (typeof schema !== 'object' || Array.isArray(schema)) {
    return undefined;
  }
  const ref = '$ref' in schema ? schema.$ref : undefined;
  if (typeof ref === 'string') {
    const name = extractComponentNameFromRef(ref);
    if (name) {
      const resolved = components[name];
      if (resolved) {
        return { name, source: 'component', schema: cloneSchema(resolved) };
      }
      const inlineSchema = resp.content?.['application/json']?.schema;
      if (typeof inlineSchema === 'object' && inlineSchema && !Array.isArray(inlineSchema)) {
        const fallbackName = sanitizeIdentifier(`${opId}_${status}`);
        const cloned = cloneSchema(inlineSchema as SchemaObject);
        if (!('type' in cloned)) {
          cloned.type = 'object';
        }
        if (!('title' in cloned)) {
          cloned.title = `${opId} ${status} response`;
        }
        return {
          name: fallbackName,
          source: 'inline',
          schema: cloned,
        };
      }
      return undefined;
    }
  }
  return {
    name: sanitizeIdentifier(`${opId}_${status}`),
    source: 'inline',
    schema: cloneSchema(schema as SchemaObject),
  };
}

export function buildResponseMapData(schema: OpenAPIObject): readonly ResponseMapEntry[] {
  const out: ResponseMapEntry[] = [];
  const inlineCounts = new Map<string, number>();
  const schemaComponents = normaliseSchemaComponents(schema.components?.schemas ?? {});
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
      schemaComponents,
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
      out.push({
        operationId: '*',
        status,
        componentName,
        jsonSchema: cloneSchema(schemaComponents[componentName] ?? ({} as SchemaObject)),
        path: '*',
        colonPath: '*',
        method: '*',
        source: 'component',
      });
    }
  }

  return out;
}

function normaliseSchemaComponents(
  components: Record<string, SchemaObject | ReferenceObject>,
): Record<string, SchemaObject | undefined> {
  const result: Record<string, SchemaObject | undefined> = {};
  for (const [name, definition] of Object.entries(components)) {
    if (definition && typeof definition === 'object' && '$ref' in definition) {
      result[name] = undefined;
      continue;
    }
    result[name] = definition;
  }
  return result;
}

function collectResponses(
  opId: string,
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options',
  responses: ResponsesObject | undefined,
  out: ResponseMapEntry[],
  emptyBodyStatuses: Set<string>,
  inlineCounts: Map<string, number>,
  schemaComponents: Record<string, SchemaObject | undefined>,
): void {
  if (!responses) {
    return;
  }
  for (const [status, response] of Object.entries(responses)) {
    if (!isResponseObject(response)) {
      continue;
    }
    const info = getJsonResponseInfo(response, opId, status, schemaComponents);
    if (info) {
      let componentName = info.name;
      let zodIdentifier: string | undefined;
      if (info.source === 'inline') {
        const baseName = sanitizeIdentifier(`${opId}_${status}`);
        const seen = inlineCounts.get(baseName) ?? 0;
        inlineCounts.set(baseName, seen + 1);
        componentName = seen === 0 ? baseName : `${baseName}_${seen}`;
        zodIdentifier = componentName;
      }
      out.push({
        operationId: opId,
        status,
        componentName,
        zodIdentifier,
        jsonSchema: cloneSchema(info.schema),
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
  components: Record<string, SchemaObject | undefined>,
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
      components,
    );
  }
}

function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
