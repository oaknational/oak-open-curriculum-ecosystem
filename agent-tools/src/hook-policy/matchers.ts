import { isPathInScope, type PathScopeOptions } from './path-scope.js';
import type { ScopedContentBlockGroup } from './types.js';

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
function scanLinesForRegex(
  content: string,
  pattern: string,
  group: ScopedContentBlockGroup,
): string | null {
  const regex = new RegExp(pattern, 'iu');
  const excludesInlineCode = group.excludes_inline_code ?? false;
  const excludeMarkers = group.excludes_lines_with ?? [];
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
    const match = regex.exec(probeLine);
    if (match !== null) {
      return match[0];
    }
  }

  return null;
}

/**
 * Decide whether a literal pattern is being added — present in new content
 * but absent from prior content, ignoring case.
 */
function literalMatchAdded(
  newContent: string,
  priorContent: string,
  pattern: string,
): string | null {
  const lowerNew = newContent.toLowerCase();
  const lowerPrior = priorContent.toLowerCase();
  const lowerPattern = pattern.toLowerCase();
  return lowerNew.includes(lowerPattern) && !lowerPrior.includes(lowerPattern) ? pattern : null;
}

/**
 * Decide whether a regex pattern is being added — matched in new content
 * (after fence/inline-code/marker exclusions) but unmatched in prior
 * content under the same exclusion rules.
 */
function regexMatchAdded(
  newContent: string,
  priorContent: string,
  group: ScopedContentBlockGroup,
  pattern: string,
): string | null {
  const matched = scanLinesForRegex(newContent, pattern, group);
  if (matched === null) {
    return null;
  }
  return scanLinesForRegex(priorContent, pattern, group) === null ? matched : null;
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
 * A scoped-block match: the group whose scope matched, plus the actual text
 * that fired. The deny builder uses the group for the concept, citation, and
 * reappraisal direction, and `matchedText` to name the exact offending text:
 * the literal phrase for a literal group, or the matched substring (e.g. the
 * actual SHA) for a regex group — never the regex source, which is noise to
 * the agent.
 */
export interface ScopedBlockMatch {
  readonly group: ScopedContentBlockGroup;
  readonly matchedText: string;
}

/**
 * Find the first scoped-block group with a pattern present in a free-standing
 * text — no file-path scoping, because the text is not a file. The comms
 * concept gate is the second consumer of this machinery: comms events carry
 * no path, so the CALLER owns concept selection and this function owns
 * matching, with {@link findAddedScopedBlock}'s ordering and exclusions.
 */
export function findScopedBlockInText(
  text: string,
  groups: readonly ScopedContentBlockGroup[],
): ScopedBlockMatch | null {
  for (const group of groups) {
    for (const pattern of group.patterns) {
      const matchedText =
        group.kind === 'regex'
          ? regexMatchAdded(text, '', group, pattern)
          : literalMatchAdded(text, '', pattern);
      if (matchedText !== null) {
        return { group, matchedText };
      }
    }
  }

  return null;
}

/**
 * Find the first scoped-block group with a pattern being ADDED — present in
 * new content but absent from prior content — when the target file matches
 * the group's include/exclude paths. Groups and the patterns within each
 * group are checked in declaration order; the first match wins. `kind` and
 * the `excludes_*` options are applied at group level to every pattern.
 * `scope` carries the path-scoping seams (the repo root that anchors the
 * groups' root-anchored scopes for the hook's absolute paths, what a relative
 * path means).
 */
export function findAddedScopedBlock(
  newContent: string,
  priorContent: string,
  filePath: string | undefined,
  groups: readonly ScopedContentBlockGroup[],
  scope: PathScopeOptions = {},
): ScopedBlockMatch | null {
  for (const group of groups) {
    if (!isPathInScope(filePath, group.include_paths, group.exclude_paths, scope)) {
      continue;
    }
    for (const pattern of group.patterns) {
      const matchedText =
        group.kind === 'regex'
          ? regexMatchAdded(newContent, priorContent, group, pattern)
          : literalMatchAdded(newContent, priorContent, pattern);
      if (matchedText !== null) {
        return { group, matchedText };
      }
    }
  }

  return null;
}
