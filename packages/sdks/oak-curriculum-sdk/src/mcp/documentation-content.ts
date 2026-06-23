/**
 * Documentation content generation for MCP server resources.
 *
 * Generates markdown content for the documentation resources defined in
 * documentation-resources.ts. Separated from the resource definitions to
 * keep a clear responsibility boundary: definitions (what resources exist)
 * vs content (what they contain).
 *
 * Tool categories, common workflows, usage tips, and `fetch` ID formats are
 * deliberately NOT generated here. They live in the canonical
 * `curriculum://model` resource (and the `get-curriculum-model` tool); the
 * getting-started guide points to that single source rather than duplicating
 * it (S1 doc-resources single-sourcing).
 *
 * @packageDocumentation
 */

import { toolGuidanceData } from './tool-guidance-data.js';

/**
 * Generates markdown content for the "Getting Started" documentation resource.
 *
 * Includes server overview, authentication information, and quick start
 * guidance, then points to `curriculum://model` for full orientation (domain
 * model, tool categories, workflows, tips, and ID formats) rather than copying
 * that content here.
 *
 * @returns Markdown string for the getting started documentation
 */
export function getGettingStartedMarkdown(): string {
  const { serverOverview } = toolGuidanceData;

  return `# ${serverOverview.name}

${serverOverview.description}

## Authentication

${serverOverview.authentication}

## Quick Start

1. **Search for lessons**: Use the \`search\` tool to find lessons by topic
2. **Browse curriculum**: Use \`get-subjects\` and browsing tools to explore structure
3. **Fetch content**: Use \`fetch\` or specific tools to get detailed lesson content
4. **Download assets**: Use \`get-lessons-assets\` then \`download-asset\` for clickable download links

## Orientation

For full orientation — the domain model (key stages, subjects, entity hierarchy), tool categories, common workflows, usage tips, and \`fetch\` ID formats — read the \`curriculum://model\` resource, or call the \`get-curriculum-model\` tool, at the start of a session.

## Documentation

For detailed API documentation, visit: <${serverOverview.documentation}>
`;
}

/**
 * Gets the markdown content for a documentation resource by URI.
 *
 * @param uri - Resource URI to get content for
 * @returns Markdown content if found, undefined otherwise
 */
export function getDocumentationContent(uri: string): string | undefined {
  if (uri === 'docs://oak/getting-started.md') {
    return getGettingStartedMarkdown();
  }
  return undefined;
}
