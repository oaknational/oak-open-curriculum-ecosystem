import type { OpenAPI3, OperationObject, ResponseObject } from 'openapi-typescript';
import { typeSafeKeys, isPlainObject, getOwnValue } from '../../../src/types/helpers.js';

export interface ResponseMapEntry {
  readonly operationId: string;
  readonly status: string;
  readonly componentName: string;
}

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null) return false;
  return 'responses' in value;
}

function isResponseObject(value: unknown): value is ResponseObject {
  if (typeof value !== 'object' || value === null) return false;
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
  if (!isPlainObject(json)) return undefined;
  const schemaObj: unknown = getOwnValue(json, 'schema');
  if (!isPlainObject(schemaObj)) return undefined;
  const refVal = getOwnValue(schemaObj, '$ref');
  if (typeof refVal !== 'string') return undefined;
  return extractComponentNameFromRef(refVal);
}

export function buildResponseMapData(schema: OpenAPI3): readonly ResponseMapEntry[] {
  const out: ResponseMapEntry[] = [];
  const paths = schema.paths ?? {};
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;

  for (const pathKey of typeSafeKeys(paths)) {
    const pathItem = getOwnValue(paths, pathKey);
    collectFromPathItem(pathItem, methods, out);
  }
  return out;
}

function ownStringKeys(o: unknown): string[] {
  if (!isPlainObject(o)) return [];
  return typeSafeKeys(o);
}

function collectResponses(opId: string, responsesUnknown: unknown, out: ResponseMapEntry[]): void {
  if (!isPlainObject(responsesUnknown)) return;
  for (const status of ownStringKeys(responsesUnknown)) {
    const respUnknown = getOwnValue(responsesUnknown, status);
    if (!isResponseObject(respUnknown)) continue;
    const name = getJsonComponentName(respUnknown);
    if (!name) continue;
    out.push({ operationId: opId, status, componentName: name });
  }
}

function collectFromPathItem(
  pathItem: unknown,
  methods: readonly ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
  out: ResponseMapEntry[],
): void {
  if (!isPlainObject(pathItem)) return;
  for (const method of methods) {
    const opUnknown = getOwnValue(pathItem, method);
    if (!isOperationObject(opUnknown)) continue;
    const opId = getOwnValue(opUnknown, 'operationId');
    if (typeof opId !== 'string') continue;
    collectResponses(opId, getOwnValue(opUnknown, 'responses'), out);
  }
}
