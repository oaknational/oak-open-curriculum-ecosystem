import { createHash } from 'node:crypto';

import {
  HELP_TEXT,
  MISSING_PLATFORM_MESSAGE,
  runAgentIdentityCli,
} from '../../src/bin/agent-identity-cli';
import { agentIdentityCliEnvironmentFromProcessEnv } from '../../src/bin/agent-identity-cli-environment';

describe('agent identity CLI planning', () => {
  it('prints help without requiring a seed', () => {
    expect(runAgentIdentityCli({ argv: ['--help'], env: {} })).toEqual({
      exitCode: 0,
      stdout: `${HELP_TEXT}\n`,
      stderr: '',
    });
  });

  it('uses explicit seed before environment seeds', () => {
    const result = runAgentIdentityCli({
      argv: ['--seed', 'explicit-seed', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'claude-seed',
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('explicit-seed').digest('hex'),
    });
  });

  it('resolves the stripped cloud platform session id when no Practice seed is set', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('01FV6rZz5BjSkApAUL6FAj72').digest('hex'),
    });
  });

  it('lets PRACTICE_AGENT_SESSION_ID_CLAUDE outrank the ambient platform session id', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'claude-seed',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('claude-seed').digest('hex'),
    });
  });

  it('prefers PRACTICE_AGENT_SESSION_ID_CLAUDE over the other Practice and harness vars', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'claude-seed',
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-seed',
        PRACTICE_AGENT_SESSION_ID_CODEX: 'codex-practice-seed',
        CODEX_THREAD_ID: 'codex-thread-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('claude-seed').digest('hex'),
    });
  });

  it('falls back to PRACTICE_AGENT_SESSION_ID_CURSOR when CLAUDE is unset', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'cursor', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-seed',
        PRACTICE_AGENT_SESSION_ID_CODEX: 'codex-practice-seed',
        CODEX_THREAD_ID: 'codex-thread-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('cursor-seed').digest('hex'),
    });
  });

  it('falls back to PRACTICE_AGENT_SESSION_ID_GEMINI before Codex seeds', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'gemini', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_GEMINI: 'gemini-practice-seed',
        PRACTICE_AGENT_SESSION_ID_CODEX: 'codex-practice-seed',
        CODEX_THREAD_ID: 'codex-thread-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('gemini-practice-seed').digest('hex'),
    });
  });

  it('falls back to PRACTICE_AGENT_SESSION_ID_CODEX before the harness CODEX_THREAD_ID', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'codex', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CODEX: 'codex-practice-seed',
        CODEX_THREAD_ID: 'codex-thread-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('codex-practice-seed').digest('hex'),
    });
  });

  it('falls back to harness CODEX_THREAD_ID when no Practice var is set', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'codex', '--format', 'json'],
      env: {
        CODEX_THREAD_ID: 'codex-thread-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('codex-thread-seed').digest('hex'),
    });
  });

  it('falls back to Antigravity conversationId when no Practice var is set', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'gemini', '--format', 'json'],
      env: {
        conversationId: 'antigravity-conversation-seed',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('antigravity-conversation-seed').digest('hex'),
    });
  });

  it('falls back to Antigravity source metadata conversationId', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'gemini', '--format', 'json'],
      env: {
        ANTIGRAVITY_SOURCE_METADATA: JSON.stringify({
          conversationId: 'antigravity-source-metadata-seed',
          toolCall: 'ignored',
        }),
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('antigravity-source-metadata-seed').digest('hex'),
    });
  });

  it('does not use Antigravity run-volatile trajectory ids as seeds', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'gemini'],
      env: {
        ANTIGRAVITY_SOURCE_METADATA: JSON.stringify({
          ANTIGRAVITY_TRAJECTORY_ID: 'volatile-run-id',
        }),
      },
    });

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr:
        'Error: missing seed; pass --seed or set PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, or Antigravity conversationId\n',
    });
  });

  it('prints default kebab output', () => {
    const result = runAgentIdentityCli({
      argv: ['--seed', 'example-session-id-001'],
      env: {},
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/^[a-z]+-[a-z]+-[a-z]+\n$/u);
  });

  it('supports the short help flag', () => {
    expect(runAgentIdentityCli({ argv: ['-h'], env: {} })).toEqual({
      exitCode: 0,
      stdout: `${HELP_TEXT}\n`,
      stderr: '',
    });
  });

  it('reports missing flag values and unknown arguments as bad usage', () => {
    expect(runAgentIdentityCli({ argv: ['--seed'], env: {} }).stderr).toBe(
      "Error: flag '--seed' requires a value\n",
    );
    expect(runAgentIdentityCli({ argv: ['--format'], env: {} }).stderr).toBe(
      "Error: flag '--format' requires a value\n",
    );
    expect(runAgentIdentityCli({ argv: ['--unknown'], env: {} }).stderr).toBe(
      "Error: unknown argument '--unknown'\n",
    );
  });

  it('reports missing seed naming the Practice vars and harness fallback', () => {
    expect(runAgentIdentityCli({ argv: ['--platform', 'gemini'], env: {} })).toEqual({
      exitCode: 2,
      stdout: '',
      stderr:
        'Error: missing seed; pass --seed or set PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, or Antigravity conversationId\n',
    });
  });

  it('reports unknown format as bad usage without exiting the test process', () => {
    expect(runAgentIdentityCli({ argv: ['--seed', 'seed', '--format', 'xml'], env: {} })).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: "Error: unsupported format 'xml'; expected kebab, display, or json\n",
    });
  });

  it('renders the environment override as a type-total override result', () => {
    const result = runAgentIdentityCli({
      argv: ['--seed', 'any', '--format', 'json'],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: 'Frolicking Toast',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      kind: 'override',
      namingSchemaVersion: 'override',
      displayName: 'Frolicking Toast',
      slug: 'frolicking-toast',
      seedDigest: createHash('sha256').update('any').digest('hex'),
      override: 'Frolicking Toast',
    });
  });

  it('uses a Practice session seed with the session-level resolved-name cache', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-session-seed',
        PRACTICE_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
      },
    });

    expect(JSON.parse(result.stdout)).toEqual({
      kind: 'override',
      namingSchemaVersion: 'override',
      displayName: 'Cached Session Name',
      slug: 'cached-session-name',
      seedDigest: createHash('sha256').update('cursor-session-seed').digest('hex'),
      override: 'Cached Session Name',
    });
  });

  it('maps the executable process environment into CLI input', () => {
    expect(
      agentIdentityCliEnvironmentFromProcessEnv({
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-session-seed',
        PRACTICE_AGENT_SESSION_ID_GEMINI: 'gemini-session-seed',
        CLAUDE_CODE_SESSION_ID: 'claude-cli-session-seed',
        PRACTICE_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
      }),
    ).toStrictEqual({
      PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-session-seed',
      PRACTICE_AGENT_SESSION_ID_GEMINI: 'gemini-session-seed',
      CLAUDE_CODE_SESSION_ID: 'claude-cli-session-seed',
      PRACTICE_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
    });
  });
});

