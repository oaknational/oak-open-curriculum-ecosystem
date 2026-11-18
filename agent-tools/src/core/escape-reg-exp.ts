/**
 * `text` with every regular-expression metacharacter escaped, so it matches itself
 * literally when composed into a `RegExp` source outside a character class (with or without
 * the `u` flag); `-` is left as it is, so the result does not belong inside `[...]`.
 */
export function escapeRegExp(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}
