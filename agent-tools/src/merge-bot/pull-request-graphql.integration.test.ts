import { describe, expect, it } from 'vitest';

import type { GithubApiFetch } from './mint-installation-token.js';
import { markReadyForReview, resolveReviewThread } from './pull-request-graphql.js';
import {
  scriptedGithub,
  writes,
  type GithubScript,
  type RecordedRequest,
} from './test-helpers/github-fetch-double.js';
import { refusalReason } from './test-helpers/refusal-reason.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The two verbs on GitHub's GraphQL surface, against a scripted GitHub: the
 * read each makes first, the refusals that read raises with no mutation
 * sent, the mutation and the id it carries, the failure when the mutation
 * answers but the state did not take, and the failures a non-200 raises
 * with GitHub's words. No network, no IO.
 */

const REPO = { owner: 'acme', repoName: 'widgets' };
const API = 'https://api.github.com/repos/acme/widgets';
const GRAPHQL = 'https://api.github.com/graphql';
const TOKEN = 'ghs_pull_request_token';
const THREAD = 'PRRT_kwDOAbc123';
const PR_NODE = 'PR_kwDOXyz';

/** The GraphQL document a recorded request carried, for assertions on what was asked. */
function graphqlOf(request: RecordedRequest | undefined): { query: string; variables: unknown } {
  const body = request?.body;
  if (typeof body !== 'object' || body === null || !('query' in body) || !('variables' in body)) {
    throw new Error('the request carried no GraphQL document');
  }
  return { query: String(body.query), variables: body.variables };
}

/** The mutations among the recorded requests: the GraphQL documents that are not reads. */
function mutations(requests: readonly RecordedRequest[]): RecordedRequest[] {
  return requests.filter(
    (request) => request.url === GRAPHQL && graphqlOf(request).query.startsWith('mutation'),
  );
}

/** GitHub's answer to the thread read: the node as a review thread on `pr` of `repository`, resolved or not. */
function threadNode(pr: number, isResolved: boolean, repository = 'acme/widgets'): unknown {
  return {
    data: {
      node: {
        __typename: 'PullRequestReviewThread',
        isResolved,
        pullRequest: { number: pr, repository: { nameWithOwner: repository } },
      },
    },
  };
}

/** A script answering the thread read with `read`, and the resolve mutation with `mutation`. */
function resolveScript(read: unknown, mutation: unknown): GithubScript {
  return (request) => {
    if (request.url !== GRAPHQL) {
      return undefined;
    }
    return graphqlOf(request).query.includes('resolveReviewThread')
      ? { status: 200, body: mutation }
      : { status: 200, body: read };
  };
}

const RESOLVED_ANSWER = { data: { resolveReviewThread: { thread: { isResolved: true } } } };

