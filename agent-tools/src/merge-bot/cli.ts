import type { Result } from '@oaknational/result';

import type { ReadPrStateOptions } from '../pr-watch/state-gh.js';
import type { PrStateReading } from '../pr-watch/state-types.js';
import { MERGE_USAGE } from './merge-args.js';
import { runMergeAction, type MergeActionInput } from './merge-cli.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { mintForConfig, type MintedToken } from './mint-for-config.js';
import { PUSH_USAGE } from './push-args.js';
import { runPushAction, type PushActionInput } from './push-cli.js';
import type { GitExecutor } from './git-executor.js';
import type { TokenFileStore } from './push-git.js';
import { resolveMintTokenConfig } from './resolve-config.js';
import { permissionNamesFor, TOKEN_SCOPE_NAMES } from './token-scopes.js';

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
 * `merge-bot mint-token` prints a short-lived GitHub App installation token
 * to stdout (and nothing else there), for the OTHER bot writes
 * (gh pr create/edit, comments, review replies, thread resolution,
 * update-branch). Assign it, then use it — never the `GH_TOKEN=$(…) gh …`
 * prefix form, which cannot fail fast: a failing mint leaves `GH_TOKEN`
 * empty, `gh` reads empty as UNSET, and the command runs as the signed-in
 * human.
 *
 * ```bash
 * token=$(pnpm --silent agent-tools merge-bot mint-token --scope <scope-name>) || exit 1
 * ```
 *
 * The bot is absent from the protections ruleset's bypass list — its one
 * bypass is the separate code-owner review gate (owner ruling 2026-07-21,
 * verified against the rulesets API 2026-07-31; `docs/engineering/merge-bot.md`
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
  /** Repo root for `.github/merge-bot.json` resolution (usually the cwd's repo). */
  readonly repoRoot?: string;
  readonly readConfigFileImpl?: (filePath: string) => string;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
  /** Injection seams for tests. */
  readonly fetchImpl?: GithubApiFetch;
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
}

const USAGE = `merge-bot mint-token --scope <${TOKEN_SCOPE_NAMES.join('|')}> [--app-id <id>] [--private-key-path <pem-path>] [--repo <owner/name>] [--json]
  Prints a short-lived GitHub App installation token (stdout carries ONLY the
  token unless --json, which bundles the token into the printed object). The
  repo's .github/merge-bot.json is the single authority for the bot identity;
  the private key lives at ~/.config/<appSlug>/private-key.pem, derived from
  it. Flags are explicit operator overrides (cross-repo invocation, tests) —
  not a resolution tier.

  --scope is REQUIRED and has no default: a token carries only the permissions
  its mint requests, so defaulting would make the most privileged scope the
  silent one. Scopes and what each permits are defined in token-scopes.ts.
${TOKEN_SCOPE_NAMES.map((name) => `    ${name}: ${permissionNamesFor(name).join(', ')}\n`).join('')}
  A 403 reading "Resource not accessible by integration" means the wrong
  --scope, not a broken bot: an ungranted permission fails the mint with a 422.
  Other 403s (ruleset refusals, rate limits) are not scope problems.

${MERGE_USAGE}
${PUSH_USAGE}`;

/** Forward the CLI's injection seams to the merge action. */
function mergeActionInputFrom(input: MergeBotCliInput): MergeActionInput {
  return {
    identityInput: {
      envHome: input.env.HOME,
      repoRoot: input.repoRoot,
      readConfigFileImpl: input.readConfigFileImpl,
    },
    stdout: input.stdout,
    stderr: input.stderr,
    fetchImpl: input.fetchImpl,
    readFileImpl: input.readFileImpl,
    nowEpochSeconds: input.nowEpochSeconds,
    readReadingImpl: input.readReadingImpl,
    sleepImpl: input.sleepImpl,
    nowIsoImpl: input.nowIsoImpl,
  };
}

/** Forward the CLI's injection seams to the push action. */
function pushActionInputFrom(input: MergeBotCliInput): PushActionInput {
  return {
    identityInput: {
      envHome: input.env.HOME,
      repoRoot: input.repoRoot,
      readConfigFileImpl: input.readConfigFileImpl,
    },
    repoRoot: input.repoRoot ?? process.cwd(),
    stdout: input.stdout,
    stderr: input.stderr,
    fetchImpl: input.fetchImpl,
    readFileImpl: input.readFileImpl,
    nowEpochSeconds: input.nowEpochSeconds,
    gitExecutor: input.gitExecutor,
    gitPath: input.gitPath,
    baseEnv: input.baseEnv,
    tokenFiles: input.tokenFiles,
  };
}

function writeSuccess(outcome: MintedToken, json: boolean, input: MergeBotCliInput): void {
  if (json) {
    input.stdout.write(`${JSON.stringify(outcome)}\n`);
    return;
  }
  input.stdout.write(`${outcome.token}\n`);
  input.stderr.write(`token expires ${outcome.expiresAt}\n`);
}

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
  if (action === 'merge') {
    return runMergeAction(rest, mergeActionInputFrom(input));
  }
  if (action === 'push') {
    return runPushAction(rest, pushActionInputFrom(input));
  }
  if (action !== 'mint-token') {
    input.stderr.write(`merge-bot: unknown action "${action}"\n${USAGE}`);
    return 2;
  }
  return runMintTokenAction(rest, input);
}

async function runMintTokenAction(
  rest: readonly string[],
  input: MergeBotCliInput,
): Promise<number> {
  const config = resolveMintTokenConfig(rest, {
    envHome: input.env.HOME,
    repoRoot: input.repoRoot,
    readConfigFileImpl: input.readConfigFileImpl,
  });
  if (!config.ok) {
    input.stderr.write(`merge-bot mint-token: ${config.error.message}\n`);
    return 2;
  }

  const outcome = await mintForConfig(config.value, {
    fetchImpl: input.fetchImpl,
    readFileImpl: input.readFileImpl,
    nowEpochSeconds: input.nowEpochSeconds,
  });
  if (!outcome.ok) {
    input.stderr.write(`merge-bot mint-token: ${outcome.error.message}\n`);
    return 1;
  }
  writeSuccess(outcome.value, config.value.json, input);
  return 0;
}
