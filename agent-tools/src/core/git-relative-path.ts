import path from 'node:path';

/**
 * Convert a host-separator relative path to git's canonical forward-slash
 * form.
 *
 * @remarks
 * git speaks forward-slash relative paths on every platform — `ls-files`,
 * `cat-file`, index queries, blob stores. Host-side helpers like
 * `path.relative` emit backslashes on Windows, so any of their output used as
 * a git path must cross through this boundary first; querying git with a
 * backslash path silently misses on Windows while working everywhere POSIX
 * (the class behind the refounding byte-source "no bytes staged" false
 * refusal, 2026-08-11).
 *
 * @param hostRelativePath - A repo-relative path in host separators.
 * @param separator - The host separator; defaults to `path.sep`, injectable
 *   so both separators are provable from any platform.
 */
export function toGitPath(hostRelativePath: string, separator: string = path.sep): string {
  return separator === '/' ? hostRelativePath : hostRelativePath.split(separator).join('/');
}
