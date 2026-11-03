import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { graphqlJson } from './github-graphql.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { readPullRequest, refused, type Outcome } from './pull-request-github.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The verbs of `merge-bot pull-request` that write on GitHub's GraphQL
 * surface, where alone they exist: resolving a review thread, and marking a
 * draft ready for review. Each reads its precondition first and refuses as a
 * typed value, mutating nothing; each reads the mutation's answer back and
 * fails when the state it asked for did not take.
 */

const threadReadSchema = z.object({
  data: z.object({
    node: z
      .object({
        __typename: z.string(),
        isResolved: z.boolean().optional(),
        pullRequest: z
          .object({
            number: z.number().int().positive(),
            repository: z.object({ nameWithOwner: z.string().min(1) }),
          })
          .optional(),
      })
      .nullable(),
  }),
});

/** The thread as the read answers it. */
type ThreadNode = z.output<typeof threadReadSchema>['data']['node'];

const threadResolvedSchema = z.object({
  data: z.object({
    resolveReviewThread: z.object({ thread: z.object({ isResolved: z.boolean() }) }),
  }),
});

const readyMarkedSchema = z.object({
  data: z.object({
    markPullRequestReadyForReview: z.object({ pullRequest: z.object({ isDraft: z.boolean() }) }),
  }),
});

const THREAD_READ = `query($id: ID!) {
  node(id: $id) {
    __typename
    ... on PullRequestReviewThread {
      isResolved
      pullRequest { number repository { nameWithOwner } }
    }
  }
}`;

const RESOLVE_THREAD = `mutation($id: ID!) {
  resolveReviewThread(input: { threadId: $id }) { thread { isResolved } }
}`;

const MARK_READY = `mutation($id: ID!) {
  markPullRequestReadyForReview(input: { pullRequestId: $id }) { pullRequest { isDraft } }
}`;

/** A pull request as the thread read names it, for the refusal: `owner/name#number`. */
function pullRequestName(repository: string, number: number): string {
  return `${repository}#${String(number)}`;
}

/**
 * What the thread read rules out: not a thread, on another pull request
 * (another repository's pull request of the same number included: a node id
 * is global, the number is not), or already resolved.
 */
function threadRefusal(
  node: ThreadNode,
  repo: BotRepository,
  pr: number,
  thread: string,
): string | undefined {
  if (node === null || node.__typename !== 'PullRequestReviewThread') {
    return `"${thread}" does not name a review thread`;
  }
  const expected = `${repo.owner}/${repo.repoName}`;
  const on = node.pullRequest;
  const elsewhere =
    on === undefined ||
    on.number !== pr ||
    on.repository.nameWithOwner.toLowerCase() !== expected.toLowerCase();
  if (elsewhere) {
    const where = on === undefined ? '?' : pullRequestName(on.repository.nameWithOwner, on.number);
    return `thread "${thread}" is on pull request ${where}, not ${pullRequestName(expected, pr)}`;
  }
  return node.isResolved === true ? `thread "${thread}" is already resolved` : undefined;
}

/** The `resolve` verb: read the thread, refuse what the read rules out, then resolve. */
export async function resolveReviewThread(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
  thread: string,
): Promise<Result<Outcome<'resolved'>, Error>> {
  const read = await graphqlJson(
    fetchImpl,
    token,
    'the review thread read',
    { query: THREAD_READ, variables: { id: thread } },
    threadReadSchema,
  );
  if (!read.ok) {
    return read;
  }
  const refusal = threadRefusal(read.value.data.node, repo, pr, thread);
  if (refusal !== undefined) {
    return ok(refused(refusal));
  }
  const resolved = await graphqlJson(
    fetchImpl,
    token,
    'the thread resolution',
    { query: RESOLVE_THREAD, variables: { id: thread } },
    threadResolvedSchema,
  );
  if (!resolved.ok) {
    return resolved;
  }
  return resolved.value.data.resolveReviewThread.thread.isResolved
    ? ok({ kind: 'resolved', pr, thread })
    : err(
        new Error(`the thread resolution answered, but thread "${thread}" still reads unresolved`),
      );
}

/** The `ready` verb: an open draft, marked ready by its node id. */
export async function markReadyForReview(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  pr: number,
): Promise<Result<Outcome<'ready'>, Error>> {
  const read = await readPullRequest(fetchImpl, token, repo, pr);
  if (!read.ok) {
    return read;
  }
  if (read.value.state !== 'open') {
    return ok(refused(`pull request #${String(pr)} is not open`));
  }
  if (!read.value.draft) {
    return ok(refused(`pull request #${String(pr)} is not a draft`));
  }
  const marked = await graphqlJson(
    fetchImpl,
    token,
    'the ready-for-review mark',
    { query: MARK_READY, variables: { id: read.value.node_id } },
    readyMarkedSchema,
  );
  if (!marked.ok) {
    return marked;
  }
  return marked.value.data.markPullRequestReadyForReview.pullRequest.isDraft
    ? err(
        new Error(
          `the ready-for-review mark answered, but pull request #${String(pr)} still reads as a draft`,
        ),
      )
    : ok({ kind: 'ready', pr });
}
