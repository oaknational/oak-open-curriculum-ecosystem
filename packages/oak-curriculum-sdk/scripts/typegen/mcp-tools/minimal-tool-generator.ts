/**
 * Tool Groupings Generator
 *
 * Generates TOOL_GROUPINGS data structure from the enriched schema.
 * Groups tools by method and parameter signature for type narrowing.
 *
 * This creates a runtime lookup with full type preservation.
 */

import type { OpenAPI3 } from 'openapi-typescript';

/**
 * Tool metadata from enriched schema
 */
interface ToolMetadata {
  name: string;
  path: string;
  method: string;
  pathParams: string[];
  queryParams: string[];
}

/**
 * Extract tools from enriched schema with embedded metadata
 */
function extractToolsFromEnrichedSchema(schema: OpenAPI3): ToolMetadata[] {
  if (!schema.paths) return [];

  const tools: ToolMetadata[] = [];
  const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

  for (const [path, pathItem] of Object.entries(schema.paths)) {
    if (typeof pathItem !== 'object' || '$ref' in pathItem) continue;

    for (const method of methods) {
      const operation = pathItem[method];
      if (!operation || typeof operation !== 'object') continue;
      
      // Extract the embedded tool metadata we added
      const metadata = (operation as any).operationToolMetadata;
      if (metadata) {
        tools.push(metadata);
      }
    }
  }

  return tools;
}

/**
 * Determine grouping key based on method and parameters
 */
function getGroupingKey(tool: ToolMetadata): string {
  const method = tool.method.toUpperCase();
  const hasPathParams = tool.pathParams.length > 0;
  const hasQueryParams = tool.queryParams.length > 0;
  
  if (!hasPathParams && !hasQueryParams) {
    return `${method}_NO_PARAMS`;
  } else if (hasPathParams && !hasQueryParams) {
    return `${method}_WITH_PATH_PARAMS`;
  } else if (!hasPathParams && hasQueryParams) {
    return `${method}_WITH_QUERY_PARAMS`;
  } else {
    return `${method}_WITH_ALL_PARAMS`;
  }
}

/**
 * Generate the TOOL_GROUPINGS structure
 * Groups tools by method and parameter signature
 */
