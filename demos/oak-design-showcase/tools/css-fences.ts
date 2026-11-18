/**
 * Markdown CSS fences, found by a string scan rather than a regular
 * expression. The skill eval graders read a response's fenced CSS as authored
 * CSS, and the pattern they used (an info string, a whitespace run, then a
 * lazy body up to the next backtick run) backtracks super-linearly on a run of
 * backticks; this scan reads each character a bounded number of times.
 *
 * The fence it recognises is the one that pattern did: three backticks, the
 * info string `css` or `CSS` and nothing else on it but whitespace, a newline,
 * then the body up to the next three backticks wherever they sit. The body
 * starts after the LAST newline of the whitespace run that follows the info
 * string, and a fence with no closing run is no fence.
 *
 * @packageDocumentation
 */

const FENCE = '```';
const INFO_STRINGS: ReadonlySet<string> = new Set(['css', 'CSS']);

/** One fence's extent in its text, as offsets: the markers and the body. */
interface CssFenceSpan {
  /** Offset of the opening backticks. */
  readonly start: number;
  /** Offset of the body's first character. */
  readonly bodyStart: number;
  /** Offset of the closing backticks (the body's end, exclusive). */
  readonly bodyEnd: number;
  /** Offset just past the closing backticks. */
  readonly end: number;
}

/** Whether `character` is JavaScript whitespace, the class `\s` matches. */
function isWhitespace(character: string): boolean {
  return character.trim() === '' && character !== '';
}

/**
 * Offset of the body's first character for an opener at `start`, or
 * `undefined` when no info string and newline follow it.
 */
function bodyStartAfter(text: string, start: number): number | undefined {
  const infoEnd = start + FENCE.length + 'css'.length;
  const info = text.slice(start + FENCE.length, infoEnd);
  if (!INFO_STRINGS.has(info)) {
    return undefined;
  }
  let lastNewline = -1;
  let cursor = infoEnd;
  while (cursor < text.length && isWhitespace(text.charAt(cursor))) {
    if (text.charAt(cursor) === '\n') {
      lastNewline = cursor;
    }
    cursor += 1;
  }
  return lastNewline === -1 ? undefined : lastNewline + 1;
}

/** Every CSS fence in `text`, in order and non-overlapping. */
function cssFenceSpans(text: string): readonly CssFenceSpan[] {
  const spans: CssFenceSpan[] = [];
  let from = 0;
  for (;;) {
    const start = text.indexOf(FENCE, from);
    if (start === -1) {
      return spans;
    }
    const bodyStart = bodyStartAfter(text, start);
    if (bodyStart === undefined) {
      from = start + 1;
      continue;
    }
    const bodyEnd = text.indexOf(FENCE, bodyStart);
    if (bodyEnd === -1) {
      return spans;
    }
    const end = bodyEnd + FENCE.length;
    spans.push({ start, bodyStart, bodyEnd, end });
    from = end;
  }
}

/** The body of every CSS fence in `text`, in order. */
export function cssFenceBodies(text: string): readonly string[] {
  return cssFenceSpans(text).map((span) => text.slice(span.bodyStart, span.bodyEnd));
}

/** `text` with every CSS fence, markers included, replaced by `replacement`. */
export function withoutCssFences(text: string, replacement: string): string {
  let result = '';
  let from = 0;
  for (const span of cssFenceSpans(text)) {
    result += text.slice(from, span.start) + replacement;
    from = span.end;
  }
  return result + text.slice(from);
}
