import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { runAgentIdentityCli } from '../../src/bin/agent-identity-cli';
import { deriveIdentity } from '../../src/core/agent-identity';
import { planCursorSessionIdentityHook } from '../../src/cursor/oak-session-identity-hook';

describe('agent identity session cache', () => {
  it('re-derives the same identity from the Cursor hook-emitted seed alone (no pinned name)', () => {
    // The hook emits only the seed (PDR-027, 2026-08-24 amendment); the CLI
    // must reach the exact identity the hook displayed by derivation,
    // proving no pinned-name cache is needed for hook/CLI coherence.
    const sessionId = 'cursor-session-cache-seed';
    const expected = deriveIdentity(sessionId);
    const plan = planCursorSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: sessionId }),
      environment: { CURSOR_PROJECT_DIR: '/repo', OAK_SKIP_COMPOSER_SESSION_MIRROR: '1' },
      fallbackProjectDir: '/repo',
      nowIso: '2026-05-05T13:40:00.000Z',
    });

    const result = runAgentIdentityCli({
      argv: ['--format', 'json'],
      env: plan.output.env,
    });

    expect(JSON.parse(result.stdout)).toEqual({
      ...expected,
      seedDigest: createHash('sha256').update(sessionId).digest('hex'),
    });
  });
});
