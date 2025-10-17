#!/usr/bin/env node

/**
 * Type generation core functionality
 * Generates TypeScript types from OpenAPI schema
 */

import fs from 'node:fs';
import path from 'node:path';
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
  generateOpenAiConnectorContent,
} from './typegen/index.js';
import { generatePathUtilsFile } from './typegen/paths/generate-path-utils.js';
import { buildResponseMapData } from './typegen/response-map/build-response-map.js';
import { emitResponseValidators } from './typegen/response-map/emit-response-validators.js';
import { emitRequestValidatorMap } from './typegen/validation/emit-request-validator-map.js';
import { runAllCrossValidations } from './typegen/validation/cross-validate.js';
import type { FileMap } from './typegen/extraction-types.js';
import {
  generateCompleteMcpTools,
  type GeneratedMcpToolFiles,
} from './typegen/mcp-tools/mcp-tool-generator.js';
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
import { generateZeroHitFixtureModules } from './typegen/observability/generate-zero-hit-fixtures.js';
import { generateAdminStreamFixtureModules } from './typegen/admin/generate-admin-fixtures.js';
import { generateQueryParserModules } from './typegen/query-parser/generate-query-parser.js';
import { getZodiosEndpointDefinitionList } from 'openapi-zod-client';

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
    'path-parameters.ts': pathParameterContent,
    'path-utils.ts': pathUtilsContent,
    'response-map.ts': responseValidatorsContent,
    'validation/request-parameter-map.ts': requestValidatorContent,
    'routing/url-helpers.ts': generateUrlHelpers(),
    // OpenAI connector helpers (code-generated module)
    '../openai-connector/index.ts': generateOpenAiConnectorContent(),
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
  const queryParserModules = generateQueryParserModules();
  const zeroHitFixtures = generateZeroHitFixtureModules(sdkSchema);
  const adminStreamFixtures = generateAdminStreamFixtureModules(sdkSchema);

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
    ...queryParserModules,
    ...zeroHitFixtures,
    ...adminStreamFixtures,
  };
}

/**
 * Write files to disk
 * Side effect function - separated from pure logic
 */
function writeFiles(outDirectory: string, fileMap: FileMap): void {
  for (const [filename, content] of Object.entries(fileMap)) {
    const target = path.resolve(outDirectory, filename);
    const dir = path.dirname(target);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(target, content);
  }
}

/**
 * Write MCP tools directory structure to disk
 */
export function writeMcpToolsDirectory(
  outDirectory: string,
  mcpTools: GeneratedMcpToolFiles,
): void {
  const mcpToolsDir = path.resolve(outDirectory, 'mcp-tools');
  const contractDir = path.resolve(mcpToolsDir, 'contract');
  const generatedDir = path.resolve(mcpToolsDir, 'generated');
  const dataDir = path.resolve(generatedDir, 'data');
  const dataToolsDir = path.resolve(dataDir, 'tools');
  const aliasesDir = path.resolve(generatedDir, 'aliases');
  const runtimeDir = path.resolve(generatedDir, 'runtime');

  fs.mkdirSync(contractDir, { recursive: true });
  fs.mkdirSync(dataToolsDir, { recursive: true });
  fs.mkdirSync(aliasesDir, { recursive: true });
  fs.mkdirSync(runtimeDir, { recursive: true });

  fs.writeFileSync(path.resolve(mcpToolsDir, 'index.ts'), mcpTools.index);

  for (const [filename, content] of Object.entries(mcpTools.contract)) {
    fs.writeFileSync(path.resolve(contractDir, filename), content);
  }

  fs.writeFileSync(path.resolve(dataDir, 'definitions.ts'), mcpTools.data['definitions.ts']);
  fs.writeFileSync(path.resolve(dataDir, 'index.ts'), mcpTools.data['index.ts']);
  for (const [filename, content] of Object.entries(mcpTools.data.tools)) {
    fs.writeFileSync(path.resolve(dataToolsDir, filename), content);
  }

  for (const [filename, content] of Object.entries(mcpTools.aliases)) {
    fs.writeFileSync(path.resolve(aliasesDir, filename), content);
  }

  for (const [filename, content] of Object.entries(mcpTools.runtime)) {
    fs.writeFileSync(path.resolve(runtimeDir, filename), content);
  }
}

/**
 * Generate path parameters file content
 * Pure function - no side effects
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

function postProcessTypesSource(source: string): string {
  return source
    .replace(/\u00A0/g, ' ')
    .replace(/headers: \{\n\s*\[name: string\]: unknown;\n\s*\};/g, 'headers?: never;');
}

export async function generateSchemaArtifacts(
  baseSchema: OpenAPIObject,
  sdkSchema: OpenAPIObject,
  outDirectory: string,
  options: { generateMcpTools?: boolean } = {},
): Promise<void> {
  fs.mkdirSync(outDirectory, { recursive: true });

  const sdkSchemaPath = path.resolve(outDirectory, 'api-schema-sdk.json');
  const sdkSchemaContent = generateJsonContent(sdkSchema);
  fs.writeFileSync(sdkSchemaPath, sdkSchemaContent);

  // Generate TypeScript types from original schema
  const schemaUrl = new URL(`file://${sdkSchemaPath}`);
  const ast = await openapiTS(schemaUrl);
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
  const endpointContext = getZodiosEndpointDefinitionList(sdkSchemaWithPaths, {
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

  // Write all files (side effect)
  writeFiles(outDirectory, fileMap);

  // Generate and write MCP tools if requested
  // TODO: we always want the mcp tools, remove the conditional and the option
  if (options.generateMcpTools) {
    const mcpTools = generateCompleteMcpTools(sdkSchema);
    writeMcpToolsDirectory(outDirectory, mcpTools);
  }
}

type SchemaWithPaths = Omit<OpenAPIObject, 'paths'> & {
  paths: NonNullable<OpenAPIObject['paths']>;
};

function ensurePathsOnSchema(schema: OpenAPIObject): SchemaWithPaths {
  const { paths, ...rest } = schema;
  if (paths) {
    return { ...rest, paths };
  }
  return { ...rest, paths: {} };
}
