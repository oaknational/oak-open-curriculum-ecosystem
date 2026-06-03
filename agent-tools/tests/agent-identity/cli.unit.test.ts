import { createHash } from 'node:crypto';

import { HELP_TEXT, runAgentIdentityCli } from '../../src/bin/agent-identity-cli';
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

  it('prefers PRACTICE_AGENT_SESSION_ID_CLAUDE over the other Practice and harness vars', () => {
    const result = runAgentIdentityCli({
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: ['--format', 'json'],
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
      argv: [],
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
    expect(runAgentIdentityCli({ argv: [], env: {} })).toEqual({
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
        OAK_AGENT_IDENTITY_OVERRIDE: 'Frolicking Toast',
      },
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      kind: 'override',
      displayName: 'Frolicking Toast',
      slug: 'frolicking-toast',
      seedDigest: createHash('sha256').update('any').digest('hex'),
      override: 'Frolicking Toast',
    });
  });

  it('uses a Practice session seed with the session-level resolved-name cache', () => {
    const result = runAgentIdentityCli({
      argv: ['--format', 'json'],
      env: {
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-session-seed',
        OAK_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
      },
    });

    expect(JSON.parse(result.stdout)).toEqual({
      kind: 'override',
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
        OAK_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
      }),
    ).toStrictEqual({
      PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-session-seed',
      PRACTICE_AGENT_SESSION_ID_GEMINI: 'gemini-session-seed',
      OAK_AGENT_IDENTITY_OVERRIDE: 'Cached Session Name',
    });
  });
});
