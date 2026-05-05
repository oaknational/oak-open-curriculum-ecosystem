import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { runAgentIdentityCli } from '../../src/bin/agent-identity-cli';
import { deriveIdentity } from '../../src/core/agent-identity';
import { planCursorSessionIdentityHook } from '../../src/cursor/oak-session-identity-hook';

describe('agent identity session cache', () => {
  it('resolves the Cursor hook-emitted cached display name through the CLI', () => {
    const sessionId = 'cursor-session-cache-seed';
    const displayName = deriveIdentity(sessionId).displayName;
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
      kind: 'override',
      displayName,
      slug: deriveIdentity(sessionId, { override: displayName }).slug,
      seedDigest: createHash('sha256').update(sessionId).digest('hex'),
      override: displayName,
    });
  });
});