describe('resolveReviewThread', () => {
  it('reads the thread, then resolves it by its node id', async () => {
    const github = scriptedGithub(resolveScript(threadNode(42, false), RESOLVED_ANSWER));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(result).toEqual({ ok: true, value: { kind: 'resolved', pr: 42, thread: THREAD } });
    const read = github.requests.find((request) => graphqlOf(request).query.startsWith('query'));
    expect(graphqlOf(read).variables).toEqual({ id: THREAD });
    expect(mutations(github.requests).map((request) => graphqlOf(request).variables)).toEqual([
      { id: THREAD },
    ]);
    expect(github.requests.every((request) => request.authorization === `Bearer ${TOKEN}`)).toBe(
      true,
    );
  });

  it('refuses, mutating nothing, when the thread is on another pull request', async () => {
    const github = scriptedGithub(resolveScript(threadNode(41, false), RESOLVED_ANSWER));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(refusalReason(result)).toContain('acme/widgets#41');
    expect(mutations(github.requests)).toEqual([]);
  });

  it("refuses, mutating nothing, when the thread is on another repository's pull request of the same number", async () => {
    const github = scriptedGithub(
      resolveScript(threadNode(42, false, 'acme/gadgets'), RESOLVED_ANSWER),
    );

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(refusalReason(result)).toContain('acme/gadgets#42');
    expect(refusalReason(result)).toContain('not acme/widgets#42');
    expect(mutations(github.requests)).toEqual([]);
  });

  it('refuses, mutating nothing, when the thread is already resolved', async () => {
    const github = scriptedGithub(resolveScript(threadNode(42, true), RESOLVED_ANSWER));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(refusalReason(result)).toContain('already resolved');
    expect(mutations(github.requests)).toEqual([]);
  });

  it.each([
    { name: 'no node', node: null },
    { name: 'a node of another type', node: { __typename: 'IssueComment' } },
  ])('refuses, mutating nothing, when the id names $name', async ({ node }) => {
    const github = scriptedGithub(resolveScript({ data: { node } }, RESOLVED_ANSWER));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(refusalReason(result)).toContain('review thread');
    expect(mutations(github.requests)).toEqual([]);
  });

  it('fails when the mutation answers but the thread still reads unresolved', async () => {
    const unresolved = { data: { resolveReviewThread: { thread: { isResolved: false } } } };
    const github = scriptedGithub(resolveScript(threadNode(42, false), unresolved));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('unresolved');
  });

  it("fails with GitHub's words on a GraphQL error", async () => {
    const errors = { errors: [{ message: 'Could not resolve to a node with the global id' }] };
    const github = scriptedGithub(resolveScript(errors, RESOLVED_ANSWER));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(failureMessage(result)).toContain('Could not resolve to a node');
  });

  it("fails naming the status and GitHub's message when the read answers a non-200 without GraphQL errors", async () => {
    const github = scriptedGithub(() => ({
      status: 403,
      body: { message: 'Resource not accessible by integration' },
    }));

    const result = await resolveReviewThread(github.fetchImpl, TOKEN, REPO, 42, THREAD);

    expect(failureMessage(result)).toContain('403');
    expect(failureMessage(result)).toContain('Resource not accessible by integration');
    expect(failureMessage(result)).not.toContain(TOKEN);
  });

  it('fails naming the status when a non-200 answer carries no JSON body', async () => {
    const html: GithubApiFetch = () =>
      Promise.resolve({ status: 502, json: () => Promise.reject(new Error('Unexpected token <')) });

    const result = await resolveReviewThread(html, TOKEN, REPO, 42, THREAD);

    expect(failureMessage(result)).toContain('502');
    expect(failureMessage(result)).toContain('non-JSON');
  });
});

/** GitHub's REST reading of pull request 42. */
function pullRequest(state: 'open' | 'closed', draft: boolean): unknown {
  return { number: 42, node_id: PR_NODE, state, draft };
}

/** A script answering the pull request read and the ready mutation. */
function readyScript(read: unknown, mutation: unknown): GithubScript {
  return (request) => {
    if (`${request.method} ${request.url}` === `GET ${API}/pulls/42`) {
      return { status: 200, body: read };
    }
    return request.url === GRAPHQL ? { status: 200, body: mutation } : undefined;
  };
}

const READY_ANSWER = {
  data: { markPullRequestReadyForReview: { pullRequest: { isDraft: false } } },
};

describe('markReadyForReview', () => {
  it('reads the pull request, then marks it ready by its node id', async () => {
    const github = scriptedGithub(readyScript(pullRequest('open', true), READY_ANSWER));

    const result = await markReadyForReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(result).toEqual({ ok: true, value: { kind: 'ready', pr: 42 } });
    expect(mutations(github.requests).map((request) => graphqlOf(request).variables)).toEqual([
      { id: PR_NODE },
    ]);
  });

  it('refuses, mutating nothing, when the pull request is not a draft', async () => {
    const github = scriptedGithub(readyScript(pullRequest('open', false), READY_ANSWER));

    const result = await markReadyForReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(refusalReason(result)).toContain('not a draft');
    expect(writes(github.requests)).toEqual([]);
  });

  it('refuses, mutating nothing, when the pull request is not open', async () => {
    const github = scriptedGithub(readyScript(pullRequest('closed', true), READY_ANSWER));

    const result = await markReadyForReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(refusalReason(result)).toContain('not open');
    expect(writes(github.requests)).toEqual([]);
  });

  it('fails when the mutation answers but the pull request still reads as a draft', async () => {
    const stillDraft = {
      data: { markPullRequestReadyForReview: { pullRequest: { isDraft: true } } },
    };
    const github = scriptedGithub(readyScript(pullRequest('open', true), stillDraft));

    const result = await markReadyForReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('draft');
  });

  it('fails naming the status when the pull request cannot be read', async () => {
    const github = scriptedGithub(() => ({ status: 404, body: { message: 'Not Found' } }));

    const result = await markReadyForReview(github.fetchImpl, TOKEN, REPO, 42);

    expect(failureMessage(result)).toContain('404');
  });
});
