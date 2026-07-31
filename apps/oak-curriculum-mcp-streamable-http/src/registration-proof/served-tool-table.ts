/**
 * Reviewer-facing served-tool-table renderer.
 *
 * Renders one line per served tool — name, title, description, annotations —
 * from an observed `tools/list` result (or the canonical registration walk in
 * tests), so the reviewer-facing table IS the served surface by construction
 * rather than a hand-maintained copy that drifts (MCP-439: the submission
 * draft's hand-kept table under-counted the surface, 39 rows against 40
 * served, and paraphrased descriptions the portal captures verbatim).
 */

import { err, ok, type Result } from '@oaknational/result';

/** One served tool as observed from `tools/list` or the registration walk. */
export interface ServedToolRow {
  readonly name: string;
  readonly title?: string;
  readonly description?: string;
  readonly annotations?: {
    readonly readOnlyHint?: boolean;
    readonly destructiveHint?: boolean;
    readonly idempotentHint?: boolean;
    readonly openWorldHint?: boolean;
  };
}

const HINT_ORDER = ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint'] as const;

/** Escapes literal angle brackets so prose like "<track>" stays text, not HTML. */
function escapeAngleBrackets(segment: string): string {
  return segment.replaceAll('<', String.raw`\<`).replaceAll('>', String.raw`\>`);
}

const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', ')']);

/** Wraps bare URLs as markdown autolinks, keeping trailing punctuation outside. */
function wrapBareUrls(segment: string): string {
  return segment.replaceAll(/https?:\/\/[^\s"'`\\]+/gu, (match) => {
    let end = match.length;
    while (end > 0 && TRAILING_PUNCTUATION.has(match.charAt(end - 1))) {
      end -= 1;
    }
    return `<${match.slice(0, end)}>${match.slice(end)}`;
  });
}

/**
 * Collapses a multi-line description to one honest single-line rendering,
 * source-faithful as markdown: existing code spans pass through verbatim
 * (backticks preserved, contents untouched); outside code spans, literal
 * angle brackets are escaped so they render as text, and bare URLs become
 * autolinks with sentence punctuation kept outside the link (MD034 without
 * altering the description's words).
 */
function flattenedDescription(description: string): string {
  return description
    .replaceAll(/\s+/gu, ' ')
    .trim()
    .split(/(`[^`]*`)/u)
    .map((segment) =>
      segment.length > 1 && segment.startsWith('`') && segment.endsWith('`')
        ? segment
        : wrapBareUrls(escapeAngleBrackets(segment)),
    )
    .join('');
}

function renderAnnotations(annotations: NonNullable<ServedToolRow['annotations']>): string {
  return HINT_ORDER.filter((hint) => annotations[hint] !== undefined)
    .map((hint) => `${hint}: ${String(annotations[hint])}`)
    .join('; ');
}

/**
 * Renders the served tool table as markdown: a generated banner, the tool
 * count, then one line per tool in name order. Every row must carry a name,
 * a title, a non-empty description, and annotations — a gap is an error
 * naming the offending tool, never a silently thinner row.
 */
export function renderServedToolTable(rows: readonly ServedToolRow[]): Result<string, string> {
  const sorted = [...rows].sort((left, right) => left.name.localeCompare(right.name));
  const lines: string[] = [];
  for (const row of sorted) {
    if (row.title === undefined || row.title.trim() === '') {
      return err(`Served tool "${row.name}" has no title`);
    }
    if (row.description === undefined || row.description.trim() === '') {
      return err(`Served tool "${row.name}" has no description`);
    }
    if (row.annotations === undefined) {
      return err(`Served tool "${row.name}" has no annotations`);
    }
    lines.push(
      `- \`${row.name}\` — ${row.title} — ${flattenedDescription(row.description)} — ${renderAnnotations(row.annotations)}`,
    );
  }
  const header = [
    '# Served tool table (generated)',
    '',
    'Generated from the live in-memory `tools/list` of the real composition root by',
    '`scripts/generate-served-tool-table.ts`. Do not edit by hand — regenerate with',
    '`pnpm --filter oak-curriculum-mcp-streamable-http generate:tool-table`; the',
    'served-tool-table artefact test pins this file to the canonical registration',
    'walk, so a drifted copy fails the suite.',
    '',
    `${String(sorted.length)} tools served.`,
    '',
  ];
  return ok(`${[...header, ...lines].join('\n')}\n`);
}
