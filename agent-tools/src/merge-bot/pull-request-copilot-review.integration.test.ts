import { describe, expect, it } from 'vitest';

import { requestCopilotReview } from './pull-request-copilot-review.js';
import { requestTo, scriptedGithub } from './test-helpers/github-fetch-double.js';
import { refusalReason } from './test-helpers/refusal-reason.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `request-review` verb against a scripted GitHub: the one call it
 * makes, what a created request reads as, the three answers that are typed
 * refusals (no such pull request, a review already pending, GitHub declining
 * the request), and the failure any other status raises. No network, no IO.
 */

const REPO = { owner: 'acme', repoName: 'widgets' };
const ENDPOINT = 'https://api.github.com/repos/acme/widgets/pulls/42/copilot-code-review';
const TOKEN = 'ghs_pull_request_token';

/** A GitHub that answers the review request with one status and body. */
function answering(status: number, body: unknown): ReturnType<typeof scriptedGithub> {
  return scriptedGithub((request) =>
    `${request.method} ${request.url}` === `POST ${ENDPOINT}` ? { status, body } : undefined,
  );
}

describe('requestCopilotReview', () => {
  it('POSTs to the pull request’s Copilot review endpoint under the token, sending no body', async () => {
    const github = answering(201, { node_id: 'CCR_kwDOAbc', state: 'PENDING' });

    const result = await requestCopilotReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(result).toEqual({
      ok: true,
      value: { kind: 'review-requested', pr: 42, reviewer: 'copilot' },
    });
    expect(github.requests).toHaveLength(1);
    const sent = requestTo(github.requests, 'POST', ENDPOINT);
    expect(sent?.body).toBeUndefined();
    expect(sent?.authorization).toBe(`Bearer ${TOKEN}`);
  });

  it('refuses a number that is not a pull request', async () => {
    const github = answering(404, { message: 'Not Found' });

    const result = await requestCopilotReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(refusalReason(result)).toBe('#42 is not a pull request');
  });

  it('refuses when a Copilot review is already pending', async () => {
    const github = answering(409, { message: 'A review request is already pending' });

    const result = await requestCopilotReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(refusalReason(result)).toBe('a Copilot review is already pending on #42');
  });

  it('refuses with GitHub’s own words when GitHub declines the request', async () => {
    const github = answering(422, { message: 'The actor is not eligible for Copilot code review' });

    const result = await requestCopilotReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(refusalReason(result)).toBe(
      'GitHub declined a Copilot review of #42 — The actor is not eligible for Copilot code review',
    );
  });

  it.each([403, 429, 503])(
    'fails naming the status and message when GitHub answers %i',
    async (status) => {
      const github = answering(status, { message: 'not now' });

      const result = await requestCopilotReview(github.fetchImpl, TOKEN, REPO, 42);

      expect(failureMessage(result)).toContain(String(status));
      expect(failureMessage(result)).toContain('not now');
    },
  );
});