describe('agent identity CLI: the retired override name has no fallback', () => {
  it('derives the name from the seed when only the retired override name is set', () => {
    const argv = ['--seed', 'any', '--format', 'json'];
    const result = runAgentIdentityCli({
      argv,
      env: agentIdentityCliEnvironmentFromProcessEnv({
        OAK_AGENT_IDENTITY_OVERRIDE: 'Frolicking Toast',
      }),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('Frolicking Toast');
    expect(result.stdout).toBe(runAgentIdentityCli({ argv, env: {} }).stdout);
  });
});

describe('agent identity CLI: the Claude Code CLI session id seed (PDR-027, 2026-09-24)', () => {
  it('resolves the Claude Code CLI session id when no Practice or cloud seed is set', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: { CLAUDE_CODE_SESSION_ID: '74fc02f6-0615-464a-a5d2-daa7d85a2334' },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('74fc02f6-0615-464a-a5d2-daa7d85a2334').digest('hex'),
    });
  });

  it('lets the cloud platform session id outrank the CLI session id', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
        CLAUDE_CODE_SESSION_ID: '74fc02f6-0615-464a-a5d2-daa7d85a2334',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('01FV6rZz5BjSkApAUL6FAj72').digest('hex'),
    });
  });

  it('lets the CLI session id outrank the Codex thread id', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        CODEX_THREAD_ID: 'codex-thread-seed',
        CLAUDE_CODE_SESSION_ID: '74fc02f6-0615-464a-a5d2-daa7d85a2334',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('74fc02f6-0615-464a-a5d2-daa7d85a2334').digest('hex'),
    });
  });
});

describe('agent identity CLI platform gate', () => {
  it('with --platform codex, the Claude seeds do not count: a nested Codex seat keeps its thread id', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'codex', '--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'claude-seed',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
        CLAUDE_CODE_SESSION_ID: 'claude-cli-session',
        CODEX_THREAD_ID: 'codex-thread',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('codex-thread').digest('hex'),
    });
  });

  it('with --platform codex and only Claude seeds set, reports the missing seed', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'codex'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'claude-seed',
        CLAUDE_CODE_SESSION_ID: 'claude-cli-session',
      },
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('missing seed');
    expect(result.stderr).toContain(
      'PRACTICE_AGENT_SESSION_ID_CLAUDE and CLAUDE_CODE_SESSION_ID are set but do not count on platform codex',
    );
  });

  it('with --platform claude-code, the cloud id and the CLI session id count, the cloud id first', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'claude-code', '--format', 'json'],
      env: {
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
        CLAUDE_CODE_SESSION_ID: 'claude-cli-session',
        CODEX_THREAD_ID: 'codex-thread',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('01FV6rZz5BjSkApAUL6FAj72').digest('hex'),
    });
  });

  it('an explicit --seed wins on any platform', () => {
    const result = runAgentIdentityCli({
      argv: ['--platform', 'codex', '--seed', 'explicit-seed', '--format', 'json'],
      env: { CODEX_THREAD_ID: 'codex-thread' },
    });

    expect(JSON.parse(result.stdout)).toMatchObject({
      seedDigest: createHash('sha256').update('explicit-seed').digest('hex'),
    });
  });

  it.each([[['--platform']], [['--platform', '']], [['--platform', '   ']]])(
    'reports --platform without a value as bad usage, never as an open gate: %j',
    (argv: string[]) => {
      const result = runAgentIdentityCli({ argv, env: { CODEX_THREAD_ID: 'codex-thread' } });

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain("flag '--platform' requires a value");
    },
  );

  it('with neither --seed nor --platform, reports bad usage naming the flag: the seat is never inferred from the environment', () => {
    expect(
      runAgentIdentityCli({ argv: [], env: { CLAUDE_CODE_SESSION_ID: 'claude-cli-session' } }),
    ).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: `Error: ${MISSING_PLATFORM_MESSAGE}\n`,
    });
  });
});
