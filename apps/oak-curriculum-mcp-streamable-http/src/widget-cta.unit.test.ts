/**
 * Unit tests for the CTA (Call-to-Action) system.
 *
 * These tests verify the pure functions that generate CTA HTML and JavaScript.
 * They prove behavior, not implementation - we can change HOW the HTML/JS is
 * generated without breaking tests that prove WHAT is generated.
 *
 * @see widget-cta/ - Source module
 * @see testing-strategy.md - Unit test definitions
 */

import { describe, it, expect } from 'vitest';
import {
  generateCtaButtonHtml,
  generateCtaContainerHtml,
  generateCtaHandlerJs,
  CTA_REGISTRY,
  CTA_LIST,
  CTA_UNDERSTOOD_DELAY_MS,
  type CtaConfig,
} from './widget-cta/index.js';

describe('generateCtaButtonHtml', () => {
  describe('given a CTA config with icon', () => {
    const cta: CtaConfig = {
      id: 'test-cta',
      label: 'Test Action',
      loadingLabel: 'Loading...',
      understoodLabel: 'Done!',
      icon: '🎯',
      prompt: 'Test prompt',
    };

    it('generates a button element with correct id', () => {
      const html = generateCtaButtonHtml(cta);
      expect(html).toContain('id="test-cta-btn"');
    });

    it('generates a button element with btn and cta-btn classes', () => {
      const html = generateCtaButtonHtml(cta);
      expect(html).toContain('class="btn cta-btn"');
    });

    it('displays icon followed by label', () => {
      const html = generateCtaButtonHtml(cta);
      expect(html).toContain('>🎯 Test Action<');
    });
  });

  describe('given a CTA config without icon', () => {
    const cta: CtaConfig = {
      id: 'no-icon-cta',
      label: 'No Icon Action',
      loadingLabel: 'Working...',
      understoodLabel: 'Complete!',
      prompt: 'Test prompt',
    };

    it('displays only the label without leading space', () => {
      const html = generateCtaButtonHtml(cta);
      expect(html).toContain('>No Icon Action<');
      expect(html).not.toContain('> No Icon Action<');
    });
  });
});

describe('generateCtaContainerHtml', () => {
  it('generates a container div with id cta-container', () => {
    const html = generateCtaContainerHtml();
    expect(html).toContain('id="cta-container"');
  });

  it('generates a container with cta-container class', () => {
    const html = generateCtaContainerHtml();
    expect(html).toContain('class="cta-container"');
  });

  it('is hidden by default with inline style', () => {
    const html = generateCtaContainerHtml();
    expect(html).toContain('style="display:none"');
  });

  it('includes a button for each CTA in the registry', () => {
    const html = generateCtaContainerHtml();

    for (const cta of CTA_LIST) {
      expect(html).toContain(`id="${cta.id}-btn"`);
    }
  });

  it('includes a button for the learnOak CTA with correct id', () => {
    const html = generateCtaContainerHtml();
    expect(html).toContain('id="learn-oak-btn"');
    expect(html).toContain(CTA_REGISTRY.learnOak.label);
  });
});

describe('generateCtaHandlerJs', () => {
  it('generates JavaScript containing CTA_CONFIGS array', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('const CTA_CONFIGS = [');
  });

  it('generates JavaScript containing initCtaButtons function', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('function initCtaButtons()');
  });

  it('includes config entries for each CTA in the registry', () => {
    const js = generateCtaHandlerJs();

    for (const cta of CTA_LIST) {
      expect(js).toContain(`id: ${JSON.stringify(cta.id)}`);
    }
  });

  it('includes feature detection for sendFollowUpMessage', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('window.openai?.sendFollowUpMessage');
  });

  it('includes DOM ready handling', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('document.readyState');
    expect(js).toContain('DOMContentLoaded');
  });

  it('includes understoodText in config entries', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('understoodText:');
  });

  it('shows understood state with setTimeout after successful send', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain('btn.textContent = cta.understoodText');
    expect(js).toContain('setTimeout');
  });

  describe('prompt escaping', () => {
    it('escapes backticks in prompts for safe template literal embedding', () => {
      const js = generateCtaHandlerJs();
      expect(js).toMatch(/\\`[^`]+\\`/);
    });
  });
});

describe('CTA_UNDERSTOOD_DELAY_MS', () => {
  it('is defined as 10 seconds in milliseconds', () => {
    expect(CTA_UNDERSTOOD_DELAY_MS).toBe(10000);
  });

  it('is embedded in generated JavaScript for setTimeout', () => {
    const js = generateCtaHandlerJs();
    expect(js).toContain(String(CTA_UNDERSTOOD_DELAY_MS));
  });
});

describe('CTA_REGISTRY', () => {
  it('contains the learnOak CTA', () => {
    expect(CTA_REGISTRY).toHaveProperty('learnOak');
  });

  describe('learnOak CTA', () => {
    const learnOak = CTA_REGISTRY.learnOak;

    it('has id "learn-oak"', () => {
      expect(learnOak.id).toBe('learn-oak');
    });

    it('has a non-empty label', () => {
      expect(learnOak.label.length).toBeGreaterThan(0);
    });

    it('has a non-empty understoodLabel', () => {
      expect(learnOak.understoodLabel.length).toBeGreaterThan(0);
    });

    it('prompts for curriculum orientation', () => {
      expect(learnOak.prompt).toMatch(/orientation|domain model/i);
    });

    it('has a non-empty prompt', () => {
      expect(learnOak.prompt.length).toBeGreaterThan(0);
    });
  });
});
