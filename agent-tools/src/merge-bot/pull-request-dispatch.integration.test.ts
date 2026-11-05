import { describe, expect, it } from 'vitest';

import { dispatchWorkflow, workflowFile, type WorkflowFile } from './pull-request-dispatch.js';
import {
  connectionRefused,
  requestTo,
  scriptedGithub,
  writes,
  type GithubScript,
} from './test-helpers/github-fetch-double.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `dispatch-workflow` verb: the file-name shape only a plain workflow
 * basename passes, and the dispatch against a scripted GitHub — the default
 * branch read first, the POST with it as the ref, a 204 as done and any
 * other status as a failure naming it. No network, no IO.
 */

const REPO = { owner: 'acme', repoName: 'widgets' };
const API = 'https://api.github.com/repos/acme/widgets';
const TOKEN = 'ghs_dispatch_token';
const DISPATCHES = `${API}/actions/workflows/upstream-carrier.yml/dispatches`;

function carrier(): WorkflowFile {
  const file = workflowFile('upstream-carrier.yml');
  if (!file.ok) {
    throw new Error('the fixture file name must pass the shape check');
  }
  return file.value;
}

/** GitHub as it reads when the dispatch can proceed: the default branch, then the 204. */
function dispatchScript(post: { status: number; body: unknown }): GithubScript {
  return (request) => {
    const line = `${request.method} ${request.url}`;
    if (line === `GET ${API}`) {
      return { status: 200, body: { default_branch: 'trunk' } };
    }
    return line === `POST ${DISPATCHES}` ? post : undefined;
  };
}

describe('workflowFile', () => {
  it.each(['upstream-carrier.yml', 'ci.yaml', 'a_b-c.1.yml', 'Mixed-Case.yml'])(
    'admits the plain workflow basename %s',
    (name) => {
      expect(workflowFile(name)).toEqual({ ok: true, value: { fileName: name } });
    },
  );

  it.each([
    'ci/x.yml',
    '../upstream-carrier.yml',
    '.github/workflows/ci.yml',
    'x.txt',
    'x.yml/',
    '.yml',
    '',
    'two words.yml',
    'ünï.yml',
    'ci.yml.bak',
    // GitHub reads only the lowercase extensions as workflow files.
    'X.YML',
  ])('refuses "%s", which is not a plain *.yml or *.yaml basename', (name) => {
    const result = workflowFile(name);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('--workflow');
    expect(failureMessage(result)).toContain('basename');
  });

  it('echoes a refused name without its control and format characters', () => {
    const message = failureMessage(workflowFile('ci\u{1b}[2J.yml/x'));

    expect(message).toContain('ci[2J.yml/x');
    expect(message).not.toMatch(/[\p{Cc}\p{Cf}]/u);
  });
});

describe('dispatchWorkflow', () => {
  it('reads the default branch, then POSTs the dispatch with it as the ref', async () => {
    const github = scriptedGithub(dispatchScript({ status: 204, body: null }));

    const result = await dispatchWorkflow(github.fetchImpl, TOKEN, REPO, carrier());

    expect(result).toEqual({
      ok: true,
      value: { kind: 'dispatched', workflow: 'upstream-carrier.yml', ref: 'trunk' },
    });
    const post = requestTo(github.requests, 'POST', DISPATCHES);
    expect(writes(github.requests)).toEqual([post]);
    expect(post?.body).toEqual({ ref: 'trunk' });
    expect(github.requests.every((request) => request.authorization === `Bearer ${TOKEN}`)).toBe(
      true,
    );
  });

  it.each([
    { status: 404, message: 'Not Found' },
    { status: 403, message: 'Resource not accessible by integration' },
    { status: 422, message: 'Workflow does not have workflow_dispatch trigger' },
    { status: 200, message: 'unexpected body' },
  ])('fails naming the status and GitHub message when the POST answers $status', async (step) => {
    const github = scriptedGithub(
      dispatchScript({ status: step.status, body: { message: step.message } }),
    );

    const result = await dispatchWorkflow(github.fetchImpl, TOKEN, REPO, carrier());

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain(String(step.status));
    expect(failureMessage(result)).toContain(step.message);
    expect(failureMessage(result)).not.toContain(TOKEN);
  });

  it('fails before the POST when the default branch cannot be read', async () => {
    const github = scriptedGithub(() => ({ status: 500, body: { message: 'Server Error' } }));

    const result = await dispatchWorkflow(github.fetchImpl, TOKEN, REPO, carrier());

    expect(failureMessage(result)).toContain('500');
    expect(writes(github.requests)).toEqual([]);
  });

  it('fails as a value, never a throw, when the connection drops', async () => {
    const result = await dispatchWorkflow(connectionRefused, TOKEN, REPO, carrier());

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('connection reset');
  });
});
