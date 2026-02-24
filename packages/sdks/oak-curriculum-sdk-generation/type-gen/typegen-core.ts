#!/usr/bin/env node

/**
 * Type generation core functionality
 * Generates TypeScript types from OpenAPI schema
 */

import type { OpenAPIObject } from 'openapi3-ts/oas31';
import openapiTS, { astToString } from 'openapi-typescript';
import {
  generateJsonContent,
  generateBaseSchemaContent,
  generatePathParametersHeader,
  generatePathsConstant,
  generateRuntimeSchemaChecks,
  generateAllParameterConstants,
  generateValidPathsByParameters,
  generatePathParametersInterface,
  extractPathParameters,
  extractPathOperations,
  generateOperationConstants,
  generateUrlHelpers,
} from './typegen/index.js';
import { generatePathUtilsFile } from './typegen/paths/generate-path-utils.js';
import { buildResponseMapData } from './typegen/response-map/build-response-map.js';
import { emitResponseValidators } from './typegen/response-map/emit-response-validators.js';
import { emitRequestValidatorMap } from './typegen/validation/emit-request-validator-map.js';
import { runAllCrossValidations } from './typegen/validation/cross-validate.js';
import type { FileMap } from './typegen/extraction-types.js';
import { generateSearchFacetTypeModules } from './typegen/search/generate-search-facet-types.js';
import { generateSearchFacetZodModules } from './typegen/search/generate-search-facet-zod.js';
import { generateSearchRequestModules } from './typegen/search/generate-search-requests.js';
import { generateSearchResponseModules } from './typegen/search/generate-search-responses.js';
import { generateSearchResponseDocsModules } from './typegen/search/generate-search-response-docs.js';
import { generateSearchSuggestionModules } from './typegen/search/generate-search-suggestions.js';
import { generateSearchScopeModules } from './typegen/search/generate-search-scopes.js';
import { generateSearchFixtureModules } from './typegen/search/generate-search-fixtures.js';
import { generateSearchIndexModule } from './typegen/search/generate-search-index.js';
import { generateSearchIndexDocumentModules } from './typegen/search/generate-search-index-docs.js';
import { generateEsMappingModules } from './typegen/search/generate-es-mappings.js';
import { generateZeroHitFixtureModules } from './typegen/observability/generate-zero-hit-fixtures.js';
import { generateAdminStreamFixtureModules } from './typegen/admin/generate-admin-fixtures.js';
import { generateQueryParserModules } from './typegen/query-parser/generate-query-parser.js';
import { generateSdkErrorTypes } from './typegen/error-types/index.js';
import { generateClientTypes } from './typegen/client-types/generate-client-types.js';
import { getEndpointDefinitions } from './adapter/index.js';
import { ensurePathsOnSchema } from './typegen-core-helpers.js';
import {
  calculateSdkSchemaPath,
  outputGeneratedFiles,
  writeSdkSchemaFile,
} from './typegen-core-file-operations.js';

/**
 * Create a map of filenames to their content
 * Pure function - no side effects
 */
export function createFileMap(
  baseSchema: OpenAPIObject,
  sdkSchema: OpenAPIObject,
  tsTypesContent: string,
  pathParameterContent: string,
  pathUtilsContent: string,
  responseValidatorsContent: string,
  requestValidatorContent: string,
): FileMap {
  const baseFiles: FileMap = {
    'api-schema-original.json': generateJsonContent(baseSchema),
    'api-schema-sdk.json': generateJsonContent(sdkSchema),
    'api-schema-base.ts': generateBaseSchemaContent(sdkSchema),
    'api-paths-types.ts': tsTypesContent,
    'client-types.ts': generateClientTypes(),
    'path-parameters.ts': pathParameterContent,
    'path-utils.ts': pathUtilsContent,
    'response-map.ts': responseValidatorsContent,
    'validation/request-parameter-map.ts': requestValidatorContent,
    'routing/url-helpers.ts': generateUrlHelpers(),
  };

  const searchFacetTypes = generateSearchFacetTypeModules();
  const searchFacetZod = generateSearchFacetZodModules();
  const searchRequests = generateSearchRequestModules(sdkSchema);
  const searchResponses = generateSearchResponseModules(sdkSchema);
  const searchResponseDocs = generateSearchResponseDocsModules(sdkSchema);
  const searchSuggestions = generateSearchSuggestionModules(sdkSchema);
  const searchScopes = generateSearchScopeModules(sdkSchema);
  const searchFixtures = generateSearchFixtureModules(sdkSchema);
  const searchIndex = generateSearchIndexModule(sdkSchema);
  const searchIndexDocuments = generateSearchIndexDocumentModules(sdkSchema);
  const esMappings = generateEsMappingModules(sdkSchema);
  const queryParserModules = generateQueryParserModules();
  const zeroHitFixtures = generateZeroHitFixtureModules(sdkSchema);
  const adminStreamFixtures = generateAdminStreamFixtureModules(sdkSchema);

  // Error types for Result pattern (ADR-088)
  const errorTypes = { 'error-types/sdk-error-types.ts': generateSdkErrorTypes() };

  return {
    ...baseFiles,
    ...searchFacetTypes,
    ...searchFacetZod,
    ...searchRequests,
    ...searchResponses,
    ...searchResponseDocs,
    ...searchSuggestions,
    ...searchScopes,
    ...searchFixtures,
    ...searchIndex,
    ...searchIndexDocuments,
    ...esMappings,
    ...queryParserModules,
    ...zeroHitFixtures,
    ...adminStreamFixtures,
    ...errorTypes,
  };
}

