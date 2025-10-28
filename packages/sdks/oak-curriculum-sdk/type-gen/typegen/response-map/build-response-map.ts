import type {
  OpenAPIObject,
  OperationObject,
  PathItemObject,
  ResponsesObject,
  SchemaObject,
} from 'openapi3-ts/oas31';
import {
  isResponseObject,
  sanitizeIdentifier,
  toColonPath,
  createComponentResolver,
  getJsonResponseInfo,
  cloneSchema,
} from './shared.js';

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
