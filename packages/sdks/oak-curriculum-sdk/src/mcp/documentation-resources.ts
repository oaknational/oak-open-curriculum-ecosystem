/**
 * Documentation resources for MCP server "start here" experience.
 *
 * This module provides markdown documentation exposed via MCP resources/list.
 * Resources are application-controlled and can be surfaced by MCP clients
 * in sidebars, documentation panes, or other UI elements.
 *
 * Content is derived from tool-guidance-data.ts which provides the structured
 * data for tool usage documentation.
 *
 * @remarks Static content added at SDK compile time per schema-first principles.
 */

import { toolGuidanceData } from './tool-guidance-data.js';

/**
 * Documentation resource definition for MCP registration.
 */
export interface DocumentationResource {
  /** Unique resource identifier (used in registration) */
  readonly name: string;
  /** Resource URI following docs:// scheme */
  readonly uri: string;
  /** Human-readable title */
  readonly title: string;
  /** Description shown in resource listings */
  readonly description: string;
  /** MIME type (always text/markdown for documentation) */
  readonly mimeType: 'text/markdown';
}

/**
 * Documentation resources available for MCP registration.
 *
 * These resources provide "getting started" and tool usage documentation.
 * MCP clients can list these via resources/list and read via resources/read.
 */
export const DOCUMENTATION_RESOURCES: readonly DocumentationResource[] = [
  {
    name: 'getting-started',
    uri: 'docs://oak/getting-started.md',
    title: 'Getting Started with Oak Curriculum',
    description: 'Introduction to the Oak Curriculum MCP server, authentication, and first steps.',
    mimeType: 'text/markdown',
  },
  {
    name: 'tools-reference',
    uri: 'docs://oak/tools.md',
    title: 'Tool Reference',
    description:
      'Complete reference of all available tools organised by category with usage guidance.',
    mimeType: 'text/markdown',
  },
  {
    name: 'workflows',
    uri: 'docs://oak/workflows.md',
    title: 'Common Workflows',
    description: 'Step-by-step guides for common tasks like finding lessons and planning.',
    mimeType: 'text/markdown',
  },
] as const;

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
 * Generates markdown content for the "Workflows" documentation resource.
 *
 * Provides step-by-step guides for common tasks.
 *
 * @returns Markdown string for the workflows documentation
 */
export function getWorkflowsMarkdown(): string {
  const { workflows } = toolGuidanceData;

  const workflowSection = (workflow: (typeof workflows)[keyof typeof workflows]): string => {
    const steps = workflow.steps
      .map((step) => {
        let line = `${String(step.step)}. ${step.action}`;
        if ('tool' in step && step.tool) {
          line += ` (use \`${step.tool}\`)`;
        }
        if ('example' in step && step.example) {
          line += `\n   - Example: \`${step.example}\``;
        }
        if ('note' in step && step.note) {
          line += `\n   - Note: ${step.note}`;
        }
        return line;
      })
      .join('\n');

    return `## ${workflow.title}

${workflow.description}

${steps}
`;
  };

  return `# Common Workflows

Step-by-step guides for common tasks with the Oak Curriculum MCP server.

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
