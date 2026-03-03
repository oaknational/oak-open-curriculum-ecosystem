/* eslint-disable max-lines -- This is a generator script that produces code, not production code */
import path from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import type { OpenAPIObject, ResponsesObject } from 'openapi3-ts/oas31';
import type { Logger } from '@oaknational/logger';
import { generateZodSchemasFromOpenAPI } from './adapter/index.js';
import { ensurePathsOnSchema } from './codegen-core-helpers.js';

export interface ZodgenIO {
  readonly existsSync: (path: string) => boolean;
  readonly mkdirSync: (path: string, options: { readonly recursive: boolean }) => void;
  readonly writeFileSync: (path: string, data: string) => void;
  readonly generateZodSchemasFromOpenAPI: (opts: {
    readonly openApiDoc: OpenAPIObject;
    readonly distPath: string;
  }) => Promise<{ readonly output: string }>;
}

const defaultIO: ZodgenIO = {
  existsSync,
  mkdirSync,
  writeFileSync,
  generateZodSchemasFromOpenAPI,
};

/**
 * Generates Zod endpoint definitions with parameter schemas from an OpenAPI document.
 * Uses the default template to generate complete endpoint definitions including request parameters.
 *
 * All generated code uses Zod v4 via the adapter boundary.
 *
 * @param openApiDoc - The OpenAPI document to generate from
 * @param outDir - The output directory for generated files
 * @param io - Injectable IO dependencies (for testing)
 * @throws TypeError - If the OpenAPI document is invalid
 */
