import { err, ok, type Result } from '@oaknational/result';

import { defaultPrivateKeyPath, loadMergeBotRepoConfig } from './repo-config.js';

/**
 * Bot-identity resolution shared by every merge-bot action.
 *
 * `.github/merge-bot.json` is the single AUTHORITY for the bot identity;
 * flags are explicit operator overrides (cross-repo invocation, tests) —
 * never a resolution tier. Split from `resolve-config.ts` when the `merge`
 * action became the second consumer (`consolidate-at-second-consumer`):
 * scope handling stays with each action (mint-token requires `--scope`;
 * `merge` fixes its scope internally), identity resolution lives once here.
 */

export interface MergeBotResolveInput {
  readonly envHome?: string;
  readonly repoRoot?: string;
  readonly readConfigFileImpl?: (filePath: string) => string;
}

/** The resolved bot identity: app, key, and the owner/name split repo. */
export interface BotIdentity {
  readonly appId: string;
  readonly keyPath: string;
  readonly owner: string;
  readonly repoName: string;
}

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
 * The repo config is the AUTHORITY for the bot identity, not a tier a
 * resolution ladder lands on; an override is an explicit flag choice.
 */
function applyAuthority(
  partial: { appId?: string; keyPath?: string; repo?: string },
  input: MergeBotResolveInput,
): Result<IdentityValues, Error> {
  const repoConfig = loadMergeBotRepoConfig({
    repoRoot: input.repoRoot ?? process.cwd(),
    readFileImpl: input.readConfigFileImpl,
  });
  if (!repoConfig.ok) {
    return err(
      new Error(
        `the repo's merge-bot identity is unreadable — .github/merge-bot.json is the single authority; fix it (${repoConfig.error.message}); flags exist only as explicit overrides`,
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
