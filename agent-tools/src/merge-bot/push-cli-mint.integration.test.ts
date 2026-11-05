import { generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { runMergeBotCli } from './cli.js';
import type { GitExecutor } from './git-executor.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import {
  BASE_ENV,
  GIT_PATH,
  EXPIRES_AT,
  gitFake,
  gitReads,
  NOW,
  REFUSED_PUSH,
  tokenStoreFake,
} from './test-helpers/push-cli-double.js';

/**
 * `merge-bot push` with its production mint. The other push tests inject the
 * mint; here none is injected, so the CLI composes `mintForConfig` over its
 * own mint seams (the endpoints, the key, the clock). What is proven: that
 * the token GitHub answers is the one git is handed, and that every attempt
 * of one push carries that same token. Which scope the push asks for is a
 * decision, held by construction in `push-mint.ts` and never pinned here.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

/** The token the endpoint answers the first request for one with. */
const FIRST_TOKEN = 'installation-token-1';

/**
 * The mint endpoints. Each request for a token is answered with a token of
 * its own, numbered from one, so a second mint would show in what git is
 * handed.
 */
function mintEndpoints(): GithubApiFetch {
  let answered = 0;
  return (url) => {
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    answered += 1;
    const token = `installation-token-${String(answered)}`;
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token, expires_at: EXPIRES_AT }),
    });
  };
}

const SILENT: Pick<NodeJS.WriteStream, 'write'> = { write: () => true };

/** `merge-bot push` over the mint endpoints and the given git, no mint injected. */
function pushMinting(gitExecutor: GitExecutor): {
  readonly exit: Promise<number>;
  readonly handed: () => readonly string[];
} {
  const fetchImpl = mintEndpoints();
  const { store, writes } = tokenStoreFake();
  const exit = runMergeBotCli({
    args: ['push'],
    env: { HOME: '/test-home' },
    stdout: SILENT,
    stderr: SILENT,
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    nowEpochSeconds: () => 1_800_000_000,
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    runGitImpl: () => 'worktree /repo\n',
    sleepImpl: () => Promise.resolve(),
    nowIsoImpl: () => NOW,
    gitExecutor,
    gitPath: GIT_PATH,
    gitReads: gitReads(),
    branchArgSeams: { refFormatOracle: () => true },
    baseEnv: BASE_ENV,
    tokenFiles: store,
  });
  return { exit, handed: () => writes.map((write) => write.content) };
}

describe('merge-bot push with its production mint', () => {
  it('hands git the token GitHub answers', async () => {
    const run = pushMinting(gitFake().gitExecutor);

    expect(await run.exit).toBe(0);
    expect(run.handed()).toEqual([FIRST_TOKEN]);
  });

  it('hands git the same token on every attempt of a push GitHub refuses each time', async () => {
    const run = pushMinting(gitFake(REFUSED_PUSH).gitExecutor);

    expect(await run.exit).toBe(1);
    expect(run.handed().length).toBeGreaterThan(1);
    expect([...new Set(run.handed())]).toEqual([FIRST_TOKEN]);
  });
});
