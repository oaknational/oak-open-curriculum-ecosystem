/**
 * Renders the prompts section for the landing page.
 *
 * Generates an HTML collapsible section listing all available MCP prompts
 * from the Oak Curriculum SDK.
 */

import { MCP_PROMPTS } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { escapeHtml } from './escape-html.js';

/**
 * Renders the prompts section with all available MCP prompts.
 *
 * Generates an expandable `<details>` element containing a list of all
 * MCP prompts with their names, descriptions, and arguments. Prompt data
 * is sourced from the Oak Curriculum SDK.
 *
 * @returns HTML string for the prompts section
 *
 * @example
 * ```typescript
 * const promptsHtml = renderPromptsSection();
 * // Returns: '<details class="card expandable">...'
 * ```
 */
export function renderPromptsSection(): string {
  const promptCount = MCP_PROMPTS.length;

  const promptItems = MCP_PROMPTS.map((prompt) => {
    const args = prompt.arguments ?? [];
    const argList =
      args.length > 0
        ? `<span class="prompt-args">Arguments: ${args.map((a) => `<code>${escapeHtml(a.name)}</code>${a.required ? '' : ' (optional)'}`).join(', ')}</span>`
        : '';

    return `
      <li>
        <code>${escapeHtml(prompt.name)}</code>
        <span class="tool-desc">${escapeHtml(prompt.description)}</span>
        ${argList}
      </li>`;
  }).join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Prompts (${String(promptCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>Prompts are workflow templates that guide common curriculum tasks:</p>
      <ul class="tool-list">${promptItems}
      </ul>
    </details>`;
}
