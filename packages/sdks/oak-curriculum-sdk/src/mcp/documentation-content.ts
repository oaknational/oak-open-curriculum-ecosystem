/**
 * Documentation content generation for MCP server resources.
 *
 * Generates markdown content for the documentation resources defined in
 * documentation-resources.ts. Separated from the resource definitions to
 * keep each file within the max-lines limit while maintaining clear
 * responsibility boundaries: definitions (what resources exist) vs
 * content (what they contain).
 *
 * @packageDocumentation
 */

import { toolGuidanceData } from './tool-guidance-data.js';

/**
 * Generates markdown content for the "Getting Started" documentation resource.
 *
 * Includes server overview, authentication information, and quick start guidance.
 *
 * @returns Markdown string for the getting started documentation
 */
export function getGettingStartedMarkdown(): string {
  const { serverOverview, tips } = toolGuidanceData;

  return `# ${serverOverview.name}

${serverOverview.description}

## Authentication

${serverOverview.authentication}

## Quick Start

1. **Search for lessons**: Use the \`search\` tool to find lessons by topic
2. **Browse curriculum**: Use \`get-subjects\` and browsing tools to explore structure
3. **Fetch content**: Use \`fetch\` or specific tools to get detailed lesson content
4. **Download assets**: Use \`get-lessons-assets\` then \`download-asset\` for clickable download links

## Tips

${tips.map((tip) => `- ${tip}`).join('\n')}

## Documentation

For detailed API documentation, visit: <${serverOverview.documentation}>
`;
}

/**
 * Generates markdown content for the "Tools Reference" documentation resource.
 *
 * Organises all available tools by category with descriptions and usage guidance.
 *
 * @returns Markdown string for the tools reference documentation
 */
export function getToolsReferenceMarkdown(): string {
  const { toolCategories, idFormats } = toolGuidanceData;

  const categorySection = (
    name: string,
    category: (typeof toolCategories)[keyof typeof toolCategories],
  ): string => {
    return `### ${name}

${category.description}

**When to use**: ${category.whenToUse}

**Tools**: ${category.tools.map((t) => `\`${t}\``).join(', ')}`;
  };

  return `# Tool Reference

This document describes all available tools organised by category.

## Tool Categories

${categorySection('Agent Support', toolCategories.agentSupport)}

${categorySection('Discovery', toolCategories.discovery)}

${categorySection('Browsing', toolCategories.browsing)}

${categorySection('Fetching', toolCategories.fetching)}

${categorySection('Progression', toolCategories.progression)}

## ID Formats for the Fetch Tool

${idFormats.description}

| Prefix | Example | Description |
|--------|---------|-------------|
${idFormats.formats.map((f) => `| \`${f.prefix}\` | \`${f.example}\` | ${f.description} |`).join('\n')}
`;
}

/**
 * Formats the tool reference suffix for a workflow step.
 *
 * @param step - The workflow step
 * @returns Tool reference string or empty string
 */
function formatStepTool(
  step: (typeof toolGuidanceData.workflows)[keyof typeof toolGuidanceData.workflows]['steps'][number],
): string {
  return 'tool' in step && step.tool ? ` (use \`${step.tool}\`)` : '';
}

/**
 * Formats the sub-items (example, returns, note) for a workflow step.
 *
 * @param step - The workflow step
 * @returns Formatted sub-items string
 */
function formatStepSubItems(
  step: (typeof toolGuidanceData.workflows)[keyof typeof toolGuidanceData.workflows]['steps'][number],
): string {
  const items: string[] = [];
  if ('example' in step && step.example) {
    items.push(`   - Example: \`${step.example}\``);
  }
  if ('returns' in step && step.returns) {
    items.push(`   - Returns: ${step.returns}`);
  }
  if ('note' in step && step.note) {
    items.push(`   - Note: ${step.note}`);
  }
  return items.length > 0 ? `\n${items.join('\n')}` : '';
}

/**
 * Formats a single workflow step as a markdown numbered list item.
 *
 * @param step - The workflow step to format
 * @returns Formatted markdown string for the step
 */
function formatWorkflowStep(
  step: (typeof toolGuidanceData.workflows)[keyof typeof toolGuidanceData.workflows]['steps'][number],
): string {
  const toolRef = formatStepTool(step);
  const subItems = formatStepSubItems(step);
  return `${String(step.step)}. ${step.action}${toolRef}${subItems}`;
}

/**
 * Generates markdown content for the "Workflows" documentation resource.
 *
 * Provides step-by-step guides for common tasks.
 *
 * @returns Markdown string for the workflows documentation
 */
export function getWorkflowsMarkdown(): string {
  const { workflows } = toolGuidanceData;

  const workflowSection = (workflow: (typeof workflows)[keyof typeof workflows]): string => {
    const steps = workflow.steps.map(formatWorkflowStep).join('\n');

    return `## ${workflow.title}

${workflow.description}

${steps}
`;
  };

  return `# Common Workflows

Step-by-step guides for common tasks with the Oak Curriculum MCP server.

${workflowSection(workflows.userInteractions)}

${workflowSection(workflows.findLessons)}

${workflowSection(workflows.lessonPlanning)}

${workflowSection(workflows.browseSubject)}

${workflowSection(workflows.trackProgression)}
`;
}

/**
 * Gets the markdown content for a documentation resource by URI.
 *
 * @param uri - Resource URI to get content for
 * @returns Markdown content if found, undefined otherwise
 */
export function getDocumentationContent(uri: string): string | undefined {
  switch (uri) {
    case 'docs://oak/getting-started.md':
      return getGettingStartedMarkdown();
    case 'docs://oak/tools.md':
      return getToolsReferenceMarkdown();
    case 'docs://oak/workflows.md':
      return getWorkflowsMarkdown();
    default:
      return undefined;
  }
}
