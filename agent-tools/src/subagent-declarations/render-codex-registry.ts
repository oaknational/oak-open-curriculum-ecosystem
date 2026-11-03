/**
 * The Codex registry (closure item 6, 2b-ii, slice A2): `.codex/config.toml` is a hand-kept
 * head (the host's own settings: the file opener, the features, the hooks) followed by one
 * `[agents."<name>"]` block per Codex adapter, each carrying the adapter's description and
 * its config file. The head is kept verbatim up to the first block; the blocks are rendered
 * from the declarations, sorted by name, so the registry names exactly the adapters the
 * generator renders (`render-codex-adapter.ts`). The tail starts at the first line that names
 * the agents table at all, however loosely written, and admits nothing but blocks in the
 * rendered shape (the header, the description, the config file, in that order, blank lines
 * between): a foreign line there (a section a hand placed after the registry, a header
 * written with leading whitespace or an inline comment, a field outside its place in a
 * block, a header with no fields) refuses naming that line rather than being dropped or
 * mistaken for head, and the cure is to move it above the first block or complete the
 * block. A description a TOML basic string cannot carry verbatim refuses as the adapter
 * itself does.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { CODEX_REGISTRY_PATH, platformDescription, specsOf } from './adapter-spec.js';
import { carriesTomlLineUnsafe } from './render-codex-adapter.js';
import type { SubagentDeclaration } from './subagent-declaration.js';

// Any line that opens the agents table starts the tail, so a header written loosely is
// judged there as foreign, never kept as head.
const HEADER_CANDIDATE = /^\s*\[\s*agents\s*\./u;
const BLOCK_HEADER = /^\[agents\."([^"]+)"\]$/u;
// The block fields as TOML writes them, escapes admitted here so the render, not the split,
// is what judges a description the basic string cannot carry verbatim.
const DESCRIPTION_FIELD = /^description = "(?:[^"\\]|\\.)*"$/u;
const CONFIG_FILE_FIELD = /^config_file = "(?:[^"\\]|\\.)*"$/u;
// The lines of one block, in the order the render writes them.
const BLOCK_LINES = [BLOCK_HEADER, DESCRIPTION_FIELD, CONFIG_FILE_FIELD] as const;

/**
 * Split the registry text into its hand-kept head and check that its tail holds blocks only.
 * The text is LF (the port LF-normalises every read); the head is every line before the
 * first line naming the agents table, each with its newline, so a registry that starts with
 * a block has an empty head and one with no block is closed by the blank line the blocks
 * follow; either way the rendered registry splits to the same head again, so `--fix` is a
 * fixpoint.
 *
 * @param path - The registry's repo-relative path, for the refusal.
 * @param text - The registry's full LF text.
 * @returns The head, or the refusal naming the first foreign line in the tail.
 */
export function splitCodexRegistry(path: string, text: string): Result<string, string> {
  const lines = text.split('\n');
  const first = lines.findIndex((line) => HEADER_CANDIDATE.test(line));
  if (first === -1) {
    return ok(closedHead(text));
  }
  const foreign = firstForeignTailLine(lines.slice(first));
  if (foreign !== undefined) {
    return err(
      `${path}: line "${foreign}" sits in the registry tail, which the declarations render whole; write a block line in the rendered shape with its block complete, or move a foreign section above the first agents block; refusing to regenerate the sub-agent adapters`,
    );
  }
  return ok(
    lines
      .slice(0, first)
      .map((line) => `${line}\n`)
      .join(''),
  );
}

/**
 * The first tail line out of place: a line that is not the block line due next (blank lines
 * pass anywhere), or the header of a block the text ends before completing.
 */
function firstForeignTailLine(tail: readonly string[]): string | undefined {
  let due = 0;
  let header = '';
  for (const line of tail) {
    if (line === '') {
      continue;
    }
    const pattern = BLOCK_LINES[due];
    if (pattern === undefined || !pattern.test(line)) {
      return line;
    }
    header = due === 0 ? line : header;
    due = (due + 1) % BLOCK_LINES.length;
  }
  return due === 0 ? undefined : header;
}

/** A head with no registry after it, closed by the blank line the first block needs. */
function closedHead(text: string): string {
  if (text === '') {
    return '';
  }
  const terminated = text.endsWith('\n') ? text : `${text}\n`;
  return terminated.endsWith('\n\n') ? terminated : `${terminated}\n`;
}

/**
 * Render the registry: the head verbatim, then one block per Codex adapter in name order.
 * The declarations are the set `renderSubagentAdapters` accepted, so no two specs share a
 * name (it refuses those first); called alone on such a set, two blocks would carry one
 * name.
 *
 * @param head - The hand-kept head as `splitCodexRegistry` returns it.
 * @param declarations - The templates' declarations, in any order.
 * @returns The registry text, or the refusal for a description the TOML form cannot carry.
 */
export function renderCodexRegistry(
  head: string,
  declarations: readonly SubagentDeclaration[],
): Result<string, string> {
  const specs = declarations
    .flatMap(specsOf)
    .filter((spec) => spec.platforms.includes('codex'))
    .sort((left, right) => left.name.localeCompare(right.name));
  const unsafe = specs.find((spec) => carriesTomlLineUnsafe(platformDescription('codex', spec)));
  if (unsafe !== undefined) {
    return err(
      `${CODEX_REGISTRY_PATH}: the description of ${unsafe.name} carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it`,
    );
  }
  const blocks = specs.map(
    (spec) =>
      `[agents."${spec.name}"]\ndescription = "${platformDescription('codex', spec)}"\nconfig_file = "agents/${spec.name}.toml"\n`,
  );
  return ok(`${head}${blocks.join('\n')}`);
}
