/**
 * One signed disposition line, as the pr-lifecycle skill's intake contract
 * writes it: an optional bullet, the bold marker label, then `·`-separated
 * fields — `head SHA:<sha>`, `review <id>`, `<path>:<line>` (in an optional
 * code span; the SHA may be a prefix), the item — and a closing separator,
 * after which anything is prose. The line is read field by field: one regex
 * over the whole line backtracked across its whitespace in cubic time (the
 * analyser's S8786 finding, cured 2026-10-28), so each field is matched
 * anchored, on its own, and the anchor splits at its last colon.
 *
 * @packageDocumentation
 */

/** The fields a disposition line names; the marker is read by the marker grammar, not here. */
export interface DispositionLine {
  readonly headPrefix: string;
  readonly reviewId: string;
  readonly path: string;
  readonly line: number;
  readonly item: string;
}

interface LineFields {
  readonly head: string;
  readonly review: string;
  readonly anchor: string;
  readonly item: string;
}

const SEPARATOR = '·';
const BOLD = '**';
const LEADING_BULLET = /^-?\s*/u;
const HEAD_FIELD = /^head SHA:([0-9a-f]{7,40})$/u;
const REVIEW_FIELD = /^review (\S+)$/u;
const LINE_NUMBER = /^\d+$/u;
const CODE_SPAN_EDGE = /^`|`$/gu;

// The text after the bold label, or null when the line does not open with an
// optional bullet and a non-empty bold span (whose text carries no asterisk).
function afterLabel(line: string): string | null {
  const opened = line.replace(LEADING_BULLET, '');
  const close = opened.indexOf('*', BOLD.length);
  if (!opened.startsWith(BOLD) || close <= BOLD.length || !opened.startsWith(BOLD, close)) {
    return null;
  }
  return opened.slice(close + BOLD.length);
}

// The trimmed fields between the separators: the gap after the label must be
// empty, and a fifth separator must close the item.
function fieldsOf(rest: string): LineFields | null {
  const [gap, head, review, anchor, item, ...closing] = rest
    .split(SEPARATOR)
    .map((field) => field.trim());
  if (
    gap !== '' ||
    head === undefined ||
    review === undefined ||
    anchor === undefined ||
    item === undefined ||
    closing.length === 0
  ) {
    return null;
  }
  return { head, review, anchor, item };
}

function headOf(field: string): string | null {
  return HEAD_FIELD.exec(field)?.[1] ?? null;
}

function reviewIdOf(field: string): string | null {
  return REVIEW_FIELD.exec(field)?.[1] ?? null;
}

// `<path>:<line>` in an optional code span; the line is the digits after the
// last colon, so a path may itself carry colons.
function anchorOf(field: string): Pick<DispositionLine, 'path' | 'line'> | null {
  const unwrapped = field.replaceAll(CODE_SPAN_EDGE, '');
  const colon = unwrapped.lastIndexOf(':');
  const line = unwrapped.slice(colon + 1);
  if (unwrapped.includes('`') || colon <= 0 || !LINE_NUMBER.test(line)) {
    return null;
  }
  return { path: unwrapped.slice(0, colon), line: Number(line) };
}

/**
 * Read one line as a disposition line, or `null` when any field is outside
 * the contract's shape (an empty item included: a line that names no item is
 * no key, and its comment's marker then reads as a batched disposition).
 */
export function parseDispositionLine(line: string): DispositionLine | null {
  const rest = afterLabel(line);
  const fields = rest === null ? null : fieldsOf(rest);
  if (fields === null) {
    return null;
  }
  const headPrefix = headOf(fields.head);
  const reviewId = reviewIdOf(fields.review);
  const anchor = anchorOf(fields.anchor);
  if (headPrefix === null || reviewId === null || anchor === null || fields.item === '') {
    return null;
  }
  return { headPrefix, reviewId, path: anchor.path, line: anchor.line, item: fields.item };
}
