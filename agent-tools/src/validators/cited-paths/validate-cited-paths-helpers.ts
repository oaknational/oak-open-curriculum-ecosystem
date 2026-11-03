/**
 * Resolve repository-path citations in authored surfaces against the paths
 * that exist.
 *
 * Doctrine cites the surfaces it depends on by path: a rule points at a
 * pattern record, a skill at a sub-agent template, a directive at a
 * reference. When the target is absent the citation is a latent refusal — a
 * seat follows it and finds nothing. On 2026-09-13 forty such targets were
 * cited from twenty live files after a lineage transplant, and no gate saw
 * them: `validate-markdown-links` skips code spans by design. This helper is
 * the recur-proof half of the cure. Extraction lives in
 * `extract-path-citations.ts`; this module resolves each citation through an
 * injected existence check so it stays pure.
 *
 * @packageDocumentation
 */

import { extractPathCitations } from './extract-path-citations.js';

export { extractPathCitations };

/** A citation whose target does not exist. */
export interface MissingPathFinding {
  /** Repo-relative path to the file containing the finding. */
  readonly path: string;
  /** 1-based line number of the finding. */
  readonly line: number;
  /** The token as written. */
  readonly match: string;
  /** The normalised repo-relative target that does not exist. */
  readonly target: string;
}

/**
 * Resolve every path citation in the given files through `exists`.
 *
 * @param files - In-memory files with repo-relative paths.
 * @param exists - Whether a repo-relative path names an existing file or
 * directory.
 * @returns Findings in file then line order; empty when every citation
 * resolves.
 *
 * @example
 * ```ts
 * findMissingPathCitations(
 *   [{ path: '.agent/rules/x.md', content: 'See `.agent/memory/active/patterns/gone.md`.' }],
 *   () => false,
 * );
 * // [{ path: '.agent/rules/x.md', line: 1, match: '.agent/memory/active/patterns/gone.md', target: '.agent/memory/active/patterns/gone.md' }]
 * ```
 */
export function findMissingPathCitations(
  files: readonly { readonly path: string; readonly content: string }[],
  exists: (target: string) => boolean,
): readonly MissingPathFinding[] {
  return files.flatMap((file) => missingCitationsInFile(file, exists));
}

/**
 * The phrase an import provenance uses to name a path in the tree a surface was imported
 * from. A citation on such a line (or one wrapped from the previous line) names a foreign
 * tree by design and is never resolved against this repository (PDR-142: the record of where
 * a surface came from is the record; the cited-paths gate checks this repository's own
 * citations).
 */
const FOREIGN_TREE_PHRASE = 'source repo-relative path';

/**
 * Whether this citation is the provenance target: the first code span after the foreign-tree
 * phrase, on the phrase's line or the one after it. Any other citation in that window is a
 * local citation and resolves as usual.
 */
function namesForeignTree(lines: readonly string[], line: number, match: string): boolean {
  const previous = line >= 2 ? (lines[line - 2] ?? '') : '';
  const current = lines[line - 1] ?? '';
  const joined = `${previous} ${current}`.replaceAll(/\s+/g, ' ');
  const phraseAt = joined.indexOf(FOREIGN_TREE_PHRASE);
  if (phraseAt === -1) {
    return false;
  }
  const afterPhrase = joined.slice(phraseAt + FOREIGN_TREE_PHRASE.length);
  const firstSpan = /`([^`]+)`/.exec(afterPhrase);
  return firstSpan !== null && firstSpan[1] === match;
}

function missingCitationsInFile(
  file: { readonly path: string; readonly content: string },
  resolves: (target: string) => boolean,
): readonly MissingPathFinding[] {
  const lines = file.content.split('\n');
  return extractPathCitations(file.content)
    .filter((citation) => !namesForeignTree(lines, citation.line, citation.match))
    .filter((citation) => !resolves(citation.target))
    .map((citation) => ({
      path: file.path,
      line: citation.line,
      match: citation.match,
      target: citation.target,
    }));
}
