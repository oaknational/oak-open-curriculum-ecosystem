import { describe, it, expect } from 'vitest';
import {
  encodeHtmlText,
  encodeHtmlAttribute,
  encodeScriptContent,
  decodeHtml,
} from './html-encoding.js';

describe('HTML Encoding - Unit Tests', () => {
  describe('encodeHtmlText', () => {
    it('should encode basic HTML entities', () => {
      expect(encodeHtmlText('<div>Test</div>')).toBe('&lt;div&gt;Test&lt;/div&gt;');
    });

    it('should encode quotes and ampersands', () => {
      expect(encodeHtmlText('A & B "quoted"')).toBe('A &amp; B &quot;quoted&quot;');
    });

    it('should encode script tags', () => {
      expect(encodeHtmlText('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('should handle empty strings', () => {
      expect(encodeHtmlText('')).toBe('');
    });
  });

  describe('encodeHtmlAttribute', () => {
    it('should encode all special characters', () => {
      const input = '<div class="test" data-value=\'val\'>content</div>';
      const output = encodeHtmlAttribute(input);

      expect(output).not.toContain('<');
      expect(output).not.toContain('>');
      expect(output).not.toContain('"');
      expect(output).not.toContain("'");
    });

    it('should encode newlines', () => {
      expect(encodeHtmlAttribute('line1\nline2\rline3')).toBe('line1&#10;line2&#13;line3');
    });
  });

  describe('encodeScriptContent', () => {
    it('should encode </script> to prevent HTML parser closure', () => {
      const js = 'const html = "</script>";';
      const encoded = encodeScriptContent(js);

      expect(encoded).toBe('const html = "<\\/script>";');
    });

    it('should handle multiple occurrences', () => {
      const js = 'const a = "</script>"; const b = "</SCRIPT>";';
      const encoded = encodeScriptContent(js);

      expect(encoded).toBe('const a = "<\\/script>"; const b = "<\\/SCRIPT>";');
    });

    it('should not break valid JavaScript', () => {
      const js = 'const x = 1</2; // division';
      const encoded = encodeScriptContent(js);

      // Should encode </ even in division context
      expect(encoded).toContain('<\\/');
    });

    it('should handle renderer HTML generation', () => {
      const js = `
function renderHelp() {
  let h = '<div>';
  h += '<p>Content</script>';
  h += '</div>';
  return h;
}`;
      const encoded = encodeScriptContent(js);

      expect(encoded).toContain('<\\/script>');
      expect(encoded).not.toContain('</script>');
    });

    it('should create valid JavaScript after encoding', () => {
      const js = 'const test = "<p></script>";';
      const encoded = encodeScriptContent(js);

      // The encoded version should be valid JS
      expect(() => {
        new Function(encoded);
      }).not.toThrow();
    });
  });

  describe('decodeHtml', () => {
    it('should decode HTML entities', () => {
      const encoded = '&lt;div&gt;Test&lt;/div&gt;';
      expect(decodeHtml(encoded)).toBe('<div>Test</div>');
    });

    it('should be inverse of encodeHtmlText', () => {
      const original = '<script>alert("test")</script>';
      const encoded = encodeHtmlText(original);
      const decoded = decodeHtml(encoded);

      expect(decoded).toBe(original);
    });
  });

  describe('Round-trip encoding', () => {
    it('should preserve content through encode/decode cycle', () => {
      const original = 'A & B <div>"test"</div>';
      const encoded = encodeHtmlText(original);
      const decoded = decodeHtml(encoded);

      expect(decoded).toBe(original);
    });
  });
});
