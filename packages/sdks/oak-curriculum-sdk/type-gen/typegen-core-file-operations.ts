/**
 * File operations for the type generation process
 */

import path from 'node:path';
import fs from 'node:fs';

import type { OpenAPIObject } from 'openapi3-ts/oas31';

import type { FileMap } from './typegen/extraction-types.js';
import {
  generateCompleteMcpTools,
  type GeneratedMcpToolFiles,
} from './typegen/mcp-tools/mcp-tool-generator.js';
import { generateJsonContent } from './typegen/schema/schema-generators.js';

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

export function calculateSdkSchemaPath(outDirectory: string): string {
  return path.resolve(outDirectory, 'api-schema-sdk.json');
}

export function outputGeneratedFiles(
  outDirectory: string,
  fileMap: FileMap,
  sdkSchema: OpenAPIObject,
  sdkSchemaPath: string,
): void {
  // Create output directory
  fs.mkdirSync(outDirectory, { recursive: true });

  // Write SDK schema to disk

  const sdkSchemaContent = generateJsonContent(sdkSchema);
  fs.writeFileSync(sdkSchemaPath, sdkSchemaContent);

  // Write all derived SDK files to disk
  writeFiles(outDirectory, fileMap);

  // Generate and write MCP tools
  const mcpTools = generateCompleteMcpTools(sdkSchema);
  writeMcpToolsDirectory(outDirectory, mcpTools);
}
