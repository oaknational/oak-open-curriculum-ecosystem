import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

/**
 * The push credential file's lifecycle: a fresh private directory, one
 * exclusive-create write at mode 0600 (owner-only on POSIX; Windows has no
 * POSIX mode bits, so protection there rests on the per-user temp
 * directory's ACL), one removal — and the two translations that keep
 * filesystem failures off the CLI's usage-error path. Split from
 * `push-git.ts` at the size gate; the two files together are the whole
 * credential discipline (`push-git.ts` owns the helper, the environment, and
 * the argv).
 */

/**
 * The token file's lifecycle seam, injectable so tests never touch a
 * filesystem: a private directory, one exclusive-create write, one removal.
 */
export interface TokenFileStore {
  /** Create a fresh private directory (0700 on POSIX) and return its path. */
  readonly mkdtemp: (prefix: string) => string;
  /** Write `content` to `path` with `mode`, refusing an existing file. */
  readonly writeFile: (path: string, content: string, mode: number) => void;
  /** Remove the directory and everything in it. */
  readonly remove: (dir: string) => void;
}

/** The real filesystem translation, at exactly one boundary. */
export function realTokenFileStore(): TokenFileStore {
  return {
    mkdtemp: (prefix) => mkdtempSync(join(tmpdir(), prefix)),
    // `wx` refuses to follow a pre-existing path, so nothing can swap a
    // symlink into the fresh private directory between create and write.
    writeFile: (path, content, mode) => {
      writeFileSync(path, content, { mode, flag: 'wx' });
    },
    remove: (dir) => {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

/** The token file, staged: the private directory and the file inside it (0600 on POSIX). */
export interface StagedToken {
  readonly dir: string;
  readonly tokenPath: string;
}

/**
 * Stage the token file, translating the filesystem's throws to a value
 * (ADR-088): a full or unwritable temp root is an operational failure, and an
 * escaping throw would land it on the CLI's usage-error exit instead. A
 * half-staged directory is removed before reporting.
 */
export function stageTokenFile(store: TokenFileStore, token: string): Result<StagedToken, Error> {
  let dir: string | undefined;
  try {
    dir = store.mkdtemp('merge-bot-push-');
    const tokenPath = join(dir, 'token');
    store.writeFile(tokenPath, token, 0o600);
    return ok({ dir, tokenPath });
  } catch (cause) {
    if (dir !== undefined) {
      removeQuietly(store, dir);
    }
    return err(
      new Error(
        `cannot stage the push credential file: ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
    );
  }
}

/**
 * Remove the token directory WITHOUT letting a removal failure replace the
 * transfer's outcome: a throw here after a landed push would misreport the
 * push as failed — the same completed-mutation-misreported class the merge
 * side guards with its state-UNKNOWN wording. The failure surfaces as a
 * warning line (path only, never content) for the caller's stderr.
 */
export function removeQuietly(store: TokenFileStore, dir: string): string | undefined {
  try {
    store.remove(dir);
    return undefined;
  } catch (cause) {
    return `warning: push credential directory not removed (${dir}): ${cause instanceof Error ? cause.message : String(cause)}`;
  }
}
