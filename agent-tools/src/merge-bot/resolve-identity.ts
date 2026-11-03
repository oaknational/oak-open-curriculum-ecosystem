import { err, ok, type Result } from '@oaknational/result';

import {
  resolveCoordinationHome,
  type GitRunner,
} from '../collaboration-state/coordination-home.js';
import {
  defaultPrivateKeyPath,
  loadMergeBotRepoConfig,
  MERGE_BOT_CONFIG_RELATIVE_PATH,
} from './repo-config.js';

/**
 * Bot-identity resolution shared by every merge-bot action.
 *
 * The clone's `.github/merge-bot.json` is the single AUTHORITY for the bot
 * identity (per-checkout, never tracked — see `repo-config.ts`); flags are
 * explicit operator overrides (cross-repo invocation, tests) — never a
 * resolution tier. The file is read at the clone's PRIMARY checkout, so a
 * linked worktree, which holds no copy of an untracked file, reads the same
 * one every other worktree does. Split from `resolve-config.ts` when the
 * `merge` action became the second consumer (`consolidate-at-second-consumer`):
 * scope handling stays with each action (mint-token requires `--scope`;
 * `merge` fixes its scope internally), identity resolution lives once here.
 */

export interface MergeBotResolveInput {
  readonly envHome?: string;
  /**
   * The invoking repository's root — where the primary-checkout resolution
   * runs git from, so a cwd inside another repository resolves THAT clone
   * deliberately. Defaults to the process cwd.
   */
  readonly repoRoot?: string;
  readonly readConfigFileImpl?: (filePath: string) => string;
  /**
   * The git runner the primary-checkout resolution uses. REQUIRED, injected
   * at the composition edge (the bin passes the real one; tests pass a fake),
   * so no path can resolve the config anywhere but the clone's primary
   * checkout and no test can reach a real git process by omission.
   */
  readonly runGitImpl: GitRunner;
}

/** The resolved bot identity: app, key, and the owner/name split repo. */
export interface BotIdentity {
  readonly appId: string;
  readonly keyPath: string;
  readonly owner: string;
  readonly repoName: string;
}

/** The repository the bot identity names, as the GitHub calls address it. */
export type BotRepository = Pick<BotIdentity, 'owner' | 'repoName'>;

function isBlank(value: string | undefined): value is undefined | '' {
  return value === undefined || value === '';
}

const OWNER_GRAMMAR = /^[A-Za-z0-9-]+$/;
const REPO_GRAMMAR = /^[A-Za-z0-9._-]+$/;

function splitRepo(repo: string): Result<{ owner: string; repoName: string }, Error> {
  const [owner, repoName, ...extra] = repo.split('/');
  if (
    extra.length > 0 ||
    isBlank(owner) ||
    isBlank(repoName) ||
    !OWNER_GRAMMAR.test(owner) ||
    !REPO_GRAMMAR.test(repoName)
  ) {
    return err(new Error(`--repo must be owner/name in GitHub grammar, got "${repo}"`));
  }
  return ok({ owner, repoName });
}

interface IdentityValues {
  readonly appId: string;
  readonly keyPath: string;
  readonly repo: string;
}

/**
 * The innermost cause's message — git's own words — so the root failure
 * survives the wrap while the resolver's advisory text (which names a flag
 * this CLI does not accept) does not.
 */
function rootCause(cause: unknown): string {
  if (!(cause instanceof Error)) {
    return String(cause);
  }
  return cause.cause instanceof Error ? rootCause(cause.cause) : cause.message;
}

/**
 * Where the per-checkout config lives: the clone's primary checkout — the one
 * location every linked worktree shares, the same home the collaboration
 * substrate resolves to — resolved unconditionally, starting from the
 * invoking repository's root. The declared coordination-home option is
 * deliberately NOT passed: an inter-Practice session's coordination home is
 * another repository, and this config belongs to this repository's clone.
 */
function resolvePrimaryConfigRoot(input: MergeBotResolveInput): Result<string, Error> {
  try {
    return ok(
      resolveCoordinationHome(input.repoRoot ?? process.cwd(), { runGit: input.runGitImpl }),
    );
  } catch (cause) {
    return err(
      new Error(
        `cannot locate this clone's primary checkout to read ${MERGE_BOT_CONFIG_RELATIVE_PATH}: run from inside the clone (any worktree); git said: ${rootCause(cause)}`,
        { cause },
      ),
    );
  }
}

/**
 * The repo config is the AUTHORITY for the bot identity, not a tier a
 * resolution ladder lands on; an override is an explicit flag choice.
 */
function applyAuthority(
  partial: { appId?: string; keyPath?: string; repo?: string },
  input: MergeBotResolveInput,
): Result<IdentityValues, Error> {
  const configRoot = resolvePrimaryConfigRoot(input);
  if (!configRoot.ok) {
    return err(configRoot.error);
  }
  const repoConfig = loadMergeBotRepoConfig({
    repoRoot: configRoot.value,
    readFileImpl: input.readConfigFileImpl,
  });
  if (!repoConfig.ok) {
    return err(
      new Error(
        `the clone's merge-bot identity is unreadable — .github/merge-bot.json is the single authority (per-checkout, never tracked); fix it (${repoConfig.error.message})`,
        { cause: repoConfig.error },
      ),
    );
  }
  const keyPath = isBlank(partial.keyPath)
    ? deriveKeyPath(input.envHome, repoConfig.value.appSlug)
    : ok(partial.keyPath);
  if (!keyPath.ok) {
    return keyPath;
  }
  return ok({
    appId: isBlank(partial.appId) ? repoConfig.value.appId : partial.appId,
    repo: isBlank(partial.repo) ? repoConfig.value.repo : partial.repo,
    keyPath: keyPath.value,
  });
}

function deriveKeyPath(home: string | undefined, appSlug: string): Result<string, Error> {
  if (isBlank(home)) {
    return err(new Error('cannot derive the key path: HOME is unset'));
  }
  return ok(defaultPrivateKeyPath({ home, appSlug }));
}

/**
 * Resolve the bot identity from explicit overrides plus the repo-config
 * authority, returning the owner/name split ready for the GitHub API.
 */
export function resolveBotIdentity(
  partial: { appId?: string; keyPath?: string; repo?: string },
  input: MergeBotResolveInput,
): Result<BotIdentity, Error> {
  const identity: Result<IdentityValues, Error> =
    !isBlank(partial.appId) && !isBlank(partial.keyPath) && !isBlank(partial.repo)
      ? ok({ appId: partial.appId, keyPath: partial.keyPath, repo: partial.repo })
      : applyAuthority(partial, input);
  if (!identity.ok) {
    return identity;
  }
  const split = splitRepo(identity.value.repo);
  if (!split.ok) {
    return split;
  }
  return ok({
    appId: identity.value.appId,
    keyPath: identity.value.keyPath,
    owner: split.value.owner,
    repoName: split.value.repoName,
  });
}

/**
 * The bot's login, its app slug, from the clone's merge-bot config: the only
 * account whose comment may declare a review vendor unavailable
 * (the review-vendor unavailability declaration `pr-watch` reads).
 */
export function resolveMergeBotAppSlug(input: MergeBotResolveInput): Result<string, Error> {
  const configRoot = resolvePrimaryConfigRoot(input);
  if (!configRoot.ok) {
    return err(configRoot.error);
  }
  const repoConfig = loadMergeBotRepoConfig({
    repoRoot: configRoot.value,
    readFileImpl: input.readConfigFileImpl,
  });
  return repoConfig.ok ? ok(repoConfig.value.appSlug) : err(repoConfig.error);
}
