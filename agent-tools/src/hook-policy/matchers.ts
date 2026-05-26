import type { ScopedContentBlock } from './types.js';

/**
 * Strip inline-code spans (backticked text) from a single line.
 *
 * Used by the regex matcher so that a SHA wrapped in backticks
 * (e.g. `abc1234`) is treated as a code reference and not as a
 * load-bearing literal token in the prose.
 */
function stripInlineCodeSpans(line: string): string {
  return line.replaceAll(/`[^`]+`/gu, '');
}

/**
 * Decide whether a line is *predominantly code-shaped* (a YAML/JSON-style
 * data line, an indented data fragment, or a line whose substance is the
 * backticked tokens) versus *prose-narrative* (a sentence containing
 * backticked references). The discipline (per PDR-053 surface-polarity
 * doctrine and the no-moving-targets rule) is that backticked SHAs in
 * prose are intentional pointers and SHOULD fire the moving-target rule;
 * backticked SHAs inside data-shaped lines (YAML field values, table
 * cells, JSON snippets) are the data being documented and SHOULD NOT.
 *
 * Heuristic: the line is "predominantly code-shaped" when its
 * non-backticked content does not contain a recognisable sentence
 * fragment (≥3 consecutive alphabetic words separated by spaces).
 * Sentence-shape content marks the line as prose; absence marks it as
 * data.
 */
export function lineIsPredominantlyCodeShaped(line: string): boolean {
  const stripped = stripInlineCodeSpans(line);
  const proseRun = /\b[A-Za-z][A-Za-z']+\s+[A-Za-z][A-Za-z']+\s+[A-Za-z][A-Za-z']+\b/u;
  return !proseRun.test(stripped);
}

/**
 * Build the probe-line for a single raw line under a scoped block's
 * inline-code exclusion semantics. Returns `null` when the line should
 * be skipped entirely (excluded by marker); returns the probe content
 * otherwise.
 */
function probeLineForRegex(
  rawLine: string,
  excludeMarkers: readonly string[],
  excludesInlineCode: boolean,
): string | null {
  if (excludeMarkers.some((marker) => rawLine.includes(marker))) {
    return null;
  }
  if (excludesInlineCode && lineIsPredominantlyCodeShaped(rawLine)) {
    return stripInlineCodeSpans(rawLine);
  }
  return rawLine;
}

/**
 * Scan content line-by-line for a regex match that respects fenced
 * code blocks, inline code (when configured AND the line is data-shaped),
 * and explicit historical-reference markers.
 */
function scanLinesForRegex(content: string, block: ScopedContentBlock): boolean {
  const regex = new RegExp(block.pattern, 'iu');
  const excludesInlineCode = block.excludes_inline_code ?? false;
  const excludeMarkers = block.excludes_lines_with ?? [];
  let inFence = false;

  for (const rawLine of content.split('\n')) {
    if (rawLine.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    const probeLine = probeLineForRegex(rawLine, excludeMarkers, excludesInlineCode);
    if (probeLine === null) {
      continue;
    }
    if (regex.test(probeLine)) {
      return true;
    }
  }

  return false;
}

/**
 * Decide whether a literal pattern is being added — present in new content
 * but absent from prior content, ignoring case.
 */
function literalMatchAdded(
  newContent: string,
  priorContent: string,
  block: ScopedContentBlock,
): boolean {
  const lowerNew = newContent.toLowerCase();
  const lowerPrior = priorContent.toLowerCase();
  const lowerPattern = block.pattern.toLowerCase();
  return lowerNew.includes(lowerPattern) && !lowerPrior.includes(lowerPattern);
}

/**
 * Decide whether a regex pattern is being added — matched in new content
 * (after fence/inline-code/marker exclusions) but unmatched in prior
 * content under the same exclusion rules.
 */
function regexMatchAdded(
  newContent: string,
  priorContent: string,
  block: ScopedContentBlock,
): boolean {
  if (!scanLinesForRegex(newContent, block)) {
    return false;
  }
  return !scanLinesForRegex(priorContent, block);
}

/**
 * Check whether a blocked pattern is being ADDED — present in new content
 * but absent from prior content.
 */
export function findAddedBlockedContent(
  newContent: string,
  priorContent: string,
  blockedPatterns: readonly string[],
): string | null {
  const lowerNew = newContent.toLowerCase();
  const lowerPrior = priorContent.toLowerCase();

  for (const pattern of blockedPatterns) {
    const lowerPattern = pattern.toLowerCase();
    if (lowerNew.includes(lowerPattern) && !lowerPrior.includes(lowerPattern)) {
      return pattern;
    }
  }

  return null;
}

/**
 * Match a single path-scope entry against a file path.
 *
 * Entries beginning with `**\/*` (no space) are treated as a suffix match
 * (e.g. `**\/*.plan.md` matches any path ending in `.plan.md`). All other
 * entries are treated as substring matches against the file path, which
 * works equivalently for absolute and relative forms because the path
 * always contains its own directory prefix.
 */
function matchesPathScope(filePath: string, scope: string): boolean {
  if (scope.startsWith('**/*')) {
    return filePath.endsWith(scope.slice(4));
  }
  return filePath.includes(scope);
}

/**
 * Determine whether a file path is in scope for a `ScopedContentBlock` —
 * matches at least one include and no excludes.
 */
export function isPathInScope(
  filePath: string | undefined,
  includePaths: readonly string[],
  excludePaths: readonly string[] = [],
): boolean {
  if (filePath === undefined) {
    return false;
  }
  const matchesInclude = includePaths.some((scope) => matchesPathScope(filePath, scope));
  if (!matchesInclude) {
    return false;
  }
  return !excludePaths.some((scope) => matchesPathScope(filePath, scope));
}

/**
 * Find a path-scoped doctrine block whose pattern is being ADDED — present
 * in new content but absent from prior content — when the target file
 * matches the block's include/exclude paths.
 */
export function findAddedScopedBlock(
  newContent: string,
  priorContent: string,
  filePath: string | undefined,
  scopedBlocks: readonly ScopedContentBlock[],
): ScopedContentBlock | null {
  for (const block of scopedBlocks) {
    if (!isPathInScope(filePath, block.include_paths, block.exclude_paths)) {
      continue;
    }
    const matched =
      block.kind === 'regex'
        ? regexMatchAdded(newContent, priorContent, block)
        : literalMatchAdded(newContent, priorContent, block);
    if (matched) {
      return block;
    }
  }

  return null;
}
