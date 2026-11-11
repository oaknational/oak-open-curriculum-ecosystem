/**
 * Path scoping for a `ScopedContentBlockGroup`, shared by the write-hook
 * (absolute file paths) and the whole-tree gates that reuse the policy's
 * blocks (repository-relative paths).
 * The root a root-anchored scope reads against is the caller's: for the hook,
 * the session's project directory; a path outside it matches no anchored
 * scope, so the anchor fails closed, never open. Separators are the host's:
 * on a Windows host (`sep` is the backslash) a backslash reads as `/` in the
 * path and the root before any scope is tested; on a POSIX host a backslash
 * is a character of a name and reads as nothing else. The prefix comparison
 * is case-sensitive, so a drive letter spelt two ways for one tree fails
 * closed (the exemption does not apply), never open.
 */

import { sep } from 'node:path';

/** A Windows absolute path: a drive letter with a separator, or a UNC root. */
const WINDOWS_ABSOLUTE = /^(?:[A-Za-z]:[\\/]|\\\\)/u;

/** The seams a caller may set: the repository root, the host's separator, what a relative path means. */
export interface PathScopeOptions {
  /** The repository root an absolute path is made relative to; none means no anchored match. */
  readonly repoRoot?: string;
  /** The host's separator; a backslash host reads backslashes as `/`. Defaults to `node:path`'s. */
  readonly separator?: '/' | '\\';
  /**
   * Whether a relative path is repository-relative (the whole-tree gates' paths are; the
   * default). The write-hook passes `false`: its relative paths come from a payload and are
   * resolved against the payload's working directory before scoping, so one still relative
   * here has no known place in the repository and claims no anchored exemption.
   */
  readonly relativeIsRepoRelative?: boolean;
}

/** The path with the host's separators read as `/`, so every scope form compares one way. */
function withSlashes(filePath: string, separator: '/' | '\\'): string {
  return separator === '\\' ? filePath.replaceAll('\\', '/') : filePath;
}

function isAbsolutePath(filePath: string, separator: '/' | '\\'): boolean {
  return filePath.startsWith('/') || (separator === '\\' && WINDOWS_ABSOLUTE.test(filePath));
}

/**
 * The file path relative to the repository root, when it can be: a relative
 * path as given (when the caller says its relative paths are repository-relative);
 * an absolute path inside a known root made relative; an absolute path outside
 * the root, with no root known, or a relative path the caller cannot place,
 * `undefined` (no repository surface, so no root-anchored scope can name it).
 */
function repoRelativePath(filePath: string, options: PathScopeOptions): string | undefined {
  const separator = options.separator ?? hostSeparator();
  const file = withSlashes(filePath, separator);
  if (!isAbsolutePath(filePath, separator)) {
    return options.relativeIsRepoRelative === false ? undefined : file;
  }
  if (options.repoRoot === undefined) {
    return undefined;
  }
  const root = withSlashes(options.repoRoot, separator);
  const prefix = root.endsWith('/') ? root : `${root}/`;
  return file.startsWith(prefix) ? file.slice(prefix.length) : undefined;
}

function hostSeparator(): '/' | '\\' {
  return sep === '\\' ? '\\' : '/';
}

/**
 * Whether a repository-relative path is the anchored entry itself or a descendant of it:
 * a directory entry (trailing `/`) is a prefix; a file entry matches exactly or as a
 * directory prefix, never a sibling that merely shares the name (`policy.json.bak`).
 */
function underAnchor(relative: string, anchor: string): boolean {
  if (anchor.endsWith('/')) {
    return relative.startsWith(anchor);
  }
  return relative === anchor || relative.startsWith(`${anchor}/`);
}

/**
 * Match a single path-scope entry against a file path.
 *
 * Entries beginning with `**\/*` (no space) are treated as a suffix match
 * (e.g. `**\/*.plan.md` matches any path ending in `.plan.md`). Entries
 * beginning with `./` are root-anchored: they match a repository-relative
 * path from its first character (`./.agent/memory/` matches
 * `.agent/memory/x.md`, never `docs/.agent/memory/x.md`), so an exemption
 * cannot be claimed by a nested copy of an exempt path. All other
 * entries are treated as substring matches against the file path, which
 * works equivalently for absolute and relative forms because the path
 * always contains its own directory prefix.
 */
function matchesPathScope(filePath: string, scope: string, options: PathScopeOptions): boolean {
  const slashed = withSlashes(filePath, options.separator ?? hostSeparator());
  if (scope.startsWith('**/*')) {
    return slashed.endsWith(scope.slice(4));
  }
  if (scope.startsWith('./')) {
    const relative = repoRelativePath(filePath, options);
    return relative !== undefined && underAnchor(relative, scope.slice(2));
  }
  return slashed.includes(scope);
}

/**
 * Determine whether a file path is in scope for a `ScopedContentBlockGroup` —
 * matches at least one include and no excludes. `options.repoRoot` lets a
 * root-anchored scope read an absolute path (the write-hook's form); the
 * whole-tree gates pass repository-relative paths and need no root.
 */
export function isPathInScope(
  filePath: string | undefined,
  includePaths: readonly string[],
  excludePaths: readonly string[] = [],
  options: PathScopeOptions = {},
): boolean {
  if (filePath === undefined) {
    return false;
  }
  const matchesInclude = includePaths.some((scope) => matchesPathScope(filePath, scope, options));
  if (!matchesInclude) {
    return false;
  }
  return !excludePaths.some((scope) => matchesPathScope(filePath, scope, options));
}
