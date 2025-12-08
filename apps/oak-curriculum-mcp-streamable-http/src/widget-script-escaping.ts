/**
 * Safe HTML escaping for JavaScript-embedded HTML strings.
 *
 * When embedding HTML strings inside `<script>` tags, special care must be taken
 * to escape sequences that could prematurely close the script tag.
 *
 * @module widget-script-escaping
 */

/**
 * Escapes HTML strings that will be embedded in JavaScript code inside `<script>` tags.
 *
 * **Critical**: When HTML strings containing `</script>` are embedded in JavaScript,
 * the browser's HTML parser will see the `</script>` and close the script tag
 * prematurely, even though it's inside a JavaScript string literal.
 *
 * Example of the problem:
 * ```html
 * <script>
 *   const html = '<p>Hello</script>';  // Browser closes script tag HERE!
 *   console.log(html);                 // This never executes
 * </script>
 * ```
 *
 * The solution is to escape the forward slash in `</script>` to `<\/script>`.
 *
 * @param html - HTML string to be safely embedded in JavaScript
 * @returns Escaped HTML string safe for embedding in `<script>` tags
 *
 * @example
 * ```typescript
 * const html = escapeHtmlForScript('<p>Text</script>');
 * // Returns: '<p>Text<\/script>'
 *
 * const jsCode = `const x = '${html}';`;
 * // Safe to embed in <script> tag
 * ```
 */
export function escapeHtmlForScript(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // Escape </script> to prevent premature script tag closure
  // Replace </script with <\/script (escape the forward slash)
  return html.replace(/<\/script/gi, '<\\/script');
}

/**
 * Escapes a complete JavaScript code block for safe embedding in HTML.
 *
 * This function ensures that any JavaScript code can be safely embedded
 * inside a `<script type="module">` tag without breaking out.
 *
 * @param jsCode - JavaScript code to escape
 * @returns Escaped JavaScript code
 */
export function escapeJsForScriptTag(jsCode: string): string {
  if (typeof jsCode !== 'string') {
    return '';
  }

  // Escape any </script> sequences in the JavaScript code
  return jsCode.replace(/<\/script/gi, '<\\/script');
}

/**
 * Safely wraps JavaScript code in a <script> tag with proper escaping.
 *
 * @param jsCode - JavaScript code to wrap
 * @param type - Script type attribute (default: 'module')
 * @returns Complete script tag with escaped content
 */
export function wrapInScriptTag(jsCode: string, type = 'module'): string {
  const escapedCode = escapeJsForScriptTag(jsCode);
  return `<script type="${type}">${escapedCode}</script>`;
}
