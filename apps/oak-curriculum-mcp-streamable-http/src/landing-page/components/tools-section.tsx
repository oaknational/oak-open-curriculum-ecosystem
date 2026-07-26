/**
 * The Tools card — derived, never authored.
 *
 * @remarks
 * Membership comes from the served-surface filter over the SDK's universal
 * tool registry; order comes from {@link AGGREGATED_TOOL_ORDER}, whose
 * completeness over the full inventory is enforced by the unit suite
 * independently of serving state. Long descriptions follow the
 * git-commit convention: first paragraph is the summary, everything below is
 * "how to use" and collapses.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';
import {
  generatedToolRegistry,
  isAggregatedToolName,
  listUniversalTools,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type {
  AGGREGATED_TOOL_DEFS,
  UniversalToolListEntry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { isUniversalToolLive, SERVED_SURFACE } from '../../served-surface/served-surface.js';

/** All aggregated tool names, derived from the SDK's definitions map. */
type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;

/**
 * Preferred order for aggregated tools (value-add first, utilities last).
 *
 * Completeness invariant: every aggregated tool has an explicit position
 * here, enforced by the unit test against `AGGREGATED_TOOL_DEFS` — a new
 * aggregated tool cannot silently fall to the incidental tail order.
 */
export const AGGREGATED_TOOL_ORDER: readonly AggregatedToolName[] = [
  'get-curriculum-model',
  'browse-curriculum',
  'explore-topic',
  'search',
  'fetch',
  'get-thread-progressions',
  'get-prior-knowledge-graph',
  'get-misconception-graph',
  'get-keyword-graph',
  'get-eef-evidence',
  'user-search',
  'user-search-query',
  'download-asset',
];

/**
 * Splits a description by first paragraph (git-commit convention).
 * First paragraph = summary; rest = how-to-use instructions.
 *
 * @param description - Full tool description
 * @returns `[summary, howToUse]` — `howToUse` is empty if only one paragraph
 */
export function splitDescriptionByFirstParagraph(description: string): [string, string] {
  const trimmed = description.trim();
  const firstDoubleNewline = trimmed.indexOf('\n\n');
  if (firstDoubleNewline === -1) {
    return [trimmed, ''];
  }
  return [
    trimmed.slice(0, firstDoubleNewline).trim(),
    trimmed.slice(firstDoubleNewline + 2).trim(),
  ];
}

/** Sorts aggregated tools into the preferred order; unlisted tools go last. */
function sortAggregatedTools(tools: UniversalToolListEntry[]): UniversalToolListEntry[] {
  const orderMap = new Map<string, number>(AGGREGATED_TOOL_ORDER.map((name, i) => [name, i]));
  return [...tools].sort((a, b) => {
    const aIdx = orderMap.get(a.name) ?? Number.POSITIVE_INFINITY;
    const bIdx = orderMap.get(b.name) ?? Number.POSITIVE_INFINITY;
    return aIdx - bIdx;
  });
}

/** The live universal tools, unsorted. */
export function servedTools(): UniversalToolListEntry[] {
  return listUniversalTools(generatedToolRegistry).filter((tool) =>
    isUniversalToolLive(SERVED_SURFACE, tool.name),
  );
}

function ToolItem({ tool }: { readonly tool: UniversalToolListEntry }): JSX.Element {
  const [summary, howToUse] = splitDescriptionByFirstParagraph(tool.description);

  return (
    <details className="oak-disclosure tool-item">
      <summary>
        <code>{tool.name}</code>
      </summary>
      {(summary || howToUse) && (
        <div className="tool-desc">
          {summary}
          {howToUse && (
            <details className="oak-disclosure tool-how-to-use">
              {/* Two dozen identical "How to use" controls read as one
                  repeated, meaningless label out of context in a screen
                  reader's control list; the hidden suffix names which tool
                  each one belongs to without changing the visible design. */}
              <summary>
                How to use<span className="oak-visually-hidden"> {tool.name}</span>
              </summary>
              <div className="tool-how-to-use-body">{howToUse}</div>
            </details>
          )}
        </div>
      )}
    </details>
  );
}

export function ToolsSection(): JSX.Element {
  const tools = servedTools();
  const aggregated = sortAggregatedTools(tools.filter((tool) => isAggregatedToolName(tool.name)));
  const generated = tools.filter((tool) => !isAggregatedToolName(tool.name));

  return (
    <details className="oak-card oak-accordion">
      <summary>
        <h2 className="oak-heading-5">Tools ({tools.length})</h2>
      </summary>
      <div className="oak-accordion__body">
        <p>The following tools are available via the MCP protocol:</p>
        <h3 className="tool-group-label">Curriculum tools</h3>
        <p className="tool-group-hint">Higher-level tools that combine multiple API calls</p>
        <div className="tool-list">
          {aggregated.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
        <hr className="tool-divider" />
        <h3 className="tool-group-label muted">API pass-through</h3>
        <p className="tool-group-hint">Individual Oak Curriculum API endpoints</p>
        <div className="tool-list">
          {generated.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </details>
  );
}
