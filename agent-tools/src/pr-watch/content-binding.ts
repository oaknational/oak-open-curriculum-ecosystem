/**
 * Whether a review binds the pull request's head: exactly (it reviewed the
 * head commit), or by content (the commit it reviewed carries the same patch
 * against the base as the head does, as after a pure sync: a merge of the
 * base that leaves the pull request's own patch unchanged).
 *
 * @remarks
 * A leg bound to the exact head commit is re-opened by every sync merge,
 * although the content it reviewed has not changed. The content of a commit
 * is its patch against the base (`merge-base(base, commit)..commit`),
 * compared by `git patch-id --verbatim`, which ignores commit ids, index
 * lines and hunk offsets but not whitespace. Equal ids bind; any other
 * answer, or an id that could not be read, leaves the review unbound and the
 * leg as it was. No merge-commit structure is inspected, so the claim does
 * not depend on how the sync was made. The limit is a decision: a sync that
 * changes a file the pull request also touches, with the pull request's
 * hunks re-applied identically, still binds; the reviewer's verdict is on
 * the same hunks against new context, and the head's checks cover the
 * context (`.agent/reports/agentic-engineering/2026-09-26-sync-lineage-binding-design.md`).
 * Pure: the reader supplies the ids.
 */

declare const patchIdBrand: unique symbol;

/** A patch-id as `git patch-id` prints it: forty lowercase hex characters. */
export type PatchId = string & { readonly [patchIdBrand]: true };

const PATCH_ID = /^[0-9a-f]{40}$/u;

/** Whether a string is a patch-id; the one way a value becomes a {@link PatchId}. */
export function isPatchId(value: string): value is PatchId {
  return PATCH_ID.test(value);
}

/** A commit's content against the base: its patch-id, or why it could not be read. */
export type ContentId =
  | { readonly kind: 'id'; readonly id: PatchId }
  | { readonly kind: 'unproven'; readonly reason: string };

/** One reviewed commit's content, by the commit's oid. */
interface ReviewedContent {
  readonly oid: string;
  readonly content: ContentId;
}

/**
 * What the reader read: nothing (and why), or the head's patch-id and each
 * earlier reviewed commit's content. A reviewed commit is read only under a
 * head whose content was read.
 */
export type ContentLeg =
  | { readonly kind: 'unread'; readonly reason: string }
  | {
      readonly kind: 'read';
      readonly head: PatchId;
      readonly reviewed: readonly ReviewedContent[];
    };

/** No content read: every review binds exactly or not at all. */
export const NO_CONTENT: ContentLeg = { kind: 'unread', reason: 'content not read' };

/** How a review binds the head, if it does. */
export type Binding =
  | { readonly kind: 'exact' }
  | { readonly kind: 'content'; readonly id: PatchId }
  | { readonly kind: 'unbound' };

/** The review's one field the binding reads. */
interface Reviewed {
  readonly commitOid: string;
}

/**
 * The head a reading binds reviews to: its commit, and the content ids a
 * review of an earlier commit binds it by.
 */
export interface BindingHead {
  readonly headRefOid: string;
  readonly content: ContentLeg;
}

const UNBOUND: Binding = { kind: 'unbound' };

/**
 * How a review binds a head. An empty commit oid never binds: the full
 * harvest keeps historical reviews, and a wildcard would let an old review
 * without a commit satisfy every later push. The conservative wait this
 * creates is bounded by the checks-green timeout leg. Why a review is
 * unbound is in the content leg itself, which the reading carries.
 *
 * @param review - the review, by the commit it names
 * @param headRefOid - the pull request's head commit
 * @param content - the content the reader read
 * @returns exact, content (with the shared id), or unbound
 */
