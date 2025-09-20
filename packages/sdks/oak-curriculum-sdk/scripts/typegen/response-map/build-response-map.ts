import type { OpenAPI3, OperationObject, ResponseObject } from 'openapi-typescript';
import { typeSafeKeys, isPlainObject, getOwnValue } from '../../../src/types/helpers.js';

export interface ResponseMapEntry {
  readonly operationId: string;
  readonly status: string;
  readonly componentName: string;
  readonly path?: string;
  readonly method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';
}

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'responses' in value;
}

function isResponseObject(value: unknown): value is ResponseObject {
  if (typeof value !== 'object' || value === null) {
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

function getJsonComponentName(resp: ResponseObject): string | undefined {
  const json = resp.content?.['application/json'];
  if (!isPlainObject(json)) {
    return undefined;
  }
  const schemaObj: unknown = getOwnValue(json, 'schema');
  if (!isPlainObject(schemaObj)) {
    return undefined;
  }
  const refVal = getOwnValue(schemaObj, '$ref');
  if (typeof refVal !== 'string') {
    return undefined;
  }
  return extractComponentNameFromRef(refVal);
}

export function buildResponseMapData(schema: OpenAPI3): readonly ResponseMapEntry[] {
  const out: ResponseMapEntry[] = [];
  const paths = schema.paths ?? {};
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;
  const emptyBodyStatuses = new Set(['204', '304']);

  for (const pathKey of typeSafeKeys(paths)) {
    const pathItem = getOwnValue(paths, pathKey);
    collectFromPathItem(pathKey, pathItem, methods, out, emptyBodyStatuses);
  }

  // Emit wildcard entries for error statuses when a single schema is used across all operations
  const byStatus = new Map<string, Set<string>>();
  for (const entry of out) {
    if (entry.componentName === '__VOID__') {
      continue;
    }
    const set = byStatus.get(entry.status) ?? new Set<string>();
    set.add(entry.componentName);
    byStatus.set(entry.status, set);
  }
  for (const [status, components] of byStatus) {
    if (components.size === 1) {
      const [componentName] = components;
      out.push({ operationId: '*', status, componentName });
    }
  }

  return out;
}

function ownStringKeys(o: unknown): string[] {
  if (!isPlainObject(o)) {
    return [];
  }
  return typeSafeKeys(o);
}

function collectResponses(
  opId: string,
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options',
  responsesUnknown: unknown,
  out: ResponseMapEntry[],
  emptyBodyStatuses: Set<string>,
): void {
  if (!isPlainObject(responsesUnknown)) {
    return;
  }
  for (const status of ownStringKeys(responsesUnknown)) {
    const respUnknown = getOwnValue(responsesUnknown, status);
    if (!isResponseObject(respUnknown)) {
      continue;
    }
    const name = getJsonComponentName(respUnknown);
    if (name) {
      out.push({ operationId: opId, status, componentName: name, path, method });
      continue;
    }
    // If there is no JSON schema and status implies no content, emit a void entry
    if (emptyBodyStatuses.has(status)) {
      out.push({ operationId: opId, status, componentName: '__VOID__', path, method });
    }
  }
}

function collectFromPathItem(
  pathKey: string,
  pathItem: unknown,
  methods: readonly ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
  out: ResponseMapEntry[],
  emptyBodyStatuses: Set<string>,
): void {
  if (!isPlainObject(pathItem)) {
    return;
  }
  for (const method of methods) {
    const opUnknown = getOwnValue(pathItem, method);
    if (!isOperationObject(opUnknown)) {
      continue;
    }
    const opId = getOwnValue(opUnknown, 'operationId');
    if (typeof opId !== 'string') {
      continue;
    }
    collectResponses(
      opId,
      pathKey,
      method,
      getOwnValue(opUnknown, 'responses'),
      out,
      emptyBodyStatuses,
    );
  }
}
