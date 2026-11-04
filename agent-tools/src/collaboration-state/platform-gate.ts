/**
 * The platform gate on the PDR-027 seed (2026-09-25 amendment): the three
 * Claude seeds count only when the seat's platform is a Claude platform.
 *
 * @remarks
 * Claude Code exports its session id into every Bash tool shell and its
 * `SessionStart` hook appends the Practice seed to the env file every later
 * shell reads, so a Codex or Cursor seat opened from a Claude shell sees all
 * three Claude seeds and, ungated, would take the Claude seat's identity. Both
 * seed resolvers read this module. Pure: no IO.
 *
 * @packageDocumentation
 */

/**
 * The three Claude seeds, in precedence order; the gate reads exactly these.
 */
const CLAUDE_SEED_SOURCES = [
  'PRACTICE_AGENT_SESSION_ID_CLAUDE',
  'CLAUDE_CODE_REMOTE_SESSION_ID',
  'CLAUDE_CODE_SESSION_ID',
] as const;

/** One of the three Claude seed variable names. */
type ClaudeSeedSource = (typeof CLAUDE_SEED_SOURCES)[number];

/** The environment fields the gate reads. */
export type ClaudeSeedEnvironment = Readonly<Partial<Record<ClaudeSeedSource, string>>>;

/**
 * Whether a platform label names a Claude platform: `claude` itself or any
 * `claude-` variant (`claude-code`, a cloud seat), whatever its case or
 * padding. Only on these do the three Claude seeds count.
 */
export function isClaudePlatform(platform: string): boolean {
  const label = platform.trim().toLowerCase();
  return label === 'claude' || label.startsWith('claude-');
}

/**
 * The Claude seeds present in the environment that the gate excludes on a
 * non-Claude platform, by source name (never value), so a missing-seed error
 * can say why a variable the operator can see did not count. Empty on a
 * Claude platform.
 */
export function gatedClaudeSeedsPresent(
  env: ClaudeSeedEnvironment,
  platform: string,
): readonly string[] {
  if (isClaudePlatform(platform)) {
    return [];
  }
  return CLAUDE_SEED_SOURCES.filter((source) => (env[source] ?? '').trim().length > 0);
}

/**
 * The sentence a missing-seed error appends when gated Claude seeds were set:
 * names them and the platform, or is empty when there are none.
 */
export function gatedSeedsSentence(gated: readonly string[], platform: string): string {
  if (gated.length === 0) {
    return '';
  }
  const plural = gated.length > 1;
  return ` ${gated.join(' and ')} ${plural ? 'are' : 'is'} set but ${plural ? 'do' : 'does'} not count on platform ${platform}.`;
}
