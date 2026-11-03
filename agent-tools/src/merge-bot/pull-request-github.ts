import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { restJson, restProbe, unexpectedStatus } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { PullRequestOutcome } from './pull-request-report.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The REST writes of `merge-bot pull-request` on an existing pull request's
 * conversation: comment, reply, close, and the read of the pull request the
 * close and the ready mark decide on. Each goes through `github-rest.ts`,
 * so a status other than the one expected is a failure naming it. The
 * verbs on the GraphQL surface (resolve, ready) are `pull-request-graphql.ts`;
 * the `open` verb, with its four reads, is `pull-request-open.ts`.
 */

/** A verb's outcome: what landed, or the typed refusal. */
export type Outcome<TKind extends PullRequestOutcome['kind']> = Extract<
  PullRequestOutcome,
  { kind: TKind | 'refused' }
>;

const commentSchema = z.object({ id: z.number().int().positive(), html_url: z.string().min(1) });

const pullRequestSchema = z.object({
  node_id: z.string().min(1),
  state: z.enum(['open', 'closed']),
  draft: z.boolean(),
});

/** The pull request as GitHub holds it: its node id, its state and whether it is a draft. */
export type PullRequestReading = z.output<typeof pullRequestSchema>;

const closedSchema = z.object({ state: z.literal('closed') });

/** The typed refusal, as every verb states one. */
export function refused(reason: string): Extract<PullRequestOutcome, { kind: 'refused' }> {
  return { kind: 'refused', reason };
}

const PULL_REQUEST_READ = 'GET /repos/{owner}/{repo}/pulls/{n}';

/** The path of one pull request under the API root. */
function pullsPath(repo: BotRepository, pr: number): string {
  return `/repos/${repo.owner}/${repo.repoName}/pulls/${String(pr)}`;
}

/** Read the pull request: for a verb whose precondition is its state. */
export async function readPullRequest(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
): Promise<Result<PullRequestReading, Error>> {
  return restJson(
    fetchImpl,
    token,
    { method: 'GET', path: pullsPath(repo, pr), label: PULL_REQUEST_READ },
    200,
    pullRequestSchema,
  );
}

/** POST `body` as an issue comment on the pull request's conversation; the comment's id and URL. */
async function postIssueComment(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
  body: string,
): Promise<Result<{ readonly id: number; readonly url: string }, Error>> {
  const posted = await restJson(
    fetchImpl,
    token,
    {
      method: 'POST',
      path: `/repos/${repo.owner}/${repo.repoName}/issues/${String(pr)}/comments`,
      body: { body },
      label: 'POST /repos/{owner}/{repo}/issues/{n}/comments',
    },
    201,
    commentSchema,
  );
  return posted.ok ? ok({ id: posted.value.id, url: posted.value.html_url }) : posted;
}

/**
 * The `comment` verb. The issues endpoint the comment goes through accepts an
 * issue number as readily as a pull request's, so the pull request is probed
 * first: a 404 is the typed refusal, any other status but 200 the failure.
 */
export async function commentOnPullRequest(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
  body: string,
): Promise<Result<Outcome<'commented'>, Error>> {
  const probe = await restProbe(fetchImpl, token, {
    method: 'GET',
    path: pullsPath(repo, pr),
    label: PULL_REQUEST_READ,
  });
  if (!probe.ok) {
    return probe;
  }
  if (probe.value.status === 404) {
    return ok(refused(`#${String(pr)} is not a pull request`));
  }
  if (probe.value.status !== 200) {
    return err(unexpectedStatus(PULL_REQUEST_READ, probe.value.status, probe.value.detail));
  }
  const posted = await postIssueComment(fetchImpl, token, repo, pr, body);
  return posted.ok
    ? ok({ kind: 'commented', pr, commentId: posted.value.id, url: posted.value.url })
    : posted;
}

/** The `reply` verb: a reply on the review thread the review comment belongs to. */
export async function replyToReviewComment(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
  comment: number,
  body: string,
): Promise<Result<Outcome<'replied'>, Error>> {
  const posted = await restJson(
    fetchImpl,
    token,
    {
      method: 'POST',
      path: `${pullsPath(repo, pr)}/comments/${String(comment)}/replies`,
      body: { body },
      label: 'POST /repos/{owner}/{repo}/pulls/{n}/comments/{id}/replies',
    },
    201,
    commentSchema,
  );
  return posted.ok
    ? ok({ kind: 'replied', pr, commentId: posted.value.id, url: posted.value.html_url })
    : posted;
}

/** The `close` verb: the reason as an issue comment, then the close; refused before either when not open. */
export async function closePullRequest(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
  reason: string,
): Promise<Result<Outcome<'closed'>, Error>> {
  const read = await readPullRequest(fetchImpl, token, repo, pr);
  if (!read.ok) {
    return read;
  }
  if (read.value.state !== 'open') {
    return ok(refused(`pull request #${String(pr)} is not open`));
  }
  const posted = await postIssueComment(fetchImpl, token, repo, pr, reason);
  if (!posted.ok) {
    return posted;
  }
  const closed = await restJson(
    fetchImpl,
    token,
    {
      method: 'PATCH',
      path: pullsPath(repo, pr),
      body: { state: 'closed' },
      label: 'PATCH /repos/{owner}/{repo}/pulls/{n}',
    },
    200,
    closedSchema,
  );
  return closed.ok
    ? ok({ kind: 'closed', pr, commentId: posted.value.id })
    : err(
        new Error(
          `the reason landed as comment ${String(posted.value.id)}, but the close did not: ${closed.error.message}`,
          { cause: closed.error },
        ),
      );
}
