import type { Result } from '@oaknational/result';
import { typeSafeHasOwn } from '@oaknational/type-helpers';

import type { ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading } from '../pr-watch/state-types.js';
import { MERGE_USAGE } from './merge-usage.js';
import { runMergeAction, type MergeActionInput } from './merge-cli.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { mintForConfig, type MintSeams } from './mint-for-config.js';
import { MINT_TOKEN_USAGE, runMintTokenAction } from './mint-token-cli.js';
import { PULL_REQUEST_USAGE } from './pull-request-usage.js';
import { runPullRequestAction, type PullRequestActionInput } from './pull-request-cli.js';
import { PUSH_USAGE } from './push-args.js';
import { runPushAction, type PushActionInput } from './push-cli.js';
import { RETIRE_USAGE } from './retire-args.js';
import { runRetireAction, type RetireActionInput } from './retire-cli.js';
import type { BranchArgSeams } from './branch-arg.js';
import type { GitActionInput } from './git-action-input.js';
import type { GitExecutor } from './git-executor.js';
import type { PushGitReads, TokenFileStore } from './push-git.js';
import type { PushMint } from './push-mint.js';
import type { RetireGitPort } from './retire-git-port.js';
import type { GitRunner } from '../collaboration-state/coordination-home.js';
import type { MergeBotResolveInput } from './resolve-identity.js';

/**
 * CLI for the `merge-bot` topic (AIP-158, MCP-508).
 *
 * `merge-bot merge` is the sanctioned landing path: it mints its own token,
 * reads the settlement verdict, and merges ONLY on SETTLE-READY — never
 * squash, the verdicted tip's sha pinned in the call:
 *
 * ```bash
 * pnpm agent-tools merge-bot merge --pr <n> --expect <reviewer>
 * ```
 *
 * `merge-bot push` pushes the invoking worktree's HEAD under the bot
 * identity — the token in a transfer-lifetime 0600 file whose path rides the
 * child environment (never the token itself: hooks inherit that
 * environment), no force, no `--no-verify`, default-branch targets refused
 * by name.
 *
 * `merge-bot retire` deletes a merged branch's names (local, cached
 * tracking, remote) once each is proven an ancestor of the remote default
 * branch's tip: the remote one as the bot by compare-and-swap, under the
 * `branch-retire` scope, minted only when that delete is due.
 *
 * `merge-bot pull-request` makes the bot's writes on a pull request's
 * conversation — open a draft, comment, reply, resolve a thread, mark
 * ready, close, dispatch a workflow — each under one token minted at the
 * scope that verb needs (`pull-request-work` for the open,
 * `pull-request-conversation` for the conversation verbs, `workflow-dispatch`
 * for the dispatch), so no seat composes a `GH_TOKEN=$(…) gh …` shell line.
 *
 * `merge-bot mint-token` prints a short-lived GitHub App installation token
 * to stdout (and nothing else there), for the bot writes no typed command
 * carries yet (update-branch, a reviewer request); `mint-token-cli.ts`
 * carries the assign-then-use discipline.
 *
 * The bot is absent from the protections ruleset's bypass list — its one
 * bypass is the separate code-owner review gate (owner ruling 2026-07-21,
 * verified against the rulesets API 2026-07-31; `.agent/reference/merge-bot.md`
 * carries the split) — so its merges bind to required checks and threads.
 * The sanctioned direct-merge path under the 2026-07-21 owner rulings
 * (`--admin` always banned; direct `--merge` banned on bypass-capable
 * accounts).
 */

interface MergeBotEnvironment {
  readonly HOME?: string;
}

export interface MergeBotCliInput {
  readonly args: readonly string[];
  readonly env: MergeBotEnvironment;
  /** The invoking repository's root: the cwd every git call runs in, and where the primary-checkout resolution starts. */
  readonly repoRoot?: string;
  readonly readConfigFileImpl?: (filePath: string) => string;
  /** The git runner the primary-checkout resolution uses — required; the bin injects the real one, tests a fake. */
  readonly runGitImpl: GitRunner;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  /** Injection seams for tests. */
  readonly fetchImpl?: GithubApiFetch;
  /** The file reader: the private key for the mint, and the pull-request action's body and reason files. */
  readonly readFileImpl?: (path: string) => Promise<string>;
  readonly nowEpochSeconds?: () => number;
  /** Merge-action seams (same discipline as the block above). */
  readonly readReadingImpl?: (options: ReadPrStateOptions) => Result<PrStateReading, Error>;
  readonly sleepImpl?: (ms: number) => Promise<void>;
  readonly nowIsoImpl?: () => string;
  /** Push-action seams: the git binary, its executor, the child's base environment, the token file's lifecycle. */
  readonly gitExecutor?: GitExecutor;
  readonly gitPath?: string;
  readonly baseEnv?: Readonly<Record<string, string | undefined>>;
  readonly tokenFiles?: TokenFileStore;
  /** Push seam: git's answers about HEAD and origin. */
  readonly gitReads?: PushGitReads;
  /** Push, retire and pull-request seam: the token mint. Unset, each mints with `mintForConfig` over `fetchImpl`, `readFileImpl` and `nowEpochSeconds`; set, the mint's seams never reach them, though `fetchImpl` still carries the action's own GitHub calls. `mint-token` and `merge` never read it. */
  readonly mintImpl?: PushMint;
  /** Retire-action seam: git as the command asks of it. */
  readonly retireGitPort?: RetireGitPort;
  /** Push, retire and pull-request seam: the `--branch` check's oracle. */
  readonly branchArgSeams?: BranchArgSeams;
}

