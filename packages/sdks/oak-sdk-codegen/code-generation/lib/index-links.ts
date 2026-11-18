/**
 * Reads the relative link targets out of a generated Markdown index.
 *
 * @remarks
 * `verify-docs.ts` derives the Markdown pages it expects from the links the
 * generated `index.md` carries, so the generator's own curation decides what
 * must exist. Each link is `[label](./target)`; a label never contains a
 * square bracket and a target never contains a parenthesis, which keeps the
 * scan linear over any index (`sonarjs/super-linear-regex`).
 */

/** `[label](./target)`: the label without brackets, the target without parentheses. */
const RELATIVE_LINK = /\[[^\][]+\]\(\.\/([^()]+)\)/g;

/**
 * The `./`-relative link targets in document order, as written.
 *
 * @param markdown - The generated index content
 */
export function extractRelativeLinkTargets(markdown: string): readonly string[] {
  return [...markdown.matchAll(RELATIVE_LINK)].flatMap((match) =>
    match[1] === undefined ? [] : [match[1]],
  );
}
