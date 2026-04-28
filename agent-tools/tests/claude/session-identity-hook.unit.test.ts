import { describe, expect, it } from 'vitest';

import { planClaudeSessionIdentityHook } from '../../src/claude/session-identity-hook';
import { deriveIdentity } from '../../src/core/agent-identity';

describe('planClaudeSessionIdentityHook', () => {
  it('returns an empty hook output and no env write when stdin is not JSON', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: 'not json',
        environment: { CLAUDE_ENV_FILE: '/tmp/env-file' },
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('returns an empty hook output and no env write when session_id is missing', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: JSON.stringify({ source: 'startup', model: 'claude-opus-4-7' }),
        environment: { CLAUDE_ENV_FILE: '/tmp/env-file' },
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('returns an empty hook output and no env write when session_id is empty', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: JSON.stringify({ session_id: '   ' }),
        environment: { CLAUDE_ENV_FILE: '/tmp/env-file' },
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('emits additionalContext naming the derived agent identity', () => {
    const sessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const expectedDisplayName = deriveIdentity(sessionId).displayName;
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({
        session_id: sessionId,
        source: 'startup',
        model: 'claude-opus-4-7',
      }),
      environment: { CLAUDE_ENV_FILE: '/tmp/env-file' },
    });

    expect(plan.hookOutput).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: plan.hookOutput.hookSpecificOutput?.additionalContext ?? '',
      },
    });

    const additionalContext = plan.hookOutput.hookSpecificOutput?.additionalContext ?? '';
    expect(additionalContext).toContain('[Practice agent identity]');
    expect(additionalContext).toContain(`Session identity (PDR-027): ${expectedDisplayName}`);
    expect(additionalContext).toContain(
      'PDR-027 session_id_prefix (first 6 of session_id): 22e835',
    );
    expect(additionalContext).toContain('PRACTICE_AGENT_SESSION_ID_CLAUDE');
    expect(additionalContext).toContain(`/rename ${expectedDisplayName} - <intent>`);
    expect(additionalContext).toContain('Do not auto-rename');
  });

  it('emits an env-file write line with the session id when CLAUDE_ENV_FILE is set', () => {
    const sessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: sessionId }),
      environment: { CLAUDE_ENV_FILE: '/tmp/claude-env-file-abc' },
    });

    expect(plan.envFileWrite).toStrictEqual({
      absolutePath: '/tmp/claude-env-file-abc',
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE=${sessionId}\n`,
    });
  });

  it('omits the env-file write when CLAUDE_ENV_FILE is missing', () => {
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: 'session-id-without-env-file' }),
      environment: {},
    });

    expect(plan.envFileWrite).toBeUndefined();
    expect(plan.hookOutput.hookSpecificOutput?.additionalContext).toContain(
      '[Practice agent identity]',
    );
  });

  it('omits the env-file write when CLAUDE_ENV_FILE is whitespace', () => {
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: 'session-id-with-blank-env-file' }),
      environment: { CLAUDE_ENV_FILE: '   ' },
    });

    expect(plan.envFileWrite).toBeUndefined();
  });
});
