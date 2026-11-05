/**
 * The second transport of a reviewer's reported result: a completion comment.
 *
 * @remarks
 * The Codex connector reports on the conversation as well as through review
 * objects, in one of two shapes: when it files no findings, a comment per run
 * ("Didn't find any major issues", naming the commit it read under the label
 * "Reviewed commit"); or one summary comment per pull request that the
 * connector rewrites on every run (`completion-summary.ts`), whose Code
 * Review row names the commit a code review read when its status is
 * Completed, whatever it found (findings arrive as review objects and
 * threads, which the door reads first), or the commit a run tried when its
 * status is Failed. Copilot posts a review object either way. By the owner's
 * ruling of 2026-09-16
 * (`.agent/reports/merge-door-comment-evidence-decision-2026-09-16.md`) a
 * zero-findings result is a positive result. This reads such a comment as a
 * {@link HarvestedReview} bound to the commit it names, on the ruling's
 * preconditions as the decision note's 2026-09-28 amendment states them: the
 * author is an expected reviewer; the comment is unedited, or last edited by
 * its author (the summary's rewrite is the author's report, timed at the
 * edit; an edit by any other account is not the reviewer's report); the
 * named prefix resolves to exactly one of the pull request's commits; and
 * (checked at settlement, against the tip) that commit binds the current tip,
 * exactly or by content (`content-binding.ts`). A Failed row is read on the
 * same preconditions as the vendor's failed run on that commit (the note's
 * amendment of 2026-10-27): a review whose body is the row as posted, which
 * `vendor-error-reviews.ts` knows as an error review, so it satisfies no
 * leg, is counted, and proves a declaration of the vendor's unavailability.
 * A vendor's notice about its own service, naming no commit
 * (`vendor-notices.ts`), is neither a report nor a refusal: it is returned
 * for the verdict to print. An expected reviewer's comment that fails a
 * precondition is never read as silence: it is returned as REFUSED, naming
 * the precondition and quoting the comment, so the verdict can say what it
 * saw. A comment by anyone else is not a reviewer's report and is not read.
 * Pure: the caller supplies the comments, the commits and the reviewers.
 */

import { sanitiseTerminalLine } from '../core/terminal-output.js';
import { resolveNamedCommit, type CommitRefusal } from './completion-reports.js';
import { codeReviewRowQuote, type CodeReviewReport } from './completion-summary.js';
import { normaliseLogin } from './logins.js';
import type { HarvestedReview } from './reviewer-legs.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';
import { isVendorNotice } from './vendor-notices.js';

/** A comment's last edit: when, and by whom (`unknown` for a deleted account). */
interface CommentEdit {
  readonly at: string;
  readonly by: string;
}

/** A conversation comment as the paginated `comments` harvest carries it. */
export interface CompletionComment {
  readonly id: string;
  readonly author: string;
  readonly body: string;
  readonly createdAt: string;
  /** The last edit, or null for a comment never edited. */
  readonly lastEdit: CommentEdit | null;
}

export interface ReadCompletionCommentsInput {
  readonly comments: readonly CompletionComment[];
  /** Full SHAs of the commits a named prefix may resolve to, in any order. */
  readonly commits: readonly string[];
  /** The expected reviewers (declared, or defaulted from the observed surface), by login. */
  readonly reviewers: readonly string[];
}

/** A review read from a completion comment; `transport` says which. */
export type CompletionCommentReview = HarvestedReview & {
  readonly id: string;
  readonly transport: 'completion-comment';
};

/**
 * The precondition an expected reviewer's comment failed, in the ruling's
 * words: the edit precondition, or why the body names no one commit
 * (`completion-reports.ts`).
 */
export type RefusedPrecondition =
  | CommitRefusal
  | 'edited by an account other than its author'
  | 'reports a failed run in a row the error classifier does not read';

/** An expected reviewer's comment that fails a precondition: named and quoted, never silent. */
export interface RefusedCompletionComment {
  readonly id: string;
  readonly author: string;
  /** When the quoted text was written: the last edit, else the creation. */
  readonly reportedAt: string;
  readonly precondition: RefusedPrecondition;
  /** The comment's Code Review row, else its first non-empty line; bounded. */
  readonly quote: string;
}

/** A vendor's notice about its own service, by an expected reviewer: printed, deciding nothing. */
interface VendorNoticeComment {
  readonly id: string;
  readonly author: string;
  /** When the quoted text was written: the last edit, else the creation. */
  readonly reportedAt: string;
  /** The notice's first non-empty line; bounded. */
  readonly quote: string;
}

