/**
 * File operations for the type generation process.
 *
 * @remarks
 * Every write goes through an injected {@link FileSystemPort}, so the layout
 * logic is provable in-process against the in-memory fake and the real
 * adapter is wired once, in `codegen.ts` (`principles.md` §Testing; ADR-078).
 */

import path from 'node:path';

import type { OpenAPIObject } from 'openapi3-ts/oas31';

import type { FileSystemPort } from '../src/io/file-system-port.js';
import type { FileMap } from './typegen/extraction-types.js';
import {
  generateCompleteMcpTools,
  type GeneratedMcpToolFiles,
} from './typegen/mcp-tools/mcp-tool-generator.js';

/** Prefixes every key of a file map with a directory. */
function nestFileMap(directory: string, files: Readonly<Record<string, string>>): FileMap {
  return Object.fromEntries(
    Object.entries(files).map(([filename, content]) => [`${directory}/${filename}`, content]),
  );
}

/**
 * Lays out the generated MCP tool modules under `mcp-tools/`.
 *
 * @remarks
 * Pure: the result maps each relative path to its content, in the structure
 * the runtime, the stubs and the aliases import one another by.
 *
 * @param mcpTools - The generated module contents, grouped by role
 * @returns Relative paths under the output directory and their content
 */
export function createMcpToolsFileMap(mcpTools: GeneratedMcpToolFiles): FileMap {
  return {
    'mcp-tools/index.ts': mcpTools.index,
    ...nestFileMap('mcp-tools/contract', mcpTools.contract),
    'mcp-tools/definitions.ts': mcpTools.data['definitions.ts'],
    'mcp-tools/scopes-supported.ts': mcpTools.data['scopes-supported.ts'],
    ...nestFileMap('mcp-tools/tools', mcpTools.data.tools),
    ...nestFileMap('mcp-tools/aliases', mcpTools.aliases),
    ...nestFileMap('mcp-tools/runtime', mcpTools.runtime),
    'mcp-tools/stubs/index.ts': mcpTools.stubs['index.ts'],
    'mcp-tools/stubs/tools/index.ts': mcpTools.stubs['tools/index.ts'],
    ...nestFileMap('mcp-tools/stubs/tools', mcpTools.stubs.tools),
  };
}

/**
 * Writes every entry of a file map beneath the output directory, creating the
 * directories it needs first.
 *
 * @param outDirectory - Absolute output directory
 * @param fileMap - Relative paths and their content
 * @param fs - The file system to write through
 */
export async function writeFileMap(
  outDirectory: string,
  fileMap: FileMap,
  fs: FileSystemPort,
): Promise<void> {
  const targets = Object.entries(fileMap).map(
    ([filename, content]) => [path.resolve(outDirectory, filename), content] as const,
  );
  const directories = new Set(targets.map(([target]) => path.dirname(target)));
  await Promise.all([...directories].map((directory) => fs.mkdir(directory)));
  await Promise.all(targets.map(([target, content]) => fs.writeFile(target, content)));
}

/**
 * Writes the derived SDK files and the generated MCP tools to the output directory.
 *
 * @param outDirectory - Absolute output directory
 * @param fileMap - The derived SDK files from `createFileMap`
 * @param sdkSchema - The SDK-decorated schema the MCP tools derive from
 * @param fs - The file system to write through
 */
export async function outputGeneratedFiles(
  outDirectory: string,
  fileMap: FileMap,
  sdkSchema: OpenAPIObject,
  fs: FileSystemPort,
): Promise<void> {
  const mcpTools = createMcpToolsFileMap(generateCompleteMcpTools(sdkSchema));
  await writeFileMap(outDirectory, { ...fileMap, ...mcpTools }, fs);
}
