/**
 * Documentation resources for MCP server "start here" experience.
 *
 * This module defines the documentation resource constants exposed via
 * MCP resources/list. Resources are application-controlled and can be
 * surfaced by MCP clients in sidebars, documentation panes, or other
 * UI elements.
 *
 * Content generation lives in documentation-content.ts (separated by
 * responsibility: definitions here, content there).
 *
 * @remarks Static content added at SDK compile time per schema-first principles.
 */

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
  /** MCP resource annotations for priority and audience targeting */
  readonly annotations: {
    readonly priority: number;
    readonly audience: ('user' | 'assistant')[];
  };
}

/**
 * Documentation resources available for MCP registration.
 *
 * Provides the "getting started" guide. Tool categories, workflows, tips, and
 * `fetch` ID formats are single-sourced through the canonical
 * `curriculum://model` resource (and the `get-curriculum-model` tool), not
 * duplicated here. MCP clients can list these via resources/list and read via
 * resources/read.
 */
export const DOCUMENTATION_RESOURCES: readonly DocumentationResource[] = [
  {
    name: 'getting-started',
    uri: 'docs://oak/getting-started.md',
    title: 'Getting Started with Oak Curriculum',
    description: 'Introduction to the Oak Curriculum MCP server, authentication, and first steps.',
    mimeType: 'text/markdown',
    annotations: {
      priority: 0.8,
      audience: ['user', 'assistant'] satisfies ('user' | 'assistant')[],
    },
  },
];

// Re-export content generation from the split module
export { getDocumentationContent, getGettingStartedMarkdown } from './documentation-content.js';
