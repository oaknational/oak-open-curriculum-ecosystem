import { describe, expect, it } from 'vitest';

import { openPullRequest, type OpenInput } from './pull-request-open.js';
import {
  connectionRefused,
  requestLines,
  requestTo,
  scriptedGithub,
  writes,
  type GithubScript,
} from './test-helpers/github-fetch-double.js';
import { refusalReason } from './test-helpers/refusal-reason.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `open` verb against a scripted GitHub: the reads that precede the
 * write, each refusal they can raise and that nothing is written after one,
 * the draft POST and what it carries, and the failures a status other than
 * the expected one raises. No network, no IO.
 */

const REPO = { owner: 'acme', repoName: 'widgets' };
const API = 'https://api.github.com/repos/acme/widgets';
const TOKEN = 'ghs_pull_request_token';
const INPUT: OpenInput = {
  branch: 'feat/x',
  title: 'feat: x',
  body: 'The body.\n',
  wipLimit: 3,
  laneAuthors: ['octocat'],
};

/** An open pull request in a listing: its head ref and its author, null for an account that is gone. */
function openPr(number: number, ref: string, login: string | null = 'octocat'): unknown {
  return { number, head: { ref }, user: login === null ? null : { login } };
}

/** A pull request by an author no case here counts: somebody else's bot. */
const SOMEBODY_ELSES = openPr(10, 'dependabot/npm_and_yarn/zod-4.2.0', 'dependabot[bot]');

/** GitHub as it reads when the open can proceed: one lane by the counted author, that author's coordination branch, one by an account that is gone, one by somebody else's bot. */
function happyScript(overrides: Partial<Record<string, GithubScript>> = {}): GithubScript {
  return (request) => {
    const line = `${request.method} ${request.url}`;
    const override = overrides[line];
    if (override !== undefined) {
      return override(request);
    }
    if (line === `GET ${API}`) {
      return { status: 200, body: { default_branch: 'trunk' } };
    }
    if (line === `GET ${API}/branches/feat%2Fx`) {
      return { status: 200, body: { name: 'feat/x' } };
    }
    if (line === `GET ${API}/pulls?state=open&head=acme%3Afeat%2Fx&per_page=1`) {
      return { status: 200, body: [] };
    }
    if (line === `GET ${API}/pulls?state=open&per_page=100&page=1`) {
      return {
        status: 200,
        body: [
          openPr(7, 'feat/a'),
          openPr(8, 'coordination/2026-10-27-abc123'),
          openPr(9, 'fix/b', null),
          SOMEBODY_ELSES,
        ],
      };
    }
    if (line === `POST ${API}/pulls`) {
      return {
        status: 201,
        body: { number: 42, html_url: 'https://github.com/acme/widgets/pull/42' },
      };
    }
    return undefined;
  };
}

