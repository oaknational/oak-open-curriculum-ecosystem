import type { GitCommandResult } from './git-executor.js';
import { clearedAskPassConfig } from './git-credential-chain.js';
import { describeGitChildEnd, type GitContext } from './push-git.js';
import { gitWords } from './retire-parse.js';

/**
 * How every `merge-bot retire` read and write reaches git: the binary, the
 * cwd and the child environment the command binds once, one runner, and one
 * shape for a failed call. The reads (`retire-git-read.ts`), the deletes
 * (`retire-git-delete.ts`) and the worktree check (`retire-worktrees.ts`)
 * all run through here.
 *
 * Every call runs under the operator's own `origin` credential: the reads
 * are reads, and the deletes are of refs the operator holds, so the
 * bot-identity rule does not apply, and the `credential.helper` arm stays
 * open. Every prompting arm of git's credential chain is closed: the
 * environment carries `GIT_TERMINAL_PROMPT=0` and `GCM_INTERACTIVE=never`
 * and no `GIT_ASKPASS` or `SSH_ASKPASS`, and every call clears `core.askPass`
 * on its own command line (`clearedAskPassConfig`, derived from the one
 * chain table). So over https an unattended seat fails rather than asks; a
 * prompt from ssh itself is outside git's reach, and the network bound below
 * ends it. Output volume is git's answer to a named query, which the command
 * bounds, so the capturing arm is sound.
 */

/** The git binary, its cwd, and the child environment for every retire read and write. */
export interface RetireGit {
  readonly git: GitContext;
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}

/** Network reads get a bound, so an unattended seat can never hang on one. */
const NETWORK_TIMEOUT_MS = 120_000;

/**
 * Run one git command in the retire context. No `--` separates positionals:
 * every value that reaches argv is validated first (ref names `refs/`-prefixed
 * by the parsers, shas 40-hex, worktree paths as `git worktree list` prints
 * them), so none can read as a flag.
 */
export async function runGit(
  retire: RetireGit,
  args: readonly string[],
  network = false,
): Promise<GitCommandResult> {
  return retire.git.exec(retire.git.file, [...clearedAskPassConfig(), ...args], {
    cwd: retire.cwd,
    env: retire.env,
    ...(network ? { timeoutMs: NETWORK_TIMEOUT_MS } : {}),
  });
}

/** A failed git call as an Error that names the question and git's own words. */
export function gitFailure(question: string, result: GitCommandResult): Error {
  return new Error(`${question}: git ${describeGitChildEnd(result)}: ${gitWords(result.stderr)}`);
}
