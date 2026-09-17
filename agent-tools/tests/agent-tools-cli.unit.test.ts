import { Readable } from 'node:stream';

import { err, ok } from '@oaknational/result';
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
    expect(result.stdout).toMatch(/^[A-Z][a-z]+ [a-z]+ [A-Z][a-z]+\n$/u);
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
      readCommitQueueRegistry: async () =>
        ok({
          schema_version: '1.3.0',
          claims: [],
          commit_queue: [],
        }),
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(JSON.parse(result.stdout)).toMatchObject({ total: 0, active: 0 });
  });

  it('surfaces a registry read Err through the CLI boundary as exit 2 with the message verbatim', async () => {
    // The CLI read seam unwraps with the identity-preserving unwrapOrThrow;
    // an exact-equality pin on stderr catches a prefixing `unwrap` slip.
    const result = await runAgentToolsCli({
      argv: ['commit-queue', 'status', '--now', '2026-05-12T07:52:59Z'],
      env: {},
      cwd: '/repo',
      repoRoot: '/repo',
      readCommitQueueRegistry: async () =>
        err(
          new Error('active-claims.json must use schema_version 1.3.0 before commit queue writes'),
        ),
    });

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: 'active-claims.json must use schema_version 1.3.0 before commit queue writes\n',
    });
  });

  it('dispatches codex-exec last-message with injected stdin', async () => {
    const event = JSON.stringify({
      type: 'item.completed',
      item: { type: 'agent_message', text: 'Integration ok' },
    });
    const result = await runAgentToolsCli({
      argv: ['codex-exec', 'last-message'],
      env: {},
      cwd: '/repo',
      stdin: Readable.from(event),
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(result.stdout).toBe('Integration ok\n');
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

  it('dispatches coordination help through the single entrypoint', async () => {
    const result = await runAgentToolsCli({
      argv: ['coordination', '--help'],
      env: {},
      cwd: '/repo',
    });

    expect(result).toMatchObject({ exitCode: 0, stderr: '' });
    expect(result.stdout).toContain('coordination successor-name [--base <ref>]');
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
        '  context-cost',
        '  coordination',
        '  session-metadata',
        '  codex-exec',
        '  merge-bot',
        '  pr',
        '  pr-watch',
        '  spawn',
        '',
        'Error: unknown topic: unknown-topic',
        '',
      ].join('\n')}`,
    });
  });

  it.each(['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__'])(
    'treats the prototype-chain key %p as an unknown topic, not an inherited handler',
    async (protoKey) => {
      const result = await runAgentToolsCli({
        argv: [protoKey],
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
          '  context-cost',
          '  coordination',
          '  session-metadata',
          '  codex-exec',
          '  merge-bot',
          '  pr',
          '  pr-watch',
          '  spawn',
          '',
          `Error: unknown topic: ${protoKey}`,
          '',
        ].join('\n')}`,
      });
    },
  );

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
