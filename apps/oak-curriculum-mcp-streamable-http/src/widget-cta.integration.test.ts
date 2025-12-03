/**
 * Integration tests for the CTA (Call-to-Action) system.
 *
 * These tests verify how the CTA system integrates with the widget.
 * They prove that the generated HTML and JavaScript are correctly
 * embedded in the widget output.
 *
 * Per testing-strategy.md, integration tests verify how code units work
 * together when imported - NOT running systems.
 *
 * @see widget-cta.ts - CTA generators
 * @see aggregated-tool-widget.ts - Widget HTML that embeds CTAs
 * @see widget-script-state.ts - Widget script that embeds CTA handlers
 * @see testing-strategy.md - Integration test definitions
 */

import { describe, it, expect } from 'vitest';
import { AGGREGATED_TOOL_WIDGET_HTML } from './aggregated-tool-widget.js';
import { WIDGET_STATE_JS } from './widget-script-state.js';
import { CTA_REGISTRY } from './widget-cta/index.js';

describe('CTA integration with widget HTML', () => {
  describe('CTA container placement', () => {
    it('includes the CTA container in the widget HTML', () => {
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain('id="cta-container"');
    });

    it('places CTA container inside the header element', () => {
      // The CTA should be inside the .hdr div, not after it
      // Extract the header section and verify CTA is inside
      const headerMatch = /<div class="hdr">[\s\S]*?<\/div>\s*<div id="c">/.exec(
        AGGREGATED_TOOL_WIDGET_HTML,
      );
      expect(headerMatch).not.toBeNull();

      const headerContent = headerMatch?.[0] ?? '';
      expect(headerContent).toContain('id="cta-container"');
    });

    it('CTA container is hidden by default', () => {
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(
        'id="cta-container" class="cta-container" style="display:none"',
      );
    });
  });

  describe('CTA buttons in widget HTML', () => {
    it('includes a button for each registered CTA', () => {
      const registryKeys = Object.keys(CTA_REGISTRY);

      for (const key of registryKeys) {
        const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
        expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(`id="${cta.id}-btn"`);
      }
    });

    it('includes the learnOak button with correct id and label', () => {
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain('id="learn-oak-btn"');
      // Verify the label from the registry appears in the button
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(CTA_REGISTRY.learnOak.label);
    });
  });
});

describe('CTA integration with widget script', () => {
  describe('CTA handler in widget script', () => {
    it('includes the CTA initialization function', () => {
      expect(WIDGET_STATE_JS).toContain('function initCtaButtons()');
    });

    it('includes CTA_CONFIGS array with registered CTAs', () => {
      expect(WIDGET_STATE_JS).toContain('const CTA_CONFIGS = [');

      const registryKeys = Object.keys(CTA_REGISTRY);
      for (const key of registryKeys) {
        const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
        expect(WIDGET_STATE_JS).toContain(`id: '${cta.id}'`);
      }
    });

    it('includes feature detection for OpenAI API', () => {
      expect(WIDGET_STATE_JS).toContain('window.openai?.sendFollowUpMessage');
    });

    it('includes click handler that calls sendFollowUpMessage', () => {
      expect(WIDGET_STATE_JS).toContain(
        'await window.openai.sendFollowUpMessage({ prompt: cta.prompt })',
      );
    });

    it('includes loading state management', () => {
      expect(WIDGET_STATE_JS).toContain('btn.disabled = true');
      expect(WIDGET_STATE_JS).toContain('btn.textContent = cta.loadingText');
    });

    it('includes error recovery that re-enables button', () => {
      expect(WIDGET_STATE_JS).toContain('btn.disabled = false');
      expect(WIDGET_STATE_JS).toContain('btn.textContent = cta.buttonText');
    });

    it('hides CTA container on successful send', () => {
      expect(WIDGET_STATE_JS).toContain("if (ctaContainer) ctaContainer.style.display = 'none'");
    });
  });
});

describe('CTA widget structure coherence', () => {
  it('widget HTML button IDs match what the script expects', () => {
    // The script looks for elements by ID pattern: cta.id + '-btn'
    // The HTML should have buttons with those IDs
    const registryKeys = Object.keys(CTA_REGISTRY);

    for (const key of registryKeys) {
      const cta = CTA_REGISTRY[key as keyof typeof CTA_REGISTRY];
      const expectedId = `${cta.id}-btn`;

      // HTML should have the button
      expect(AGGREGATED_TOOL_WIDGET_HTML).toContain(`id="${expectedId}"`);

      // Script should look for this ID
      expect(WIDGET_STATE_JS).toContain(`id: '${cta.id}'`);
    }
  });

  it('widget HTML container ID matches what the script expects', () => {
    // Script looks for 'cta-container'
    expect(WIDGET_STATE_JS).toContain("document.getElementById('cta-container')");
    // HTML should have that ID
    expect(AGGREGATED_TOOL_WIDGET_HTML).toContain('id="cta-container"');
  });
});
