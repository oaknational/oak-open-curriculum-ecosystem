/**
 * The landing page lists exactly the SERVED resources — the SDK inventory
 * filtered to the served-surface definition's live rows. The page advertises
 * what a connected client sees; dormant inventory (the creation-oriented
 * guidance documents, D11) never renders.
 */
import { ALL_MCP_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { isResourceLive, SERVED_SURFACE } from '../../served-surface/served-surface.js';
import { deriveLandingPageViewProps } from '../derive-view-props.js';
import { ResourcesSection } from './resources-section.js';

const SERVED_RESOURCES = ALL_MCP_RESOURCES.filter((r) => isResourceLive(SERVED_SURFACE, r.uri));
const DORMANT_RESOURCES = ALL_MCP_RESOURCES.filter((r) => !isResourceLive(SERVED_SURFACE, r.uri));

describe('ResourcesSection', () => {
  // Rendered through the build-time derivation — the composed invariant the
  // baked page ships.
  const html = renderToStaticMarkup(
    <ResourcesSection resources={deriveLandingPageViewProps().resources} />,
  );

  it('includes the uri and title of every SERVED resource — and no dormant inventory', () => {
    expect(SERVED_RESOURCES.length).toBeGreaterThan(0);
    for (const resource of SERVED_RESOURCES) {
      expect(html).toContain(resource.uri);
      expect(html).toContain(resource.title);
    }
    expect(DORMANT_RESOURCES.length).toBeGreaterThan(0);
    for (const resource of DORMANT_RESOURCES) {
      expect(html).not.toContain(resource.uri);
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

  it('renders the count from the served live-set length', () => {
    expect(html).toContain(`Resources (${String(SERVED_RESOURCES.length)})`);
  });

  it('renders as a design-system card accordion', () => {
    expect(html).toContain('<details class="oak-card oak-accordion">');
    expect(html).toContain('<summary>');
    expect(html).toContain('<ul class="tool-list"');
  });
});
