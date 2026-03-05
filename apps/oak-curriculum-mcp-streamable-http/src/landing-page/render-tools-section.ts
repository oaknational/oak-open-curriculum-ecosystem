/**
 * Renders the tools section for the landing page.
 *
 * Generates an HTML collapsible section listing all available MCP tools,
 * including both generated tools (from the OpenAPI schema) and aggregated
 * tools (hand-authored, combining multiple API calls).
 *
 * Uses a git-commit-style convention for long descriptions: the first
 * paragraph is the summary; everything below is "how to use" (collapsible).
 * This is for human browsing only and does not affect MCP tool behaviour.
 */

import {
  listUniversalTools,
  generatedToolRegistry,
  isAggregatedToolName,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { escapeHtml } from './escape-html.js';
import type { UniversalToolListEntry } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/** Preferred order for aggregated tools (value-add first, utilities last). */
const AGGREGATED_TOOL_ORDER: readonly string[] = [
  'get-curriculum-model',
  'browse-curriculum',
  'explore-topic',
  'search',
  'fetch',
  'get-thread-progressions',
  'get-prerequisite-graph',
];

/**
 * Splits a description by first paragraph (git-commit convention).
 * First paragraph = summary; rest = how-to-use instructions.
 *
 * @param desc - Full tool description
 * @returns [summary, howToUse] — howToUse is empty if only one paragraph
 */
function splitDescriptionByFirstParagraph(desc: string): [string, string] {
  const trimmed = desc.trim();
  const firstDoubleNewline = trimmed.indexOf('\n\n');
  if (firstDoubleNewline === -1) {
    return [trimmed, ''];
  }
  return [
    trimmed.slice(0, firstDoubleNewline).trim(),
    trimmed.slice(firstDoubleNewline + 2).trim(),
  ];
}

/**
 * Renders a single tool as a `<details>` element.
 *
 * Tool name in `<summary>`, description in the content. Long descriptions
 * use the first-paragraph convention: summary shown, rest in nested
 * "How to use" collapsible.
 *
 * @param tool - Tool entry with name and optional description
 * @returns HTML string for the tool
 */
function renderToolItem(tool: UniversalToolListEntry): string {
  const desc = tool.description ?? '';
  const [summary, howToUse] = splitDescriptionByFirstParagraph(desc);

  const summaryHtml = escapeHtml(summary);
  const howToUseHtml = howToUse
    ? `
        <details class="tool-how-to-use">
          <summary>How to use</summary>
          <div class="tool-how-to-use-body">${escapeHtml(howToUse)}</div>
        </details>`
    : '';

  const descContent =
    summaryHtml || howToUseHtml ? `<div class="tool-desc">${summaryHtml}${howToUseHtml}</div>` : '';

  return `
      <details class="tool-item">
        <summary><code>${escapeHtml(tool.name)}</code></summary>
        ${descContent}
      </details>`;
}

/**
 * Sorts aggregated tools into the preferred order (model, browse, explore,
 * search, fetch, then others). Tools not in the order list go last.
 */
function sortAggregatedTools(tools: UniversalToolListEntry[]): UniversalToolListEntry[] {
  const orderMap = new Map(AGGREGATED_TOOL_ORDER.map((name, i) => [name, i]));
  return [...tools].sort((a, b) => {
    const aIdx = orderMap.get(a.name) ?? Number.POSITIVE_INFINITY;
    const bIdx = orderMap.get(b.name) ?? Number.POSITIVE_INFINITY;
    return aIdx - bIdx;
  });
}

/**
 * Renders the tools section with all available MCP tools.
 *
 * Generates an expandable `<details>` element containing two visually
 * separated groups:
 * 1. **Curriculum tools** — aggregated tools (ordered: model, browse,
 *    explore, search, fetch, others)
 * 2. **API pass-through tools** — generated tools that map 1:1 to Oak
 *    Curriculum API endpoints
 *
 * Each tool uses `<details><summary>`: name in summary, description
 * in content. Long descriptions split by first paragraph (summary +
 * collapsible "How to use").
 *
 * @returns HTML string for the tools section
 */
export function renderToolsSection(): string {
  const tools = listUniversalTools(generatedToolRegistry);
  const toolCount = tools.length;

  const aggregated = sortAggregatedTools(tools.filter((t) => isAggregatedToolName(t.name)));
  const generated = tools.filter((t) => !isAggregatedToolName(t.name));

  const aggregatedItems = aggregated.map(renderToolItem).join('');
  const generatedItems = generated.map(renderToolItem).join('');

  return `
    <details class="card expandable">
      <summary>
        <h2>Tools (${String(toolCount)})</h2>
        <span class="expand-hint">Click to expand</span>
      </summary>
      <p>The following tools are available via the MCP protocol:</p>
      <h3 class="tool-group-label">Curriculum tools</h3>
      <p class="tool-group-hint">Higher-level tools that combine multiple API calls</p>
      <div class="tool-list">${aggregatedItems}
      </div>
      <hr class="tool-divider" />
      <h3 class="tool-group-label muted">API pass-through</h3>
      <p class="tool-group-hint">Individual Oak Curriculum API endpoints</p>
      <div class="tool-list">${generatedItems}
      </div>
    </details>`;
}
