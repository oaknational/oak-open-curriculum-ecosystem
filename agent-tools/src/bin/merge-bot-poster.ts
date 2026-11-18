import { defaultRunGit } from '../collaboration-state/coordination-home.js';
import { repoRoot } from '../core/runtime.js';
import { resolveMergeBotAppSlug } from '../merge-bot/resolve-identity.js';
import type { AgentToolsCliInput } from './agent-tools-cli-types.js';

/**
 * The bot's login for `pr state --unavailable`, read from the invoking
 * clone's merge-bot config (the one authority for the bot identity).
 *
 * @throws when the clone's merge-bot config cannot be read; `pr state` reports
 *   it and exits 2.
 */
export function mergeBotPoster(input: AgentToolsCliInput): string {
  const slug = resolveMergeBotAppSlug({
    repoRoot: input.repoRoot ?? repoRoot(),
    runGitImpl: defaultRunGit,
  });
  if (!slug.ok) {
    throw slug.error;
  }
  return slug.value;
}
