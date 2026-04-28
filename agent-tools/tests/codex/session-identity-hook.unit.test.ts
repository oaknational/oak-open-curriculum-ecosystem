import { describe, expect, it } from 'vitest';

import { planCodexSessionIdentityHook } from '../../src/codex/session-identity-hook';
import { deriveIdentity } from '../../src/core/agent-identity';

describe('planCodexSessionIdentityHook', () => {
  it('returns an empty hook output when stdin is not JSON', () => {
    expect(planCodexSessionIdentityHook({ stdinText: 'not json' })).toStrictEqual({
      hookOutput: {},
    });
  });

  it('returns an empty hook output when session_id is missing', () => {
    expect(
      planCodexSessionIdentityHook({
        stdinText: JSON.stringify({ source: 'startup', model: 'GPT-5' }),
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('returns an empty hook output when session_id is empty', () => {
    expect(
      planCodexSessionIdentityHook({
        stdinText: JSON.stringify({ session_id: '   ', source: 'resume' }),
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('emits SessionStart additionalContext containing the PDR-027 identity block', () => {
    const sessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const expectedDisplayName = deriveIdentity(sessionId).displayName;
    const plan = planCodexSessionIdentityHook({
      stdinText: JSON.stringify({
        session_id: sessionId,
        source: 'startup',
        hook_event_name: 'SessionStart',
        model: 'GPT-5',
      }),
    });

    expect(plan.hookOutput).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: plan.hookOutput.hookSpecificOutput?.additionalContext ?? '',
      },
    });

    const additionalContext = plan.hookOutput.hookSpecificOutput?.additionalContext ?? '';
    expect(additionalContext).toContain('[Practice agent identity]');
    expect(additionalContext).toContain('PDR-027 identity block:');
    expect(additionalContext).toContain(`agent_name: ${expectedDisplayName}`);
    expect(additionalContext).toContain('platform: codex');
    expect(additionalContext).toContain('model: GPT-5');
    expect(additionalContext).toContain('session_id_prefix: 22e835');
    expect(additionalContext).toContain('seed_source: CODEX_THREAD_ID');
    expect(additionalContext).toContain(
      'pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5',
    );
  });
});
