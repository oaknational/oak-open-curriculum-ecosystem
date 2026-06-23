/**
 * Unit tests for the tools section renderer.
 *
 * Verifies that the landing page tool list includes both generated tools
 * (from OpenAPI schema) and aggregated tools (hand-authored), with a
 * visual split between the two groups.
 */
import { AGGREGATED_TOOL_DEFS } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { describe, it, expect } from 'vitest';

import { AGGREGATED_TOOL_ORDER, renderToolsSection } from './render-tools-section.js';

const AGGREGATED_TOOL_NAMES = Object.keys(AGGREGATED_TOOL_DEFS);

const SAMPLE_GENERATED_TOOL_NAMES = [
  'get-key-stages',
  'get-subjects',
  'get-lessons-summary',
] as const;

describe('renderToolsSection', () => {
  const html = renderToolsSection();

  it('includes all aggregated tool names in the rendered HTML', () => {
    for (const name of AGGREGATED_TOOL_NAMES) {
      expect(html).toContain(name);
    }
  });

  it('includes generated tool names in the rendered HTML', () => {
    for (const name of SAMPLE_GENERATED_TOOL_NAMES) {
      expect(html).toContain(name);
    }
  });

  it('renders aggregated tools before generated tools', () => {
    const searchPos = html.indexOf('>search<');
    const getKeyStagesPos = html.indexOf('>get-key-stages<');
    expect(searchPos).toBeGreaterThan(-1);
    expect(getKeyStagesPos).toBeGreaterThan(-1);
    expect(searchPos).toBeLessThan(getKeyStagesPos);
  });

  it('renders aggregated tools in preferred order (model, browse, explore, search, fetch, others)', () => {
    const getModelPos = html.indexOf('>get-curriculum-model<');
    const browsePos = html.indexOf('>browse-curriculum<');
    const explorePos = html.indexOf('>explore-topic<');
    const searchPos = html.indexOf('>search<');
    const fetchPos = html.indexOf('>fetch<');
    expect(getModelPos).toBeLessThan(browsePos);
    expect(browsePos).toBeLessThan(explorePos);
    expect(explorePos).toBeLessThan(searchPos);
    expect(searchPos).toBeLessThan(fetchPos);
  });

  it('renders each tool with details/summary structure', () => {
    expect(html).toContain('<details class="tool-item">');
    expect(html).toContain('<summary>');
    expect(html).toContain('How to use');
  });

  it('renders separate labelled groups for aggregated and API tools', () => {
    expect(html).toContain('Curriculum tools');
    expect(html).toContain('API pass-through');
  });
});

describe('AGGREGATED_TOOL_ORDER', () => {
  it('assigns every aggregated tool an explicit position, exactly once', () => {
    const byName = (a: string, b: string): number => a.localeCompare(b);
    expect([...AGGREGATED_TOOL_ORDER].sort(byName)).toEqual(
      [...AGGREGATED_TOOL_NAMES].sort(byName),
    );
  });
});
