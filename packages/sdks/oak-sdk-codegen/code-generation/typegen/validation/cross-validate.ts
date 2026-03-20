import type {
  OpenAPIObject,
  OperationObject,
  PathItemObject,
  ResponseObject,
  SchemaObject,
  ReferenceObject,
} from 'openapi3-ts/oas31';
import type { ResponseMapEntry } from '../response-map/build-response-map.js';
import {
  isResponseObject,
  isReferenceObject,
  extractComponentNameFromRef,
} from '../response-map/shared.js';

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

/**
 * Validates that a path item only contains recognised HTTP method keys
 * and standard OpenAPI path-item properties.
 */
function validatePathMethods(p: string, pathItem: PathItemObject): void {
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
  const expected = collectExpectedResponseKeys(schema);
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

/**
 * Walks the schema and collects `{operationId}:{status}` keys for every
 * operation response that has a JSON schema. Also detects shared-component
 * wildcards to mirror the response-map builder's consolidation logic.
 */
function collectExpectedResponseKeys(schema: OpenAPIObject): Set<string> {
  const out = new Set<string>();
  const componentsByStatus = new Map<string, Set<string>>();
  const paths = schema.paths ?? {};
  const componentSchemas: Record<string, SchemaObject | ReferenceObject | undefined> =
    schema.components?.schemas ?? {};
  for (const [, pathItem] of Object.entries(paths)) {
    for (const method of ALLOWED_METHODS) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }
      addExpectedFromOperation(operation, out);
      collectComponentRefsByStatus(operation, componentsByStatus);
    }
  }
  addWildcardKeysForSharedComponents(componentsByStatus, componentSchemas, out);
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

/**
 * Adds `{operationId}:{status}` to the expected set for every response
 * with a JSON schema. The `Object.entries` on `ResponsesObject` can yield
 * `unknown` values due to `IExtensionType`, so we guard once with
 * `isResponseObject` at this boundary.
 */
function addExpectedFromOperation(op: OperationObject, out: Set<string>): void {
  if (!op.operationId) {
    return;
  }
  const responses = op.responses ?? {};
  for (const [status, resp] of Object.entries(responses)) {
    if (isResponseObject(resp) && responseHasJsonSchema(resp)) {
      out.add(`${op.operationId}:${status}`);
    }
  }
}

/**
 * Checks whether a validated `ResponseObject` contains a JSON schema.
 * Works with narrow types — no defensive narrowing from `unknown`.
 */
function responseHasJsonSchema(resp: ResponseObject): boolean {
  const json = resp.content?.['application/json'];
  if (!json) {
    return false;
  }
  const schema = json.schema;
  return schema !== undefined && schema !== null;
}

/**
 * Extracts the `$ref` component name from a response's JSON schema, if it
 * uses a `$ref`. Works with narrow types from the OpenAPI type system.
 */
function extractResponseComponentRef(resp: ResponseObject): string | undefined {
  const json = resp.content?.['application/json'];
  if (!json) {
    return undefined;
  }
  const schema = json.schema;
  if (!schema || !isReferenceObject(schema)) {
    return undefined;
  }
  return extractComponentNameFromRef(schema.$ref);
}

/**
 * For each operation, collects the `$ref` component name by status code.
 * This mirrors the response-map builder's wildcard detection: if every
 * component-sourced entry for a status shares one component name, a wildcard
 * is expected.
 */
function collectComponentRefsByStatus(
  op: OperationObject,
  componentsByStatus: Map<string, Set<string>>,
): void {
  const responses = op.responses ?? {};
  for (const [status, resp] of Object.entries(responses)) {
    if (!isResponseObject(resp)) {
      continue;
    }
    const refName = extractResponseComponentRef(resp);
    if (refName) {
      const set = componentsByStatus.get(status) ?? new Set<string>();
      set.add(refName);
      componentsByStatus.set(status, set);
    }
  }
}

/**
 * Adds `*:{status}` wildcard keys to the expected set for status codes
 * where all operations reference the same single component schema that
 * exists in `components/schemas`. This mirrors the response-map builder's
 * wildcard consolidation logic.
 */
function addWildcardKeysForSharedComponents(
  componentsByStatus: Map<string, Set<string>>,
  componentSchemas: Record<string, SchemaObject | ReferenceObject | undefined>,
  out: Set<string>,
): void {
  for (const [status, componentSet] of componentsByStatus) {
    if (componentSet.size !== 1) {
      continue;
    }
    const [componentName] = componentSet;
    if (componentName && Object.prototype.hasOwnProperty.call(componentSchemas, componentName)) {
      out.add(`*:${status}`);
    }
  }
}
