/**
 * @fileoverview HTML escaping utility for preventing XSS vulnerabilities.
 *
 * Provides a pure function for escaping special HTML characters in user-provided
 * or dynamic content before rendering in HTML templates.
 *
 * @example
 * ```typescript
 * import { escapeHtml } from './escape-html.js';
 *
 * const userInput = '<script>alert("xss")</script>';
 * const safe = escapeHtml(userInput);
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */

/**
 * Escapes HTML special characters to prevent XSS.
 *
 * Replaces the following characters with their HTML entity equivalents:
 * - `&` → `&amp;`
 * - `<` → `&lt;`
 * - `>` → `&gt;`
 * - `"` → `&quot;`
 * - `'` → `&#039;`
 *
 * @param text - The text to escape
 * @returns HTML-escaped text safe for rendering in HTML
 *
 * @example
 * ```typescript
 * escapeHtml('<script>') // Returns: '&lt;script&gt;'
 * escapeHtml('foo & bar') // Returns: 'foo &amp; bar'
 * ```
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
