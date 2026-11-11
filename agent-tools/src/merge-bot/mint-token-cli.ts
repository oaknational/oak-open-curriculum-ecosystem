import { mintForConfig, type MintedToken, type MintSeams } from './mint-for-config.js';
import { resolveMintTokenConfig, type MergeBotResolveInput } from './resolve-config.js';
import { permissionLevelsFor, TOKEN_SCOPE_NAMES } from './token-scopes.js';

/**
 * The `merge-bot mint-token` action: prints a short-lived GitHub App
 * installation token to stdout (and nothing else there), for the bot writes
 * no typed command carries yet: update-branch, a reviewer request. Split
 * from `cli.ts` when the pull-request action made the front door the fifth
 * action's home, so every action has its own module.
 *
 * Assign the token, then use it — never the `GH_TOKEN=$(…) gh …` prefix
 * form, which cannot fail fast: a failing mint leaves `GH_TOKEN` empty, `gh`
 * reads empty as UNSET, and the command runs as the signed-in human.
 *
 * ```bash
 * token=$(pnpm --silent agent-tools merge-bot mint-token --scope <scope-name>) || exit 1
 * ```
 */

export const MINT_TOKEN_USAGE = `merge-bot mint-token --scope <${TOKEN_SCOPE_NAMES.join('|')}> [--app-id <id>] [--private-key-path <pem-path>] [--repo <owner/name>] [--json]
  Prints a short-lived GitHub App installation token (stdout carries ONLY the
  token unless --json, which bundles the token into the printed object). The
  clone's .github/merge-bot.json is the single authority for the bot identity:
  per-checkout and never tracked (create it from .github/merge-bot.json.example),
  read at the clone's primary checkout so every worktree sees the one copy; the
  private key lives at ~/.config/<appSlug>/private-key.pem, derived from it.
  Flags are explicit operator overrides (cross-repo invocation, tests) — not a
  resolution tier.

  --scope is REQUIRED and has no default: a token carries only the permissions
  its mint requests, so defaulting would make the most privileged scope the
  silent one. Scopes and what each permits are defined in token-scopes.ts.
${TOKEN_SCOPE_NAMES.map((name) => `    ${name}: ${permissionLevelsFor(name).join(', ')}\n`).join('')}
  A 403 reading "Resource not accessible by integration" means the wrong
  --scope, not a broken bot: an ungranted permission fails the mint with a 422.
  Other 403s (ruleset refusals, rate limits) are not scope problems.
`;

/** The action's composition surface: the identity's seams, the mint's, and the two streams. */
export interface MintTokenActionInput {
  readonly identityInput: MergeBotResolveInput;
  readonly mintSeams: MintSeams;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

function writeSuccess(outcome: MintedToken, json: boolean, input: MintTokenActionInput): void {
  if (json) {
    input.stdout.write(`${JSON.stringify(outcome)}\n`);
    return;
  }
  input.stdout.write(`${outcome.token}\n`);
  input.stderr.write(`token expires ${outcome.expiresAt}\n`);
}

/** Resolve the identity and the scope from argv, mint, print. Exit map: 0 printed, 1 the mint failed, 2 usage. */
export async function runMintTokenAction(
  rest: readonly string[],
  input: MintTokenActionInput,
): Promise<number> {
  const config = resolveMintTokenConfig(rest, input.identityInput);
  if (!config.ok) {
    input.stderr.write(`merge-bot mint-token: ${config.error.message}\n`);
    return 2;
  }

  const outcome = await mintForConfig(config.value, input.mintSeams);
  if (!outcome.ok) {
    input.stderr.write(`merge-bot mint-token: ${outcome.error.message}\n`);
    return 1;
  }
  writeSuccess(outcome.value, config.value.json, input);
  return 0;
}
