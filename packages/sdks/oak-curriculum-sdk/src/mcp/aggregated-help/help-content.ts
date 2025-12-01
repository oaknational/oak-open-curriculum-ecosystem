/**
 * Help content generation for the get-help tool.
 *
 * This module handles building help responses for both general
 * server guidance and tool-specific help.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatError, formatOptimizedResult } from '../universal-tool-shared.js';
import { toolGuidanceData } from '../tool-guidance-data.js';
import { typeSafeEntries } from '../../types/helpers/type-helpers.js';

/** Interface for category lookup result */
interface CategoryInfo {
  categoryName: string;
  category: (typeof toolGuidanceData.toolCategories)[keyof typeof toolGuidanceData.toolCategories];
}

/**
 * Finds which category a tool belongs to.
 *
 * @param toolName - Name of the tool to look up
 * @returns Category name and info if found, undefined otherwise
 */
function findToolCategory(toolName: string): CategoryInfo | undefined {
  const entries = typeSafeEntries(toolGuidanceData.toolCategories);

  for (const [categoryName, category] of entries) {
    const toolsAsStrings: readonly string[] = category.tools;
    if (toolsAsStrings.includes(toolName)) {
      return { categoryName, category };
    }
  }

  return undefined;
}

/**
 * Gets related workflows for a tool.
 *
 * @param toolName - Name of the tool to find workflows for
 * @returns Array of workflow names that use this tool
 */
function getRelatedWorkflows(toolName: string): string[] {
  const entries = typeSafeEntries(toolGuidanceData.workflows);

  return entries
    .filter(([, workflow]) =>
      workflow.steps.some((step) => 'tool' in step && step.tool === toolName),
    )
    .map(([workflowName]) => workflowName);
}

/** Known aggregated tool names for help lookup */
const AGGREGATED_TOOL_NAMES: readonly string[] = ['search', 'fetch', 'get-ontology', 'get-help'];

/**
 * Checks if a string is a known aggregated tool name.
 */
function isKnownAggregatedTool(name: string): boolean {
  return AGGREGATED_TOOL_NAMES.includes(name);
}

/** Default values for help when no category is found */
const DEFAULT_HELP = {
  category: 'aggregated',
  description: 'Aggregated tool combining multiple operations',
  whenToUse: 'See tool description for usage guidance',
} as const;

/**
 * Gets related tools from category, excluding the current tool.
 */
function getRelatedToolsFromCategory(
  toolName: string,
  categoryInfo: CategoryInfo | undefined,
): readonly string[] {
  if (!categoryInfo) {
    return [];
  }
  return categoryInfo.category.tools.filter((t) => t !== toolName);
}

/**
 * Filters tips that mention the given tool name.
 */
function filterTipsForTool(toolName: string): readonly string[] {
  const lowerToolName = toolName.toLowerCase();
  return toolGuidanceData.tips.filter((tip) => tip.toLowerCase().includes(lowerToolName));
}

/**
 * Builds the base help object for a tool.
 */
function buildBaseHelp(toolName: string, categoryInfo: CategoryInfo | undefined) {
  return {
    tool: toolName,
    category: categoryInfo?.categoryName ?? DEFAULT_HELP.category,
    description: categoryInfo?.category.description ?? DEFAULT_HELP.description,
    whenToUse: categoryInfo?.category.whenToUse ?? DEFAULT_HELP.whenToUse,
    relatedTools: getRelatedToolsFromCategory(toolName, categoryInfo),
    relatedWorkflows: getRelatedWorkflows(toolName),
    tips: filterTipsForTool(toolName),
  };
}

/**
 * Returns help for a specific tool.
 *
 * @param toolName - Name of the tool to get help for
 * @returns CallToolResult with tool-specific help or error
 */
export function getToolSpecificHelp(toolName: string): CallToolResult {
  const categoryInfo = findToolCategory(toolName);

  if (!categoryInfo && !isKnownAggregatedTool(toolName)) {
    const errorMsg = `Unknown tool: ${toolName}. Use get-help without parameters to see available tools.`;
    return formatError(errorMsg);
  }

  const help = buildBaseHelp(toolName, categoryInfo);

  // Add ID format info if this is the fetch tool
  const fullData = toolName === 'fetch' ? { ...help, idFormats: toolGuidanceData.idFormats } : help;

  return formatOptimizedResult({
    summary: `Help for tool: ${toolName}. Category: ${help.category}.`,
    fullData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-help',
    annotationsTitle: 'Get Help',
  });
}

/**
 * Returns general server guidance.
 *
 * @returns CallToolResult with full server guidance
 */
export function getGeneralHelp(): CallToolResult {
  return formatOptimizedResult({
    summary:
      'Oak Curriculum MCP server guidance. Includes tool categories, workflows, ID formats, and tips.',
    fullData: toolGuidanceData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-help',
    annotationsTitle: 'Get Help',
  });
}
