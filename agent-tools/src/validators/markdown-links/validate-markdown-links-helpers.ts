/**
 * Pure helpers for the markdown-links validator.
 *
 * An internal markdown link is a dependency on a file path; if the target is
 * absent the link is broken. These functions extract internal `.md` links,
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

import type {
  BrokenLink,
  BrokenLinksByFile,
  ExtractedLink,
  MarkdownLinkReport,
  ScanFile,
} from './validate-markdown-links-types.js';

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

  // Source only; re-created per line with the 'g' flag so `^` anchors to the
  // start of each individual line string (no cross-line lastIndex carry-over).
  const linkPatternSource = /\]\(([^)]+)\)|^\s*\[[^\]]+\]:\s*(\S+)/.source;

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
    const lineText = lines[i].replace(/`[^`]*`/g, '');
    let match: RegExpExecArray | null;
    const pattern = new RegExp(linkPatternSource, 'g');
    while ((match = pattern.exec(lineText)) !== null) {
      const rawTarget = (match[1] ?? match[2] ?? '').trim();
      if (!isInternalLinkTarget(rawTarget)) {
        continue;
      }
      links.push({ rawTarget, line: i + 1 });
    }
  }
  return links;
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
 * target is not an internal `.md` reference.
 *
 * Steps: strip a trailing ` "title"` and the `#fragment`, URL-decode, then
 * resolve. A leading `/` is repo-root-relative; otherwise relative to the
 * source dir. Only targets ending in `.md` resolve; anything else (image, code,
 * pure anchor) returns `null`.
 */
export function resolveLinkTarget(sourcePath: string, rawTarget: string): string | null {
  // Strip a markdown link title (`path "Title"`), then the fragment.
  const withoutTitle = rawTarget.replace(/\s+"[^"]*"$/, '').trim();
  const withoutFragment = withoutTitle.split('#')[0];
  if (withoutFragment === '') {
    return null;
  }
  const decoded = decodeUrlPath(withoutFragment);
  if (!decoded.endsWith('.md')) {
    return null;
  }
  if (decoded.startsWith('/')) {
    // Repo-root-relative: drop the leading slash and normalise.
    return posix.normalize(decoded.replace(/^\/+/, ''));
  }
  const sourceDir = posix.dirname(sourcePath.replace(/^\.\//, ''));
  return posix.normalize(posix.join(sourceDir, decoded));
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

/**
 * Find every broken internal `.md` link across the supplied source files.
 *
 * A link is broken when its resolved repo-relative target is not present in
 * `repoFiles` (the live, non-excluded repo file inventory). Each broken link
 * is annotated with a {@link suggestFix} suggestion. Only `.md` targets are
 * checked; non-`.md` targets and pure anchors are not counted.
 */
export function findBrokenLinks(
  files: readonly ScanFile[],
  repoFiles: readonly string[],
): MarkdownLinkReport {
  const repoFileSet = new Set(repoFiles);
  const broken: BrokenLink[] = [];
  const byFile: BrokenLinksByFile[] = [];
  let linksChecked = 0;

  for (const file of files) {
    const fileBroken: BrokenLink[] = [];
    for (const link of extractMarkdownLinks(file.path, file.content)) {
      const resolved = resolveLinkTarget(file.path, link.rawTarget);
      if (resolved === null) {
        continue; // not an internal .md reference
      }
      linksChecked++;
      if (repoFileSet.has(resolved)) {
        continue; // target exists
      }
      const brokenLink: BrokenLink = {
        writtenTarget: link.rawTarget,
        resolvedTarget: resolved,
        line: link.line,
        suggestedFix: suggestFix(file.path, resolved, repoFiles),
      };
      fileBroken.push(brokenLink);
      broken.push(brokenLink);
    }
    if (fileBroken.length > 0) {
      byFile.push({ sourcePath: file.path, links: fileBroken });
    }
  }

  const autoFixable = broken.filter((link) => link.suggestedFix !== null).length;
  return {
    broken,
    byFile,
    totals: {
      filesScanned: files.length,
      linksChecked,
      brokenLinks: broken.length,
      autoFixable,
      manual: broken.length - autoFixable,
    },
  };
}
