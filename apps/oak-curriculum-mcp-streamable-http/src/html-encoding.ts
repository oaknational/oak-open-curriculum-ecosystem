/**
 * HTML encoding utilities for safe embedding of content in HTML documents.
 *
 * These functions provide proper escaping for different HTML contexts:
 * - Text content
 * - Attribute values
 * - Script content embedded in HTML
 *
 */

/**
 * Encodes text for safe embedding in HTML text nodes.
 * Converts special HTML characters to entities.
 *
 * @param text - Plain text to encode
 * @returns HTML-safe encoded text
 *
 * @example
 * ```typescript
 * encodeHtmlText('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function encodeHtmlText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Encodes text for safe embedding in HTML attribute values.
 * More restrictive than text encoding.
 *
 * @param text - Text to encode for attribute
 * @returns Attribute-safe encoded text
 */
export function encodeHtmlAttribute(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('\n', '&#10;')
    .replaceAll('\r', '&#13;');
}

/**
 * Encodes JavaScript code for safe embedding in HTML <script> tags.
 *
 * The challenge: When embedding JS in `<script>`, the HTML parser sees `</script>`
 * as the closing tag, even inside strings. We must prevent this WITHOUT breaking
 * the JavaScript syntax.
 *
 * Strategy: Replace `</` with `<\/` in the JavaScript code.
 * In JavaScript, `\/` is just an escaped forward slash (same as `/`),
 * but it prevents the HTML parser from seeing `</script>`.
 *
 * @param jsCode - JavaScript code to encode
 * @returns Script-safe encoded JavaScript
 *
 * @example
 * ```typescript
 * const js = 'const html = "<p></script>";';
 * encodeScriptContent(js);
 * // Returns: 'const html = "<p><\/script>";'
 * // Valid JS, but won't close the HTML script tag
 * ```
 */
export function encodeScriptContent(jsCode: string): string {
  if (typeof jsCode !== 'string') {
    return '';
  }

  // Replace </ with <\/ to prevent script tag closure
  // This is safe because \/ in JavaScript is the same as /
  return jsCode.replaceAll('</', String.raw`<\/`);
}

/**
 * Decodes HTML entities back to plain text.
 * Use this when you need to reverse HTML encoding.
 *
 * @param html - HTML-encoded text
 * @returns Decoded plain text
 */
export function decodeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  return html
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&')
    .replaceAll('&#10;', '\n')
    .replaceAll('&#13;', '\r');
}
