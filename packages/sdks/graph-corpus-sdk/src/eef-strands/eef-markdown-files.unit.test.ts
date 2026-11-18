import { posix } from 'node:path';

import { format } from 'prettier';
import { describe, expect, it } from 'vitest';

import { renderEefMarkdownFiles } from './eef-markdown-files.js';
import { CORPUS_REFERENCE_FILE, strandFilePath } from './eef-markdown-paths.js';
import { EEF_STRAND_IDS } from './strand-lookup.js';

const files = renderEefMarkdownFiles();
const renderedPaths: ReadonlySet<string> = new Set(files.map((file) => file.path));

/** A file name of lower-case letters, digits and hyphens, optionally under the strands directory. */
const SAFE_PATH_SHAPE = /^(strands\/)?[a-z0-9-]+\.md$/;

/** The relative markdown link targets in a rendered text. */
function relativeLinkTargets(text: string): readonly string[] {
  return [...text.matchAll(/\]\((\.{1,2}\/[^)]+)\)/g)].map((match) => match[1] ?? '');
}

describe('renderEefMarkdownFiles', () => {
  it('renders the corpus reference and exactly one file per strand, with no orphan and no gap', () => {
    const expected = [CORPUS_REFERENCE_FILE, ...EEF_STRAND_IDS.map((id) => strandFilePath(id))];

    expect(files.map((file) => file.path)).toEqual(expected);
    expect(renderedPaths.size).toBe(expected.length);
  });

  it('places every strand file under the strands directory and the reference beside it', () => {
    const [reference, ...strands] = files;

    expect(reference?.path.includes('/')).toBe(false);
    expect(strands).toHaveLength(EEF_STRAND_IDS.length);
    expect(strands.every((file) => file.path.startsWith('strands/'))).toBe(true);
  });

  it.each(files)('$path is a safe relative path with no parent segment', ({ path }) => {
    expect(path).toMatch(SAFE_PATH_SHAPE);
    expect(path.includes('..')).toBe(false);
  });

  it.each(files)('$path links only to files in the rendered set', ({ path, text }) => {
    const targets = relativeLinkTargets(text);
    const unresolved = targets
      .map((target) => posix.normalize(posix.join(posix.dirname(path), target)))
      .filter((resolved) => !renderedPaths.has(resolved));

    expect(targets.length).toBeGreaterThan(0);
    expect(unresolved).toEqual([]);
  });

  it.each(files)('$path keeps the structural invariants the blocks promise', ({ text }) => {
    const lines = text.split('\n');

    expect(text.startsWith('# ')).toBe(true);
    expect(text.endsWith('\n')).toBe(true);
    expect(text.endsWith('\n\n')).toBe(false);
    expect(text).not.toContain('\n\n\n');
    expect(lines.some((line) => /\s$/.test(line))).toBe(false);
    expect(lines.some((line) => /^[*+] /.test(line))).toBe(false);
  });

  // The markdown parser with no options: the repository's formatter
  // configuration sets nothing that changes markdown output (prose wrapping
  // stays at its preserve default), and the writer script re-checks every
  // written file against the resolved repository configuration, which is
  // where a drift in that configuration would surface.
  it.each(files)("$path is already in the formatter's normal form", async ({ text }) => {
    const normalised = await format(text, { parser: 'markdown' });

    expect(normalised).toBe(text);
  });
});
