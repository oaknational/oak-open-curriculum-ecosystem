import { describe, expect, it } from 'vitest';

import { runAgentToolsCli } from '../src/bin/agent-tools-cli';

describe('agent-tools unified CLI', () => {
  it('dispatches agent-identity through the single entrypoint', async () => {
    const result = await runAgentToolsCli({
      argv: ['agent-identity', '--seed', 'example-session-id-001', '--format', 'display'],
      env: {},
      cwd: '/repo',
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(result.stdout).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+\n$/u);
  });

  it('dispatches collaboration-state actions through the single entrypoint', async () => {
    const result = await runAgentToolsCli({
      argv: ['collaboration-state', 'identity', 'preflight', '--help'],
      env: {},
      cwd: '/repo',
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(result.stdout).toContain('identity preflight --platform <platform> --model <model>');
  });

  it('dispatches commit-queue output into the unified result buffer', async () => {
    const result = await runAgentToolsCli({
      argv: ['commit-queue', 'status', '--now', '2026-05-12T07:52:59Z'],
      env: {},
      cwd: '/repo',
      repoRoot: '/repo',
      readCommitQueueRegistry: async () => ({
        schema_version: '1.3.0',
        claims: [],
        commit_queue: [],
      }),
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(JSON.parse(result.stdout)).toMatchObject({ total: 0, active: 0 });
  });

  it('passes commit-queue help through without requiring option values', async () => {
    const result = await runAgentToolsCli({
      argv: ['commit-queue', 'enqueue', '--help'],
      env: {},
      cwd: '/repo',
      repoRoot: '/repo',
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(result.stdout).toContain('enqueue --claim-id <uuid>');
  });

  it('uses one error shape for unknown topics', async () => {
    const result = await runAgentToolsCli({
      argv: ['unknown-topic'],
      env: {},
      cwd: '/repo',
    });

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: `${[
        'Usage: agent-tools <topic> [action] [options]',
        '',
        'Topics:',
        '  agent-identity',
        '  collaboration-state',
        '  commit-queue',
        '  branch-touched-files',
        '',
        'Error: unknown topic: unknown-topic',
        '',
      ].join('\n')}`,
    });
  });

  it('can emit structured lifecycle logs from the shared entrypoint', async () => {
    const result = await runAgentToolsCli({
      argv: [
        '--log-json',
        'agent-identity',
        '--seed',
        'example-session-id-001',
        '--format',
        'kebab',
      ],
      env: {},
      cwd: '/repo',
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain('"surface":"agent-tools"');
    expect(result.stderr).toContain('"topic":"agent-identity"');
    expect(result.stderr).toContain('"event":"complete"');
  });
});
