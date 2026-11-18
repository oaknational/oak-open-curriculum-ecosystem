/**
 * The typed outcomes of reading a rule surface, and the pure classification
 * behind the listing. The projection leg acts destructively on a listing (`--fix`
 * removes a projection no rule renders), so a listing never reads a failure
 * as "nothing here": absence is ENOENT and nothing else, any other read
 * failure is `unreadable`, and an entry that is not a regular file is
 * `foreign` before any file is listed. A directory is foreign too: the rule
 * surfaces are flat (the canonical set admits no nested rule), and Claude
 * Code loads `.claude/rules/` recursively, so a nested hand-authored file
 * would be read by the platform and unseen by the gate (the 2a code-expert
 * finding, 2026-09-14). A regular file without the surface's extension is
 * listed as `stray`, never dropped: a `README.txt` on a wholly generated
 * surface is stale there (a `.DS_Store` a file browser drops is too, and
 * `--fix` removes it: the contract as stated) and a refusal on the canonical
 * one (the #74 round-one finding, 2026-09-14).
 *
 * @packageDocumentation
 */

import { compareRuleNames } from '../../rule-declarations/rule-name.js';

/** What listing a directory found: the closed set of outcomes a caller must handle. */
export type DirectoryListing =
  | { readonly kind: 'absent' }
  | { readonly kind: 'unreadable'; readonly cause: string }
  /** An entry that is not a regular file: a directory, a symlink or a special file. */
  | { readonly kind: 'foreign'; readonly entry: string }
  | {
      readonly kind: 'files';
      /** The regular files with the extension, sorted, repo-relative. */
      readonly files: readonly string[];
      /** The regular files without the extension, sorted, repo-relative. */
      readonly stray: readonly string[];
    };

/** What reading one entry found: the closed set of outcomes a caller must handle. */
export type EntryRead =
  | { readonly kind: 'absent' }
  | { readonly kind: 'unreadable'; readonly cause: string }
  /** The entry is not a regular file: a directory, a symlink or a special file. */
  | { readonly kind: 'foreign' }
  | { readonly kind: 'text'; readonly text: string };

/** The two facts about a directory entry the classification reads (`fs.Dirent` satisfies it). */
export interface DirectoryEntry {
  readonly name: string;
  isFile(): boolean;
}

/**
 * Classify a directory's entries: the first entry in name order that is not a
 * regular file makes the listing `foreign`; otherwise the regular files, sorted,
 * as repo-relative paths, split by whether they carry the extension.
 */
export function classifyDirectoryEntries(
  relDir: string,
  entries: readonly DirectoryEntry[],
  extension: string,
): DirectoryListing {
  const sorted = [...entries].sort((a, b) => compareRuleNames(a.name, b.name));
  const foreign = sorted.find((entry) => !entry.isFile());
  if (foreign !== undefined) {
    return { kind: 'foreign', entry: `${relDir}/${foreign.name}` };
  }
  const paths = sorted.map((entry) => `${relDir}/${entry.name}`);
  return {
    kind: 'files',
    files: paths.filter((entry) => entry.endsWith(extension)),
    stray: paths.filter((entry) => !entry.endsWith(extension)),
  };
}
