/**
 * The Codex connector's per-pull-request summary: one comment, opening with
 * a marker, that the connector rewrites on every run. Its table has one
 * Code Review row, whose status word is the connector's closed vocabulary
 * (Completed, Running, Failed) and whose Commit cell names the commit the
 * run read or tried. This module reads that shape alone: which rows report
 * on a commit, whether the row is still running, and how a row is quoted.
 * Rows are read only in a comment that opens with the marker: the
 * connector's other comments carry model-written text a requester can steer.
 * Shapes as recorded on pull request 264 (2026-09-28: Completed, Running)
 * and pull request 362 (2026-10-27: Failed, beside a machine-readable state
 * block on the summary's second line, which this module does not read).
 * Pure.
 *
 * @packageDocumentation
 */

const SUMMARY_MARKER = '<!-- codex-pull-request-review-summary -->';

// A Code Review row whose status is Completed or Failed names, in its Commit
// cell, an inline-code prefix of at least seven hex characters (seven on
// every recorded instance). Both are the connector's report: a completed run
// read the commit, a failed run tried it. A row still Running names the
// commit under review, which is no result yet.
const COMPLETED_ROW =
  /^\| [^|\n]*\*\*Code Review\*\* \| [^|\n]*\*\*Completed\*\*[^|\n]*\| `([0-9a-f]{7,40})` \|[^\n]*$/gmu;
const FAILED_ROW =
  /^\| [^|\n]*\*\*Code Review\*\* \| [^|\n]*\*\*Failed\*\*[^|\n]*\| `([0-9a-f]{7,40})` \|[^\n]*$/gmu;
const RUNNING_ROW = /^\| [^|\n]*\*\*Code Review\*\* \| [^|\n]*\*\*Running\*\*/mu;
const CODE_REVIEW_ROW = /^\| [^|\n]*\*\*Code Review\*\* \|.*$/mu;
const STATUS_WORD = /\*\*[^*]+\*\*/u;

/** Whether a comment is the connector's summary: it opens with the marker. */
export function isSummary(body: string): boolean {
  return body.trimStart().startsWith(SUMMARY_MARKER);
}

/**
 * A Code Review row's report on one commit: the run completed on it, or
 * failed on it. A failed run carries its row as posted, which becomes the
 * body of the review the reader makes of it (`completion-comments.ts`) and
 * which `vendor-error-reviews.ts` knows as an error review.
 */
export type CodeReviewReport =
  | { readonly status: 'completed'; readonly prefix: string }
  | { readonly status: 'failed'; readonly prefix: string; readonly row: string };

function prefixes(body: string, pattern: RegExp): readonly { prefix: string; row: string }[] {
  return [...body.matchAll(pattern)].flatMap((match) =>
    match[1] === undefined ? [] : [{ prefix: match[1], row: match[0] }],
  );
}

/**
 * Every Code Review row of a summary that reports on a commit: the completed
 * rows, then the failed rows. A summary carries one Code Review row; the
 * reader refuses a comment with more.
 *
 * @param body - A summary comment's body.
 */
export function summaryReports(body: string): readonly CodeReviewReport[] {
  return [
    ...prefixes(body, COMPLETED_ROW).map(({ prefix }) => ({
      status: 'completed' as const,
      prefix,
    })),
    ...prefixes(body, FAILED_ROW).map(({ prefix, row }) => ({
      status: 'failed' as const,
      prefix,
      row,
    })),
  ];
}

/** Whether a summary's Code Review row is still running. */
export function isSummaryRunning(body: string): boolean {
  return RUNNING_ROW.test(body);
}

// A row as its cells, the status cell cut to its bold status word: the rest
// of that cell is the connector's time markup and, on a failed run, its
// retry instruction; the status word is the report.
function rowQuote(row: string): string {
  const [review, status = '', ...rest] = row
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell) => cell !== '');
  const word = STATUS_WORD.exec(status)?.[0] ?? status;
  return [review, word, ...rest].join(' | ');
}

/**
 * The quote of the Code Review row a body carries: a summary's row (a
 * summary's first line is only its marker), or the body itself when its
 * first non-empty line is such a row (a failed run's review body); undefined
 * for any other body.
 *
 * @param body - A comment's or a review's body.
 */
export function codeReviewRowQuote(body: string): string | undefined {
  if (isSummary(body)) {
    const row = CODE_REVIEW_ROW.exec(body)?.[0];
    return row === undefined ? undefined : rowQuote(row);
  }
  const match = CODE_REVIEW_ROW.exec(body.trim());
  return match?.index === 0 ? rowQuote(match[0]) : undefined;
}
