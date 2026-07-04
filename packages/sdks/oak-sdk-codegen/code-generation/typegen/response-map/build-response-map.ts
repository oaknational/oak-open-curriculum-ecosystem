/**
 * Response-map builder for the codegen pipeline.
 *
 * Walks the OpenAPI schema and produces a flat array of {@link ResponseMapEntry}
 * records — one per operation/status combination plus wildcard entries for
 * shared error schemas. Downstream consumers:
 *
 * - **Emitter** (`emit-response-validators.ts`): generates Zod-based
 *   response validators from the entries. Uses `getWildcardRecord()` for
 *   shared error schemas.
 * - **Descriptor helpers** (`build-response-descriptor-helpers.ts`): merges
 *   wildcard entries as a base layer under each operation descriptor.
 * - **Cross-validator** (`cross-validate.ts`): validates that the response
 *   map is consistent with the schema — mirrors the wildcard consolidation
 *   logic to produce matching expected keys.
 *
 * ### Wildcard consolidation
 *
 * When every operation references the same single `$ref` component for a
 * given status code (e.g. all 26 endpoints share `error.BAD_REQUEST` for
 * 400), the builder emits an additional wildcard entry (`operationId: '*'`).
 * This avoids N duplicate entries in the generated validator map. The
 * emitter and descriptor helpers already handle wildcards; the
 * cross-validator was updated to mirror this logic (see ADR-065 item 6).
 *
 * ### Component name sanitisation
 *
 * Component names from `$ref` (e.g. `error.BAD_REQUEST`) are sanitised via
 * {@link sanitizeIdentifier} to match the keys in the generated Zod schema
 * registry (e.g. `error_BAD_REQUEST`). Sanitisation happens at the entry
 * point in {@link collectResponses} to ensure all downstream consumers
 * receive consistent identifiers.
 */

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
  type ResponseInfo,
} from './shared.js';
import { createWildcardResponseMapEntries } from './build-response-map-wildcards.js';
import type { ResponseMapEntry, ResponseMapMethod } from './response-map-entry.js';

export type { ResponseMapEntry } from './response-map-entry.js';

function isOperationObject(value: unknown): value is OperationObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return 'responses' in value;
}

interface CollectContext {
  readonly out: ResponseMapEntry[];
  readonly emptyBodyStatuses: Set<string>;
  readonly inlineCounts: Map<string, number>;
  readonly resolveComponent: (name: string) => SchemaObject | undefined;
  readonly componentSchemas: Map<string, SchemaObject>;
}

export function buildResponseMapData(schema: OpenAPIObject): readonly ResponseMapEntry[] {
  const out: ResponseMapEntry[] = [];
  const resolver = createComponentResolver(schema.components?.schemas ?? {});
  const paths = schema.paths ?? {};
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;
  const ctx: CollectContext = {
    out,
    emptyBodyStatuses: new Set(['204', '304']),
    inlineCounts: new Map<string, number>(),
    resolveComponent: resolver.resolve,
    componentSchemas: new Map<string, SchemaObject>(),
  };

  for (const pathKey in paths) {
    if (!Object.hasOwn(paths, pathKey)) {
      continue;
    }
    const pathItem = paths[pathKey];
    collectFromPathItem(pathKey, pathItem, methods, ctx);
  }

  out.push(...createWildcardResponseMapEntries(out, ctx.componentSchemas));

  return out;
}

function collectResponses(
  opId: string,
  path: string,
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options',
  responses: ResponsesObject | undefined,
  ctx: CollectContext,
): void {
  if (!responses) {
    return;
  }
  for (const [status, response] of Object.entries(responses)) {
    if (!isResponseObject(response)) {
      continue;
    }
    const info = getJsonResponseInfo(response, opId, status, ctx.resolveComponent);
    if (info) {
      ctx.out.push(
        createJsonResponseEntry({
          info,
          opId,
          status,
          path,
          method,
          inlineCounts: ctx.inlineCounts,
          componentSchemas: ctx.componentSchemas,
        }),
      );
      continue;
    }
    // If there is no JSON schema and status implies no content, emit a void entry
    if (ctx.emptyBodyStatuses.has(status)) {
      ctx.out.push({
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

function createJsonResponseEntry({
  info,
  opId,
  status,
  path,
  method,
  inlineCounts,
  componentSchemas,
}: {
  readonly info: ResponseInfo;
  readonly opId: string;
  readonly status: string;
  readonly path: string;
  readonly method: Exclude<ResponseMapMethod, '*'>;
  readonly inlineCounts: Map<string, number>;
  readonly componentSchemas: Map<string, SchemaObject>;
}): ResponseMapEntry {
  let componentName = info.source === 'component' ? sanitizeIdentifier(info.name) : info.name;
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
  return {
    operationId: opId,
    status,
    componentName,
    zodIdentifier,
    jsonSchema,
    path,
    colonPath: toColonPath(path),
    method,
    source: info.source,
  };
}

function collectFromPathItem(
  pathKey: string,
  pathItem: PathItemObject | undefined,
  methods: readonly ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
  ctx: CollectContext,
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
    collectResponses(opId, pathKey, method, operation.responses, ctx);
  }
}

function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
