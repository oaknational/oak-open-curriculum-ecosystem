/**
 * Split a markdown document into its leading YAML frontmatter block and body.
 *
 * @remarks
 * Shared by the package-gate integration tests (skill frontmatter contract,
 * merged-skill derivation) so fence handling cannot diverge between them
 * (consolidate-at-second-consumer). Parsing the YAML itself stays with the
 * caller, which owns the schema it expects.
 *
 * @packageDocumentation
 */

export interface SplitDocument {
  /** The YAML between the fences, without them. */
  readonly frontmatter: string;
  /** Everything after the closing fence. */
  readonly body: string;
}

const FENCE = /^---\n([\s\S]*?)\n---\n/;

/** The frontmatter and body, or `undefined` when the document has no leading fence. */
export function splitFrontmatter(markdown: string): SplitDocument | undefined {
  const match = FENCE.exec(markdown);
  if (match === null) {
    return undefined;
  }
  return { frontmatter: match[1] ?? '', body: markdown.slice(match[0].length) };
}
