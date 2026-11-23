import { describe, expect, it } from 'vitest';

import {
  API,
  BODY_FILE,
  runPullRequest,
  type PullRequestRunOptions,
} from './test-helpers/pull-request-cli-double.js';
import type { GithubScript } from './test-helpers/github-fetch-double.js';

/**
 * The labels a clone's bot adds to a pull request it opens, through the
 * `merge-bot pull-request open` front door over injected seams. The labels
 * come from the clone's own config and from nowhere else: a clone that
 * states none adds none, whoever's tool it is running. No network, no IO.
 */

const OPEN = [
  'open',
  '--branch',
  'feat/x',
  '--title',
  'feat: x',
  '--body-file',
  BODY_FILE,
  '--wip-limit',
  '3',
];

const LABELS_URL = `${API}/issues/43/labels`;

/** GitHub as it reads when the open proceeds; `labels` answers the label call. */
function openScript(labels: ReturnType<GithubScript>): GithubScript {
  return (request) => {
    const line = `${request.method} ${request.url}`;
    if (line === `GET ${API}`) {
      return { status: 200, body: { default_branch: 'trunk' } };
    }
    if (line === `GET ${API}/branches/feat%2Fx`) {
      return { status: 200, body: { name: 'feat/x' } };
    }
    if (line.startsWith(`GET ${API}/pulls?state=open`)) {
      return { status: 200, body: [] };
    }
    if (line === `POST ${API}/pulls`) {
      return { status: 201, body: { number: 43, html_url: `${API}/pull/43` } };
    }
    return line === `POST ${LABELS_URL}` ? labels : undefined;
  };
}

/** A clone's merge-bot config, with whatever it states beyond the identity. */
function configStating(extra: object): PullRequestRunOptions['readConfigFileImpl'] {
  return () =>
    JSON.stringify({
      appSlug: 'some-bot',
      appId: '4352989',
      repo: 'acme/widgets',
      ...extra,
    });
}

describe('merge-bot pull-request open, the labels of the clone that opens', () => {
  it('adds the labels the clone states, after the open', async () => {
    const run = await runPullRequest(OPEN, {
      script: openScript({ status: 200, body: [{ name: 'fleet' }, { name: 'docs' }] }),
      readConfigFileImpl: configStating({ pullRequestLabels: ['fleet', 'docs'] }),
    });

    expect(run.exit).toBe(0);
    expect(run.out).toContain('#43');
    const writes = run.requests.filter((request) => request.method === 'POST');
    expect(writes.map((request) => request.url)).toEqual([`${API}/pulls`, LABELS_URL]);
    expect(writes[1]?.body).toEqual({ labels: ['fleet', 'docs'] });
  });

  it.each([
    { name: 'states no labels', extra: {} },
    { name: 'states an empty list', extra: { pullRequestLabels: [] } },
  ])('adds none when the clone $name', async ({ extra }) => {
    const run = await runPullRequest(OPEN, {
      script: openScript(undefined),
      readConfigFileImpl: configStating(extra),
    });

    expect(run.exit).toBe(0);
    expect(run.requests.some((request) => request.url === LABELS_URL)).toBe(false);
  });

  it('fails with exit 1 when the open succeeds and the labelling does not, naming the pull request that now exists', async () => {
    const run = await runPullRequest(OPEN, {
      script: openScript({ status: 404, body: { message: 'Label does not exist' } }),
      readConfigFileImpl: configStating({ pullRequestLabels: ['fleet'] }),
    });

    expect(run.exit).toBe(1);
    expect(run.err).toContain('#43');
    expect(run.err).toContain('fleet');
    expect(run.err).toContain('do not open it again');
  });

  it('does not label when the open refuses', async () => {
    const run = await runPullRequest(OPEN, {
      script: (request) =>
        `${request.method} ${request.url}` === `GET ${API}/branches/feat%2Fx`
          ? { status: 404, body: { message: 'Branch not found' } }
          : openScript(undefined)(request),
      readConfigFileImpl: configStating({ pullRequestLabels: ['fleet'] }),
    });

    expect(run.exit).toBe(3);
    expect(run.requests.filter((request) => request.method === 'POST')).toEqual([]);
  });
});