export function generateMinimalToolLookup(schema: OpenAPI3): string {
  const tools = extractToolsFromEnrichedSchema(schema);

  // Group tools by their grouping key
  const groupedTools: Record<string, ToolMetadata[]> = {};
  for (const tool of tools) {
    const groupKey = getGroupingKey(tool);
    if (!groupedTools[groupKey]) {
      groupedTools[groupKey] = [];
    }
    groupedTools[groupKey].push(tool);
  }

  const lines: string[] = [
    '/**',
    ' * GENERATED FILE - DO NOT EDIT',
    ' * ',
    ' * Tool Groupings',
    ' * ',
    ' * Groups tools by method and parameter signature.',
    ' * Preserves full relationship between tool names, paths, methods, and parameters.',
    ' */',
    '',
    '// Import schema for type extraction',
    'import { schema } from "./api-schema";',
    '',
  ];

  // First define the data structure
  lines.push('/**');
  lines.push(' * Tool groupings data structure');
  lines.push(' * Contains all tool metadata organized by parameter signature');
  lines.push(' */');
  lines.push('const TOOL_GROUPINGS_DATA = {')

  // Generate grouped entries
  const sortedGroups = Object.keys(groupedTools).sort();
  for (const groupKey of sortedGroups) {
    lines.push(`  ${groupKey}: {`);
    
    const toolsInGroup = groupedTools[groupKey];
    for (const tool of toolsInGroup) {
      lines.push(`    '${tool.name}': {`);
      lines.push(`      toolName: '${tool.name}' as const,`);
      lines.push(`      path: '${tool.path}' as const,`);
      lines.push(`      method: '${tool.method}' as const,`);
      
      // Generate path params array
      lines.push(`      pathParams: [`);
      for (const param of tool.pathParams) {
        lines.push(`        '${param}',`);
      }
      lines.push(`      ] as const,`);
      
      // Generate query params array
      lines.push(`      queryParams: [`);
      for (const param of tool.queryParams) {
        lines.push(`        '${param}',`);
      }
      lines.push(`      ] as const,`);
      
      // Add the grouping field
      lines.push(`      grouping: '${groupKey}' as const,`);
      lines.push(`    },`);
    }
    
    lines.push(`  },`);
  }

  lines.push('} as const;');
  lines.push('');
  
  // Derive basic types from the data
  lines.push('// Types derived from the data structure');
  lines.push('export type ToolGroupingsData = typeof TOOL_GROUPINGS_DATA;');
  lines.push('export type GroupingKey = keyof ToolGroupingsData;');
  lines.push('export type ToolName = {');
  lines.push('  [K in GroupingKey]: keyof ToolGroupingsData[K]');
  lines.push('}[GroupingKey];');
  lines.push('');
  
  // Add type extraction from schema
  lines.push('/**');
  lines.push(' * Extract exact metadata types from schema based on tool name');
  lines.push(' * These types ensure all fields are fully constrained by the tool name');
  lines.push(' */');
  lines.push('type ExtractPathForTool<T extends ToolName> = {');
  lines.push('  [K in keyof typeof schema.paths]: {');
  lines.push('    [M in keyof typeof schema.paths[K]]:');
  lines.push('      typeof schema.paths[K][M] extends { operationToolName: T }');
  lines.push('        ? K');
  lines.push('        : never');
  lines.push('  }[keyof typeof schema.paths[K]]');
  lines.push('}[keyof typeof schema.paths];');
  lines.push('');
  
  lines.push('type ExtractMethodForTool<T extends ToolName> = {');
  lines.push('  [K in keyof typeof schema.paths]: {');
  lines.push('    [M in keyof typeof schema.paths[K]]:');
  lines.push('      typeof schema.paths[K][M] extends { operationToolName: T }');
  lines.push('        ? Uppercase<M & string>');
  lines.push('        : never');
  lines.push('  }[keyof typeof schema.paths[K]]');
  lines.push('}[keyof typeof schema.paths];');
  lines.push('');
  
  lines.push('type ExtractMetadataForTool<T extends ToolName> = {');
  lines.push('  [K in keyof typeof schema.paths]: {');
  lines.push('    [M in keyof typeof schema.paths[K]]:');
  lines.push('      typeof schema.paths[K][M] extends { operationToolMetadata: infer Meta }');
  lines.push('        ? Meta extends { name: T }');
  lines.push('          ? Meta');
  lines.push('          : never');
  lines.push('        : never');
  lines.push('  }[keyof typeof schema.paths[K]]');
  lines.push('}[keyof typeof schema.paths];');
  lines.push('');
  
  lines.push('/**');
  lines.push(' * Fully constrained tool metadata interface');
  lines.push(' * All fields are determined by the tool name T and grouping G');
  lines.push(' */');
  lines.push('interface ToolMetadata<T extends ToolName, G extends GroupingKey> {');
  lines.push('  toolName: T;');
  lines.push('  path: ExtractPathForTool<T>;');
  lines.push('  method: ExtractMethodForTool<T>;');
  lines.push('  pathParams: ExtractMetadataForTool<T> extends { pathParams: infer P } ? P : readonly [];');
  lines.push('  queryParams: ExtractMetadataForTool<T> extends { queryParams: infer Q } ? Q : readonly [];');
  lines.push('  grouping: G;');
  lines.push('}');
  lines.push('');
  
  lines.push('/**');
  lines.push(' * Type-level filtering - only include tools valid for this grouping');
  lines.push(' */');
  lines.push('type ToolsForGrouping<G extends GroupingKey> = {');
  lines.push('  [T in ToolName as T extends keyof ToolGroupingsData[G] ? T : never]: ToolMetadata<T, G>;');
  lines.push('};');
  lines.push('');
  
  lines.push('/**');
  lines.push(' * The complete type structure with bidirectional constraints');
  lines.push(' */');
  lines.push('type ToolGroupingStructure = {');
  lines.push('  [G in GroupingKey]: ToolsForGrouping<G>;');
  lines.push('};');
  lines.push('');
  
  // Export the fully typed TOOL_GROUPINGS
  lines.push('/**');
  lines.push(' * Export the fully typed TOOL_GROUPINGS');
  lines.push(' * Type annotation ensures all fields match schema constraints');
  lines.push(' */');
  lines.push('export const TOOL_GROUPINGS: ToolGroupingStructure = TOOL_GROUPINGS_DATA;');
  lines.push('');
  lines.push('export type ToolGroupings = typeof TOOL_GROUPINGS;');
  lines.push('');

  // Generate type guard
  lines.push('/**');
  lines.push(' * Type guard for tool names');
  lines.push(' * Proves at runtime that a value is a valid tool name');
  lines.push(' */');
  lines.push('export function isToolName(value: unknown): value is ToolName {');
  lines.push('  if (typeof value !== "string") return false;');
  lines.push('  for (const group of Object.values(TOOL_GROUPINGS)) {');
  lines.push('    if (value in group) return true;');
  lines.push('  }');
  lines.push('  return false;');
  lines.push('}');

  return lines.join('\n');
}
