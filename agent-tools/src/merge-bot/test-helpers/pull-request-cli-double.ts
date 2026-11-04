import { err, ok } from '@oaknational/result';

import type { BranchArgSeams } from '../branch-arg.js';
import { runMergeBotCli, type MergeBotCliInput } from '../cli.js';
import type { PushMint } from '../push-mint.js';
import { scriptedGithub, type GithubScript, type RecordedRequest } from './github-fetch-double.js';
import { EXPIRES_AT, mintAnswering } from './push-cli-double.js';

/**
 * The doubles behind the `merge-bot pull-request` front-door tests: GitHub
 * as a script (`github-fetch-double.ts`), the mint as a fake, the body files
 * as a map from path to content, and `runPullRequest`, the CLI over all of
 * them with both output streams captured. No network, no IO.
 */

export const TOKEN = 'sekrit-pull-request-token';
export const API = 'https://api.github.com/repos/acme/widgets';
export const GRAPHQL = 'https://api.github.com/graphql';
export const BODY_FILE = '/srv/repo/.agent/state/body.md';
export const BODY = 'The body, verbatim.\n';

/** A mint that answers `TOKEN`: what a run that reaches GitHub is given, unless a case gives another. */
const MINT_ANSWERING: PushMint = mintAnswering(TOKEN);

/** The mint a run that must mint nothing is given: reaching it fails the run, so a refusal that reached it would not read as one. */
export const MINT_UNREACHED: PushMint = () =>
  Promise.resolve(err(new Error('the mint was reached')));

/** A mint that answers `TOKEN` and records the scope of each mint it is asked for. */
export function mintRecording(): { readonly mint: PushMint; readonly scopes: string[] } {
  const scopes: string[] = [];
  return {
    scopes,
    mint: (config) => {
      scopes.push(config.scope);
      return Promise.resolve(ok({ token: TOKEN, expiresAt: EXPIRES_AT, installationId: 55 }));
    },
  };
}

/** The dispatch verb's two calls, as GitHub answers them when the dispatch can proceed. */
export const DISPATCH_SCRIPT: GithubScript = (request) => {
  const line = `${request.method} ${request.url}`;
  if (line === `GET ${API}`) {
    return { status: 200, body: { default_branch: 'trunk' } };
  }
  return line === `POST ${API}/actions/workflows/upstream-carrier.yml/dispatches`
    ? { status: 204, body: null }
    : undefined;
};

const IDENTITY_CONFIG = JSON.stringify({
  appSlug: 'jimbot-oakington-iii',
  appId: '4352989',
  repo: 'acme/widgets',
});

/** GitHub answering nothing: every request is unscripted, which the double reports loudly. */
const SILENT_GITHUB: GithubScript = () => undefined;

export interface PullRequestRun {
  readonly exit: number;
  readonly out: string;
  readonly err: string;
  /** Every request GitHub received, in order. */
  readonly requests: readonly RecordedRequest[];
}

/** What a front-door run may vary besides argv. */
export interface PullRequestRunOptions {
  /** GitHub's answers; defaults to answering nothing. */
  readonly script?: GithubScript;
  /** The token mint; defaults to {@link MINT_ANSWERING}. */
  readonly mint?: PushMint;
  /** The files the run may read, by path; a path outside the map rejects as a missing file does. */
  readonly files?: Readonly<Record<string, string>>;
  readonly readConfigFileImpl?: (path: string) => string;
  /** The `--branch` check's seams; defaults to an oracle that accepts every name. */
  readonly branchArgSeams?: BranchArgSeams;
  readonly overrides?: Partial<MergeBotCliInput>;
}

/** A file reader over a constant map. */
function filesReader(files: Readonly<Record<string, string>>): (path: string) => Promise<string> {
  return (path) => {
    const content = files[path];
    return content === undefined
      ? Promise.reject(new Error(`ENOENT: no such file, open '${path}'`))
      : Promise.resolve(content);
  };
}

/** Run `merge-bot pull-request` over the doubles. */
export async function runPullRequest(
  args: readonly string[],
  options: PullRequestRunOptions = {},
): Promise<PullRequestRun> {
  const out: string[] = [];
  const errText: string[] = [];
  const github = scriptedGithub(options.script ?? SILENT_GITHUB);
  const exit = await runMergeBotCli({
    args: ['pull-request', ...args],
    env: { HOME: '/test-home' },
    stdout: { write: (chunk: string) => out.push(chunk) > 0 },
    stderr: { write: (chunk: string) => errText.push(chunk) > 0 },
    fetchImpl: github.fetchImpl,
    mintImpl: options.mint ?? MINT_ANSWERING,
    readFileImpl: filesReader(options.files ?? { [BODY_FILE]: BODY }),
    readConfigFileImpl: options.readConfigFileImpl ?? (() => IDENTITY_CONFIG),
    repoRoot: '/srv/repo',
    runGitImpl: () => 'worktree /srv/repo\n',
    branchArgSeams: options.branchArgSeams ?? { refFormatOracle: () => true },
    ...options.overrides,
  });
  return { exit, out: out.join(''), err: errText.join(''), requests: github.requests };
}

/** GitHub as it reads when every verb on pull request 42 can proceed. */
export const CONVERSATION_SCRIPT: GithubScript = (request) => {
  const line = `${request.method} ${request.url}`;
  if (line === `GET ${API}/pulls/42`) {
    return { status: 200, body: { number: 42, node_id: 'PR_kwDOXyz', state: 'open', draft: true } };
  }
  if (line === `POST ${API}/issues/42/comments`) {
    return { status: 201, body: { id: 9001, html_url: `${API}/pull/42#issuecomment-9001` } };
  }
  if (line === `POST ${API}/pulls/42/comments/777/replies`) {
    return { status: 201, body: { id: 778, html_url: `${API}/pull/42#discussion_r778` } };
  }
  if (line === `PATCH ${API}/pulls/42`) {
    return { status: 200, body: { state: 'closed' } };
  }
  if (line !== `POST ${GRAPHQL}`) {
    return undefined;
  }
  const document = JSON.stringify(request.body);
  if (document.includes('resolveReviewThread')) {
    return {
      status: 200,
      body: { data: { resolveReviewThread: { thread: { isResolved: true } } } },
    };
  }
  if (document.includes('markPullRequestReadyForReview')) {
    return {
      status: 200,
      body: { data: { markPullRequestReadyForReview: { pullRequest: { isDraft: false } } } },
    };
  }
  return {
    status: 200,
    body: {
      data: {
        node: {
          __typename: 'PullRequestReviewThread',
          isResolved: false,
          pullRequest: { number: 42, repository: { nameWithOwner: 'acme/widgets' } },
        },
      },
    },
  };
};