/**
 * Generate path parameters file content
 */
export function generatePathParametersContent(
  schema: OpenAPIObject,
  parameters: ReturnType<typeof extractPathParameters>['parameters'],
  validCombinations: ReturnType<typeof extractPathParameters>['validCombinations'],
): string {
  // Extract operations at generation time
  const operations = extractPathOperations(schema);

  const sections = [
    generatePathParametersHeader(),
    generatePathsConstant(schema),
    generateRuntimeSchemaChecks(),
    generateAllParameterConstants(parameters),
    generatePathParametersInterface(parameters),
    generateValidPathsByParameters(validCombinations),
    // Add the new operation constants
    generateOperationConstants(operations),
  ];

  return sections.join('\n');
}

/**
 * Escape TSDoc-unsafe characters inside a doc comment body.
 *
 * Braces, angle brackets, and literal backslash-n sequences that appear in
 * generated OpenAPI descriptions/examples break the TSDoc parser. This
 * function escapes them while preserving valid inline tags.
 */
const PLACEHOLDER_PREFIX = '___TSDOC_SAFE_';
const PLACEHOLDER_SUFFIX = '___';

function escapeTsDocUnsafeChars(docBody: string): string {
  // Protect complete valid TSDoc inline tags with placeholders before escaping
  const placeholders: string[] = [];
  let withPlaceholders = docBody.replace(/\{@(?:link|inheritDoc)\s[^}]*\}/g, (match) => {
    placeholders.push(match);
    return `${PLACEHOLDER_PREFIX}${String(placeholders.length - 1)}${PLACEHOLDER_SUFFIX}`;
  });

  withPlaceholders = withPlaceholders
    // Escape remaining braces
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    // Escape angle brackets (HTML-like syntax)
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    // Escape literal \n sequences (not real newlines) that appear in VTT examples
    .replace(/\\n/g, '\\\\n');

  // Restore valid inline tags
  const pattern = new RegExp(`${PLACEHOLDER_PREFIX}(\\d+)${PLACEHOLDER_SUFFIX}`, 'g');
  return withPlaceholders.replace(pattern, (_, idx) => placeholders[Number(idx)] ?? '');
}

export function postProcessTypesSource(source: string): string {
  return (
    source
      .replace(/\u00A0/g, ' ')
      .replace(/headers: \{\n\s*\[name: string\]: unknown;\n\s*\};/g, 'headers?: never;')
      // Strip non-standard JSDoc tags emitted by openapiTS
      .replace(/\/\*\*\s*@description\s+/g, '/** ')
      .replace(/^(\s*\*)\s*@description\s+/gm, '$1 ')
      .replace(/^(\s*\*)\s*@constant\s*$/gm, '')
      .replace(/^\s*\/\*\*\s*@constant\s*\*\/\s*$/gm, '')
      .replace(/^(\s*\*)\s*@enum\s+\{[^}]*\}\s*$/gm, '')
      .replace(/^\s*\/\*\*\s*@enum\s+\{[^}]*\}\s*\*\/\s*$/gm, '')
      // Escape TSDoc-unsafe characters within doc comments only
      .replace(/\/\*\*[\s\S]*?\*\//g, (match) => escapeTsDocUnsafeChars(match))
  );
}

export async function generateSchemaArtifacts(
  baseSchema: OpenAPIObject,
  sdkSchema: OpenAPIObject,
  outDirectory: string,
): Promise<void> {
  // Generate TypeScript types from original schema
  const sdkSchemaPath = calculateSdkSchemaPath(outDirectory);
  writeSdkSchemaFile(outDirectory, sdkSchema, sdkSchemaPath);
  const ast = await openapiTS(new URL(`file://${sdkSchemaPath}`));
  const tsTypesContent = postProcessTypesSource(astToString(ast));

  // Extract path parameters and valid combinations from original schema
  const { parameters, validCombinations } = extractPathParameters(sdkSchema);

  // Generate all content using sdk schema
  const pathParameterContent = generatePathParametersContent(
    sdkSchema,
    parameters,
    validCombinations,
  );
  const pathUtilsContent = generatePathUtilsFile();
  const responseMapEntries = buildResponseMapData(sdkSchema);
  // Cross-validation: fail fast on drift/mismatch
  runAllCrossValidations(sdkSchema, responseMapEntries);
  const responseValidatorsContent = emitResponseValidators(responseMapEntries);
  const sdkSchemaWithPaths = ensurePathsOnSchema(sdkSchema);
  const endpointContext = getEndpointDefinitions(sdkSchemaWithPaths, {
    shouldExportAllSchemas: true,
    shouldExportAllTypes: true,
    groupStrategy: 'none',
    withAlias: false,
  });
  const requestValidatorContent = emitRequestValidatorMap(endpointContext.endpoints);

  const fileMap = createFileMap(
    baseSchema,
    sdkSchema,
    tsTypesContent,
    pathParameterContent,
    pathUtilsContent,
    responseValidatorsContent,
    requestValidatorContent,
  );

  outputGeneratedFiles(outDirectory, fileMap, sdkSchema, sdkSchemaPath);
}
