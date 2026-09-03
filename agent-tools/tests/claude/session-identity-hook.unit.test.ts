import { describe, expect, it } from 'vitest';

import {
  claudeSessionIdentityHookEnvironmentFromProcessEnv,
  planClaudeSessionIdentityHook,
} from '../../src/claude/session-identity-hook';
import { deriveIdentity } from '../../src/core/agent-identity';

describe('planClaudeSessionIdentityHook', () => {
  it('returns an empty hook output and no env write when stdin is not JSON', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: 'not json',
        environment: { CLAUDE_ENV_FILE: 'mem://env-file' },
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('returns an empty hook output and no env write when session_id is missing', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: JSON.stringify({ source: 'startup', model: 'claude-opus-4-7' }),
        environment: { CLAUDE_ENV_FILE: 'mem://env-file' },
      }),
    ).toStrictEqual({ hookOutput: {} });
  });

  it('returns an empty hook output and no env write when session_id is empty', () => {
    expect(
      planClaudeSessionIdentityHook({
        stdinText: JSON.stringify({ session_id: '   ' }),
        environment: { CLAUDE_ENV_FILE: 'mem://env-file' },
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
      environment: { CLAUDE_ENV_FILE: 'mem://env-file' },
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
    expect(additionalContext).toContain('PRACTICE_AGENT_SESSION_ID_CLAUDE');
    expect(additionalContext).toContain(`/rename ${expectedDisplayName} - <intent>`);
    expect(additionalContext).toContain('Do not auto-rename');
  });

  it('never pins a display name in the env file (2026-08-24 chimera regression)', () => {
    // One seat produced three identity tuples in one day (measured in the
    // castr estate) because the hook pinned OAK_AGENT_IDENTITY_OVERRIDE
    // alongside the seed: a later seed change re-derived prefix and uuid
    // while the pinned name stayed. The name must always derive from the
    // live seed at the point of use.
    const sessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: sessionId }),
      environment: { CLAUDE_ENV_FILE: 'mem://claude-env-file-abc' },
    });

    expect(plan.envFileWrite).toStrictEqual({
      absolutePath: 'mem://claude-env-file-abc',
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${sessionId}'\n`,
    });
    expect(plan.envFileWrite?.appendLine).not.toContain('OAK_AGENT_IDENTITY_OVERRIDE');
  });

  it('prefers the stripped platform session id over the harness session id on cloud seats', () => {
    const harnessSessionId = 'd36e5cf3-6bcc-51db-9823-a91546b618f7';
    const platformSeed = '01FV6rZz5BjSkApAUL6FAj72';
    const expectedDisplayName = deriveIdentity(platformSeed).displayName;

    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: harnessSessionId }),
      environment: {
        CLAUDE_ENV_FILE: 'mem://env-file',
        CLAUDE_CODE_REMOTE_SESSION_ID: `cse_${platformSeed}`,
      },
    });

    const additionalContext = plan.hookOutput.hookSpecificOutput?.additionalContext ?? '';
    expect(additionalContext).toContain(`Session identity (PDR-027): ${expectedDisplayName}`);
    expect(plan.envFileWrite?.appendLine).toBe(
      `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${platformSeed}'\n`,
    );
  });

  it('derives from the platform session id alone when stdin carries no session_id', () => {
    const platformSeed = '01FV6rZz5BjSkApAUL6FAj72';
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ source: 'startup' }),
      environment: {
        CLAUDE_ENV_FILE: 'mem://env-file',
        CLAUDE_CODE_REMOTE_SESSION_ID: `cse_${platformSeed}`,
      },
    });

    expect(plan.envFileWrite?.appendLine).toBe(
      `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${platformSeed}'\n`,
    );
  });

  it('falls back to the harness session id when the platform session id is blank', () => {
    const harnessSessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: harnessSessionId }),
      environment: {
        CLAUDE_ENV_FILE: 'mem://env-file',
        CLAUDE_CODE_REMOTE_SESSION_ID: '   ',
      },
    });

    expect(plan.envFileWrite?.appendLine).toBe(
      `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${harnessSessionId}'\n`,
    );
  });

  it('escapes an apostrophe-bearing session id in the env-file export line', () => {
    // Pins that the host CALLS the quoter: naive interpolation renders
    // 'it's-a-session-seed' (a syntactically broken export line), and every
    // later Bash call in the session would fail to source the env file.
    const sessionId = "it's-a-session-seed";
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: sessionId }),
      environment: { CLAUDE_ENV_FILE: 'mem://claude-env-file-quote' },
    });

    expect(plan.envFileWrite).toStrictEqual({
      absolutePath: 'mem://claude-env-file-quote',
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE=${String.raw`'it'\''s-a-session-seed'`}\n`,
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

describe('claudeSessionIdentityHookEnvironmentFromProcessEnv', () => {
  it('forwards CLAUDE_CODE_REMOTE_SESSION_ID independently of CLAUDE_ENV_FILE', () => {
    // Regression: the executable adapter once hand-picked only
    // CLAUDE_ENV_FILE, silently dropping the remote session id and leaving
    // the cloud-seat seed branch unreachable in production.
    expect(
      claudeSessionIdentityHookEnvironmentFromProcessEnv({
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      }),
    ).toStrictEqual({ CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72' });
  });

  it('forwards both variables when present and neither when absent', () => {
    expect(
      claudeSessionIdentityHookEnvironmentFromProcessEnv({
        CLAUDE_ENV_FILE: '/tmp/env',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_abc',
      }),
    ).toStrictEqual({ CLAUDE_ENV_FILE: '/tmp/env', CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_abc' });
    expect(claudeSessionIdentityHookEnvironmentFromProcessEnv({})).toStrictEqual({});
  });
});

describe('operator override rendering', () => {
  it('renders the explicit operator override while writing only the seed', () => {
    const sessionId = '22e83599-a627-4427-b23c-fe6ce046e859';
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: sessionId }),
      environment: {
        CLAUDE_ENV_FILE: 'mem://env-file',
        OAK_AGENT_IDENTITY_OVERRIDE: 'Named By Owner',
      },
    });

    const additionalContext = plan.hookOutput.hookSpecificOutput?.additionalContext ?? '';
    expect(additionalContext).toContain('Session identity (PDR-027): Named By Owner');
    expect(plan.envFileWrite?.appendLine).toBe(
      `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${sessionId}'\n`,
    );
  });
});

describe('explicit Practice seed precedence in the hook', () => {
  it('an explicit PRACTICE_AGENT_SESSION_ID_CLAUDE outranks the ambient platform id', () => {
    const plan = planClaudeSessionIdentityHook({
      stdinText: JSON.stringify({ session_id: 'harness-uuid' }),
      environment: {
        CLAUDE_ENV_FILE: 'mem://env-file',
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'explicit-operator-seed',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      },
    });

    expect(plan.envFileWrite?.appendLine).toBe(
      "export PRACTICE_AGENT_SESSION_ID_CLAUDE='explicit-operator-seed'\n",
    );
  });
});
