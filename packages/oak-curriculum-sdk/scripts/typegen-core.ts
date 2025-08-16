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
} from './typegen/index.js';
import type { FileMap } from './typegen/extraction-types.js';
import {
  generateCompleteMcpTools,
  type GeneratedMcpToolFiles,
} from './typegen/mcp-tools/mcp-tool-generator.js';

/**
 * Create a map of filenames to their content
 * Pure function - no side effects
 */
export function createFileMap(
  sourceSchema: OpenAPI3,
  jsonStringSchema: string,
  tsTypesContent: string,
  pathParameterContent: string,
): FileMap {
  const baseFiles: FileMap = {
    'api-schema.json': jsonStringSchema,
    'api-schema-base.ts': generateBaseSchemaContent(sourceSchema),
    'api-paths-types.ts': tsTypesContent,
    'path-parameters.ts': pathParameterContent,
  };

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
 * Write MCP tools directory structure to disk
 */
function writeMcpToolsDirectory(outDirectory: string, mcpTools: GeneratedMcpToolFiles): void {
  const mcpToolsDir = path.resolve(outDirectory, 'mcp-tools');
  const toolsDir = path.resolve(mcpToolsDir, 'tools');

  // Create directories
  fs.mkdirSync(mcpToolsDir, { recursive: true });
  fs.mkdirSync(toolsDir, { recursive: true });

  // Write main files
  fs.writeFileSync(path.resolve(mcpToolsDir, 'index.ts'), mcpTools['index.ts']);
  fs.writeFileSync(path.resolve(mcpToolsDir, 'types.ts'), mcpTools['types.ts']);
  fs.writeFileSync(path.resolve(mcpToolsDir, 'lib.ts'), mcpTools['lib.ts']);

  // Write tool files
  for (const [filename, content] of Object.entries(mcpTools.tools)) {
    fs.writeFileSync(path.resolve(toolsDir, filename), content);
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

  // Generate pure JSON schema without tool metadata
  const jsonStringSchema = generateJsonContent(sourceSchema);

  // Generate TypeScript types from original schema
  const ast = await openapiTS(sourceSchema);
  const tsTypesContent = astToString(ast);

  // Extract path parameters and valid combinations from original schema
  const { parameters, validCombinations } = extractPathParameters(sourceSchema);

  // Generate all content using original schema
  const pathParameterContent = generatePathParametersContent(
    sourceSchema,
    parameters,
    validCombinations,
  );

  const fileMap = createFileMap(
    sourceSchema,
    jsonStringSchema,
    tsTypesContent,
    pathParameterContent,
  );

  // Write all files (side effect)
  writeFiles(outDirectory, fileMap);

  // Generate and write MCP tools if requested
  if (options.generateMcpTools) {
    const mcpTools = generateCompleteMcpTools(sourceSchema);
    writeMcpToolsDirectory(outDirectory, mcpTools);
  }
}
