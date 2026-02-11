/**
 * Renders the resources section for the landing page.
 *
 * Generates an HTML collapsible section listing all available MCP resources
 * from the Oak Curriculum SDK.
 */

import { DOCUMENTATION_RESOURCES } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

import { escapeHtml } from './escape-html.js';

/**
 * Renders the resources section with all available MCP resources.
 *
 * Generates an expandable `<details>` element containing a list of all
 * MCP documentation resources with their URIs, titles, and descriptions.
 * Resource data is sourced from the Oak Curriculum SDK.
 *
 * @returns HTML string for the resources section
 *
 * @example
 * ```typescript
 * const resourcesHtml = renderResourcesSection();
 * // Returns: '<details class="card expandable">...'
 * ```
 */
export function renderResourcesSection(): string {
  const resourceCount = DOCUMENTATION_RESOURCES.length;

  const resourceItems = DOCUMENTATION_RESOURCES.map(
    (resource) => `
      <li>
        <code>${escapeHtml(resource.uri)}</code>
        <span class="resource-title">${escapeHtml(resource.title)}</span>
        <span class="tool-desc">${escapeHtml(resource.description)}</span>
      </li>`,
  ).join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Resources (${String(resourceCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>Documentation resources available via MCP resources/read:</p>
      <ul class="tool-list">${resourceItems}
      </ul>
    </details>`;
}
