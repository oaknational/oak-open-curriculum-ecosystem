import { err, ok, type Result } from '@oaknational/result';

import { loadMergeBotRepoConfig } from './repo-config.js';
import { resolvePrimaryConfigRoot, type MergeBotResolveInput } from './resolve-identity.js';

/**
 * What a clone states about the pull requests its bot opens, read from the
 * clone's merge-bot config (`.github/merge-bot.json`, per-checkout and never
 * tracked). Both statements follow the clone and not the tool: another
 * person's clone of the same repository names its own app, applies its own
 * labels and counts its own work in progress.
 */
export interface CloneStatements {
  /** The labels the bot adds to a pull request it opens; empty when the config states none. */
  readonly labels: readonly string[];
  /**
   * The GitHub logins whose open pull requests count as this clone's lanes
   * under the open limit. Never empty.
   */
  readonly laneAuthors: readonly string[];
}

/** Git's `user.name` where the tool was invoked, or nothing when git states none. */
function gitUserName(input: MergeBotResolveInput): string | undefined {
  try {
    const name = input.runGitImpl(['config', 'user.name'], input.repoRoot ?? process.cwd()).trim();
    return name === '' ? undefined : name;
  } catch {
    // `git config` exits non-zero when the key is unset; the bot's own login
    // still stands, so an unset name narrows the default and fails nothing.
    return undefined;
  }
}

/**
 * The lane authors when the config states none: the identity git commits as
 * here (`user.name`) and this clone's own bot (`<appSlug>[bot]`), which
 * authors every pull request the tool opens. Git's name is a GitHub login
 * only where the checkout is set up that way, which is why the open prints
 * the count it found and the refusal prints the authors it counted.
 */
function defaultLaneAuthors(input: MergeBotResolveInput, appSlug: string): readonly string[] {
  const bot = `${appSlug}[bot]`;
  const name = gitUserName(input);
  return name === undefined || name.toLowerCase() === bot.toLowerCase() ? [bot] : [name, bot];
}

/**
 * Read the clone's statements. A stated `laneAuthors` list is the whole
 * answer and replaces the default.
 */
export function resolveCloneStatements(
  input: MergeBotResolveInput,
): Result<CloneStatements, Error> {
  const configRoot = resolvePrimaryConfigRoot(input);
  if (!configRoot.ok) {
    return err(configRoot.error);
  }
  const repoConfig = loadMergeBotRepoConfig({
    repoRoot: configRoot.value,
    readFileImpl: input.readConfigFileImpl,
  });
  if (!repoConfig.ok) {
    return err(repoConfig.error);
  }
  return ok({
    labels: repoConfig.value.pullRequestLabels ?? [],
    laneAuthors:
      repoConfig.value.laneAuthors ?? defaultLaneAuthors(input, repoConfig.value.appSlug),
  });
}