const USAGE = `${MINT_TOKEN_USAGE}
${MERGE_USAGE}
${PUSH_USAGE}
${RETIRE_USAGE}
${PULL_REQUEST_USAGE}`;

/** The mint's injection seams, the same for every action that mints. */
function mintSeamsFrom(input: MergeBotCliInput): MintSeams {
  return {
    fetchImpl: input.fetchImpl,
    readFileImpl: input.readFileImpl,
    nowEpochSeconds: input.nowEpochSeconds,
  };
}

/** The identity's seams, the same for every action. */
function identityInputFrom(input: MergeBotCliInput): MergeBotResolveInput {
  return {
    envHome: input.env.HOME,
    repoRoot: input.repoRoot,
    readConfigFileImpl: input.readConfigFileImpl,
    runGitImpl: input.runGitImpl,
  };
}

/** The mint as the push, retire and pull-request actions take it: injected whole, or composed over the seams. */
function mintFrom(input: MergeBotCliInput): PushMint {
  return input.mintImpl ?? ((config) => mintForConfig(config, mintSeamsFrom(input)));
}

/** Forward the CLI's injection seams to the merge action. */
function mergeActionInputFrom(input: MergeBotCliInput): MergeActionInput {
  return {
    identityInput: identityInputFrom(input),
    stdout: input.stdout,
    stderr: input.stderr,
    ...mintSeamsFrom(input),
    readReadingImpl: input.readReadingImpl,
    sleepImpl: input.sleepImpl,
    nowIsoImpl: input.nowIsoImpl,
  };
}

/** Forward the seams the push and retire actions share (`git-action-input.ts`), composing the mint. */
function gitActionInputFrom(input: MergeBotCliInput): GitActionInput {
  return {
    mint: mintFrom(input),
    identityInput: identityInputFrom(input),
    repoRoot: input.repoRoot ?? process.cwd(),
    stdout: input.stdout,
    stderr: input.stderr,
    gitExecutor: input.gitExecutor,
    gitPath: input.gitPath,
    baseEnv: input.baseEnv,
    branchArgSeams: input.branchArgSeams,
  };
}

/** Forward the CLI's injection seams to the push action. */
function pushActionInputFrom(input: MergeBotCliInput): PushActionInput {
  return {
    ...gitActionInputFrom(input),
    sleepImpl: input.sleepImpl,
    nowIsoImpl: input.nowIsoImpl,
    tokenFiles: input.tokenFiles,
    gitReads: input.gitReads,
  };
}

/** Forward the CLI's injection seams to the retire action: the shared set, GitHub for its GraphQL calls, its git port. */
function retireActionInputFrom(input: MergeBotCliInput): RetireActionInput {
  return {
    ...gitActionInputFrom(input),
    fetchImpl: input.fetchImpl,
    gitPort: input.retireGitPort,
  };
}

/** Forward the CLI's injection seams to the pull-request action: identity, the mint, GitHub, the file reader. */
function pullRequestActionInputFrom(input: MergeBotCliInput): PullRequestActionInput {
  return {
    identityInput: identityInputFrom(input),
    mint: mintFrom(input),
    fetchImpl: input.fetchImpl,
    readFileImpl: input.readFileImpl,
    branchArgSeams: input.branchArgSeams,
    stdout: input.stdout,
    stderr: input.stderr,
  };
}

/** One action: the argv after its name, and the CLI's seams. */
type Action = (rest: readonly string[], input: MergeBotCliInput) => Promise<number>;

/** The closed set of actions, each forwarding the seams it takes. */
const ACTIONS = {
  'mint-token': (rest, input) =>
    runMintTokenAction(rest, {
      identityInput: identityInputFrom(input),
      mintSeams: mintSeamsFrom(input),
      stdout: input.stdout,
      stderr: input.stderr,
    }),
  merge: (rest, input) => runMergeAction(rest, mergeActionInputFrom(input)),
  push: (rest, input) => runPushAction(rest, pushActionInputFrom(input)),
  retire: (rest, input) => runRetireAction(rest, retireActionInputFrom(input)),
  'pull-request': (rest, input) => runPullRequestAction(rest, pullRequestActionInputFrom(input)),
} as const satisfies Readonly<Record<string, Action>>;

export async function runMergeBotCli(input: MergeBotCliInput): Promise<number> {
  const [action, ...rest] = input.args;
  if (action === '--help' || action === '-h') {
    input.stdout.write(USAGE);
    return 0;
  }
  if (action === undefined) {
    input.stderr.write(USAGE);
    return 2;
  }
  if (!typeSafeHasOwn(ACTIONS, action)) {
    input.stderr.write(`merge-bot: unknown action "${action}"\n${USAGE}`);
    return 2;
  }
  return ACTIONS[action](rest, input);
}
