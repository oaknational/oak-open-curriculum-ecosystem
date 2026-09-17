import { err, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from '../core/trusted-git.js';
import { clearedCredentialConfig, scrubbedCredentialEnv } from './git-credential-chain.js';
import { realGitExecutor, type GitCommandResult, type GitExecutor } from './git-executor.js';
import {
  realTokenFileStore,
  removeQuietly,
  stageTokenFile,
  type TokenFileStore,
} from './push-token-file.js';

/**
 * The git plumbing behind `merge-bot push`: the static credential helper, the
 * child environment that carries only the token FILE's path, and the argv
 * that carries none of it. With `push-token-file.ts` (the 0600 file's
 * lifecycle) this is the whole credential discipline, split at the size gate
 * — the same seam `merge-args.ts` and `merge-cli.ts` record for the merge
 * action.
 *
 * The push itself is the git binary's work. Nothing here re-implements any
 * part of it; the file exists so that the ONE place a token meets a child
 * process is small enough to read in a sitting.
 *
 * The claim to hold is exactly this: the hook chain can no longer capture the
 * token ACCIDENTALLY (an env dump prints a path, not a credential). A hook
 * descendant that names the path can still read the file — same-user access
 * is not a boundary this transport can draw.
 */

export type { TokenFileStore } from './push-token-file.js';

/** A resolved git binary plus the executor that runs it. */
export interface GitContext {
  readonly file: string;
  readonly exec: GitExecutor;
}

/**
 * The one credential helper, as a static literal: it echoes the app-token
 * username and reads the password from the token FILE named by
 * `GH_PUSH_TOKEN_FILE`. Nothing is interpolated into it, so no value from
 * argv, config or the network can ever become part of the shell fragment git
 * runs. Reading a file rather than an environment variable keeps the token
 * itself out of the environment git exports to the pre-push hook chain —
 * pnpm, turbo, and every test the gates spawn — where any env dump would
 * print it; the env names only a path.
 */
const CREDENTIAL_HELPER =
  '!f() { echo username=x-access-token; echo "password=$(cat "$GH_PUSH_TOKEN_FILE")"; }; f';

/**
 * The git binary by ABSOLUTE path (SonarCloud S4036) — `resolveTrustedGit`
 * throws when it finds none, translated here at the one boundary.
 */
export function resolveGitContext(seams: {
  readonly gitExecutor?: GitExecutor;
  readonly gitPath?: string;
}): Result<GitContext, Error> {
  const exec = seams.gitExecutor ?? realGitExecutor();
  if (seams.gitPath !== undefined) {
    return ok({ file: seams.gitPath, exec });
  }
  try {
    return ok({ file: resolveTrustedGit(), exec });
  } catch (cause) {
    return err(new Error(cause instanceof Error ? cause.message : String(cause)));
  }
}

/**
 * The child environment for the push: the base WHOLESALE, any stale
 * `GH_PUSH_TOKEN` REMOVED (the hook chain must not inherit a token this
 * invocation did not place), every env-sourced arm of git's credential chain
 * removed with it (`git-credential-chain.ts` holds the table), and the
 * token-file path added LAST so a stale path in the base can never win over
 * the fresh one. Terminal prompting is disabled alongside: if the helper ever
 * failed to answer, git must fail loudly rather than fall back to asking a
 * human — under shared credentials that human's identity is what the push
 * would carry.
 */
function pushEnv(
  tokenPath: string,
  baseEnv: Readonly<Record<string, string | undefined>>,
): Record<string, string | undefined> {
  return {
    ...baseEnv,
    GH_PUSH_TOKEN: undefined,
    ...scrubbedCredentialEnv(),
    GIT_TERMINAL_PROMPT: '0',
    GH_PUSH_TOKEN_FILE: tokenPath,
  };
}

/**
 * The push call's argv: every config-sourced arm of the credential chain
 * cleared (a configured keychain helper, or a configured askpass program,
 * must never answer for the bot), then the one static helper — last, so the
 * clear it follows cannot disarm it. The token is NOT here — argv is visible
 * in the process list to anything that can read it — and neither is any
 * bypass: no force flag, no `--no-verify`.
 */
function pushArgv(remote: string, branch: string): readonly string[] {
  return [
    ...clearedCredentialConfig(),
    '-c',
    `credential.helper=${CREDENTIAL_HELPER}`,
    'push',
    remote,
    `HEAD:${branch}`,
  ];
}

/**
 * Ask git which branch HEAD is on — never inferred from the environment. No
 * output sink: a branch name is output this tool controls, so capturing it is
 * a fact about the call rather than an unexamined buffer.
 */
export async function currentBranch(
  git: GitContext,
  options: { readonly cwd: string; readonly env: Readonly<Record<string, string | undefined>> },
): Promise<Result<string, Error>> {
  const result = await git.exec(git.file, ['rev-parse', '--abbrev-ref', 'HEAD'], options);
  if (result.status !== 0) {
    return err(
      new Error(
        `cannot read the current branch (git rev-parse ${describeGitChildEnd(result)}): ${result.stderr.trim()}`,
      ),
    );
  }
  const branch = result.stdout.trim();
  return branch === ''
    ? err(new Error('cannot read the current branch: git rev-parse printed nothing'))
    : ok(branch);
}

/**
 * Hand the whole transfer to git. The token reaches it only through a 0600
 * file in a fresh private directory whose path rides the environment; the
 * directory is removed whatever the push's outcome — even a git seam that
 * throws in breach of its value-returning contract — so the token outlives
 * the transfer by nothing. That lifetime rests on the `finally` running only
 * once the call has SETTLED: the awaited git call keeps the file on disk for
 * exactly as long as git is reading it, and not one turn longer.
 *
 * The gate chain's output reaches `onOutput` in full when git completes —
 * conserved in files, never in a buffer this function holds nor on a Node
 * pipe (R1; F-112). A long gate run is silent until it settles; the
 * transcript arrives whole, kernel-interleaved as a terminal would show it.
 */
export async function pushHead(
  git: GitContext,
  input: {
    readonly remote: string;
    readonly branch: string;
    readonly cwd: string;
    readonly token: string;
    readonly baseEnv: Readonly<Record<string, string | undefined>>;
    readonly tokenFiles?: TokenFileStore;
    readonly onOutput?: (chunk: string) => void;
  },
): Promise<Result<GitCommandResult, Error>> {
  const store = input.tokenFiles ?? realTokenFileStore();
  const staged = stageTokenFile(store, input.token);
  if (!staged.ok) {
    return staged;
  }
  let result: GitCommandResult;
  let warning: string | undefined;
  try {
    result = await git.exec(git.file, pushArgv(input.remote, input.branch), {
      cwd: input.cwd,
      env: pushEnv(staged.value.tokenPath, input.baseEnv),
      ...(input.onOutput === undefined ? {} : { onOutput: input.onOutput }),
    });
  } finally {
    warning = removeQuietly(store, staged.value.dir);
  }
  return ok(warning === undefined ? result : { ...result, stderr: `${result.stderr}${warning}\n` });
}

/**
 * A git child's end, named truthfully: a kill is not an exit (F-112) —
 * the signal is reported distinctly, never collapsed to a bare number.
 */
export function describeGitChildEnd(result: GitCommandResult): string {
  // No "(status 128)" alongside the signal: 128 is this seam's sentinel,
  // and printing it reads as git's own fatal-error exit code.
  return result.signal === null ? `exited ${result.status}` : `was killed by ${result.signal}`;
}
