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
import { generateMinimalToolLookup } from './typegen/mcp-tools/minimal-tool-generator.js';

/**
 * Create a map of filenames to their content
 * Pure function - no side effects
 */
export function createFileMap(
  jsonStringSchema: string,
  tsTypesContent: string,
  pathParameterContent: string,
  mcpToolsContent?: string,
): FileMap {
  const baseFiles: FileMap = {
    'api-schema.json': jsonStringSchema,
    'api-schema.ts': generateTsSchemaContent(jsonStringSchema),
    'api-paths-types.ts': tsTypesContent,
    'path-parameters.ts': pathParameterContent,
  };

  // Add MCP file if content is provided
  if (mcpToolsContent) {
    baseFiles['mcp-tools.ts'] = mcpToolsContent;
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
  sourceSchema: OpenAPI3,
  outDirectory: string,
  options: { generateMcpTools?: boolean } = {},
): Promise<void> {
  fs.mkdirSync(outDirectory, { recursive: true });

  // Generate enriched schema with embedded MCP tool metadata
  const jsonStringSchema = generateJsonContent(sourceSchema);
  const schema = JSON.parse(jsonStringSchema) as OpenAPI3;

  // Generate TypeScript types from enriched schema
  const ast = await openapiTS(schema);
  const tsTypesContent = astToString(ast);

  // Extract path parameters and valid combinations from enriched schema
  const { parameters, validCombinations } = extractPathParameters(schema);

  // Generate all content using enriched schema
  const pathParameterContent = generatePathParametersContent(schema, parameters, validCombinations);

  // Generate MCP tools if requested
  let mcpToolsContent: string | undefined;

  if (options.generateMcpTools) {
    // Use the enriched schema for tool generation
    mcpToolsContent = generateMinimalToolLookup(schema);
  }

  const fileMap = createFileMap(
    jsonStringSchema,
    tsTypesContent,
    pathParameterContent,
    mcpToolsContent,
  );

  // Write all files (side effect)
  writeFiles(outDirectory, fileMap);
}
