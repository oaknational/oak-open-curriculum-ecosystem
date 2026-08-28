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
 */
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
