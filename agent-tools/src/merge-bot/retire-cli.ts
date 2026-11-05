import { err, ok, type Result } from '@oaknational/result';

import { DEFAULT_BRANCH_NAMES } from './branch-arg.js';
import type { GitActionInput } from './git-action-input.js';
import { scrubbedCredentialEnv } from './git-credential-chain.js';
import { realFetch } from './github-fetch.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { namesGithubRepository, trustedOriginRepository } from './origin-repository.js';
import { resolveGitContext } from './push-git.js';
import { RefFormatOracleUnavailableError } from './ref-format.js';
import { resolveBotIdentity, type BotIdentity } from './resolve-identity.js';
import { parseRetireArgs, RETIRE_USAGE } from './retire-args.js';
import { decideRetirement } from './retire-decision.js';
import { executePlan } from './retire-execute.js';
import { gitRetirePort, type RetireGitPort } from './retire-git-port.js';
import { exitCodeFor, writeRetireOutcome, type RetireOutcome } from './retire-report.js';

/**
 * The `merge-bot retire` action: parse, bind, read, decide, write, report.
 * The argv contract and the usage text are in `retire-args.ts`; the proof is
 * `retire-decision.ts`; the writes are `retire-execute.ts`. Every read and
 * write of the branch's names reaches git only through `retire-git-port.ts`.
 * Two git reads come before it and are the merge bot's shared seams, not the
 * port's: the `--branch` check's ref-format oracle (`branch-arg.ts`), and the
 * identity's lookup of the primary checkout (`resolve-identity.ts`).
 *
 * Two bindings come before any read that could lead to a write. The branch is
 * never main, master or HEAD, in any case. And `origin`'s one configured URL
 * must name the repository the bot identity would delete in. git's traffic
 * can still be rewritten (`insteadOf`), so the proofs are bound to that
 * repository again at the mint, by sha: the branch tip and the default
 * branch's name and tip must read there, through GitHub, exactly as proven.
 * When no remote delete is due nothing is minted, and the local names are
 * deleted on the proofs of the repository git's traffic reached.
 */

/** Branch names refused before anything is read, compared case-insensitively: the default names, and HEAD. */
function isReservedBranch(branch: string): boolean {
  const folded = branch.toLowerCase();
  return DEFAULT_BRANCH_NAMES.has(folded) || folded === 'head';
}

/**
 * The action's composition surface: the seams every git action shares
 * (`git-action-input.ts`), GitHub for the reads and the delete the minted
 * token carries, and git as this command asks of it.
 */
export interface RetireActionInput extends GitActionInput {
  /** GitHub's GraphQL endpoint; defaults to the real fetch. */
  readonly fetchImpl?: GithubApiFetch;
  /** git, as the command asks of it; defaults to real git in `repoRoot`. */
  readonly gitPort?: RetireGitPort;
}

