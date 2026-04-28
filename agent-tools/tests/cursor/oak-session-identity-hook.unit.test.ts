import { describe, expect, it } from 'vitest';

import { deriveIdentity } from '../../src/core/agent-identity';
import { planCursorSessionIdentityHook } from '../../src/cursor/oak-session-identity-hook';

const projectDir = '/repo';
const nowIso = '2026-04-27T07:50:41.000Z';

describe('planCursorSessionIdentityHook', () => {
  it('returns empty env and additional_context for invalid JSON', () => {
    expect(
      planCursorSessionIdentityHook({
        stdinText: 'not json',
        environment: { CURSOR_PROJECT_DIR: projectDir },
        fallbackProjectDir: projectDir,
        nowIso,
      }).output,
    ).toStrictEqual({ env: {}, additional_context: '' });
  });

  it('returns empty env and additional_context when session_id is missing', () => {
    expect(
      planCursorSessionIdentityHook({
        stdinText: JSON.stringify({ is_background_agent: false, composer_mode: 'agent' }),
        environment: { CURSOR_PROJECT_DIR: projectDir },
        fallbackProjectDir: projectDir,
        nowIso,
      }).output,
    ).toStrictEqual({ env: {}, additional_context: '' });
  });

  it('sets PRACTICE_AGENT_SESSION_ID_CURSOR and includes session identity context', () => {
    const sessionId = 'unit-test-hook-seed-xyz';
    const expectedDisplayName = deriveIdentity(sessionId).displayName;
    const plan = planCursorSessionIdentityHook({
      stdinText: JSON.stringify({
        session_id: sessionId,
        is_background_agent: false,
        composer_mode: 'agent',
      }),
      environment: { CURSOR_PROJECT_DIR: projectDir },
      fallbackProjectDir: projectDir,
      nowIso,
    });

    expect(plan.output.env).toStrictEqual({ PRACTICE_AGENT_SESSION_ID_CURSOR: sessionId });
    expect(plan.output.additional_context).toContain('[Practice agent identity]');
    expect(plan.output.additional_context).toContain(
      'PDR-027 session_id_prefix (first 6 of composer session_id): unit-t',
    );
    expect(plan.output.additional_context).toContain(
      `Deterministic display name for this composer session: ${expectedDisplayName}`,
    );
    expect(plan.output.additional_context).toContain('Suggested Composer tab title');
    expect(plan.output.user_message).toBe(
      `Oak · ${expectedDisplayName} — suggested Composer tab title; details in .cursor/oak-composer-session.local.json`,
    );
    expect(plan.mirror).toStrictEqual({
      absolutePath: '/repo/.cursor/oak-composer-session.local.json',
      payload: {
        schema: 'oak.cursor-composer-session.v1',
        updatedAt: nowIso,
        composerSessionId: sessionId,
        sessionIdPrefix: 'unit-t',
        displayName: expectedDisplayName,
        suggestedComposerTabTitle: `Oak · ${expectedDisplayName}`,
      },
    });
  });

  it('skips the mirror side effect when the hook environment asks for it', () => {
    const plan = planCursorSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: 'unit-test-hook-seed-xyz' }),
      environment: {
        CURSOR_PROJECT_DIR: projectDir,
        OAK_SKIP_COMPOSER_SESSION_MIRROR: '1',
      },
      fallbackProjectDir: projectDir,
      nowIso,
    });

    expect(plan.output.env).toStrictEqual({
      PRACTICE_AGENT_SESSION_ID_CURSOR: 'unit-test-hook-seed-xyz',
    });
    expect(plan.mirror).toBeUndefined();
  });
});
