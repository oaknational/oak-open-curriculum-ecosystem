/**
 * File layout of the EEF corpus markdown projection, owned in one place so the
 * renderers' relative links and the rendered file set agree by construction.
 *
 * Layout, relative to a consumer-chosen output directory:
 *
 * - `eef-corpus-reference.md` — source and attribution, methodology, caveats
 *   and the strand index (`renderCorpusReferenceMarkdown`).
 * - `strands/<strand id>.md` — one file per strand (`renderStrandMarkdown`).
 *
 * A strand's file name is its corpus id plus `.md`. Every id in the corpus is
 * lower-case letters, digits and hyphens, and the package's tests pin that
 * shape over every path the file-set function returns, so a corpus refresh
 * that carried a path segment in an id reddens a test before any file name is
 * built from it.
 */
import type { EefStrandId } from './strand-lookup.js';

/** The directory, relative to the output root, that holds the per-strand files. */
export const STRANDS_DIRECTORY = 'strands';

/** The corpus-reference file name, relative to the output root. */
export const CORPUS_REFERENCE_FILE = 'eef-corpus-reference.md';

/** Link from a strand file up to the corpus-reference file. */
export const CORPUS_REFERENCE_LINK_FROM_STRAND = `../${CORPUS_REFERENCE_FILE}`;

function strandBaseName(id: EefStrandId): string {
  return `${id}.md`;
}

/** Path of a strand's file relative to the output root: `strands/<id>.md`. */
export function strandFilePath(id: EefStrandId): string {
  return `${STRANDS_DIRECTORY}/${strandBaseName(id)}`;
}

/** Link from one strand file to a sibling strand file. */
export function strandLinkFromStrand(id: EefStrandId): string {
  return `./${strandBaseName(id)}`;
}

/** Link from the corpus-reference file down to a strand file. */
export function strandLinkFromReference(id: EefStrandId): string {
  return `./${strandFilePath(id)}`;
}