export async function generateZodSchemas(
  openApiDoc: OpenAPIObject,
  outDir: string,
  logger: Logger,
  io: ZodgenIO = defaultIO,
): Promise<void> {
  if (!io.existsSync(outDir)) {
    io.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'curriculumZodSchemas.ts');

  const openApiDocWithPaths = ensurePathsOnSchema(openApiDoc);

  const methodAndPathToOperationId = new Map<string, string>();
  const primaryStatusByOperationId = new Map<string, string>();

  // openapi3-ts exposes path entries via loose index signatures; inspect dynamically with runtime guards.
  const pathEntries = Object.entries(openApiDocWithPaths.paths);
  interface OperationLike {
    operationId?: unknown;

    responses?: ResponsesObject;
  }
  function isOperationLike(value: unknown): value is OperationLike {
    return (
      typeof value === 'object' && value !== null && 'operationId' in value && 'responses' in value
    );
  }
  for (const [rawPath, pathItem] of pathEntries) {
    if (!pathItem) {
      continue;
    }
    const operationEntries = Object.entries(pathItem);
    for (const [method, operation] of operationEntries) {
      if (!operation || typeof operation !== 'object') {
        continue;
      }
      if (!isOperationLike(operation)) {
        throw new TypeError(`Invalid operation: ${JSON.stringify(operation)}`);
      }
      const operationCandidate = operation;
      if (typeof operationCandidate.operationId !== 'string') {
        continue;
      }
      const sanitisedPath = rawPath.replace(/\{([^}]+)\}/g, ':$1');
      const methodKey = method.toLowerCase();
      methodAndPathToOperationId.set(
        `${methodKey} ${sanitisedPath}`,
        operationCandidate.operationId,
      );

      const responsesCandidate = operationCandidate.responses;
      const statusKeys = responsesCandidate ? Object.keys(responsesCandidate) : [];
      const primaryStatus = statusKeys.find((status) => status.startsWith('2')) ?? statusKeys[0];
      if (primaryStatus) {
        primaryStatusByOperationId.set(operationCandidate.operationId, primaryStatus);
      }
    }
  }

  const { output } = await io.generateZodSchemasFromOpenAPI({
    openApiDoc,
    distPath: outFile,
  });
  logger.info('Zod schemas generated');

  const operationIdMapEntries = Array.from(methodAndPathToOperationId.entries())
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n');
  const primaryStatusEntries = Array.from(primaryStatusByOperationId.entries())
    .map(([operationId, status]) => `  ${JSON.stringify(operationId)}: ${JSON.stringify(status)},`)
    .join('\n');
  const operationIdMapCode = [
    'const OPERATION_ID_BY_METHOD_AND_PATH = {',
    operationIdMapEntries,
    '} as const;',
  ].join('\n');
  const primaryStatusMapCode = [
    'const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = {',
    primaryStatusEntries,
    '} as const;',
  ].join('\n');
  const operationLookupHelpers = [
    'function isOperationKey(key: string): key is keyof typeof OPERATION_ID_BY_METHOD_AND_PATH {',
    '  return key in OPERATION_ID_BY_METHOD_AND_PATH;',
    '}',
    '',
    'function isPrimaryStatusKey(key: string): key is keyof typeof PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID {',
    '  return key in PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID;',
    '}',
    '',
    'function getOperationIdForEndpoint(method: string, path: string): string | undefined {',
    '  const key = `${method.toLowerCase()} ${path}`;',
    '  if (!isOperationKey(key)) {',
    '    return undefined;',
    '  }',
    '  return OPERATION_ID_BY_METHOD_AND_PATH[key];',
    '}',
    '',
    'function getPrimaryStatusForOperation(operationId: string): string | undefined {',
    '  if (!isPrimaryStatusKey(operationId)) {',
    '    return undefined;',
    '  }',
    '  return PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID[operationId];',
    '}',
  ].join('\n');
  const sanitizeFunctionCode = [
    'function sanitizeSchemaKeys(',
    '  schemas: CurriculumSchemaCollection,',
    '  options?: { readonly rename?: (original: string) => string },',
    '): CurriculumSchemaCollection {',
    '  const rename = options?.rename ?? ((value: string) => value.replace(/[^A-Za-z0-9_]/g, "_"));',
    '  const result: Record<string, z.ZodType> = {};',
    '  for (const [key, value] of Object.entries(schemas)) {',
    '    const sanitized = rename(key);',
    '    result[sanitized] = value;',
    '  }',
    '  return result;',
    '}',
  ].join('\n');
  // NOTE: The adapter has already transformed the openapi-zod-client output to Zod v4 compatible code
  const endpointTypeCode = [
    '/** Endpoint interface for OpenAPI-derived endpoints */',
    'interface Endpoint {',
    '  readonly method: string;',
    '  readonly path: string;',
    '  readonly description?: string;',
    '  readonly requestFormat?: string;',
    '  readonly response: z.ZodType;',
    '  readonly errors?: readonly { readonly status: string | number; readonly description?: string; readonly schema: z.ZodType }[];',
    '  readonly parameters?: readonly { readonly name: string; readonly type: string; readonly schema: z.ZodType }[];',
    '}',
  ].join('\n');
  const helpersBlock = [
    'import { z } from "zod";',
    '',
    endpointTypeCode,
    '',
    operationIdMapCode,
    primaryStatusMapCode,
    '',
    operationLookupHelpers,
    '',
    sanitizeFunctionCode,
    '',
  ].join('\n');
  const buildCurriculumSchemasCode = [
    'function buildCurriculumSchemas(endpoints: readonly Endpoint[]): CurriculumSchemaCollection {',
    '  const baseSchemas = sanitizeSchemaKeys(rawCurriculumSchemas, { rename: renameInlineSchema });',
    '  const statusSchemas: CurriculumSchemaCollection = {};',
    '  for (const endpoint of endpoints) {',
    '    const operationId = getOperationIdForEndpoint(endpoint.method, endpoint.path);',
    '    if (!operationId) {',
    '      continue;',
    '    }',
    '    const primaryStatus = getPrimaryStatusForOperation(operationId);',
    '    if (primaryStatus) {',
    '      const primaryKey = renameInlineSchema(`${operationId}_${primaryStatus}`);',
    '      statusSchemas[primaryKey] = endpoint.response;',
    '    }',
    '    const errors = endpoint.errors ?? [];',
    '    for (const error of errors) {',
    '      const statusValue = error.status === "default" ? "default" : String(error.status);',
    '      const errorKey = renameInlineSchema(`${operationId}_${statusValue}`);',
    '      statusSchemas[errorKey] = error.schema;',
    '    }',
    '  }',
    '  const changelogEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog");',
    '  const latestEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog/latest");',
    '  const additionalSchemas: CurriculumSchemaCollection = {};',
    '  if (changelogEndpoint) {',
    '    additionalSchemas.changelog_changelog_200 = changelogEndpoint.response;',
    '  }',
    '  if (latestEndpoint) {',
    '    additionalSchemas.changelog_latest_200 = latestEndpoint.response;',
    '  }',
    '  return {',
    '    ...baseSchemas,',
    '    ...statusSchemas,',
    '    ...additionalSchemas,',
    '  };',
    '}',
  ].join('\n');

  // Modify the generated file to export the schemas
  // The adapter has already converted code to Zod v4 compatible and removed makeApi
  logger.info('Modifying file to export the endpoints');
  // The adapter converts "const endpoints = makeApi([" to "const endpoints = (["
  const withExportedEndpoints = output.replace(
    /const endpoints = \(/g,
    'export const endpoints: readonly Endpoint[] = (',
  );

  const schemasPattern = /export const schemas = {[\s\S]*?};/;
  const modifiedContent = withExportedEndpoints.replace(schemasPattern, (substring) => {
    const body = substring.replace('export const schemas = ', '').replace(';', '');
    return [
      'export type CurriculumSchemaCollection = Record<string, z.ZodType>;',
      'const renameInlineSchema = (original: string) => {\n  if (original === "changelog_changelog_200") {\n    return "ChangelogResponseSchema";\n  }\n  if (original === "changelog_latest_200") {\n    return "ChangelogLatestResponseSchema";\n  }\n  return original.replace(/[^A-Za-z0-9_]/g, "_");\n};',
      'export const rawCurriculumSchemas = ' +
        body +
        ' as const satisfies CurriculumSchemaCollection;',
      buildCurriculumSchemasCode,
    ].join('\n\n');
  });

  const buildFunctionPattern =
    /function buildCurriculumSchemas\(endpoints: ReturnType<typeof makeApi>\): CurriculumSchemaCollection {\n[\s\S]*?\n}/;
  const withUpdatedBuilder = modifiedContent.replace(
    buildFunctionPattern,
    buildCurriculumSchemasCode,
  );

  const schemaMetadata = `const curriculumSchemaCollection = buildCurriculumSchemas(endpoints);
const curriculumSchemaNames = Object.keys(curriculumSchemaCollection);
const curriculumSchemaValues: readonly z.ZodType[] = Object.values(curriculumSchemaCollection);

export const curriculumSchemas = curriculumSchemaCollection;

/**
 * Registry map keyed by generated curriculum schema names.
 * @public
 */
export type CurriculumSchemaRegistry = typeof curriculumSchemas;

/**
 * Valid curriculum schema names derived from the OpenAPI specification.
 * @public
 */
export type CurriculumSchemaName = keyof CurriculumSchemaRegistry;

/**
 * Concrete Zod schema definition for a curriculum schema name.
 * @public
 */
export type CurriculumSchemaDefinition<Name extends CurriculumSchemaName = CurriculumSchemaName> = CurriculumSchemaRegistry[Name];

export function isCurriculumSchemaName(value: unknown): value is CurriculumSchemaName {
  return typeof value === 'string' && curriculumSchemaNames.includes(value);
}

export function isCurriculumSchema(value: unknown): value is CurriculumSchemaDefinition {
  if (!(value instanceof z.ZodType)) {
    return false;
  }
  return curriculumSchemaValues.includes(value);
}`;

  // The adapter may have already removed client exports, so check both cases
  let withCurriculumSchemas: string;
  if (withUpdatedBuilder.includes('export const api = new Zodios(endpoints);')) {
    // Client export still exists - replace it with schema metadata
    withCurriculumSchemas = withUpdatedBuilder.replace(
      'export const api = new Zodios(endpoints);',
      `${schemaMetadata}\n`,
    );
  } else {
    // Client export already removed by adapter - append schema metadata at end
    withCurriculumSchemas = withUpdatedBuilder.trimEnd() + '\n\n' + schemaMetadata + '\n';
  }

  const sanitizedContent = withCurriculumSchemas.replace(
    /import { z } from ["']zod["'];/,
    helpersBlock,
  );

  logger.info('Writing to file', { path: outFile });

  io.writeFileSync(outFile, sanitizedContent);
}
