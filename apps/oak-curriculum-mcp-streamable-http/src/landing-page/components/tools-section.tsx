/**
 * The Tools card — presentational; membership and order arrive as props.
 *
 * @remarks
 * The rows are derived once, at build time, by `derive-view-props.ts`:
 * membership from the served-surface filter over the SDK's universal tool
 * registry, aggregated
 * order from `AGGREGATED_TOOL_ORDER` (completeness enforced by the unit
 * suite). This component must not import the SDK — the props seam is what
 * keeps the registries out of the browser bundle. Long descriptions follow
 * the git-commit convention: first paragraph is the summary, everything
 * below is "how to use" and collapses.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';

import type { ToolEntry } from '../view-props.js';

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

function ToolItem({ tool }: { readonly tool: ToolEntry }): JSX.Element {
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

export function ToolsSection({
  aggregatedTools,
  generatedTools,
}: {
  readonly aggregatedTools: readonly ToolEntry[];
  readonly generatedTools: readonly ToolEntry[];
}): JSX.Element {
  return (
    <details className="oak-card oak-accordion">
      <summary>
        <h2 className="oak-heading-5">Tools ({aggregatedTools.length + generatedTools.length})</h2>
      </summary>
      <div className="oak-accordion__body">
        <p>The following tools are available via the MCP protocol:</p>
        <h3 className="tool-group-label">Curriculum tools</h3>
        <p className="tool-group-hint">Higher-level tools that combine multiple API calls</p>
        <div className="tool-list">
          {aggregatedTools.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
        <hr className="tool-divider" />
        <h3 className="tool-group-label muted">API pass-through</h3>
        <p className="tool-group-hint">Individual Oak Curriculum API endpoints</p>
        <div className="tool-list">
          {generatedTools.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </details>
  );
}
