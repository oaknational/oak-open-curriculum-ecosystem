/**
 * The Resources card — presentational; membership arrives as props.
 *
 * @remarks
 * The rows are derived once, at build time, by `derive-view-props.ts` (the
 * SDK inventory filtered to the served-surface definition's live rows), so
 * the page
 * advertises exactly what a connected client sees and never dormant
 * inventory (ratified plan mcp-101). The count in the heading is the length
 * of the received list — both move together, by construction, whenever the
 * definition changes. This component must not import the SDK: the props seam
 * is what keeps it out of the browser bundle.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';

import type { ResourceEntry } from '../view-props.js';

export function ResourcesSection({
  resources,
}: {
  readonly resources: readonly ResourceEntry[];
}): JSX.Element {
  return (
    <details className="oak-card oak-accordion">
      <summary>
        <h2 className="oak-heading-5">Resources ({resources.length})</h2>
      </summary>
      <div className="oak-accordion__body">
        <p>Resources available via MCP resources/read:</p>
        <ul className="tool-list" role="list">
          {resources.map((resource) => (
            <li key={resource.uri}>
              <code>{resource.uri}</code>
              <span className="resource-title">{resource.title}</span>
              <span className="tool-desc">{resource.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