/** Mint the `branch-retire` token: contents alone, asked for only when a remote delete is due. */
async function mintToken(
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<Result<string, Error>> {
  const minted = await input.mint({ ...identity, scope: 'branch-retire' });
  return minted.ok ? ok(minted.value.token) : minted;
}

/**
 * Refuse unless `origin` has exactly one configured URL and it names the bot
 * identity's repository on github.com over https or ssh, as `merge-bot push`
 * trusts its origin (`origin-repository.ts`). No URL, or several, fails the
 * run before any read: several would not bind, since fetch reads the first
 * and a single `config --get` the last. Neither the URL nor anything parsed
 * from it is echoed: an https URL can carry a token.
 */
async function originMismatch(
  port: RetireGitPort,
  identity: BotIdentity,
): Promise<Result<string | undefined, Error>> {
  const urls = await port.originUrls();
  if (!urls.ok) {
    return urls;
  }
  if (urls.value.length === 0) {
    return err(new Error('this checkout has no origin URL configured'));
  }
  if (urls.value.length > 1) {
    return err(
      new Error(`origin has ${urls.value.length} URLs configured; this command binds exactly one`),
    );
  }
  return namesGithubRepository(trustedOriginRepository(urls.value), identity)
    ? ok(undefined)
    : ok(
        `origin does not name github.com/${identity.owner}/${identity.repoName}, the one repository the bot would delete in, as the bot binds to it: one URL, https or ssh, no plain http, no credential in the URL`,
      );
}

/**
 * The injected port, or real git in the invoking repository with prompting
 * turned off and no askpass program in its environment (the push's scrub,
 * `git-credential-chain.ts`; the runner clears the config arm on each call),
 * and with replacement refs and grafts turned off: either can
 * give a commit parents it does not have, and `merge-base` follows them, so a
 * planted one would make an unmerged tip read as merged.
 */
function portFrom(input: RetireActionInput): Result<RetireGitPort, Error> {
  if (input.gitPort !== undefined) {
    return ok(input.gitPort);
  }
  const git = resolveGitContext(input);
  if (!git.ok) {
    return git;
  }
  const env = {
    ...(input.baseEnv ?? process.env),
    ...scrubbedCredentialEnv(),
    GIT_TERMINAL_PROMPT: '0',
    GCM_INTERACTIVE: 'never',
    GIT_NO_REPLACE_OBJECTS: '1',
    GIT_GRAFT_FILE: '/dev/null',
  };
  return ok(gitRetirePort({ git: git.value, cwd: input.repoRoot, env }));
}

/** The port bound to the identity's repository, or the outcome that stops before any read. */
async function bindPort(
  branch: string,
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<RetireGitPort | RetireOutcome> {
  const port = portFrom(input);
  if (!port.ok) {
    return { kind: 'failed', branch, reason: port.error.message };
  }
  const mismatch = await originMismatch(port.value, identity);
  if (!mismatch.ok) {
    return { kind: 'failed', branch, reason: mismatch.error.message };
  }
  return mismatch.value === undefined
    ? port.value
    : { kind: 'refused', branch, reason: mismatch.value };
}

/**
 * Nothing to retire: no name exists. Any section the branch still has in
 * the repository's config goes, whether a failed removal or a hand-run
 * delete left it, so the re-run a failed removal advises finishes it; a
 * local branch made since the proof keeps its section.
 */
async function retireAbsent(branch: string, port: RetireGitPort): Promise<RetireOutcome> {
  const config = await port.removeBranchConfig(branch);
  return config.ok
    ? { kind: 'absent', branch }
    : {
        kind: 'failed',
        branch,
        reason: `no name is left to retire, but branch.${branch}'s config was left: ${config.error.message}`,
      };
}

/** Everything after the argv: bind, read, decide, write. */
async function retire(
  branch: string,
  identity: BotIdentity,
  input: RetireActionInput,
): Promise<RetireOutcome> {
  const port = await bindPort(branch, identity, input);
  if ('kind' in port) {
    return port;
  }
  const readings = await port.readings(branch);
  if (!readings.ok) {
    return { kind: 'failed', branch, reason: readings.error.message };
  }
  const decision = decideRetirement(readings.value);
  if (decision.kind !== 'plan') {
    return decision.kind === 'absent'
      ? retireAbsent(branch, port)
      : { kind: 'refused', branch, reason: decision.reason };
  }
  return executePlan(
    decision.plan,
    { branch, base: readings.value.base },
    {
      git: port,
      mintToken: () => mintToken(identity, input),
      fetchImpl: input.fetchImpl ?? realFetch(),
      repo: identity,
    },
  );
}

export async function runRetireAction(
  rest: readonly string[],
  input: RetireActionInput,
): Promise<number> {
  if (rest[0] === '--help' || rest[0] === '-h') {
    input.stdout.write(RETIRE_USAGE);
    return 0;
  }
  const parsed = parseRetireArgs(rest, input.branchArgSeams);
  if (!parsed.ok) {
    input.stderr.write(`merge-bot retire: ${parsed.error.message}\n`);
    return parsed.error instanceof RefFormatOracleUnavailableError ? 1 : 2;
  }
  const { branch, json } = parsed.value;
  let outcome: RetireOutcome;
  if (isReservedBranch(branch)) {
    outcome = {
      kind: 'refused',
      branch,
      reason: `"${branch}" names a default branch; it is never retired`,
    };
  } else {
    const identity = resolveBotIdentity({}, input.identityInput);
    if (!identity.ok) {
      input.stderr.write(`merge-bot retire: ${identity.error.message}\n`);
      return 2;
    }
    outcome = await retire(branch, identity.value, input);
  }
  writeRetireOutcome(outcome, json, input);
  return exitCodeFor(outcome);
}
