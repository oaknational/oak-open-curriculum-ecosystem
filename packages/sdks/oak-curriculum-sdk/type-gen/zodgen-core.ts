import path from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';
/**
 * Generates Zod endpoint definitions with parameter schemas from an OpenAPI document.
 * Uses the default template to generate complete endpoint definitions including request parameters.
 * @param rawSchema - The OpenAPI document to generate from (unknown input validated internally)
 * @param outDir - The output directory for generated files
 * @throws {TypeError} If the OpenAPI document is invalid
 */
export async function generateZodSchemas(openApiDoc: OpenAPIObject, outDir: string): Promise<void> {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Resolve ozc built-in default template from node_modules
  const require = createRequire(import.meta.url);
  const ozcPkgDir = path.dirname(require.resolve('openapi-zod-client/package.json'));
  const templatePath = path.join(ozcPkgDir, 'src/templates/default.hbs');
  const outFile = path.join(outDir, 'curriculumZodSchemas.ts');

  const openApiDocWithPaths: Parameters<typeof generateZodClientFromOpenAPI>[0]['openApiDoc'] =
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- JC: openapi-zod-client uses an outdated PathsObject definition, so we have to pretend that paths are no optional
    openApiDoc as OpenAPIObject & { paths: PathsObject };

  const methodAndPathToOperationId = new Map<string, string>();
  const primaryStatusByOperationId = new Map<string, string>();

  // openapi3-ts exposes path entries via loose index signatures; inspect dynamically with runtime guards.
  /* eslint-disable @typescript-eslint/no-restricted-types, @typescript-eslint/no-unsafe-argument, @typescript-eslint/consistent-type-assertions */
  const pathEntries = Object.entries(openApiDocWithPaths.paths);
  interface OperationLike {
    operationId?: unknown;
    responses?: Record<string, unknown>;
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
      const operationCandidate = operation as OperationLike;
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
  /* eslint-enable @typescript-eslint/no-restricted-types, @typescript-eslint/no-unsafe-argument, @typescript-eslint/consistent-type-assertions */

  const output = await generateZodClientFromOpenAPI({
    openApiDoc: openApiDocWithPaths,
    templatePath,
    distPath: outFile,
    // Configure for endpoint generation with parameter schemas
    options: {
      shouldExportAllSchemas: true,
      shouldExportAllTypes: true,
      groupStrategy: 'none',
      withAlias: false,
    },
  });
  console.log('✅ Zod schemas generated');

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
    'function getOperationIdForEndpoint(method: string, path: string): string | undefined {',
    '  const key = `${method.toLowerCase()} ${path}` as keyof typeof OPERATION_ID_BY_METHOD_AND_PATH;',
    '  return OPERATION_ID_BY_METHOD_AND_PATH[key];',
    '}',
    '',
    'function getPrimaryStatusForOperation(operationId: string): string | undefined {',
    '  return PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID[operationId as keyof typeof PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID];',
    '}',
  ].join('\n');
  const sanitizeFunctionCode = [
    'function sanitizeSchemaKeys(',
    '  schemas: CurriculumSchemaCollection,',
    '  options?: { readonly rename?: (original: string) => string },',
    '): CurriculumSchemaCollection {',
    '  const rename = options?.rename ?? ((value: string) => value.replace(/[^A-Za-z0-9_]/g, "_"));',
    '  const result: Record<string, ZodSchema> = {};',
    '  for (const [key, value] of Object.entries(schemas)) {',
    '    const sanitized = rename(key);',
    '    result[sanitized] = value;',
    '  }',
    '  return result;',
    '}',
  ].join('\n');
  const helpersBlock = [
    'import { z, type ZodSchema } from "zod";',
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
    'function buildCurriculumSchemas(endpoints: ReturnType<typeof makeApi>): CurriculumSchemaCollection {',
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
    '    if (Array.isArray(endpoint.errors)) {',
    '      for (const error of endpoint.errors) {',
    '        const statusValue = error.status === "default" ? "default" : String(error.status);',
    '        const errorKey = renameInlineSchema(`${operationId}_${statusValue}`);',
    '        statusSchemas[errorKey] = error.schema;',
    '      }',
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
  console.log('🔍 Modifying file to export the endpoints');
  const withTypedImport = output.replace(
    /import { z } from ['"]zod['"];/,
    'import { z, type ZodSchema } from "zod";',
  );
  const withExportedEndpoints = withTypedImport.replace(
    /const endpoints = makeApi/g,
    'export const endpoints = makeApi',
  );

  const schemasPattern = /export const schemas = {[\s\S]*?};/;
  const modifiedContent = withExportedEndpoints.replace(schemasPattern, (substring) => {
    const body = substring.replace('export const schemas = ', '').replace(';', '');
    return [
      'export type CurriculumSchemaCollection = Record<string, ZodSchema>;',
      'const renameInlineSchema = (original: string) => {\n  if (original === "changelog_changelog_200") {\n    return "ChangelogResponseSchema";\n  }\n  if (original === "changelog_latest_200") {\n    return "ChangelogLatestResponseSchema";\n  }\n  return original.replace(/[^A-Za-z0-9_]/g, "_");\n};',
      'const rawCurriculumSchemas = ' + body + ' as const satisfies CurriculumSchemaCollection;',
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
const curriculumSchemaValues: readonly z.ZodTypeAny[] = Object.values(curriculumSchemaCollection);

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

  const withCurriculumSchemas = withUpdatedBuilder.replace(
    'export const api = new Zodios(endpoints);',
    `${schemaMetadata}\n\nexport const api = new Zodios(endpoints);`,
  );

  const sanitizedContent = withCurriculumSchemas.replace(
    'import { z, type ZodSchema } from "zod";',
    helpersBlock,
  );

  console.log('📝 Writing to file: ', outFile);

  writeFileSync(outFile, sanitizedContent);
}
