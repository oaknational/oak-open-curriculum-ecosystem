/**
 * The landing page tool list includes both generated tools (from the OpenAPI
 * schema) and aggregated tools (hand-authored), with a visual split between
 * the two groups, and only the served-surface's live rows.
 */
import { AGGREGATED_TOOL_DEFS } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SERVED_SURFACE } from '../../served-surface/served-surface.js';
import { AGGREGATED_TOOL_ORDER, deriveLandingPageViewProps } from '../derive-view-props.js';
import { splitDescriptionByFirstParagraph, ToolsSection } from './tools-section.js';

const AGGREGATED_TOOL_NAMES = Object.keys(AGGREGATED_TOOL_DEFS);

const SAMPLE_GENERATED_TOOL_NAMES = [
  'get-key-stages',
  'get-subjects',
  'get-lessons-summary',
] as const;

describe('ToolsSection', () => {
  // Rendered through the build-time derivation: these tests hold the composed
  // invariant (derived membership × presentation), exactly what the baked
  // page ships.
  const { aggregatedTools, generatedTools } = deriveLandingPageViewProps();
  const html = renderToStaticMarkup(
    <ToolsSection aggregatedTools={aggregatedTools} generatedTools={generatedTools} />,
  );

  it('includes every LIVE aggregated tool name in the rendered HTML (served-surface filter)', () => {
    const liveNames = new Set(
      Object.entries(SERVED_SURFACE.universalTools)
        .filter(([, state]) => state === 'live')
        .map(([name]) => name),
    );
    for (const name of AGGREGATED_TOOL_NAMES) {
      if (liveNames.has(name)) {
        expect(html, name).toContain(name);
      }
    }
  });

  it('renders no dormant tool (the page advertises exactly what a client sees)', () => {
    const dormant = Object.entries(SERVED_SURFACE.universalTools)
      .filter(([, state]) => state === 'dormant')
      .map(([name]) => name);
    expect(dormant.length).toBeGreaterThan(0);
    for (const name of dormant) {
      expect(html, name).not.toContain(`<code>${name}</code>`);
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

  it('renders each tool as a disclosure with a how-to-use control', () => {
    // Asserted on the design-system class rather than the whole class list:
    // .oak-disclosure is what supplies the marker reset and the chevron, so
    // losing it is the regression worth catching. A nested <details> without
    // it renders the browser's native triangle beside the CSS chevron.
    expect(html).toMatch(/<details class="[^"]*\boak-disclosure\b[^"]*\btool-item\b/);
    expect(html).toContain('<summary>');
    expect(html).toContain('How to use');
  });

  it('names the tool inside each repeated how-to-use control', () => {
    // Two dozen identical "How to use" labels are indistinguishable in a
    // screen reader's control list; each carries a hidden tool name.
    expect(html).toContain(
      '<summary>How to use<span class="oak-visually-hidden"> get-curriculum-model</span></summary>',
    );
  });

  it('renders separate labelled groups for aggregated and API tools', () => {
    expect(html).toContain('Curriculum tools');
    expect(html).toContain('API pass-through');
  });

  it('renders the count from the served live-set length', () => {
    const liveCount = Object.values(SERVED_SURFACE.universalTools).filter(
      (state) => state === 'live',
    ).length;
    expect(html).toContain(`Tools (${String(liveCount)})`);
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

describe('splitDescriptionByFirstParagraph', () => {
  it('returns the whole description as the summary when there is one paragraph', () => {
    expect(splitDescriptionByFirstParagraph('Just a summary.')).toEqual(['Just a summary.', '']);
  });

  it('splits the summary from the how-to-use remainder at the first blank line', () => {
    expect(
      splitDescriptionByFirstParagraph('Summary line.\n\nHow to use it.\n\nAnd more.'),
    ).toEqual(['Summary line.', 'How to use it.\n\nAnd more.']);
  });
});
