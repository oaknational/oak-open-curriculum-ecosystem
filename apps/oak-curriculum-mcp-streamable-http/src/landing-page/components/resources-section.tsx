/**
 * The Resources card — derived, never authored.
 *
 * @remarks
 * Membership is the SDK's `ALL_MCP_RESOURCES` inventory filtered to the
 * served-surface definition's live rows, so the page advertises exactly what
 * a connected client sees and never dormant inventory (ratified plan
 * mcp-101). The count in the heading is the length of that filtered list —
 * both move together, by construction, whenever the definition changes.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';
import { ALL_MCP_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { isResourceLive, SERVED_SURFACE } from '../../served-surface/served-surface.js';

/** The live resource rows, in inventory order. */
export function servedResources(): readonly (typeof ALL_MCP_RESOURCES)[number][] {
  return ALL_MCP_RESOURCES.filter((resource) => isResourceLive(SERVED_SURFACE, resource.uri));
}

export function ResourcesSection(): JSX.Element {
  const resources = servedResources();

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
