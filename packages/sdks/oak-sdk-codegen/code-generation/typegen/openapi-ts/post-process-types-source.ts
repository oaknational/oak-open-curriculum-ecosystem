/**
 * Rewrites openapi-typescript's output for TSDoc: the JSDoc tags it emits
 * that TSDoc does not know are stripped, and the characters that break the
 * TSDoc parser inside doc comments are escaped.
 *
 * @remarks
 * Runs before `rename-root-types.ts` and `hoist-repeated-unions.ts` in
 * `codegen-core.ts`; `post-process-types-source.unit.test.ts` beside this
 * module pins each shape it rewrites.
 */

/**
 * Escape TSDoc-unsafe characters inside a doc comment body.
 *
 * Braces, angle brackets, and literal backslash-n sequences that appear in
 * generated OpenAPI descriptions/examples break the TSDoc parser. This
 * function escapes them while preserving valid inline tags.
 */
const PLACEHOLDER_PREFIX = '___TSDOC_SAFE_';
const PLACEHOLDER_SUFFIX = '___';

function escapeTsDocUnsafeChars(docBody: string): string {
  // Protect complete valid TSDoc inline tags with placeholders before escaping
  const placeholders: string[] = [];
  let withPlaceholders = docBody.replaceAll(/\{@(?:link|inheritDoc)\s[^}]*\}/g, (match) => {
    placeholders.push(match);
    return `${PLACEHOLDER_PREFIX}${String(placeholders.length - 1)}${PLACEHOLDER_SUFFIX}`;
  });

  withPlaceholders = withPlaceholders
    // Escape remaining braces
    .replaceAll('{', String.raw`\{`)
    .replaceAll('}', String.raw`\}`)
    // Escape angle brackets (HTML-like syntax)
    .replaceAll('<', String.raw`\<`)
    .replaceAll('>', String.raw`\>`)
    // Escape literal \n sequences (not real newlines) that appear in VTT examples
    .replaceAll(String.raw`\n`, String.raw`\\n`);

  // Restore valid inline tags
  const pattern = new RegExp(String.raw`${PLACEHOLDER_PREFIX}(\d+)${PLACEHOLDER_SUFFIX}`, 'g');
  return withPlaceholders.replaceAll(pattern, (_, idx) => placeholders[Number(idx)] ?? '');
}

/**
 * Rewrites openapi-typescript's output for TSDoc.
 *
 * @remarks
 * The tag-stripping patterns are anchored per line under the `m` flag and
 * use `[ \t]` for the whitespace around a tag: `\s` would also match the line
 * break, letting `^` and `$` pair across lines and backtrack over the whole
 * module (`sonarjs/super-linear-regex`). The two forms give the same output
 * for every shape openapi-typescript emits (verified over the committed
 * schema, 2026-11-02); `post-process-types-source.unit.test.ts` pins each
 * shape.
 */
export function postProcessTypesSource(source: string): string {
  return (
    source
      .replaceAll('\u00A0', ' ')
      .replaceAll(/headers: \{\n\s*\[name: string\]: unknown;\n\s*\};/g, 'headers?: never;')
      // Strip non-standard JSDoc tags emitted by openapiTS
      .replaceAll(/\/\*\*[ \t]*@description[ \t]+/g, '/** ')
      .replaceAll(/^([ \t]*\*)[ \t]*@description[ \t]+/gm, '$1 ')
      .replaceAll(/^([ \t]*\*)[ \t]*@constant[ \t]*$/gm, '')
      .replaceAll(/^[ \t]*\/\*\*[ \t]*@constant[ \t]*\*\/[ \t]*$/gm, '')
      .replaceAll(/^([ \t]*\*)[ \t]*@enum[ \t]+\{[^}]*\}[ \t]*$/gm, '')
      .replaceAll(/^[ \t]*\/\*\*[ \t]*@enum[ \t]+\{[^}]*\}[ \t]*\*\/[ \t]*$/gm, '')
      // Escape TSDoc-unsafe characters within doc comments only
      .replaceAll(/\/\*\*[\s\S]*?\*\//g, (match) => escapeTsDocUnsafeChars(match))
  );
}
