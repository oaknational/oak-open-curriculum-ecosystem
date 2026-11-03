/**
 * Section parser for the under-the-hood canonical skill. Owns the section
 * model and the markdown split; classification and digest derivation live in
 * `generator.ts`.
 */
import { err, ok, isErr, type Result } from '@oaknational/result';

/** Repo-relative path of the canonical skill the digest derives from. */
export const CANONICAL_SKILL_PATH = '.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md';

/** One markdown section: its exact heading line and verbatim body lines. */
export interface CanonicalSection {
  readonly heading: string;
  readonly lines: readonly string[];
}

/**
 * Stateful CommonMark fence tracker. A fence opens with a backtick or tilde
 * run of three or more, indented at most three spaces (deeper indent is
 * code); it closes only on a run of the SAME character, at least as long,
 * with nothing after it — so a literal three-backtick line inside a
 * four-backtick fence stays content. The returned function answers, per line
 * in order, "is this line a fence delimiter or fenced content?"; heading
 * detection is suppressed for such lines. Shared by the section split and
 * the served-section guards so both track fences the same way.
 */
export function createFenceTracker(): (line: string) => boolean {
  let open: FenceDelimiter | undefined;
  return (line: string): boolean => {
    const delimiter = parseFenceDelimiter(line);
    if (delimiter === undefined) {
      return open !== undefined;
    }
    if (open === undefined) {
      open = delimiter;
    } else if (closesFence(open, delimiter)) {
      open = undefined;
    }
    return true;
  };
}

interface FenceDelimiter {
  readonly char: string;
  readonly length: number;
  readonly rest: string;
}

/** Linear character scan — no regex, so no backtracking (Sonar S8786). */
function parseFenceDelimiter(line: string): FenceDelimiter | undefined {
  const index = fenceIndent(line);
  const char = line.charAt(index);
  if (char !== '`' && char !== '~') {
    return undefined;
  }
  let length = 0;
  while (line.charAt(index + length) === char) {
    length += 1;
  }
  const rest = line.slice(index + length);
  return isValidFence(char, length, rest) ? { char, length, rest } : undefined;
}

/** Up to three leading spaces; more makes the line indented code, not a fence. */
function fenceIndent(line: string): number {
  let index = 0;
  while (index < 3 && line.charAt(index) === ' ') {
    index += 1;
  }
  return index;
}

/**
 * CommonMark: a fence run is three or more delimiters, and a backtick
 * fence's info string may not contain a backtick (a tilde fence's may).
 */
function isValidFence(char: string, length: number, rest: string): boolean {
  return length >= 3 && !(char === '`' && rest.includes('`'));
}

/** CommonMark close: same delimiter character, an equal-or-longer run, nothing after it. */
function closesFence(open: FenceDelimiter, candidate: FenceDelimiter): boolean {
  return (
    candidate.char === open.char && candidate.length >= open.length && candidate.rest.trim() === ''
  );
}

/**
 * Splits the canonical into sections by heading line, fence-aware (a `#`
 * line inside a code fence is content, not a heading) and with the leading
 * YAML frontmatter block stripped. ATX levels 1–3 are the classification
 * grain; deeper headings are section content — and inside a SERVED section
 * they are rejected at classification (see `buildDigest`). Non-blank
 * content BEFORE the first heading has no section to be classified under
 * and fails loudly — silent discard would let canonical content drift with
 * a green parity gate. The scanner covers CommonMark's ATX forms (space,
 * tab, or end-of-line after the hashes) and both fence styles; the estate's
 * markdownlint gate binds the canonical on the same commit path (hard tabs
 * and mixed fence styles are lint errors there), so these forms are
 * defence-in-depth, not a live dialect.
 */
export function parseCanonicalSections(
  canonical: string,
): Result<readonly CanonicalSection[], string> {
  const stripped = stripFrontmatter(canonical.split('\n'));
  if (isErr(stripped)) {
    return stripped;
  }
  const { sections, preamble } = splitSections(stripped.value);
  const stray = preamble.filter((line) => line.trim() !== '');
  if (stray.length > 0) {
    return err(
      `Content before the first heading in ${CANONICAL_SKILL_PATH} cannot be classified — ` +
        `move it under an H1–H3 heading:\n${stray.join('\n')}`,
    );
  }
  return ok(sections);
}

function splitSections(lines: readonly string[]): {
  readonly sections: readonly CanonicalSection[];
  readonly preamble: readonly string[];
} {
  const sections: CanonicalSection[] = [];
  const preamble: string[] = [];
  let current: { heading: string; lines: string[] } | undefined;
  const fenced = createFenceTracker();
  for (const line of lines) {
    if (!fenced(line) && /^#{1,3}(?:[ \t]|$)/.test(line)) {
      if (current !== undefined) {
        sections.push(current);
      }
      current = { heading: line, lines: [] };
      continue;
    }
    if (current === undefined) {
      preamble.push(line);
    } else {
      current.lines.push(line);
    }
  }
  if (current !== undefined) {
    sections.push(current);
  }
  return { sections, preamble };
}

function stripFrontmatter(lines: readonly string[]): Result<readonly string[], string> {
  if (lines[0] !== '---') {
    return ok(lines);
  }
  const closing = lines.indexOf('---', 1);
  if (closing === -1) {
    return err(`Unterminated YAML frontmatter in ${CANONICAL_SKILL_PATH}`);
  }
  return ok(lines.slice(closing + 1));
}
