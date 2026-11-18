/**
 * Fixed, root-owned directories holding the shell and core utilities a
 * hermetic smoke's child processes may use, partitioned by platform.
 *
 * Smokes that spawn `git` hand their children this list as their ENTIRE
 * `PATH`, so no writable directory on the ambient `PATH` can shadow the
 * executables the smoke means to exercise. git runs hooks through a shell,
 * so the shell's directory must be on it or the hook never executes — the
 * failure then reads as "the hook produced no output", which is
 * indistinguishable from the defect these smokes exist to catch.
 *
 * Partitioning, not path-shape filtering: on win32 a rooted POSIX path is
 * drive-relative and resolves into user-plantable space, so the POSIX entries
 * are never consulted there. The win32 entries are Git for Windows' bundled
 * shell and utilities, hard-coded under `Program Files` on the system drive
 * (read-execute only for non-administrators); deriving them from
 * `%ProgramFiles%` would make a fixed path environment-influenced.
 *
 * Beside the directories: the shell itself by absolute path (`trustedShell`)
 * and the form of a file path that shell can open (`shellSafePath`).
 */
import assert from 'node:assert/strict';
import { sep } from 'node:path';

import { isErr } from '@oaknational/result';

import { toGitPath } from '../src/core/git-relative-path.js';
import { resolveTrustedShell } from '../src/core/trusted-shell.js';

const TRUSTED_SHELL_DIRECTORIES = {
  posix: ['/usr/bin', '/bin'],
  win32: [String.raw`C:\Program Files\Git\usr\bin`, String.raw`C:\Program Files\Git\bin`],
} as const;

/**
 * The platform's trusted directories joined as a `PATH` value.
 *
 * @param platform - injected so both branches are provable from any host.
 * The delimiter follows the INJECTED platform too (`;` on win32, `:`
 * otherwise), never `path.delimiter` — the host's delimiter would join the
 * win32 directories with `:` on a POSIX host, splitting every `C:` drive
 * designator and making the advertised cross-host seam untruthful.
 */
export function trustedShellPath(platform: NodeJS.Platform = process.platform): string {
  const directories =
    platform === 'win32' ? TRUSTED_SHELL_DIRECTORIES.win32 : TRUSTED_SHELL_DIRECTORIES.posix;

  return directories.join(platform === 'win32' ? ';' : ':');
}

/**
 * The trusted shell's absolute path for a smoke to spawn, or the smoke fails
 * at once with the resolver's own message (a smoke has no caller to hand a
 * `Result` to). Never `sh` by name: see `resolveTrustedShell`.
 */
export function trustedShell(): string {
  const shell = resolveTrustedShell();
  if (isErr(shell)) {
    assert.fail(shell.error.message);
  }
  return shell.value;
}

/**
 * A file path as `sh` can open it on every platform. `sh` knows `/` as the
 * only path separator: a word without one is a command name to look up on
 * `PATH`, so `.` and `exec` handed a `C:\...` path by Git for Windows' shell
 * search for a command instead of opening the file, however the word is
 * quoted. The host separator becomes `/`, which Windows accepts, through the
 * same separator boundary git paths cross (`toGitPath`); on a POSIX host the
 * path returns as it is, a backslash there being a legal filename character.
 * Quoting is the caller's, at the point of embedding, since a path can carry
 * spaces (`C:\Program Files\...`).
 *
 * @param separator - The host separator; defaults to `path.sep`, injectable
 *   so both branches are provable from any platform.
 */
export function shellSafePath(filePath: string, separator: string = sep): string {
  return toGitPath(filePath, separator);
}