export function bindsHead(review: Reviewed, headRefOid: string, content: ContentLeg): Binding {
  if (review.commitOid === '') {
    return UNBOUND;
  }
  if (review.commitOid === headRefOid) {
    return { kind: 'exact' };
  }
  if (content.kind === 'unread') {
    return UNBOUND;
  }
  const reviewed = content.reviewed.find((entry) => entry.oid === review.commitOid)?.content;
  return reviewed?.kind === 'id' && reviewed.id === content.head
    ? { kind: 'content', id: reviewed.id }
    : UNBOUND;
}

/** Whether a review binds the head, exactly or by content. */
export function reviewBinds(review: Reviewed, head: BindingHead): boolean {
  return bindsHead(review, head.headRefOid, head.content).kind !== 'unbound';
}

/**
 * The evidence clause for reviews that bind the head, naming the inference
 * when it was made so a reader sees it: empty when one binds exactly (or
 * none binds by content), else the first content binding.
 *
 * @param reviews - reviews that bind the head
 * @param head - the head and its content
 * @returns `; bound by content (…)`, or the empty string
 */
export function bindingNote(reviews: readonly Reviewed[], head: BindingHead): string {
  const bound = reviews.map((review) => ({
    review,
    binding: bindsHead(review, head.headRefOid, head.content),
  }));
  if (bound.some(({ binding }) => binding.kind === 'exact')) {
    return '';
  }
  for (const { review, binding } of bound) {
    if (binding.kind === 'content') {
      return `; bound by content (patch-id ${binding.id.slice(0, 10)}, reviewed at ${review.commitOid.slice(0, 10)}, head ${head.headRefOid.slice(0, 10)})`;
    }
  }
  return '';
}

/**
 * The reviews that stand for the head: those binding it exactly, and those
 * binding it by content unless a round was asked of their reviewer after
 * them, since a request asks for a fresh review and a review of earlier
 * content does not stand in for it.
 *
 * @param reviews - the reviewer's reviews that bind the head
 * @param head - the head and its content
 * @param awaitsRound - whether a round asked of the reviewer holds a review
 *   (`round-requests.ts` `roundAwaiter`)
 */
export function standingReviews<Review extends Reviewed>(
  reviews: readonly Review[],
  head: BindingHead,
  awaitsRound: (review: Review) => boolean,
): readonly Review[] {
  return reviews.filter((review) => review.commitOid === head.headRefOid || !awaitsRound(review));
}

/**
 * Why a reviewer's reviews of earlier commits leave the leg owed, for its
 * evidence: the reader's own reason, so a failed read (worth a retry) reads
 * apart from changed content (worth a request); or the round requested after
 * a review bound by content, which it waits for. Empty when no review names
 * an earlier commit.
 *
 * @param reviews - the reviewer's landed reviews and markers, empty bodies excluded
 * @param head - the head and its content
 * @param awaitsRound - whether a round asked of the reviewer holds a review
 */
export function unboundNote<Review extends Reviewed>(
  reviews: readonly Review[],
  head: BindingHead,
  awaitsRound: (review: Review) => boolean,
): string {
  const earlier = reviews
    .filter((review) => review.commitOid !== '' && review.commitOid !== head.headRefOid)
    .at(-1);
  if (earlier === undefined) {
    return '';
  }
  const why = whyUnbound(earlier.commitOid, head, awaitsRound(earlier));
  return why === '' ? '' : `; the review at ${earlier.commitOid.slice(0, 10)} ${why}`;
}

function whyUnbound(oid: string, head: BindingHead, awaits: boolean): string {
  if (head.content.kind === 'unread') {
    return `is not bound by content: ${head.content.reason}`;
  }
  const reviewed = head.content.reviewed.find((entry) => entry.oid === oid);
  if (reviewed === undefined) {
    return 'is not bound by content: its commit was not read';
  }
  if (reviewed.content.kind === 'unproven') {
    return `is not bound by content: ${reviewed.content.reason}`;
  }
  if (reviewed.content.id !== head.content.head) {
    return 'carries content that differs from the head';
  }
  return awaits ? 'is bound by content and waits for the round requested after it' : '';
}
