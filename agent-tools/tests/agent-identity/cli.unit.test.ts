import { createHash } from 'node:crypto';

import { HELP_TEXT, runAgentIdentityCli } from '../../src/bin/agent-identity-cli';

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
        'Error: missing seed; pass --seed or set PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_CODEX, or CODEX_THREAD_ID\n',
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
});
