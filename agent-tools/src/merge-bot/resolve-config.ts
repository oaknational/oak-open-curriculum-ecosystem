import { err, ok, type Result } from '@oaknational/result';

import {
  resolveBotIdentity,
  type BotIdentity,
  type MergeBotResolveInput,
} from './resolve-identity.js';
import { isTokenScopeName, TOKEN_SCOPE_NAMES, type TokenScopeName } from './token-scopes.js';

/**
 * Flag parsing and scope requirement for `merge-bot mint-token`.
 *
 * Identity resolution lives in `resolve-identity.ts` (shared by every
 * merge-bot action); this module owns mint-token's argv contract — the
 * explicit override flags plus the REQUIRED `--scope`. Split from cli.ts to
 * keep both files inside the size and complexity gates.
 */

export type { MergeBotResolveInput } from './resolve-identity.js';

export interface MintTokenConfig extends BotIdentity {
  /** The requested scope NAME; permissions are looked up once, at the mint. */
  readonly scope: TokenScopeName;
  readonly json: boolean;
}

/** The scope list, always derived, so usage text cannot drift from the table. */
function scopeList(): string {
  return TOKEN_SCOPE_NAMES.join(', ');
}

/**
 * A usage failure that teaches the whole replacement command, not just the
 * missing flag — a stale paste then self-cures in one step.
 */
function scopeUsageError(problem: string): Error {
  // A literal placeholder, not the first scope name: suggesting a concrete
  // scope steers a reader who wanted a read into minting the widest one.
  return new Error(
    `${problem} Valid scopes: ${scopeList()}.\n` +
      `  e.g. token=$(pnpm --silent agent-tools merge-bot mint-token --scope <scope-name>) || exit 1`,
  );
}

/** Every flag that takes a value. `--json` is a bare switch and is separate. */
const VALUE_FLAGS = ['--app-id', '--private-key-path', '--repo', '--scope'] as const;
type ValueFlag = (typeof VALUE_FLAGS)[number];

/** Widened at the declaration, so membership needs no assertion. */
const VALUE_FLAG_SET: ReadonlySet<string> = new Set(VALUE_FLAGS);

function isValueFlag(flag: string): flag is ValueFlag {
  return VALUE_FLAG_SET.has(flag);
}

/**
 * Collects `--flag value` pairs generically, so adding a flag does not add a
 * branch. Order-independent; a repeated flag takes its last occurrence.
 */
function collectValueFlags(
  rest: readonly string[],
): Result<{ values: Partial<Record<ValueFlag, string>>; json: boolean }, Error> {
  const values: Partial<Record<ValueFlag, string>> = {};
  let json = false;

  for (let i = 0; i < rest.length; i += 1) {
    const flag = rest[i] ?? '';
    if (flag === '--json') {
      json = true;
      continue;
    }
    if (!isValueFlag(flag)) {
      return err(new Error(`unknown flag "${flag}"`));
    }
    const value = rest[i + 1];
    if (value === undefined || value.startsWith('--')) {
      return err(new Error(`${flag} needs a value`));
    }
    // Last-wins would let a wrapper silently widen a caller's scope by
    // appending its own default. A credential choice must not be decided by
    // argv order.
    if (values[flag] !== undefined) {
      return err(new Error(`${flag} given more than once — pass it exactly once`));
    }
    values[flag] = value;
    i += 1;
  }
  return ok({ values, json });
}

/**
 * Required, with no default: a token carries only what its mint requests, so
 * defaulting would make the most privileged scope the silent one.
 */
function requireScope(scope: string | undefined): Result<TokenScopeName, Error> {
  if (scope === undefined) {
    return err(scopeUsageError('--scope is required.'));
  }
  if (!isTokenScopeName(scope)) {
    return err(scopeUsageError(`unknown --scope "${scope}".`));
  }
  return ok(scope);
}

export function resolveMintTokenConfig(
  rest: readonly string[],
  input: MergeBotResolveInput,
): Result<MintTokenConfig, Error> {
  const collected = collectValueFlags(rest);
  if (!collected.ok) {
    return collected;
  }
  const { values, json } = collected.value;

  const scope = requireScope(values['--scope']);
  if (!scope.ok) {
    return scope;
  }

  const identity = resolveBotIdentity(
    {
      appId: values['--app-id'],
      keyPath: values['--private-key-path'],
      repo: values['--repo'],
    },
    input,
  );
  if (!identity.ok) {
    return identity;
  }
  return ok({ ...identity.value, scope: scope.value, json });
}
