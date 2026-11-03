/**
 * Read the path scoping a hand-kept Claude rule adapter (`.claude/rules/<rule>.md`) carries.
 *
 * Most adapters are a bare pointer line with no frontmatter. A few carry a `description` and
 * a `paths` value that scopes the rule to files; only the paths matter here, because the
 * description is read from the Cursor trigger (the one source the Director named for it).
 *
 * @packageDocumentation
 */

import { ok, type Result } from '@oaknational/result';

import { splitCommaList } from './comma-list.js';
import { readFrontmatterLines } from './frontmatter-lines.js';

const CLAUDE_KEYS: ReadonlySet<string> = new Set(['description', 'paths']);

/**
 * Parse the `paths` a Claude rule adapter declares.
 *
 * @param text - The adapter file text.
 * @returns The path globs, empty when the adapter has no frontmatter or no `paths`, or the
 * reason the block could not be read.
 *
 * @example
 * ```ts
 * parseClaudeRuleAdapterPaths('---\npaths: "**\/*.ts"\n---\n\nRead and follow ...');
 * // { ok: true, value: ['**\/*.ts'] }
 * ```
 */
export function parseClaudeRuleAdapterPaths(text: string): Result<readonly string[], string> {
  const block = readFrontmatterLines(text, CLAUDE_KEYS);
  if (!block.ok) {
    return block;
  }
  const paths = block.value?.get('paths');
  return paths === undefined ? ok([]) : splitCommaList(paths);
}
