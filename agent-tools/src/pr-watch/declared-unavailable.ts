/**
 * A review vendor declared unavailable on a pull request: the operator's
 * stand-in for a leg the vendor cannot answer while it is down.
 *
 * @remarks
 * `--unavailable <login>=<comment-url>` names a comment the door finds in the
 * pull request's own harvest (it never fetches the url): the bot's, unedited
 * or edited only by the bot, opening with the line
 * `**<vendor-login> leg unavailable on head SHA:<40-hex>.**`. The timeline
 * must show the outage (the Director's ruling of 2026-09-28): an error review
 * from that vendor on the named head, or a round asked of it over sixty
 * minutes ago with no review since. A review from the vendor at or after the
 * declaration contradicts it. A passing declaration stands in for the
 * vendor's review of the named head, timed at the declaration; a failing one
 * is refused by name. The tip binding is judged in `content-binding.ts`. It
 * imports only its own types module, so both estates carry the same two
 * files byte for byte.
 *
 * @packageDocumentation
 */
import type {
  UnavailableDeclaration,
  DeclarationComment,
  DeclarationReview,
  ReadDeclaredStandInsInput,
  UnavailabilityProof,
  DeclaredStandIn,
  DeclarationRefusal,
  RefusedDeclaration,
  DeclaredUnavailableReading,
} from './declared-unavailable-types.js';

export type {
  UnavailableDeclaration,
  DeclarationComment,
  DeclarationReview,
  ReadDeclaredStandInsInput,
  DeclaredStandIn,
  DeclaredUnavailableReading,
} from './declared-unavailable-types.js';

/** The reading when nothing is declared. */
export const NO_DECLARATIONS: DeclaredUnavailableReading = { standIns: [], refused: [] };

const HOUR_MS = 60 * 60 * 1000;
const MARKER = /^\*\*(\S+) leg unavailable on head SHA:([0-9a-f]{40})\.\*\*$/u;

// Logins compare without case, and a REST login's `[bot]` suffix names the
// same account as the GraphQL login without it.
function bare(login: string): string {
  return login.toLowerCase().replace(/\[bot\]$/u, '');
}

function sameLogin(left: string, right: string): boolean {
  return bare(left) === bare(right);
}

function firstLine(body: string): string {
  return body.trim().split('\n', 1)[0]?.trim() ?? '';
}

// The head a marker line names for the reviewer, or null when it names none.
function markedHead(line: string, reviewer: string): string | null {
  const [, named = '', head = ''] = MARKER.exec(line) ?? [];
  return sameLogin(named, reviewer) ? head : null;
}

// An edit by a deleted account ('unknown') is another account's: the two
// cannot be shown to be one.
function editedByAnother(comment: DeclarationComment): boolean {
  return (
    comment.lastEdit !== null &&
    (comment.lastEdit.by === 'unknown' || !sameLogin(comment.lastEdit.by, comment.author))
  );
}

// At or after; an unreadable time (on either side) reads as after, which refuses.
function atOrAfter(time: string, since: string): boolean {
  const at = Date.parse(time);
  const from = Date.parse(since);
  return Number.isNaN(at) || Number.isNaN(from) || at >= from;
}

interface Located {
  readonly reviewer: string;
  readonly comment: DeclarationComment;
}

function locate(
  input: ReadDeclaredStandInsInput,
  declaration: UnavailableDeclaration,
): Located | DeclarationRefusal {
  const reviewer = input.expectedReviewers.find((login) => sameLogin(login, declaration.login));
  if (reviewer === undefined) {
    return 'names a reviewer that is not expected';
  }
  const comment = input.comments.find((candidate) => candidate.url === declaration.url);
  if (comment === undefined) {
    return 'names no comment on this pull request';
  }
  if (!sameLogin(comment.author, input.poster)) {
    return 'was posted by an account other than the bot';
  }
  return editedByAnother(comment)
    ? 'was edited by an account other than its author'
    : { reviewer, comment };
}

function proofOf(
  input: ReadDeclaredStandInsInput,
  reviewer: string,
  head: string,
  answers: readonly DeclarationReview[],
): UnavailabilityProof | null {
  const unanswered = (since: string) => !answers.some((a) => atOrAfter(a.submittedAt, since));
  const error = input.reviews.find(
    (review) =>
      sameLogin(review.author, reviewer) &&
      review.commitOid === head &&
      input.isErrorReview(review.body) &&
      unanswered(review.submittedAt),
  );
  if (error !== undefined) {
    return { kind: 'error-review', at: error.submittedAt };
  }
  const request = input.requests.find(
    (asked) =>
      sameLogin(asked.reviewer, reviewer) &&
      Date.parse(input.now) - Date.parse(asked.at) > HOUR_MS &&
      unanswered(asked.at),
  );
  return request === undefined ? null : { kind: 'unanswered-request', at: request.at };
}

function standIn(
  input: ReadDeclaredStandInsInput,
  located: Located,
): DeclaredStandIn | DeclarationRefusal {
  const { reviewer, comment } = located;
  const line = firstLine(comment.body);
  const head = markedHead(line, reviewer);
  if (head === null) {
    return 'does not open with the unavailability marker for this reviewer';
  }
  // A review with a body that is no error review is the vendor answering.
  const answers = input.reviews.filter(
    (review) =>
      sameLogin(review.author, reviewer) &&
      review.state !== 'PENDING' &&
      review.body.trim() !== '' &&
      !input.isErrorReview(review.body),
  );
  const at = comment.lastEdit?.at ?? comment.createdAt;
  if (answers.some((answer) => atOrAfter(answer.submittedAt, at))) {
    return 'meets a review from that reviewer since the declaration';
  }
  const proof = proofOf(input, reviewer, head, answers);
  return proof === null
    ? 'shows no unavailability on the timeline: no error review on the named head, and no request unanswered for over sixty minutes'
    : {
        id: comment.id,
        url: comment.url,
        author: reviewer,
        state: 'COMMENTED',
        body: line,
        commitOid: head,
        submittedAt: at,
        transport: 'declared-stand-in',
        proof,
      };
}

/**
 * Read every declaration against the pull request's own evidence: a stand-in
 * for the vendor's leg, or a refusal naming what failed.
 *
 * @param input - The declarations, the harvests, the bot's login and the clock.
 */
export function readDeclaredStandIns(input: ReadDeclaredStandInsInput): DeclaredUnavailableReading {
  const standIns: DeclaredStandIn[] = [];
  const refused: RefusedDeclaration[] = [];
  for (const declaration of input.declarations) {
    const located = locate(input, declaration);
    const verdict = typeof located === 'string' ? located : standIn(input, located);
    if (typeof verdict === 'string') {
      refused.push({ login: declaration.login, url: declaration.url, refusal: verdict });
    } else {
      standIns.push(verdict);
    }
  }
  return { standIns, refused };
}
