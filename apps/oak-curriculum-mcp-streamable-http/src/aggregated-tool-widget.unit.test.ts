/**
 * Unit tests for widget HTML generation to verify syntax correctness.
 *
 */

import { describe, it, expect } from 'vitest';
import { generateWidgetHtml } from './aggregated-tool-widget.js';

describe('generateWidgetHtml', () => {
  it('should generate valid HTML', () => {
    const html = generateWidgetHtml();

    // Basic structure checks
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
    expect(html).toContain('<body>');
    expect(html).toContain('</body>');
  });

  it('should include required meta tags', () => {
    const html = generateWidgetHtml();

    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain('<meta name="viewport"');
    expect(html).toContain('<title>Oak National Academy</title>');
  });

  it('should include style and script tags', () => {
    const html = generateWidgetHtml();

    expect(html).toContain('<style>');
    expect(html).toContain('</style>');
    expect(html).toContain('<script type="module">');
    expect(html).toContain('</script>');
  });

  it('should include widget structure elements', () => {
    const html = generateWidgetHtml();

    expect(html).toContain('id="root"');
    expect(html).toContain('id="content-container"');
    expect(html).toContain('id="c"');
    expect(html).toContain('id="tool-name"');
  });

  it('should have matching opening and closing tags', () => {
    const html = generateWidgetHtml();

    // Count opening and closing tags
    const openDivs = (html.match(/<div/g) || []).length;
    const closeDivs = (html.match(/<\/div>/g) || []).length;
    expect(openDivs).toBe(closeDivs);

    const openMain = (html.match(/<main/g) || []).length;
    const closeMain = (html.match(/<\/main>/g) || []).length;
    expect(openMain).toBe(closeMain);
  });

  it('should not have unescaped backticks in script tag', () => {
    const html = generateWidgetHtml();

    // Extract the script content
    const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
    expect(scriptMatch).toBeTruthy();

    if (scriptMatch) {
      const scriptContent = scriptMatch[1];

      // Check for properly nested template literals
      // This is a heuristic check - backticks should be balanced
      const backticks = scriptContent.match(/`/g) || [];

      // Should have even number of backticks (they come in pairs for template literals)
      // OR if odd, they should all be escaped
      const unescapedBackticks = scriptContent.match(/(?<!\\\\)`/g) || [];

      // Log for debugging
      console.log('Total backticks:', backticks.length);
      console.log('Unescaped backticks:', unescapedBackticks.length);

      // Unescaped backticks should be even (template literal pairs)
      expect(unescapedBackticks.length % 2).toBe(0);
    }
  });

  it('should be valid when parsed by DOMParser', () => {
    const html = generateWidgetHtml();

    // In Node environment, we can't use DOMParser, but we can check for common syntax errors

    // No unterminated strings in script
    expect(html).not.toMatch(/<script[^>]*>[^<]*'[^']*$/);
    expect(html).not.toMatch(/<script[^>]*>[^<]*"[^"]*$/);

    // Script tag should be properly closed
    const scriptTags = html.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
    expect(scriptTags.length).toBeGreaterThan(0);
  });

  it('should have CSS variables embedded in style tag', () => {
    const html = generateWidgetHtml();

    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    expect(styleMatch).toBeTruthy();

    if (styleMatch) {
      const cssContent = styleMatch[1];

      // Check for expected CSS variables
      expect(cssContent).toContain('--safe-top');
      expect(cssContent).toContain('--safe-right');
      expect(cssContent).toContain('--safe-bottom');
      expect(cssContent).toContain('--safe-left');
      expect(cssContent).toContain('--bg');
      expect(cssContent).toContain('--fg');
    }
  });

  it('should have JavaScript functions embedded in script', () => {
    const html = generateWidgetHtml();

    const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
    expect(scriptMatch).toBeTruthy();

    if (scriptMatch) {
      const jsContent = scriptMatch[1];

      // Check for expected function declarations
      expect(jsContent).toContain('function applySafeAreaInsets');
      expect(jsContent).toContain('function render');

      // Check for expected constants
      expect(jsContent).toContain('const c =');
      expect(jsContent).toContain('const toolNameEl =');
    }
  });

  describe('minimal branding header', () => {
    it('wraps logo and wordmark in a link to thenational.academy', () => {
      const html = generateWidgetHtml();

      expect(html).toContain('href="https://www.thenational.academy"');
      expect(html).toContain('class="hdr-link"');
    });

    it('header starts hidden (display:none) for conditional visibility', () => {
      const html = generateWidgetHtml();

      expect(html).toMatch(/<header[^>]*style="display:none"/);
    });

    it('header has no border-bottom in CSS', () => {
      const html = generateWidgetHtml();
      const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
      expect(styleMatch).toBeTruthy();

      if (styleMatch) {
        const hdrRule = styleMatch[1].match(/\.hdr\s*\{[^}]*\}/);
        expect(hdrRule).toBeTruthy();
        if (hdrRule) {
          expect(hdrRule[0]).not.toContain('border-bottom');
        }
      }
    });

    it('JavaScript includes HEADER_TOOLS set for conditional visibility', () => {
      const html = generateWidgetHtml();
      const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
      expect(scriptMatch).toBeTruthy();

      if (scriptMatch) {
        const jsContent = scriptMatch[1];
        expect(jsContent).toContain('HEADER_TOOLS');
        expect(jsContent).toContain('search');
        expect(jsContent).toContain('browse-curriculum');
        expect(jsContent).toContain('explore-topic');
        expect(jsContent).toContain('fetch');
      }
    });
  });

  it('should not break JavaScript syntax with template literal nesting', () => {
    const html = generateWidgetHtml();

    // This test tries to detect common template literal escaping issues
    const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);

    if (scriptMatch) {
      const jsContent = scriptMatch[1];

      // Try to parse as JavaScript (this will throw if syntax is invalid)
      // Note: This is a very basic check and won't catch all runtime errors
      expect(() => {
        new Function(jsContent);
      }).not.toThrow();
    }
  });
});
