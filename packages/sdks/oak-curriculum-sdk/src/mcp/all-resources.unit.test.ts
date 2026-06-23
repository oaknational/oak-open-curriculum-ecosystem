/**
 * Unit tests for the canonical MCP resource catalogue.
 *
 * Locks the full set of resource URIs and the exclusion of the `ui://` widget,
 * so a resource added to (or removed from) the catalogue is a deliberate,
 * reviewed change rather than silent drift.
 */
import { describe, it, expect } from 'vitest';

import { ALL_MCP_RESOURCES } from './all-resources.js';
import { WIDGET_URI } from './widget-constants.js';

describe('ALL_MCP_RESOURCES', () => {
  const uris = ALL_MCP_RESOURCES.map((resource) => resource.uri);

  it('contains every MCP resource URI the server exposes, in listing order', () => {
    expect(uris).toStrictEqual([
      'docs://oak/getting-started.md',
      'curriculum://model',
      'eef://interpretation',
    ]);
  });

  it('does not list the removed prior-knowledge-graph resource (served by the anchored tool, G1b)', () => {
    expect(uris).not.toContain('curriculum://prior-knowledge-graph');
  });

  it('does not list the removed misconception-graph resource (served by the anchored tool, G2)', () => {
    expect(uris).not.toContain('curriculum://misconception-graph');
  });

  it('does not list the removed thread-progressions resource (served by the anchored tool, G3)', () => {
    expect(uris).not.toContain('curriculum://thread-progressions');
  });

  it('excludes the ui:// widget, which is not a resources/read data resource', () => {
    expect(uris).not.toContain(WIDGET_URI);
  });

  it('gives every entry the fields listing surfaces render', () => {
    for (const resource of ALL_MCP_RESOURCES) {
      expect(resource.uri).toBeTruthy();
      expect(resource.title).toBeTruthy();
      expect(resource.description).toBeTruthy();
    }
  });
});
