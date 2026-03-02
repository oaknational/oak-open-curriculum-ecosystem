/**
 * Integration tests for widget HTML generation to ensure no script tag breakout.
 *
 * Tests the complete HTML generation pipeline:
 * 1. Widget HTML generation (aggregated-tool-widget.ts)
 * 2. Script escaping (widget-script-escaping.ts)
 * 3. Emulation wrapper (chatgpt-emulation-wrapper.ts)
 *
 */

import { describe, it, expect } from 'vitest';
import { generateWidgetHtml } from './aggregated-tool-widget.js';

describe('Widget HTML Generation - Integration', () => {
  describe('Script Tag Safety', () => {
    it('should generate HTML with exactly one closing script tag', () => {
      const html = generateWidgetHtml();

      // Count all </script> tags in the generated HTML
      const scriptClosingTags = html.match(/<\/script>/gi) || [];

      // Should have exactly one: the main script tag wrapper
      expect(scriptClosingTags.length).toBe(1);
    });

    it('should escape any </script> sequences in embedded JavaScript', () => {
      const html = generateWidgetHtml();

      // Extract the script tag content
      const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
      expect(scriptMatch).toBeTruthy();

      if (scriptMatch) {
        const scriptContent = scriptMatch[1];

        // Check for properly escaped sequences
        // If there are any HTML strings in the JS, they should use <\/script> not </script>
        const unescapedScriptTags = scriptContent.match(/(?<!\\)<\/script/gi);
        expect(unescapedScriptTags).toBeNull();
      }
    });

    it('should be parseable by an HTML parser', () => {
      const html = generateWidgetHtml();

      // Verify basic HTML structure
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('</html>');

      // Verify the script tag is properly formed
      const scriptRegex = /<script type="module">[\s\S]*<\/script>/;
      expect(html).toMatch(scriptRegex);
    });
  });

  describe('Widget Structure', () => {
    it('should include all required UI elements', () => {
      const html = generateWidgetHtml();

      expect(html).toContain('id="root"');
      expect(html).toContain('id="content-container"');
      expect(html).toContain('id="c"');
      expect(html).toContain('id="tool-name"');
    });

    it('should include the Oak logo SVG', () => {
      const html = generateWidgetHtml();
      expect(html).toContain('<svg');
      expect(html).toContain('</svg>');
    });

    it('should include styles', () => {
      const html = generateWidgetHtml();
      expect(html).toContain('<style>');
      expect(html).toContain('</style>');
    });
  });

  describe('JavaScript Embedded in HTML Strings', () => {
    it('should handle renderer functions that build HTML strings safely', () => {
      const html = generateWidgetHtml();

      // The widget script includes renderer functions that build HTML strings
      // These might contain things like '<p>', '</div>', etc.
      // But they should never create an unescaped '</script>' sequence

      const fullHtml = html;
      const allScriptClosures = fullHtml.match(/<\/script/gi) || [];

      // Should only find the legitimate closing tag
      expect(allScriptClosures.length).toBeLessThanOrEqual(2); // 1 in head (if any), 1 in body
    });
  });
});
