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

/** The HTTP methods a path item may carry operations under. */
const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;

/** Status codes whose responses carry no body. */
const EMPTY_BODY_STATUSES: ReadonlySet<string> = new Set(['204', '304']);

/**
 * The state one walk of the schema accumulates and shares across every
 * operation it visits.
 */
interface ResponseCollection {
  /** The entries collected so far, in schema order. */
  readonly out: ResponseMapEntry[];
  /** How many inline schemas each `operationId_status` base name has taken. */
  readonly inlineCounts: Map<string, number>;
  /** Resolves a component schema by its sanitised name. */
  readonly resolveComponent: (name: string) => SchemaObject | undefined;
  /** Every component schema the entries refer to, for the wildcard pass. */
  readonly componentSchemas: Map<string, SchemaObject>;
}

export function buildResponseMapData(schema: OpenAPIObject): readonly ResponseMapEntry[] {
  const resolver = createComponentResolver(schema.components?.schemas ?? {});
  const collection: ResponseCollection = {
    out: [],
    inlineCounts: new Map<string, number>(),
    resolveComponent: resolver.resolve,
    componentSchemas: new Map<string, SchemaObject>(),
  };
  const paths = schema.paths ?? {};

  for (const pathKey in paths) {
    if (!Object.hasOwn(paths, pathKey)) {
      continue;
    }
    collectFromPathItem(pathKey, paths[pathKey], collection);
  }

  collection.out.push(
    ...createWildcardResponseMapEntries(collection.out, collection.componentSchemas),
  );

  return collection.out;
}

function collectResponses(
  opId: string,
  path: string,
  method: Exclude<ResponseMapMethod, '*'>,
  responses: ResponsesObject | undefined,
  collection: ResponseCollection,
): void {
  if (!responses) {
    return;
  }
  const { out, inlineCounts, resolveComponent, componentSchemas } = collection;
  for (const [status, response] of Object.entries(responses)) {
    if (!isResponseObject(response)) {
      continue;
    }
    const info = getJsonResponseInfo(response, opId, status, resolveComponent);
    if (info) {
      out.push(
        createJsonResponseEntry({
          info,
          opId,
          status,
          path,
          method,
          inlineCounts,
          componentSchemas,
        }),
      );
      continue;
    }
    // If there is no JSON schema and status implies no content, emit a void entry
    if (EMPTY_BODY_STATUSES.has(status)) {
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
  collection: ResponseCollection,
): void {
  if (!isPathItemObject(pathItem)) {
    return;
  }

  for (const method of METHODS) {
    const operation = pathItem[method];
    if (!isOperationObject(operation)) {
      continue;
    }
    const opId = operation.operationId;
    if (typeof opId !== 'string') {
      continue;
    }
    collectResponses(opId, pathKey, method, operation.responses, collection);
  }
}

function isPathItemObject(value: unknown): value is PathItemObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
