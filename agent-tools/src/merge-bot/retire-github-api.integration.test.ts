import { assert, describe, expect, it } from 'vitest';

import type { GithubApiFetch } from './mint-installation-token.js';
import { decideRetirement, type PlannedDelete } from './retire-decision.js';
import { readRemoteRefByApi, requestRefDelete } from './retire-github-api.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The retire command's two GraphQL calls against GitHub: the re-read of the
 * remote ref (with the repository's node id), and the compare-and-swap
 * delete. The fetch answers each call with a literal GitHub response.
 */

const SHA_A = 'a'.repeat(40);
const SHA_M = 'e'.repeat(40);
const REPO = { owner: 'acme', repoName: 'widgets' };
const MAIN = { name: 'main', target: { oid: SHA_M } };

function fetchAnswering(status: number, body: unknown): GithubApiFetch {
  return () => Promise.resolve({ status, json: () => Promise.resolve(body) });
}

const refusing: GithubApiFetch = () => Promise.reject(new Error('connection reset'));

function plannedRemote(): PlannedDelete {
  const decision = decideRetirement({
    branch: 'feat/x',
    base: { name: 'main', sha: 'b'.repeat(40) },
    local: undefined,
    tracking: undefined,
    remote: { sha: SHA_A, onBase: true },
    inUseBy: [],
    caseCollisions: [],
    symbolic: [],
  });
  assert(
    decision.kind === 'plan' && decision.plan.remote !== undefined,
    'the fixture plans a remote delete',
  );
  return decision.plan.remote;
}

describe('readRemoteRefByApi', () => {
  it('reads the repository id, its default branch and tip, and the ref at its oid', async () => {
    const body = {
      data: {
        repository: { id: 'R_1', defaultBranchRef: MAIN, ref: { target: { oid: SHA_A } } },
      },
    };

    expect(await readRemoteRefByApi(fetchAnswering(200, body), 't', REPO, 'feat/x')).toEqual({
      ok: true,
      value: {
        repositoryId: 'R_1',
        defaultBranch: { name: 'main', sha: SHA_M },
        ref: { kind: 'present', sha: SHA_A },
      },
    });
  });

  it('reads a null ref as absent, and a null default branch as none', async () => {
    const body = { data: { repository: { id: 'R_1', defaultBranchRef: null, ref: null } } };

    expect(await readRemoteRefByApi(fetchAnswering(200, body), 't', REPO, 'feat/x')).toEqual({
      ok: true,
      value: { repositoryId: 'R_1', defaultBranch: undefined, ref: { kind: 'absent' } },
    });
  });

  it('fails on GraphQL errors even with a 200, on a non-200, and on a refused connection', async () => {
    const errors = { errors: [{ message: 'Could not resolve to a Repository' }] };

    expect((await readRemoteRefByApi(fetchAnswering(200, errors), 't', REPO, 'feat/x')).ok).toBe(
      false,
    );
    expect((await readRemoteRefByApi(fetchAnswering(502, {}), 't', REPO, 'feat/x')).ok).toBe(false);
    expect((await readRemoteRefByApi(refusing, 't', REPO, 'feat/x')).ok).toBe(false);
  });
});

describe('requestRefDelete', () => {
  it('reads a data answer with no errors as accepted', async () => {
    const body = { data: { updateRefs: { clientMutationId: null } } };

    expect(
      (await requestRefDelete(fetchAnswering(200, body), 't', 'R_1', plannedRemote())).ok,
    ).toBe(true);
  });

  it("reads GitHub's generic error for a stale beforeOid as not accepted, with its message printable", async () => {
    const body = {
      errors: [{ message: 'Something went wrong\u001b[31m while executing your query' }],
    };
    const result = await requestRefDelete(fetchAnswering(200, body), 't', 'R_1', plannedRemote());

    expect(failureMessage(result)).toContain('Something went wrong');
    expect(failureMessage(result)).not.toContain('\u001b');
  });

  it('never puts the token in a failure message', async () => {
    const result = await requestRefDelete(
      fetchAnswering(401, { message: 'Bad credentials' }),
      'tok_secret',
      'R_1',
      plannedRemote(),
    );

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).not.toContain('tok_secret');
  });
});
