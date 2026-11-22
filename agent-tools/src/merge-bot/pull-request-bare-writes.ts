import type { Result } from '@oaknational/result';

import type { GithubApiFetch } from './mint-installation-token.js';
import { requestCopilotReview } from './pull-request-copilot-review.js';
import { markReadyForReview, resolveReviewThread } from './pull-request-graphql.js';
import type { PullRequestOutcome } from './pull-request-report.js';
import type { PullRequestRequest } from './pull-request-request.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The verbs of `merge-bot pull-request` that name a pull request and send
 * no file: resolve, ready and request-review. Split from
 * `pull-request-cli.ts` at the size gate. Each has no precondition to settle
 * before the mint beyond the identity, so its write is ready as soon as the
 * request is parsed.
 */

/** A request that names a pull request and sends no file. */
export type BareRequest = Extract<
  PullRequestRequest,
  { verb: 'resolve' | 'ready' | 'request-review' }
>;

/** Whether the request is one of the verbs that send no file. */
export function isBareRequest(request: PullRequestRequest): request is BareRequest {
  return (
    request.verb === 'resolve' || request.verb === 'ready' || request.verb === 'request-review'
  );
}

/** The verb's write, given the token minted for it. */
export function bareWrite(
  request: BareRequest,
  repo: BotRepository,
): (token: string, fetchImpl: GithubApiFetch) => Promise<Result<PullRequestOutcome, Error>> {
  if (request.verb === 'resolve') {
    return (token, fetchImpl) =>
      resolveReviewThread(fetchImpl, token, repo, request.pr, request.thread);
  }
  if (request.verb === 'ready') {
    return (token, fetchImpl) => markReadyForReview(fetchImpl, token, repo, request.pr);
  }
  return (token, fetchImpl) => requestCopilotReview(fetchImpl, token, repo, request.pr);
}
