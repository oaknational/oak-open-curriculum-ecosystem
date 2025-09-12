import type { OpenAPI3 } from 'openapi-typescript';
import type { ResponseMapEntry } from '../response-map/build-response-map.js';
import { typeSafeKeys, isPlainObject, getOwnValue } from '../../../src/types/helpers.js';

const ALLOWED_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;

function isObject(value: unknown): value is object {
  return isPlainObject(value);
}

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
  for (const m of ALLOWED_METHODS) if (m === k) return true;
  return false;
}

function validatePathMethods(p: string, pathItem: unknown): void {
  if (!isObject(pathItem)) return;
  for (const k of typeSafeKeys(pathItem)) {
    if (isAllowedMethodKey(k)) continue;
    if (k === 'parameters' || k === 'summary' || k === 'description' || k === 'servers') continue;
    throw new Error(`Unknown HTTP method key on path ${p}: ${String(k)}`);
  }
}

export function crossValidatePaths(schema: OpenAPI3): void {
  const paths = schema.paths ?? {};
  for (const p of typeSafeKeys(paths)) {
    validatePathTransform(p);
    const pathItem = getOwnValue(paths, p);
    validatePathMethods(p, pathItem);
  }
}

export function crossValidateResponseMap(
  schema: OpenAPI3,
  entries: readonly ResponseMapEntry[],
): void {
  const expected = collectExpectedResponseKeys(schema);
  const actual = new Set<string>(entries.map((e) => `${e.operationId}:${e.status}`));
  reportDiffIfAny(expected, actual);
}

export function runAllCrossValidations(
  schema: OpenAPI3,
  responseEntries: readonly ResponseMapEntry[],
): void {
  crossValidatePaths(schema);
  crossValidateResponseMap(schema, responseEntries);
}

// getOwnValue imported

function collectExpectedResponseKeys(schema: OpenAPI3): Set<string> {
  const out = new Set<string>();
  const paths = schema.paths ?? {};
  for (const p of typeSafeKeys(paths)) {
    const pathItem = getOwnValue(paths, p);
    if (!isObject(pathItem)) continue;
    for (const m of ALLOWED_METHODS) {
      const opUnknown = getOwnValue(pathItem, m);
      if (!isObject(opUnknown)) continue;
      addExpectedFromOperation(opUnknown, out);
    }
  }
  return out;
}

function computeMissing(expected: Set<string>, actual: Set<string>): string[] {
  const missing: string[] = [];
  for (const key of expected) if (!actual.has(key)) missing.push(key);
  return missing;
}

function computeExtra(expected: Set<string>, actual: Set<string>): string[] {
  const extra: string[] = [];
  for (const key of actual) if (!expected.has(key)) extra.push(key);
  return extra;
}

function reportDiffIfAny(expected: Set<string>, actual: Set<string>): void {
  const missing = computeMissing(expected, actual);
  const extra = computeExtra(expected, actual);
  if (missing.length === 0 && extra.length === 0) return;
  const lines: string[] = ['Response map cross‑validation failed.'];
  if (missing.length > 0) {
    lines.push(`Missing (${String(missing.length)}): ${missing.slice(0, 10).join(', ')}`);
  }
  if (extra.length > 0) {
    lines.push(`Extra   (${String(extra.length)}): ${extra.slice(0, 10).join(', ')}`);
  }
  throw new Error(lines.join('\n'));
}

function addExpectedFromOperation(op: unknown, out: Set<string>): void {
  const opIdVal = getOwnValue(op, 'operationId');
  if (typeof opIdVal !== 'string') return;
  const responses = getOwnValue(op, 'responses');
  if (!isObject(responses)) return;
  for (const status of typeSafeKeys(responses)) {
    const resp = getOwnValue(responses, status);
    if (hasJsonRef(resp)) out.add(`${opIdVal}:${String(status)}`);
  }
}

function hasJsonRef(value: unknown): boolean {
  if (!isObject(value)) return false;
  const content = getOwnValue(value, 'content');
  if (!isObject(content)) return false;
  const json = getOwnValue(content, 'application/json');
  if (!isObject(json)) return false;
  const sObj = getOwnValue(json, 'schema');
  if (!isObject(sObj)) return false;
  const ref = getOwnValue(sObj, '$ref');
  return typeof ref === 'string';
}