describe('openPullRequest', () => {
  it('reads the default branch, the branch, the head and the open count, then POSTs a draft', async () => {
    const github = scriptedGithub(happyScript());

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, INPUT);

    expect(result).toEqual({
      ok: true,
      value: {
        kind: 'opened',
        number: 42,
        url: 'https://github.com/acme/widgets/pull/42',
        labels: [],
        laneCount: 1,
      },
    });
    expect(requestLines(github.requests)).toEqual(
      expect.arrayContaining([
        `GET ${API}`,
        `GET ${API}/branches/feat%2Fx`,
        `GET ${API}/pulls?state=open&head=acme%3Afeat%2Fx&per_page=1`,
        `GET ${API}/pulls?state=open&per_page=100&page=1`,
      ]),
    );
    const post = requestTo(github.requests, 'POST', `${API}/pulls`);
    expect(writes(github.requests)).toEqual([post]);
    expect(post?.body).toEqual({
      title: 'feat: x',
      head: 'feat/x',
      base: 'trunk',
      body: 'The body.\n',
      draft: true,
    });
    expect(github.requests.every((request) => request.authorization === `Bearer ${TOKEN}`)).toBe(
      true,
    );
  });

  it('refuses, writing nothing, when the remote does not hold the branch', async () => {
    const github = scriptedGithub(
      happyScript({
        [`GET ${API}/branches/feat%2Fx`]: () => ({
          status: 404,
          body: { message: 'Branch not found' },
        }),
      }),
    );

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, INPUT);

    expect(refusalReason(result)).toContain('feat/x');
    expect(writes(github.requests)).toEqual([]);
  });

  it('refuses, naming the existing pull request, when an open one already has that head', async () => {
    const github = scriptedGithub(
      happyScript({
        [`GET ${API}/pulls?state=open&head=acme%3Afeat%2Fx&per_page=1`]: () => ({
          status: 200,
          body: [openPr(31, 'feat/x')],
        }),
      }),
    );

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, INPUT);

    expect(refusalReason(result)).toContain('#31');
    expect(writes(github.requests)).toEqual([]);
  });

  it("refuses at the limit, counting the counted author's lane and not their coordination branch, an account that is gone, or somebody else's bot", async () => {
    const github = scriptedGithub(happyScript());

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, { ...INPUT, wipLimit: 1 });

    expect(refusalReason(result)).toContain('lane pull requests open: 1');
    expect(writes(github.requests)).toEqual([]);
  });

  describe('with more than one counted author', () => {
    /** Six open pull requests: two by the counted authors on lane branches, four that are not this clone's lanes. */
    const MIXED = {
      [`GET ${API}/pulls?state=open&per_page=100&page=1`]: () => ({
        status: 200,
        body: [
          openPr(7, 'feat/a'),
          openPr(8, 'coordination/2026-10-27-abc123', 'hubot[bot]'),
          openPr(9, 'fix/b', null),
          SOMEBODY_ELSES,
          openPr(11, 'chore/c', 'ada'),
          openPr(12, 'chore/d', 'hubot[bot]'),
        ],
      }),
    };
    const AUTHORS = ['Hubot[bot]', 'ada'];

    it('counts only the stated authors, whatever the case of the login, and never a coordination branch', async () => {
      const github = scriptedGithub(happyScript(MIXED));

      const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, {
        ...INPUT,
        wipLimit: 3,
        laneAuthors: AUTHORS,
      });

      expect(result).toMatchObject({ ok: true, value: { kind: 'opened', laneCount: 2 } });
    });

    it('refuses at the limit, naming the count and the authors it was taken over', async () => {
      const github = scriptedGithub(happyScript(MIXED));

      const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, {
        ...INPUT,
        wipLimit: 2,
        laneAuthors: AUTHORS,
      });

      expect(refusalReason(result)).toContain('lane pull requests open: 2');
      expect(refusalReason(result)).toContain('Hubot[bot], ada');
      expect(writes(github.requests)).toEqual([]);
    });

    it("opens at a limit of one when every open pull request is somebody else's", async () => {
      const github = scriptedGithub(happyScript());

      const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, {
        ...INPUT,
        wipLimit: 1,
        laneAuthors: AUTHORS,
      });

      expect(result).toMatchObject({ ok: true, value: { kind: 'opened', laneCount: 0 } });
    });
  });

  it('follows the listing to the next page when a page holds 100, so a count past 100 is exact', async () => {
    const page1 = Array.from({ length: 100 }, (_, index) => openPr(index + 1, `lane/${index}`));
    const github = scriptedGithub(
      happyScript({
        [`GET ${API}/pulls?state=open&per_page=100&page=1`]: () => ({ status: 200, body: page1 }),
        [`GET ${API}/pulls?state=open&per_page=100&page=2`]: () => ({
          status: 200,
          body: [openPr(101, 'lane/100'), openPr(102, 'coordination/x')],
        }),
      }),
    );

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, {
      ...INPUT,
      wipLimit: 101,
    });

    expect(refusalReason(result)).toContain('101');
    expect(requestLines(github.requests)).toContain(
      `GET ${API}/pulls?state=open&per_page=100&page=2`,
    );
  });

  it('opens when the count is one under the limit', async () => {
    const github = scriptedGithub(happyScript());

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, { ...INPUT, wipLimit: 3 });

    expect(result.ok && result.value.kind).toBe('opened');
  });

  it.each([
    { line: `GET ${API}`, status: 403, message: 'Resource not accessible by integration' },
    { line: `GET ${API}/branches/feat%2Fx`, status: 500, message: 'Server Error' },
    {
      line: `GET ${API}/pulls?state=open&head=acme%3Afeat%2Fx&per_page=1`,
      status: 502,
      message: 'Bad',
    },
    { line: `GET ${API}/pulls?state=open&per_page=100&page=1`, status: 422, message: 'Nope' },
    { line: `POST ${API}/pulls`, status: 422, message: 'Validation Failed' },
  ])('fails naming the status and GitHub message when $line answers $status', async (step) => {
    const github = scriptedGithub(
      happyScript({
        [step.line]: () => ({ status: step.status, body: { message: step.message } }),
      }),
    );

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, INPUT);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain(String(step.status));
    expect(failureMessage(result)).toContain(step.message);
    expect(failureMessage(result)).not.toContain(TOKEN);
  });

  it('fails when a body is outside the shape the call documents', async () => {
    const github = scriptedGithub(
      happyScript({
        [`POST ${API}/pulls`]: () => ({ status: 201, body: { number: 'forty-two' } }),
      }),
    );

    const result = await openPullRequest(github.fetchImpl, TOKEN, REPO, INPUT);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('POST');
  });

  it('fails as a value, never a throw, when the connection drops', async () => {
    const result = await openPullRequest(connectionRefused, TOKEN, REPO, INPUT);

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('connection reset');
  });

  it('sends the title and body verbatim, including characters JSON must escape', async () => {
    const github = scriptedGithub(happyScript());
    const body = 'line one\n"quoted" & <tag>\n';

    await openPullRequest(github.fetchImpl, TOKEN, REPO, { ...INPUT, body, title: 'a "b" c' });

    const post = requestTo(github.requests, 'POST', `${API}/pulls`);
    expect(post?.body).toMatchObject({ title: 'a "b" c', body });
  });
});
