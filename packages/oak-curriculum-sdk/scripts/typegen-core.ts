#!/usr/bin/env node

/**
 * Type generation core functionality
 * Generates TypeScript types from OpenAPI schema
 */

import fs from 'node:fs';
import path from 'node:path';
import type { OpenAPI3 } from 'openapi-typescript';
import openapiTS, { astToString } from 'openapi-typescript';
import {
  generateJsonContent,
  generateTsSchemaContent,
  generatePathParametersHeader,
  generatePathsConstant,
  generateRuntimeSchemaChecks,
  generateAllParameterConstants,
  generateValidPathsByParameters,
  generatePathParametersInterface,
  extractPathParameters,
  extractPathOperations,
  generateOperationConstants,
} from './typegen/index.js';
import type { FileMap } from './typegen/extraction-types.js';
import { generateMcpToolsModule, extractMcpTools } from './typegen/mcp-tools/index.js';
import { generateParametersModule } from './typegen/mcp-tools/parameters.js';
import { generateValidatorsModule } from './typegen/mcp-tools/validators.js';

/**
 * Create a map of filenames to their content
 * Pure function - no side effects
 */
export function createFileMap(
  jsonStringSchema: string,
  tsTypesContent: string,
  pathParameterContent: string,
  mcpToolsContent?: string,
  mcpParametersContent?: string,
  mcpValidatorsContent?: string,
): FileMap {
  const baseFiles: FileMap = {
    'api-schema.json': jsonStringSchema,
    'api-schema.ts': generateTsSchemaContent(jsonStringSchema),
    'api-paths-types.ts': tsTypesContent,
    'path-parameters.ts': pathParameterContent,
  };

  // Add MCP files if content is provided
  if (mcpToolsContent) {
    baseFiles['mcp-tools.ts'] = mcpToolsContent;
  }
  if (mcpParametersContent) {
    baseFiles['mcp-parameters.ts'] = mcpParametersContent;
  }
  if (mcpValidatorsContent) {
    baseFiles['mcp-validators.ts'] = mcpValidatorsContent;
  }

  return baseFiles;
}

/**
 * Write files to disk
 * Side effect function - separated from pure logic
 */
function writeFiles(outDirectory: string, fileMap: FileMap): void {
  for (const [filename, content] of Object.entries(fileMap)) {
    fs.writeFileSync(path.resolve(outDirectory, filename), content);
  }
}

/**
 * Generate path parameters file content
 * Pure function - no side effects
 */
export function generatePathParametersContent(
  schema: OpenAPI3,
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
    generatePathParametersInterface(),
    generateValidPathsByParameters(validCombinations),
    // Add the new operation constants
    generateOperationConstants(operations),
  ];

  return sections.join('\n');
}

export async function generateSchemaArtifacts(
  schema: OpenAPI3,
  outDirectory: string,
  options: { generateMcpTools?: boolean } = {},
): Promise<void> {
  fs.mkdirSync(outDirectory, { recursive: true });

  // Generate TypeScript types from OpenAPI
  const ast = await openapiTS(schema);
  const tsTypesContent = astToString(ast);

  // Extract path parameters and valid combinations
  const { parameters, validCombinations } = extractPathParameters(schema);

  // Generate all content using pure functions
  const jsonStringSchema = generateJsonContent(schema);
  const pathParameterContent = generatePathParametersContent(schema, parameters, validCombinations);

  // Generate MCP tools if requested
  let mcpToolsContent: string | undefined;
  let mcpParametersContent: string | undefined;
  let mcpValidatorsContent: string | undefined;

  if (options.generateMcpTools) {
    const mcpTools = extractMcpTools(schema);
    mcpToolsContent = generateMcpToolsModule(schema);
    mcpParametersContent = generateParametersModule(mcpTools);
    mcpValidatorsContent = generateValidatorsModule(schema, mcpTools);
  }

  const fileMap = createFileMap(
    jsonStringSchema,
    tsTypesContent,
    pathParameterContent,
    mcpToolsContent,
    mcpParametersContent,
    mcpValidatorsContent,
  );

  // Write all files (side effect)
  writeFiles(outDirectory, fileMap);
}

export async function generateSchema(schemaPath: string, outDirectory: string): Promise<void> {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const schemaRaw: unknown = JSON.parse(schemaContent);

  // Simple check for file-based schema
  if (!schemaRaw || typeof schemaRaw !== 'object' || !('openapi' in schemaRaw)) {
    throw new Error('Schema file does not contain a valid OpenAPI 3.x schema');
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const schema = schemaRaw as OpenAPI3;
  await generateSchemaArtifacts(schema, outDirectory);
}
