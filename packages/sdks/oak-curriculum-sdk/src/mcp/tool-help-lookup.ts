/**
 * Tool-specific help lookup for the get-curriculum-model tool.
 *
 * Provides structured help for any tool by looking up its category,
 * related workflows, and tips from the guidance data. Used by
 * curriculum-model-data.ts to compose tool-specific help sections.
 *
 * @remarks Tool validity is determined solely by presence in
 * toolGuidanceData.toolCategories. The drift-detection test in
 * tool-help-lookup.unit.test.ts ensures every aggregated tool
 * has a corresponding category entry.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';
import { toolGuidanceData } from './tool-guidance-data.js';
import { typeSafeEntries } from '../types/helpers/type-helpers.js';

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

function getRelatedToolsFromCategory(
  toolName: string,
  categoryInfo: CategoryInfo,
): readonly string[] {
  return categoryInfo.category.tools.filter((t) => t !== toolName);
}

function filterTipsForTool(toolName: string): readonly string[] {
  const lowerToolName = toolName.toLowerCase();
  return toolGuidanceData.tips.filter((tip) => tip.toLowerCase().includes(lowerToolName));
}

function buildBaseHelp(toolName: string, categoryInfo: CategoryInfo) {
  return {
    tool: toolName,
    category: categoryInfo.categoryName,
    description: categoryInfo.category.description,
    whenToUse: categoryInfo.category.whenToUse,
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

  if (!categoryInfo) {
    const errorMsg = `Unknown tool: ${toolName}. Use get-curriculum-model to see available tools and guidance.`;
    return formatError(errorMsg);
  }

  const help = buildBaseHelp(toolName, categoryInfo);

  const fullData = toolName === 'fetch' ? { ...help, idFormats: toolGuidanceData.idFormats } : help;

  return formatToolResponse({
    summary: `Help for tool: ${toolName}. Category: ${help.category}.`,
    data: fullData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-curriculum-model',
    annotationsTitle: 'Get Curriculum Model',
  });
}
