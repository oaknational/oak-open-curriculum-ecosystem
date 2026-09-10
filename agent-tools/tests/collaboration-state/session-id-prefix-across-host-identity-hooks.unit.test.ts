import { describe, expect, it } from 'vitest';

import { planClaudeSessionIdentityHook } from '../../src/claude/session-identity-hook';
import { planCodexSessionIdentityHook } from '../../src/codex/session-identity-hook';
import { sessionIdPrefix } from '../../src/collaboration-state/identity';
import { planCursorSessionIdentityHook } from '../../src/cursor/oak-session-identity-hook';

// Literal expectations, never derived: the prefix is the PDR-125 cross-estate
// join key, so a derivation change (width, casing, normalisation) must turn
// this table red. An assertion computed from sessionIdPrefix itself would move
// with the change and stay green.
const seedVectors = [
  { seed: '22e83599-a627-4427-b23c-fe6ce046e859', prefix: '22e835' },
  { seed: '22E83599-A627-4427-B23C-FE6CE046E859', prefix: '22E835' },
  { seed: '019dd34d-cb6a-74e0-a29d-6cb8a65ea14b', prefix: '019dd3' },
  { seed: 'antigravity-conversation-seed', prefix: 'antigr' },
  { seed: 'abc', prefix: 'abc' },
  { seed: 'sixchr', prefix: 'sixchr' },
] as const;

describe('the PDR-027 session_id_prefix every host hook renders', () => {
  it.each(seedVectors)(
    'canonical sessionIdPrefix derives $prefix from $seed',
    ({ seed, prefix }) => {
      expect(sessionIdPrefix(seed)).toBe(prefix);
    },
  );

  it.each(seedVectors)('the claude hook renders $prefix for $seed', ({ seed, prefix }) => {
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: seed }),
      environment: {},
    });

    const lines = (plan.hookOutput.hookSpecificOutput?.additionalContext ?? '').split('\n');
    expect(lines).toContain(`PDR-027 session_id_prefix (first 6 of the PDR-027 seed): ${prefix}.`);
  });

  it.each(seedVectors)('the codex hook renders $prefix for $seed', ({ seed, prefix }) => {
    const plan = planCodexSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: seed }),
    });

    const lines = (plan.hookOutput.hookSpecificOutput?.additionalContext ?? '').split('\n');
    expect(lines).toContain(`session_id_prefix: ${prefix}`);
  });

  it.each(seedVectors)(
    'the cursor hook renders and mirrors $prefix for $seed',
    ({ seed, prefix }) => {
      const plan = planCursorSessionIdentityHook({
        stdinText: JSON.stringify({ session_id: seed }),
        environment: { CURSOR_PROJECT_DIR: '/repo' },
        fallbackProjectDir: '/repo',
        nowIso: '2026-07-31T00:00:00.000Z',
      });

      expect(plan.output.additional_context.split('\n')).toContain(
        `PDR-027 session_id_prefix (first 6 of the PDR-027 seed): ${prefix}`,
      );
      expect(plan.mirror?.payload.sessionIdPrefix).toBe(prefix);
    },
  );
});
