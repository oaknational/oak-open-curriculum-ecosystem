/**
 * The small markdown building blocks the EEF renderers share: headings, bullet
 * lists, links, autolinks, inline code, a key-to-label helper and the document
 * join. Kept to shapes the
 * repository's formatter leaves untouched (dash bullets, one blank line between
 * blocks, a single trailing newline) so rendered text is formatter-normal by
 * construction.
 */

/** A heading of the given level. */
export function heading(level: 1 | 2 | 3, text: string): string {
  return `${'#'.repeat(level)} ${text}`;
}

/** A dash bullet list, one item per line. */
export function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/** A URL as a markdown autolink. */
export function autolink(url: string): string {
  return `<${url}>`;
}

/** A markdown link. */
export function link(text: string, target: string): string {
  return `[${text}](${target})`;
}

/** Inline code. */
export function code(text: string): string {
  return `\`${text}\``;
}

/** Join rendered blocks with one blank line between them, ending with a single newline. */
export function document(blocks: readonly string[]): string {
  return `${blocks.join('\n\n')}\n`;
}

/** A readable label from a snake_case corpus key: `early_years` becomes `Early years`. */
export function labelFromKey(key: string): string {
  const spaced = key.replaceAll('_', ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
