import type { OpenAPIObject, OperationObject } from 'openapi3-ts/oas31';
import type { ResponseMapEntry } from '../response-map/build-response-map.js';

const ALLOWED_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;

function toColon(path: string): string {
  return path.replace(/{([^}]+)}/g, ':$1');
}

function toCurly(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function validatePathTransform(p: string): void {
  const colon = toColon(p);
  const curly = toCurly(colon);
  if (curly !== p) {
    throw new Error(
      `Path normalisation mismatch: original="${p}" colon="${colon}" backToCurly="${curly}"`,
    );
  }
}

function isAllowedMethodKey(k: string): boolean {
  for (const m of ALLOWED_METHODS) {
    if (m === k) {
      return true;
    }
  }
  return false;
}

function validatePathMethods(p: string, pathItem: unknown): void {
  if (!isPathItemObject(pathItem)) {
    return;
  }
  for (const key of Object.keys(pathItem)) {
    if (isAllowedMethodKey(key)) {
      continue;
    }
    if (key === 'parameters' || key === 'summary' || key === 'description' || key === 'servers') {
      continue;
    }
    throw new Error(`Unknown HTTP method key on path ${p}: ${key}`);
  }
}

export function crossValidatePaths(schema: OpenAPIObject): void {
  const paths = schema.paths ?? {};
  for (const [path, pathItem] of Object.entries(paths)) {
    validatePathTransform(path);
    validatePathMethods(path, pathItem);
  }
}

export function crossValidateResponseMap(
  schema: OpenAPIObject,
  entries: readonly ResponseMapEntry[],
): void {
  const validated = schema;
  const expected = collectExpectedResponseKeys(validated);
  const actual = new Set<string>(entries.map((e) => `${e.operationId}:${e.status}`));
  reportDiffIfAny(expected, actual);
}

export function runAllCrossValidations(
  schema: OpenAPIObject,
  responseEntries: readonly ResponseMapEntry[],
): void {
  crossValidatePaths(schema);
  crossValidateResponseMap(schema, responseEntries);
}

// getOwnValue imported

function collectExpectedResponseKeys(schema: OpenAPIObject): Set<string> {
  const out = new Set<string>();
  const paths = schema.paths ?? {};
  for (const [, pathItem] of Object.entries(paths)) {
    if (!isPathItemObject(pathItem)) {
      continue;
    }
    for (const method of ALLOWED_METHODS) {
      const candidate = pathItem[method];
      if (!isOperationObject(candidate)) {
        continue;
      }
      addExpectedFromOperation(candidate, out);
    }
  }
  return out;
}

function computeMissing(expected: Set<string>, actual: Set<string>): string[] {
  const missing: string[] = [];
  for (const key of expected) {
    if (!actual.has(key)) {
      missing.push(key);
    }
  }
  return missing.sort();
}

function computeExtra(expected: Set<string>, actual: Set<string>): string[] {
  const extra: string[] = [];
  for (const key of actual) {
    if (!expected.has(key)) {
      extra.push(key);
    }
  }
  return extra;
}

function reportDiffIfAny(expected: Set<string>, actual: Set<string>): void {
  const missing = computeMissing(expected, actual);
  const extra = computeExtra(expected, actual);
  if (missing.length === 0 && extra.length === 0) {
    return;
  }
  const lines: string[] = ['Response map cross‑validation failed.'];
  if (missing.length > 0) {
    lines.push(`Missing (${String(missing.length)}): ${missing.slice(0, 10).join(', ')}`);
  }
  if (extra.length > 0) {
    lines.push(`Extra   (${String(extra.length)}): ${extra.slice(0, 10).join(', ')}`);
  }
  throw new Error(lines.join('\n'));
}

function addExpectedFromOperation(op: OperationObject, out: Set<string>): void {
  if (!op.operationId) {
    return;
  }
  const responses = op.responses ?? {};
  for (const [status, resp] of Object.entries(responses)) {
    if (hasJsonSchema(resp)) {
      out.add(`${op.operationId}:${status}`);
    }
  }
}

function hasJsonSchema(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const content = 'content' in value ? value.content : undefined;
  if (typeof content !== 'object' || content === null || Array.isArray(content)) {
    return false;
  }
  const json = 'application/json' in content ? content['application/json'] : undefined;
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return false;
  }
  if (!('schema' in json)) {
    return false;
  }
  const schema = json.schema;
  if (typeof schema !== 'object' || schema === null || Array.isArray(schema)) {
    return false;
  }
  return true;
}

function isSchemaObject(value: unknown): value is { readonly $ref?: string } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if ('$ref' in value && typeof value.$ref !== 'string') {
    return false;
  }
  return true;
}

function isPathItemObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  if ('operationId' in value && typeof value.operationId !== 'string') {
    return false;
  }
  if ('parameters' in value && !Array.isArray(value.parameters)) {
    return false;
  }
  return 'responses' in value && typeof value.responses === 'object' && value.responses !== null;
}
