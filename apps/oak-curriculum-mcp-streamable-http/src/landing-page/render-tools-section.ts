/**
 * @fileoverview Renders the tools section for the landing page.
 *
 * Generates an HTML collapsible section listing all available MCP tools
 * from the Oak Curriculum SDK.
 */

import { listAllToolDescriptors } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

import { escapeHtml } from './escape-html.js';

/**
 * Renders the tools section with all available MCP tools.
 *
 * Generates an expandable `<details>` element containing a list of all
 * MCP tools with their names and descriptions. Tool data is sourced
 * from the Oak Curriculum SDK.
 *
 * @returns HTML string for the tools section
 *
 * @example
 * ```typescript
 * const toolsHtml = renderToolsSection();
 * // Returns: '<details class="card expandable">...'
 * ```
 */
export function renderToolsSection(): string {
  const tools = listAllToolDescriptors();
  const toolCount = tools.length;

  const toolItems = tools
    .map(
      (tool) => `
      <li>
        <code>${escapeHtml(tool.name)}</code>
        <span class="tool-desc">${escapeHtml(tool.description)}</span>
      </li>`,
    )
    .join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Tools (${String(toolCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>The following tools are available via the MCP protocol:</p>
      <ul class="tool-list">${toolItems}
      </ul>
    </details>`;
}
