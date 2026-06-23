/**
 * Unit tests for the resources section renderer.
 *
 * Verifies the landing page lists the FULL MCP resource catalogue
 * (`ALL_MCP_RESOURCES`) — documentation, curriculum model, the two curriculum
 * graphs, and the EEF interpretation guide — not just the documentation
 * resources. Binding to the catalogue keeps the page from silently drifting.
 */
import { ALL_MCP_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { describe, it, expect } from 'vitest';

import { renderResourcesSection } from './render-resources-section.js';

describe('renderResourcesSection', () => {
  const html = renderResourcesSection();

  it('includes the uri and title of every resource in the canonical catalogue', () => {
    for (const resource of ALL_MCP_RESOURCES) {
      expect(html).toContain(resource.uri);
      expect(html).toContain(resource.title);
    }
  });

  it('includes the EEF and curriculum-model resources, not just documentation', () => {
    expect(html).toContain('eef://interpretation');
    expect(html).toContain('curriculum://model');
  });

  it('does not list the removed prior-knowledge-graph resource (served by the anchored tool)', () => {
    expect(html).not.toContain('curriculum://prior-knowledge-graph');
  });

  it('does not list the removed misconception-graph resource (served by the anchored tool)', () => {
    expect(html).not.toContain('curriculum://misconception-graph');
  });

  it('does not list the removed thread-progressions resource (served by the anchored tool)', () => {
    expect(html).not.toContain('curriculum://thread-progressions');
  });

  it('renders the count from the full catalogue length', () => {
    expect(html).toContain(`Resources (${String(ALL_MCP_RESOURCES.length)})`);
  });

  it('renders the expandable section structure', () => {
    expect(html).toContain('<details class="card expandable">');
    expect(html).toContain('<summary>');
    expect(html).toContain('<ul class="tool-list">');
  });
});
