/**
 * Extract repository-path citations from authored text.
 *
 * A path citation is a code-span or fenced-block token that starts with one
 * of the cited prefixes (`.agent/`, `docs/`), or with `patterns/`, the form
 * doctrine uses to cite a pattern record relative to the patterns directory
 * (`.agent/memory/active/patterns/`); that relative form resolves against the
 * directory, so a rule citing an absent pattern is a finding like any other
 * (closure item 4, row 6: five such citations had no check on 2026-09-14).
 * Prose is never scanned, so a sentence that mentions "the docs/ folder"
 * without code formatting is not a citation. Each token is normalised to the
 * repo-relative target it names: a trailing slash, trailing punctuation, a
 * `#anchor` and a `:line[:column]` suffix are stripped. Tokens that cannot
 * name one file or directory (a glob, a placeholder such as `<name>` or
 * `YYYY-MM-DD`, an ellipsis, a template expression) are omitted rather than
 * guessed at.
 *
 * @packageDocumentation
 */

/** One repository path cited in a code span or fenced block. */
export interface PathCitation {
  /** 1-based line number of the citation. */
  readonly line: number;
  /** The token as written. */
  readonly match: string;
  /** The normalised repo-relative path the token names. */
  readonly target: string;
}

/** Path prefixes that make a code token a repository-path citation. */
const CITED_PATH_PREFIXES = ['.agent/', 'docs/', 'patterns/'] as const;
type CitedPrefix = (typeof CITED_PATH_PREFIXES)[number];
/** The prefixes written relative to a directory, each with the rooted directory it resolves against. */
const RELATIVE_PREFIXES: Readonly<Partial<Record<CitedPrefix, string>>> = {
  'patterns/': '.agent/memory/active/patterns/',
};

const FENCE_PATTERN = /^\s*(```|~~~)/;
const INLINE_CODE_PATTERN = /`([^`\n]+)`/g;
/** A path token: a cited prefix followed by path characters, bounded by whitespace or quoting. */
const PATH_TOKEN_PATTERN = new RegExp(
  String.raw`(?<=^|[\s"'([=,])((?:${CITED_PATH_PREFIXES.map(escapeForRegExp).join('|')})[A-Za-z0-9_./@+\-#:*<>{}$~]*)`,
  'g',
);

function escapeForRegExp(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\/]/g, String.raw`\$&`);
}
/** Characters and fragments that make a token a pattern or a placeholder, never one path. */
const UNRESOLVABLE_PATTERN = /[*<>{}$|]|\.\.\.|YYYY|\/\.\.(?:\/|$)/;
/** Trailing punctuation that belongs to the sentence, not the path. */
const TRAILING_PUNCTUATION = /[.,;:)\]'"]+$/;
/** A `:line` or `:line:column` suffix. */
const LINE_SUFFIX = /:\d+(?::\d+)?$/;

/**
 * Extract every repository-path citation from one file's content.
 *
 * @param content - The file's UTF-8 text.
 * @returns Citations in line order, one per token; the same target cited
 * twice on one line yields two citations.
 *
 * @example
 * ```ts
 * extractPathCitations('Read `.agent/directives/AGENT.md#grounding` first.');
 * // [{ line: 1, match: '.agent/directives/AGENT.md#grounding', target: '.agent/directives/AGENT.md' }]
 * ```
 */
export function extractPathCitations(content: string): readonly PathCitation[] {
  const citations: PathCitation[] = [];
  let inFence = false;
  const lines = content.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const lineText = lines[index] ?? '';
    if (FENCE_PATTERN.test(lineText)) {
      inFence = !inFence;
      continue;
    }
    const candidates = inFence ? [lineText] : inlineCodeSpans(lineText);
    for (const candidate of candidates) {
      citations.push(...citationsInCodeText(candidate, index + 1));
    }
  }
  return citations;
}

function inlineCodeSpans(lineText: string): readonly string[] {
  return [...lineText.matchAll(INLINE_CODE_PATTERN)].map((match) => match[1] ?? '');
}

function citationsInCodeText(text: string, line: number): readonly PathCitation[] {
  const citations: PathCitation[] = [];
  for (const match of text.matchAll(PATH_TOKEN_PATTERN)) {
    const token = match[1] ?? '';
    const target = normaliseTarget(token);
    if (target !== undefined) {
      citations.push({ line, match: token, target });
    }
  }
  return citations;
}

/**
 * Reduce a cited token to the path it names, or `undefined` when the token
 * is a pattern or a placeholder rather than one path.
 */
function normaliseTarget(token: string): string | undefined {
  if (UNRESOLVABLE_PATTERN.test(token)) {
    return undefined;
  }
  const withoutAnchor = token.split('#', 1)[0] ?? token;
  const trimmed = withoutAnchor
    .replace(TRAILING_PUNCTUATION, '')
    .replace(LINE_SUFFIX, '')
    .replace(/\/+$/, '');
  const prefix = CITED_PATH_PREFIXES.find((candidate) => trimmed.startsWith(candidate));
  if (prefix === undefined) {
    return undefined;
  }
  const rooted = RELATIVE_PREFIXES[prefix];
  return rooted === undefined ? trimmed : `${rooted}${trimmed.slice(prefix.length)}`;
}
