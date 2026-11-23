import { describe, expect, it } from 'vitest';

import {
  API,
  BODY_FILE,
  runPullRequest,
  type PullRequestRunOptions,
} from './test-helpers/pull-request-cli-double.js';
import type { GithubScript } from './test-helpers/github-fetch-double.js';

/**
 * Whose open pull requests the limit counts, through the
 * `merge-bot pull-request open` front door over injected seams. The limit is
 * on this clone's own work in progress: a repository shared with other
 * people holds their pull requests too, and those are not this clone's
 * lanes. No network, no IO.
 */

function openAt(limit: number): readonly string[] {
  return [
    'open',
    '--branch',
    'feat/x',
    '--title',
    'feat: x',
    '--body-file',
    BODY_FILE,
    '--wip-limit',
    String(limit),
  ];
}

/** GitHub holding three open lane pull requests, one each by a person, this clone's bot and somebody else. */
const THREE_AUTHORS: GithubScript = (request) => {
  const line = `${request.method} ${request.url}`;
  if (line === `GET ${API}`) {
    return { status: 200, body: { default_branch: 'trunk' } };
  }
  if (line === `GET ${API}/branches/feat%2Fx`) {
    return { status: 200, body: { name: 'feat/x' } };
  }
  if (line.startsWith(`GET ${API}/pulls?state=open&head=`)) {
    return { status: 200, body: [] };
  }
  if (line.startsWith(`GET ${API}/pulls?state=open`)) {
    return {
      status: 200,
      body: [
        { number: 1, head: { ref: 'feat/a' }, user: { login: 'ada' } },
        { number: 2, head: { ref: 'feat/b' }, user: { login: 'some-bot[bot]' } },
        { number: 3, head: { ref: 'feat/c' }, user: { login: 'octocat' } },
      ],
    };
  }
  return line === `POST ${API}/pulls`
    ? { status: 201, body: { number: 43, html_url: `${API}/pull/43` } }
    : undefined;
};

/** A clone's merge-bot config, with whatever it states beyond the identity. */
function configStating(extra: object): PullRequestRunOptions['readConfigFileImpl'] {
  return () =>
    JSON.stringify({ appSlug: 'some-bot', appId: '4352989', repo: 'acme/widgets', ...extra });
}

/** Git answering the primary checkout, and `user.name` as given; no name is how git answers an unset key. */
function gitNaming(name: string | undefined): (args: readonly string[]) => string {
  return (args) => {
    if (args[0] !== 'config') {
      return 'worktree /srv/repo\n';
    }
    if (name === undefined) {
      throw new Error('git config user.name exited 1');
    }
    return `${name}\n`;
  };
}

describe('merge-bot pull-request open, whose pull requests the limit counts', () => {
  it("counts git's user.name and the clone's own bot when the clone states no authors", async () => {
    const run = await runPullRequest(openAt(2), {
      script: THREE_AUTHORS,
      readConfigFileImpl: configStating({}),
      overrides: { runGitImpl: gitNaming('ada') },
    });

    expect(run.exit).toBe(3);
    expect(run.err).toContain('lane pull requests open: 2');
    expect(run.err).toContain('authors counted: ada, some-bot[bot]');
  });

  it("counts the clone's own bot alone when git states no name", async () => {
    const run = await runPullRequest(openAt(1), {
      script: THREE_AUTHORS,
      readConfigFileImpl: configStating({}),
      overrides: { runGitImpl: gitNaming(undefined) },
    });

    expect(run.exit).toBe(3);
    expect(run.err).toContain('authors counted: some-bot[bot])');
  });

  it("names the bot once when git's user.name is the bot's own login, whatever its case", async () => {
    const run = await runPullRequest(openAt(1), {
      script: THREE_AUTHORS,
      readConfigFileImpl: configStating({}),
      overrides: { runGitImpl: gitNaming('Some-Bot[bot]') },
    });

    expect(run.err).toContain('authors counted: some-bot[bot])');
  });

  it("reads git's user.name without the whitespace around it", async () => {
    const run = await runPullRequest(openAt(2), {
      script: THREE_AUTHORS,
      readConfigFileImpl: configStating({}),
      overrides: { runGitImpl: gitNaming('  ada  ') },
    });

    expect(run.err).toContain('authors counted: ada, some-bot[bot])');
  });

  it('counts the authors the clone states in place of the default, and prints the count it found', async () => {
    const run = await runPullRequest(openAt(2), {
      script: THREE_AUTHORS,
      readConfigFileImpl: configStating({ laneAuthors: ['octocat'] }),
      overrides: { runGitImpl: gitNaming('ada') },
    });

    expect(run.exit).toBe(0);
    expect(run.out).toContain('#43');
    expect(run.out).toContain('lanes already open: 1');
  });
});
