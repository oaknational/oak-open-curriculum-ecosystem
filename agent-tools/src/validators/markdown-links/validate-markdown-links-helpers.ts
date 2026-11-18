/**
 * Pure helpers for the markdown-links validator.
 *
 * An internal markdown link is a dependency on a file path; if the target is
 * absent the link is broken. These functions extract internal links,
 * resolve each target to a repo-relative path, classify it broken when the
 * target file is missing, and — where the only fault is relative-path depth —
 * suggest the corrected path. They are pure: callers supply paths, contents,
 * and the repo file inventory; no IO and deterministic POSIX path semantics.
 *
 * Cross-file fragment validation (does a `#section` anchor exist in the
 * *target* file) is a documented future enhancement, deliberately out of scope:
 * markdownlint already covers same-file fragments, and cross-file anchors need
 * target-file heading parsing this version does not do.
 *
 * @packageDocumentation
 */

import posix from 'node:path/posix';

import { stripLinkTitle } from '../../core/strip-link-title.js';

import type { ExtractedLink } from './validate-markdown-links-types.js';

// Re-exported so consumers (and tests) resolve the data shapes from the
// validator's public helper surface; the type definitions live in the sibling
// module to keep this logic module under the per-file size budget.
export type {
  ExtractedLink,
  MarkdownLinkReport,
  ScanFile,
} from './validate-markdown-links-types.js';

/**
 * Path segments / suffixes that are excluded from scanning *and* from
 * auto-correction candidate matching. Archives are deliberately excluded
 * (owner direction): a link into an archive is not a live dependency, and an
 * archived file is never a suggested fix target.
 */
const EXCLUDED_DIR_SEGMENTS = ['/archive/', 'node_modules/', '.git/'] as const;

/** True when a repo-relative path must be excluded from scanning and matching. */
export function isExcludedPath(repoRelPath: string): boolean {
  const p = repoRelPath.replace(/^\.\//, '');
  if (p.endsWith('.original.md')) {
    return true;
  }
  // Normalise to a leading-slash form so a top-level `archive/` or `.git/`
  // segment is matched the same way as a nested one.
  const guarded = `/${p}`;
  return EXCLUDED_DIR_SEGMENTS.some((segment) => guarded.includes(segment));
}

/**
 * Extract internal markdown links from `content`. Resolves inline links
 * (`](target)`) and reference definitions (`[label]: target`). External URLs
 * (`http:`, `https:`, `mailto:`), pure `#fragment` anchors, and the empty
 * target are ignored at extraction time.
 *
 * Backticked paths are deliberately NOT extracted: a backtick denotes a
 * concept-NAME, not a resolvable link that can rot (mirrors reference-direction's
 * de-link convention). Inline code spans are stripped, and fenced code blocks
 * (triple-backtick or tilde fences) are skipped entirely, before link matching.
 */
export function extractMarkdownLinks(_sourcePath: string, content: string): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  const lines = content.split('\n');

  // Links inside fenced code blocks (``` or ~~~) are illustrative, not
  // dependencies, so they are skipped — the same de-link reasoning as backticked
  // inline spans, extended to multi-line fences. Toggling on each fence delimiter
  // line (and skipping it) preserves the 1-based line numbering of real links.
  let inFence = false;
  const fenceDelimiter = /^\s*(?:```|~~~)/;

  for (let i = 0; i < lines.length; i++) {
    if (fenceDelimiter.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    // Strip inline code spans so backticked paths are not treated as links.
    const lineText = lines[i].replaceAll(/`[^`]*`/g, '');
    links.push(...extractLinksFromLine(lineText, i + 1));
  }
  return links;
}

/** Extract the real path dependencies from one non-fenced, code-stripped line. */
function extractLinksFromLine(lineText: string, line: number): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  // Re-created per line so `^` anchors to this line and `lastIndex` cannot leak.
  const pattern = /\]\(([^)]+)\)|^\s*\[[^\]]+\]:\s*(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(lineText)) !== null) {
    const rawTarget = (match[1] ?? match[2] ?? '').trim();
    const isProseLabel = match[2] !== undefined && !isPathShapedReferenceTarget(rawTarget);
    if (isInternalLinkTarget(rawTarget) && !isProseLabel) {
      links.push({ rawTarget, line });
    }
  }
  return links;
}

/** Distinguish reference-definition paths from bracket-labelled prose. */
function isPathShapedReferenceTarget(target: string): boolean {
  const withoutDecoration = target.replaceAll(/^<|>$/g, '').split(/[?#]/)[0];
  return (
    withoutDecoration.startsWith('.') ||
    withoutDecoration.startsWith('/') ||
    withoutDecoration.includes('/') ||
    /\.[A-Za-z0-9_-]+$/.test(withoutDecoration)
  );
}

/** True when a target is an internal path reference (not a URL, mailto, or pure anchor). */
function isInternalLinkTarget(target: string): boolean {
  if (target === '') {
    return false;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
    return false; // http:, https:, mailto:, etc. (RFC-3986 scheme)
  }
  if (target.startsWith('#')) {
    return false; // pure anchor
  }
  return true;
}

/**
 * Resolve a raw link target to a repo-relative POSIX path, or `null` when the
 * target is not an internal path reference.
 *
 * Steps: strip a trailing ` "title"` and the `#fragment`, URL-decode, then
 * resolve. A leading `/` is repo-root-relative; otherwise relative to the
 * source dir. File, directory, image, code, JSON, and other internal targets
 * all resolve; only pure anchors return `null`.
 */
export function resolveLinkTarget(sourcePath: string, rawTarget: string): string | null {
  // Strip a markdown link title (`path "Title"`), then the fragment.
  const withoutTitle = stripLinkTitle(rawTarget).trim();
  const withoutAngles = withoutTitle.replace(/^<(.+)>$/, '$1');
  const withoutFragment = withoutAngles.split('#')[0];
  if (withoutFragment === '') {
    return null;
  }
  const decoded = decodeUrlPath(withoutFragment.split('?')[0]);
  if (decoded.startsWith('/')) {
    // Repo-root-relative: drop the leading slash and normalise.
    return normaliseResolvedPath(decoded.replace(/^\/+/, ''));
  }
  const sourceDir = posix.dirname(sourcePath.replace(/^\.\//, ''));
  return normaliseResolvedPath(posix.join(sourceDir, decoded));
}

/** Match directory targets to inventory paths regardless of a trailing slash. */
function normaliseResolvedPath(value: string): string {
  const normalised = posix.normalize(value);
  return normalised.length > 1 ? normalised.replace(/\/$/, '') : normalised;
}

/** URL-decode a path, falling back to the raw value when it is not valid encoding. */
function decodeUrlPath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Suggest a corrected repo-relative target for a broken link, or `null`.
 *
 * Takes the basename of the resolved (broken) target, finds all NON-ARCHIVE
 * repo files with that exact basename, and — only when exactly one exists —
 * returns the path to that file relative to the source file's directory. Zero
 * matches (deleted/renamed/archived-away) or more than one (ambiguous) yields
 * `null`, so the link is left for manual remediation.
 */
export function suggestFix(
  sourcePath: string,
  resolvedTarget: string,
  repoFiles: readonly string[],
): string | null {
  const basename = posix.basename(resolvedTarget);
  const matches = repoFiles.filter(
    (file) => posix.basename(file) === basename && !isExcludedPath(file),
  );
  if (matches.length !== 1) {
    return null;
  }
  const sourceDir = posix.dirname(sourcePath.replace(/^\.\//, ''));
  const relative = posix.relative(sourceDir, matches[0]);
  return relative === '' ? basename : relative;
}
