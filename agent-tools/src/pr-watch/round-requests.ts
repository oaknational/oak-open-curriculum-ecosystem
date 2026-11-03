import { z } from 'zod';

import { CODEX_CONNECTOR_LOGIN, normaliseLogin } from './logins.js';

/**
 * The rounds asked of each reviewer, for the hold on reviews bound by
 * content (`content-binding.ts` `standingReviews`). GitHub's pending
 * `reviewRequests` lists a request of a user or a team, never of a bot, and
 * a Codex round is asked by a comment, so the rounds are read from the pull
 * request's history instead: every review-request event (the Copilot request
 * among them), every ready-for-review event (the Codex connector reviews a
 * pull request marked ready), and every `@codex review` comment. A review
 * bound only by content stands for the head unless a round was asked of its
 * reviewer at or after it landed.
 */

/** A round asked of a reviewer, and when. */
export interface RoundRequest {
  readonly reviewer: string;
  readonly at: string;
}

/** A top-level comment as the comments harvest reads it: who, what, and when. */
interface TriggerComment {
  readonly author: string;
  readonly body: string;
  readonly createdAt: string;
}

// A request names a User, a Bot or a Mannequin by `login`, a Team by `slug`,
// and a deleted account by null. Any other shape fails the harvest: a request
// dropped at the boundary would let a review bound by content stand.
const requestedReviewerSchema = z
  .discriminatedUnion('__typename', [
    z.object({ __typename: z.literal('User'), login: z.string() }),
    z.object({ __typename: z.literal('Bot'), login: z.string() }),
    z.object({ __typename: z.literal('Mannequin'), login: z.string() }),
    z.object({ __typename: z.literal('Team'), slug: z.string() }),
  ])
  .nullable();

const timelineNodeSchema = z.discriminatedUnion('__typename', [
  z.object({
    __typename: z.literal('ReviewRequestedEvent'),
    createdAt: z.iso.datetime(),
    requestedReviewer: requestedReviewerSchema,
  }),
  z.object({ __typename: z.literal('ReadyForReviewEvent'), createdAt: z.iso.datetime() }),
]);

// One page of the slurped `timelineItems` harvest; a slurped harvest is never
// empty (an empty connection is one page with no nodes).
const requestsPagesSchema = z
  .array(
    z.object({
      data: z.object({
        repository: z.object({
          pullRequest: z.object({
            timelineItems: z.object({ nodes: z.array(timelineNodeSchema) }),
          }),
        }),
      }),
    }),
  )
  .min(1);

function roundOf(node: z.infer<typeof timelineNodeSchema>): RoundRequest[] {
  if (node.__typename === 'ReadyForReviewEvent') {
    return [{ reviewer: CODEX_CONNECTOR_LOGIN, at: node.createdAt }];
  }
  // Only a user or a bot is one reviewer: a team names no one, a mannequin is
  // an imported placeholder that never reviews, and null is a deleted account.
  const reviewer = node.requestedReviewer;
  return reviewer?.__typename === 'User' || reviewer?.__typename === 'Bot'
    ? [{ reviewer: reviewer.login, at: node.createdAt }]
    : [];
}

/**
 * Parse the slurped multi-page request-events harvest into the rounds asked,
 * in the connection's order.
 *
 * @throws a ZodError when the input is not the expected slurped page-array
 *   shape: a request missed would let the door merge while its run composes.
 */
export function parseRequestsHarvest(raw: unknown): RoundRequest[] {
  return requestsPagesSchema
    .parse(raw)
    .flatMap((page) => page.data.repository.pullRequest.timelineItems.nodes)
    .flatMap(roundOf);
}

// A mention anywhere in a comment asks a round: a request missed lets the door
// merge while the run composes, and a false one costs only a wait. The
// connector's own comments quote its trigger, so they are never read as one.
const CODEX_TRIGGER = /(?:^|\s)@codex\s+review\b/iu;

/**
 * The Codex rounds asked by comment: each `@codex review` comment not by the
 * connector itself.
 *
 * @param comments - the pull request's full comments harvest
 */
export function commentRequests(comments: readonly TriggerComment[]): RoundRequest[] {
  return comments
    .filter(
      (comment) =>
        normaliseLogin(comment.author) !== CODEX_CONNECTOR_LOGIN &&
        CODEX_TRIGGER.test(comment.body),
    )
    .map((comment) => ({ reviewer: CODEX_CONNECTOR_LOGIN, at: comment.createdAt }));
}

/**
 * Whether a review by `reviewer` waits for a round asked of it: a pending
 * request GitHub lists, or a round asked at or after the review landed. A
 * review with no landing time waits for any round asked of its reviewer.
 *
 * @param reviewer - the reviewer whose reviews are judged
 * @param pending - the logins GitHub lists a pending request of
 * @param requests - every round asked, of any reviewer
 */
export function roundAwaiter(
  reviewer: string,
  pending: readonly string[],
  requests: readonly RoundRequest[],
): (review: { readonly submittedAt: string }) => boolean {
  const own = normaliseLogin(reviewer);
  if (pending.some((login) => normaliseLogin(login) === own)) {
    return () => true;
  }
  const asked = requests
    .filter((request) => normaliseLogin(request.reviewer) === own)
    .map((request) => Date.parse(request.at));
  return (review) => asked.some((at) => !(Date.parse(review.submittedAt) > at));
}