export interface CompletionCommentReading {
  readonly reviews: readonly CompletionCommentReview[];
  readonly refused: readonly RefusedCompletionComment[];
  /** The expected reviewers' vendor notices, in input order. */
  readonly notices: readonly VendorNoticeComment[];
}

const QUOTE_LENGTH = 120;

function firstNonEmptyLine(body: string): string | undefined {
  return body
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line !== '');
}

/**
 * What the verdict quotes of a comment: its Code Review row (a summary's, or
 * the body itself when it is one such row: a failed run's review body) as
 * its cells with the status cut to the status word, else the comment's first
 * non-empty line; cut to {@link QUOTE_LENGTH} characters, with terminal
 * control characters stripped: the quote reaches the operator's terminal in
 * the verdict, and a reviewer's comment is not this tool's text.
 */
export function quoteOf(body: string): string {
  const line = codeReviewRowQuote(body) ?? firstNonEmptyLine(body) ?? '';
  return sanitiseTerminalLine(line).slice(0, QUOTE_LENGTH);
}

// An edit by a deleted account ('unknown') is another account's even when
// the comment's author was deleted too: the two cannot be shown to be one.
function editedByAnother(comment: CompletionComment): boolean {
  return (
    comment.lastEdit !== null &&
    (comment.lastEdit.by === 'unknown' ||
      normaliseLogin(comment.lastEdit.by) !== normaliseLogin(comment.author))
  );
}

// The author's own edit is the report, so the report is timed at it.
function reportedAt(comment: CompletionComment): string {
  return comment.lastEdit?.at ?? comment.createdAt;
}

function refusedOf(
  comment: CompletionComment,
  precondition: RefusedPrecondition,
): RefusedCompletionComment {
  const { id, author } = comment;
  return {
    id,
    author,
    reportedAt: reportedAt(comment),
    precondition,
    quote: quoteOf(comment.body),
  };
}

function noticeOf(comment: CompletionComment): VendorNoticeComment {
  const { id, author } = comment;
  return { id, author, reportedAt: reportedAt(comment), quote: quoteOf(comment.body) };
}

// A failed report whose row the error classifier does not read: the two grammars
// are kept in step by this check, not by inspection.
function unreadableFailure(report: CodeReviewReport): boolean {
  return report.status === 'failed' && !isVendorErrorReview(report.row);
}

// A failed run's body is its row as posted, which the classifier knows; a
// completed run's is the whole comment.
function reviewOf(
  comment: CompletionComment,
  commitId: string,
  report: CodeReviewReport,
): CompletionCommentReview {
  return {
    id: comment.id,
    author: comment.author,
    state: 'COMMENTED',
    body: report.status === 'failed' ? report.row : comment.body,
    commitOid: commitId,
    submittedAt: reportedAt(comment),
    transport: 'completion-comment',
  };
}

/**
 * Every expected reviewer's completion comment: a review bound to one commit
 * (a failed run's as an error review), a vendor notice, or a named refusal.
 */
export function readCompletionComments(
  input: ReadCompletionCommentsInput,
): CompletionCommentReading {
  const reviewers = new Set(input.reviewers.map(normaliseLogin));
  const reviews: CompletionCommentReview[] = [];
  const refused: RefusedCompletionComment[] = [];
  const notices: VendorNoticeComment[] = [];
  for (const comment of input.comments) {
    if (!reviewers.has(normaliseLogin(comment.author))) {
      continue;
    }
    if (editedByAnother(comment)) {
      refused.push(refusedOf(comment, 'edited by an account other than its author'));
    } else if (isVendorNotice(comment.body)) {
      notices.push(noticeOf(comment));
    } else {
      const resolution = resolveNamedCommit(comment.body, input.commits);
      if ('refused' in resolution) {
        refused.push(refusedOf(comment, resolution.refused));
      } else if (unreadableFailure(resolution.report)) {
        // A failed row the classifier would not read as an error review would
        // reach the legs as a substantive review and launder the failure into
        // "reviewed"; the reader fails closed instead.
        refused.push(
          refusedOf(comment, 'reports a failed run in a row the error classifier does not read'),
        );
      } else {
        reviews.push(reviewOf(comment, resolution.commitId, resolution.report));
      }
    }
  }
  return { reviews, refused, notices };
}
