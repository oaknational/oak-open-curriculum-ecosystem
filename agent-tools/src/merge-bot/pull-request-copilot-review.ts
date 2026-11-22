import { err, ok, type Result } from '@oaknational/result';

import { restProbe, unexpectedStatus } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { refused, type Outcome } from './pull-request-github.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The `request-review` verb of `merge-bot pull-request`: the bot asks
 * GitHub's Copilot reviewer for a review of a pull request, so the request
 * stands on the timeline under the bot and not under a person's sign-in.
 *
 * It is one call to the pull request's own Copilot review endpoint, whose
 * status is the answer. The `requested_reviewers` endpoint is not used: a
 * request for the Copilot reviewer made there under a bot token registers
 * nothing on the pull request. Copilot is the only reviewer this verb can
 * ask.
 */

const LABEL = 'POST /repos/{owner}/{repo}/pulls/{n}/copilot-code-review';

/**
 * Ask Copilot to review the pull request.
 *
 * A created request is the outcome. No such pull request, a review already
 * pending, and GitHub declining the request (the requester or the
 * repository is not eligible, or has no quota left) are typed refusals: the
 * call was well-formed and nothing was requested. Any other status is a
 * failure naming it.
 *
 * @param fetchImpl - GitHub.
 * @param token - The installation token minted for this invocation.
 * @param repo - The repository the bot identity names.
 * @param pr - The pull request's number.
 */
export async function requestCopilotReview(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
): Promise<Result<Outcome<'review-requested'>, Error>> {
  const probe = await restProbe(fetchImpl, token, {
    method: 'POST',
    path: `/repos/${repo.owner}/${repo.repoName}/pulls/${String(pr)}/copilot-code-review`,
    label: LABEL,
  });
  if (!probe.ok) {
    return probe;
  }
  const { status, detail } = probe.value;
  if (status === 201) {
    return ok({ kind: 'review-requested', pr, reviewer: 'copilot' });
  }
  if (status === 404) {
    return ok(refused(`#${String(pr)} is not a pull request`));
  }
  if (status === 409) {
    return ok(refused(`a Copilot review is already pending on #${String(pr)}`));
  }
  if (status === 422) {
    return ok(refused(`GitHub declined a Copilot review of #${String(pr)}${detail}`));
  }
  return err(unexpectedStatus(LABEL, status, detail));
}
