/**
 * The complete rendered file set of the EEF corpus markdown projection: the
 * corpus reference plus one file per strand, each with its path relative to a
 * caller-chosen output directory. Pure: this subpath carries no filesystem
 * access; writing the set is the caller's concern.
 */
import { renderCorpusReferenceMarkdown } from './eef-corpus-reference-markdown.js';
import { CORPUS_REFERENCE_FILE, strandFilePath } from './eef-markdown-paths.js';
import { renderStrandMarkdown } from './eef-strand-markdown.js';
import { EEF_STRAND_IDS } from './strand-lookup.js';

/** One rendered file: its path relative to the output root, and its markdown text. */
export interface RenderedMarkdownFile {
  readonly path: string;
  readonly text: string;
}

/**
 * Render every file of the projection.
 *
 * @returns The corpus reference first, then one entry per strand in corpus order.
 */
export function renderEefMarkdownFiles(): readonly RenderedMarkdownFile[] {
  const reference: RenderedMarkdownFile = {
    path: CORPUS_REFERENCE_FILE,
    text: renderCorpusReferenceMarkdown(),
  };
  const strands = EEF_STRAND_IDS.map((id): RenderedMarkdownFile => ({
    path: strandFilePath(id),
    text: renderStrandMarkdown(id),
  }));
  return [reference, ...strands];
}
