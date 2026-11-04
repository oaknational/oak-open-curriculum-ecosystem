/**
 * The file-system port of the rule-frontmatter sweep, with its `node:fs` default.
 *
 * The port classifies an entry before the sweep reads it: `entryKind` uses `lstat` on the path,
 * so its leaf entry is never followed and a symlinked source is refused rather than read or
 * written through (a link in an ancestor directory is outside this guard). Writes go through
 * the estate's atomic text writer (temp file, sync, rename), so a failed write never leaves a
 * half-written rule behind; `realSweepFs` takes the writer as a parameter so that property is
 * proven over an injected file system rather than asserted by name. `readSource` is the one
 * admitted read the sweep performs: every refusal it returns names the repo-relative path.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { writeTextAtomically } from '../collaboration-state/atomic-file.js';
import { isEnoent } from '../core/authored-surfaces.js';

/** The file-system operations the sweep needs; the real `node:fs` by default. */
export interface SweepFs {
  /**
   * What stands at a path, its leaf entry unfollowed: a regular file, nothing, or
   * anything else (a link, a directory, a special file).
   */
  entryKind: (absolutePath: string) => Promise<'file' | 'absent' | 'other'>;
  readFile: (absolutePath: string) => Promise<string>;
  writeFile: (absolutePath: string, text: string) => Promise<void>;
}

/**
 * The real file system: `lstat` classifies a linked leaf as itself, never as its target, and
 * every write goes through `writeFile`, the estate's atomic writer unless a caller injects one.
 */
export function realSweepFs(writeFile: SweepFs['writeFile'] = writeTextAtomically): SweepFs {
  return {
    entryKind: async (absolutePath) => {
      try {
        return (await fs.lstat(absolutePath)).isFile() ? 'file' : 'other';
      } catch (error: unknown) {
        if (isEnoent(error)) {
          return 'absent';
        }
        throw error;
      }
    },
    readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
    writeFile,
  };
}

/** The port the sweep uses when none is injected. */
export const defaultSweepFs: SweepFs = realSweepFs();

const NOT_A_REGULAR_FILE =
  'not a regular file (a symlink or special entry); the sweep reads and writes regular files only';

/**
 * Read a source file after admitting its entry kind: a missing file is a refusal naming the
 * path, anything that is not a regular file is a refusal naming the path and the kind, and
 * any other failure is a refusal naming the path and the cause, never a crash past the
 * sweep's all-or-nothing contract.
 */
export async function readSource(
  repoRoot: string,
  relativePath: string,
  sweepFs: SweepFs,
): Promise<Result<string, string>> {
  // POSIX joins throughout: every surface path is POSIX-relative, Node's fs accepts forward slashes
  // on Windows, and the fakes the tests inject key their trees by POSIX paths.
  const absolutePath = path.posix.join(repoRoot, relativePath);
  try {
    const kind = await sweepFs.entryKind(absolutePath);
    if (kind === 'absent') {
      return err(`${relativePath}: missing`);
    }
    if (kind === 'other') {
      return err(`${relativePath}: ${NOT_A_REGULAR_FILE}`);
    }
    return ok(await sweepFs.readFile(absolutePath));
  } catch (error: unknown) {
    if (isEnoent(error)) {
      return err(`${relativePath}: missing`);
    }
    const cause = error instanceof Error ? error.message : String(error);
    return err(`${relativePath}: unreadable (${cause})`);
  }
}
