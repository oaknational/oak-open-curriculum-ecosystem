/**
 * Findings from review BODIES, by the reviewer's own structured markers — the
 * pr-lifecycle state machine's item 2 ("findings are counted from BOTH harvest
 * surfaces") as the `pr-tally` node bounds it: one item per Copilot
 * suppressed-comment entry, one per Codex badge-and-heading block; a body a
 * marker parse yields nothing from is boilerplate and raises zero; a
 * non-empty body from any other reviewer, carrying prose the parser cannot
 * classify, is surfaced as "manual tally required" and never counted.
 */

/** One finding read from a review body. `path`/`line` are `null` where the body carries no anchor. */
export interface BodyFinding {
  /** The item key the disposition reference names: `item i of N` (Copilot) or the bold heading (Codex). */
  readonly key: string;
  readonly path: string | null;
  readonly line: number | null;
  /** The finding's own text, for anchor-and-substance deduplication against inline threads. */
  readonly substance: string;
}

/** The body reading: its items, and whether the body needs a manual tally instead. */
interface BodyFindings {
  readonly items: readonly BodyFinding[];
  readonly manual: boolean;
}

// The reviewer logins whose body shapes this module reads structurally.
const COPILOT_REVIEWER = 'copilot-pull-request-reviewer';
const CODEX_REVIEWER = 'chatgpt-codex-connector';

const SUPPRESSED_HEADER = /^### Suppressed comments \((\d+)\)\s*$/mu;
// An item opens with a bold `path:line` on its own line; the block's own
// sub-heading (`**Previously missed (N)** — …`) is bold too but carries no anchor.
const SUPPRESSED_ITEM = /^\*\*([^*\n]+?):(\d+)\*\*\s*$/u;
// A Codex item line is `**<sub><sub>![P<n> Badge](…)</sub></sub>  <heading>**`,
// read by its fixed parts: the badge prefix, the first sub closer, at least
// one space, the heading, the closing bold at the line's end (trailing
// whitespace allowed). One regex over the line backtracked across its
// whitespace in cubic time (the analyser's S8786 finding).
const CODEX_BADGE_OPEN = '**<sub><sub>![P';
const CODEX_BADGE_CLOSE = ' Badge]';
const SUB_CLOSER = '</sub></sub>';
const BOLD = '**';
const DIGIT = /^\d$/u;

function substanceAfter(lines: readonly string[], start: number): string {
  const text: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (
      SUPPRESSED_ITEM.test(line) ||
      line.startsWith('```') ||
      line.startsWith('- **Files reviewed')
    ) {
      break;
    }
    text.push(line.replace(/^\*\s+/u, '').trim());
  }
  return text.filter((line) => line !== '').join(' ');
}

function copilotFindings(body: string): BodyFindings {
  const header = SUPPRESSED_HEADER.exec(body);
  if (header === null) {
    return { items: [], manual: false };
  }
  const declared = Number(header[1]);
  const lines = body.slice(header.index).split('\n');
  const anchors = lines
    .map((line, index) => ({ match: SUPPRESSED_ITEM.exec(line), index }))
    .filter((entry): entry is { match: RegExpExecArray; index: number } => entry.match !== null);
  if (anchors.length !== declared) {
    return { items: [], manual: true };
  }
  return {
    items: anchors.map(({ match, index }, ordinal) => ({
      key: `item ${ordinal + 1} of ${declared}`,
      path: match[1] ?? '',
      line: Number(match[2]),
      substance: substanceAfter(lines, index),
    })),
    manual: false,
  };
}

// The index just past the badge's `![P<n> Badge]`, or -1 when the line does not open with one.
function codexBadgeEnd(line: string): number {
  const digitAt = CODEX_BADGE_OPEN.length;
  const opens =
    line.startsWith(CODEX_BADGE_OPEN) &&
    DIGIT.test(line.charAt(digitAt)) &&
    line.startsWith(CODEX_BADGE_CLOSE, digitAt + 1);
  return opens ? digitAt + 1 + CODEX_BADGE_CLOSE.length : -1;
}

// The heading of a Codex item line (leading whitespace removed), or null when
// the line is not one: a heading is required, so a badge line that closes its
// bold over whitespace alone is no item.
function codexHeading(line: string): string | null {
  const badgeEnd = codexBadgeEnd(line);
  const closer = badgeEnd === -1 ? -1 : line.indexOf(SUB_CLOSER, badgeEnd);
  const trimmed = line.trimEnd();
  if (closer === -1 || !trimmed.endsWith(BOLD)) {
    return null;
  }
  const spaced = trimmed.slice(closer + SUB_CLOSER.length, -BOLD.length);
  const heading = spaced.trimStart();
  return spaced === heading || heading === '' ? null : heading;
}

function codexFindings(body: string): BodyFindings {
  const items = body
    .split('\n')
    .map(codexHeading)
    .filter((heading): heading is string => heading !== null)
    .map((heading) => ({ key: heading.trim(), path: null, line: null, substance: '' }));
  // Two items under one heading share a key and carry no anchor to tell them
  // apart: one line would disposition both, so the body reads manual.
  const headings = new Set(items.map((item) => item.key));
  return headings.size === items.length ? { items, manual: false } : { items: [], manual: true };
}

/**
 * Read the findings a review body carries, or surface the body as needing a
 * manual tally. Structured reviewers (Copilot, Codex) always classify; an
 * empty body from anyone is nothing; any other non-empty body is manual.
 */
export function extractBodyFindings(review: {
  readonly author: string;
  readonly body: string;
}): BodyFindings {
  if (review.author === COPILOT_REVIEWER) {
    return copilotFindings(review.body);
  }
  if (review.author === CODEX_REVIEWER) {
    return codexFindings(review.body);
  }
  return { items: [], manual: review.body.trim() !== '' };
}
