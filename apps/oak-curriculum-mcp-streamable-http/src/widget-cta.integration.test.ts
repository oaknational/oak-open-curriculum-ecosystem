/**
 * Integration tests for the CTA (Call-to-Action) system.
 *
 * These tests verify the BEHAVIOR of how multiple CTA system units work together:
 * - The registry is the single source of truth that drives HTML and JS generation
 * - The HTML and JavaScript are coherent with each other (IDs match)
 *
 * Per testing-strategy.md, we test BEHAVIOR, not implementation details.
 * We should be able to completely refactor the HTML/JS generation code
 * without breaking these tests, as long as the behavior remains the same.
 *
 * @see widget-cta/ - CTA generators
 * @see aggregated-tool-widget.ts - Widget HTML that embeds CTAs
 * @see widget-script-state.ts - Widget script that embeds CTA handlers
 * @see testing-strategy.md - Integration test definitions
 */

import { describe, it, expect } from 'vitest';
import { AGGREGATED_TOOL_WIDGET_HTML } from './aggregated-tool-widget.js';
import { WIDGET_STATE_JS } from './widget-script-state.js';
import { CTA_REGISTRY } from './widget-cta/index.js';

describe('CTA integration: registry drives HTML generation', () => {
  it('generates a button element for each CTA defined in the registry', () => {
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const key of Object.keys(CTA_REGISTRY)) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(`id="${cta.id}-btn"`);
    }
  });

  it('includes each CTA label from the registry in the HTML output', () => {
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const key of Object.keys(CTA_REGISTRY)) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(cta.label);
    }
  });

  it('places the CTA container within the header for layout positioning', () => {
    // Behavior: CTAs appear in header area (important for UX)
    const headerMatch = /<div class="hdr">[\s\S]*?<\/div>\s*<div id="c">/.exec(
      AGGREGATED_TOOL_WIDGET_HTML,
    );
    expect(headerMatch?.[0]).toContain('cta-container');
  });
});

describe('CTA integration: registry drives JavaScript generation', () => {
  it('includes all registered CTA IDs in the generated JavaScript', () => {
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const key of Object.keys(CTA_REGISTRY)) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
      expect(WIDGET_STATE_JS).toContain(cta.id);
    }
  });

  it('includes all registered CTA prompts in the generated JavaScript', () => {
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const key of Object.keys(CTA_REGISTRY)) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
      // Prompt content should be present (may be escaped)
      // Check for a distinctive phrase from each prompt
      const promptSnippet = cta.prompt.slice(0, 30);
      expect(WIDGET_STATE_JS).toContain(promptSnippet);
    }
  });
});

describe('CTA integration: HTML and JavaScript coherence', () => {
  it('button IDs in HTML match the IDs referenced in JavaScript', () => {
    // If HTML has id="foo-btn", JS should reference id: 'foo'
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    for (const key of Object.keys(CTA_REGISTRY)) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];

      // HTML creates button with id pattern: {cta.id}-btn
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(`id="${cta.id}-btn"`);

      // JS must reference the same base id to find the button
      expect(WIDGET_STATE_JS).toContain(`'${cta.id}'`);
    }
  });

  it('container ID in HTML matches what JavaScript looks for', () => {
    // Both must agree on the container ID for the JS to show/hide it
    expect(AGGREGATED_TOOL_WIDGET_HTML).toContain('id="cta-container"');
    expect(WIDGET_STATE_JS).toContain('cta-container');
  });
});
