/**
 * Strip a Markdown link title from a link target, as a string walk.
 *
 * @remarks
 * A link target may end in a title, `path "Title"`: a quoted span after at
 * least one whitespace character, closing the target. The regex form
 * (`/\s+"[^"]*"$/`) is super-linear (SonarCloud S8786; the cure recorded in
 * `docs/governance/sonar-disposition-policy.md` §S8786 is a rewrite to a
 * string operation): the title is found from the end instead. Shared by the
 * markdown-link and reference-direction validators (one home at the second
 * consumer).
 *
 * @packageDocumentation
 */

/** True for one whitespace character. */
function isWhitespace(character: string): boolean {
  return /\s/u.test(character);
}

/**
 * The target without its trailing ` "Title"`, found from the end: the last
 * character must be a double quote, the opening quote is the previous one,
 * and at least one whitespace character must stand before it. Anything else
 * is returned as written.
 *
 * @param target - A raw link target, possibly carrying a title.
 * @returns The target up to the whitespace that precedes the title.
 */
export function stripLinkTitle(target: string): string {
  if (!target.endsWith('"')) {
    return target;
  }
  const opening = target.lastIndexOf('"', target.length - 2);
  if (opening <= 0 || !isWhitespace(target.charAt(opening - 1))) {
    return target;
  }
  let cut = opening - 1;
  while (cut > 0 && isWhitespace(target.charAt(cut - 1))) {
    cut -= 1;
  }
  return target.slice(0, cut);
}
