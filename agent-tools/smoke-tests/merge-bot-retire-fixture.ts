import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { z } from 'zod';

import { resolveTrustedGit } from '../src/core/trusted-git';
import { runMergeBotCli } from '../src/merge-bot/cli';
import { realGitExecutor } from '../src/merge-bot/git-executor';
import type { GithubApiFetch } from '../src/merge-bot/mint-installation-token';

import { hermeticGitEnv } from './hermetic-git-env';

/**
 * The rig for the `merge-bot retire` smokes: a real bare repository as the
 * remote, a seed clone that makes and pushes commits, and a work clone the
 * command runs in. The work clone's RAW origin URL names `acme/widgets`, as
 * the bot identity does, and `insteadOf` sends git's traffic to the bare
 * repository, so the command's origin binding and its git reads are both
 * real.
 *
 * GitHub is a double of its GraphQL contract applied to the bare repository
 * (`merge-bot-retire-github-double.ts`). Everything the command then reads
 * back is real git.
 */

export const GIT = resolveTrustedGit();
const GITHUB_URL = 'https://github.com/acme/widgets.git';
/** The token the GitHub double mints; no output stream may carry it. */
export const SMOKE_TOKEN = 'smoke-token-never-printed';

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

export interface RetireRig {
  readonly root: string;
  readonly origin: string;
  readonly seed: string;
  readonly work: string;
  readonly env: Record<string, string>;
}

/** Run git and return its trimmed stdout; a failure throws, which fails the smoke. */
export function git(rig: RetireRig, cwd: string, ...args: string[]): string {
  return execFileSync(GIT, args, { cwd, env: rig.env, encoding: 'utf8' }).trim();
}

/** A ref's sha, or undefined when it does not exist; reads by exact name. */
export function refAt(rig: RetireRig, cwd: string, ref: string): string | undefined {
  const listed = git(rig, cwd, 'for-each-ref', '--format=%(refname) %(objectname)', ref);
  const line = listed.split('\n').find((entry) => entry.startsWith(`${ref} `));
  return line?.split(' ')[1];
}

/** Commit on a branch in the seed clone and push it; returns the new tip. */
export function commitAndPush(rig: RetireRig, branch: string, message: string): string {
  git(rig, rig.seed, 'switch', '-q', branch);
  git(rig, rig.seed, 'commit', '-q', '--allow-empty', '-m', message);
  git(rig, rig.seed, 'push', '-q', 'origin', `${branch}:${branch}`);
  return git(rig, rig.seed, 'rev-parse', 'HEAD');
}

/** Cut `branch` from the seed's `from`, commit on it, push it, and merge it into `into` (pushed). */
export function mergedBranch(rig: RetireRig, branch: string, into = 'main'): string {
  git(rig, rig.seed, 'switch', '-q', '-c', branch, into);
  const tip = commitAndPush(rig, branch, `work on ${branch}`);
  git(rig, rig.seed, 'switch', '-q', into);
  git(rig, rig.seed, 'merge', '-q', '--no-ff', '-m', `merge ${branch}`, branch);
  git(rig, rig.seed, 'push', '-q', 'origin', `${into}:${into}`);
  return tip;
}

/** Build the rig, run the smoke case, and remove the rig whatever happens. */
export async function withRig<T>(run: (rig: RetireRig) => Promise<T>): Promise<T> {
  const root = mkdtempSync(join(tmpdir(), 'merge-bot-retire-'));
  const rig: RetireRig = {
    root,
    origin: join(root, 'origin.git'),
    seed: join(root, 'seed'),
    work: join(root, 'work'),
    env: hermeticGitEnv(root),
  };
  try {
    git(rig, root, 'init', '-q', '--bare', '-b', 'main', rig.origin);
    // The seed is made, not cloned: a clone of the empty bare repository warns.
    git(rig, root, 'init', '-q', '-b', 'main', rig.seed);
    git(rig, rig.seed, 'remote', 'add', 'origin', rig.origin);
    git(rig, rig.seed, 'config', 'user.name', 'smoke');
    git(rig, rig.seed, 'config', 'user.email', 'smoke@example.invalid');
    git(rig, rig.seed, 'commit', '-q', '--allow-empty', '-m', 'base');
    git(rig, rig.seed, 'push', '-q', 'origin', 'main:main');
    git(rig, root, 'clone', '-q', rig.origin, rig.work);
    git(rig, rig.work, 'config', 'user.name', 'smoke');
    git(rig, rig.work, 'config', 'user.email', 'smoke@example.invalid');
    bindOrigin(rig, rig.origin);
    return await run(rig);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** Point the work clone's raw origin URL at GitHub, and its traffic at `target`. */
export function bindOrigin(rig: RetireRig, target: string): void {
  git(rig, rig.work, 'config', 'remote.origin.url', GITHUB_URL);
  git(rig, rig.work, 'config', '--replace-all', `url.${target}.insteadOf`, GITHUB_URL);
}

const nameReport = z.looseObject({ state: z.string(), sha: z.string().optional() });

/** The `--json` outcome object, as far as the smokes read it. */
const outcomeSchema = z.looseObject({
  kind: z.string(),
  reason: z.string().optional(),
  base: z.looseObject({ name: z.string() }).optional(),
  names: z.object({ remote: nameReport, tracking: nameReport, local: nameReport }).optional(),
});

/** Read the `--json` outcome object a run wrote on stdout. */
export function outcomeOf(run: { readonly out: string }): z.infer<typeof outcomeSchema> {
  return outcomeSchema.parse(JSON.parse(run.out));
}

/**
 * Run `merge-bot retire --branch <branch>` in the work clone, with `--json`
 * unless `json` is false; the token must reach neither stream in either mode.
 */
export async function retire(
  rig: RetireRig,
  branch: string,
  fetchImpl: GithubApiFetch,
  json = true,
): Promise<{ readonly exit: number; readonly out: string; readonly err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const exit = await runMergeBotCli({
    args: ['retire', '--branch', branch, ...(json ? ['--json'] : [])],
    env: { HOME: rig.root },
    stdout: { write: (chunk: string) => out.push(chunk) > 0 },
    stderr: { write: (chunk: string) => err.push(chunk) > 0 },
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: rig.work,
    runGitImpl: (args, cwd) =>
      execFileSync(GIT, [...args], { cwd, env: rig.env, encoding: 'utf8' }),
    nowEpochSeconds: () => 1_800_000_000,
    gitExecutor: realGitExecutor(),
    gitPath: GIT,
    baseEnv: rig.env,
  });
  const run = { exit, out: out.join(''), err: err.join('') };
  assert.ok(!`${run.out}${run.err}`.includes(SMOKE_TOKEN), 'the token reached an output stream');
  return run;
}
