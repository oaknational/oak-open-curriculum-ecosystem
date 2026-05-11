import { describe, expect, it } from 'vitest';

import {
  runCommitQueueCli,
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueRegistry,
} from '../src/commit-queue';
import { type CommitQueueCliOptions } from '../src/commit-queue/types';

const agentId: CommitQueueAgentId = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
};

function intent(overrides: Partial<CommitIntent> = {}): CommitIntent {
  return {
    intent_id: '11111111-1111-4111-8111-111111111111',
    claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    agent_id: agentId,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): add commit queue helper',
    queued_at: '2026-04-27T07:20:00Z',
    updated_at: '2026-04-27T07:20:00Z',
    expires_at: '2026-04-27T07:35:00Z',
    phase: 'queued',
    ...overrides,
  };
}

function registry(): CommitQueueRegistry {
  return {
    schema_version: '1.3.0',
    claims: [],
    commit_queue: [
      intent(),
      intent({
        intent_id: '22222222-2222-4222-8222-222222222222',
        agent_id: {
          ...agentId,
          agent_name: 'Prismatic Waxing Anchor',
        },
        phase: 'pre_commit',
        expires_at: '2026-04-27T07:00:00Z',
      }),
    ],
  };
}

function stdoutBuffer(): { readonly stdout: { write(chunk: string): void }; text(): string } {
  const chunks: string[] = [];
  return {
    stdout: {
      write(chunk: string): void {
        chunks.push(chunk);
      },
    },
    text(): string {
      return chunks.join('');
    },
  };
}

interface WriteCommandNowCase {
  readonly command: string;
  readonly options: CommitQueueCliOptions;
}

const writeCommandNowCases: readonly WriteCommandNowCase[] = [
  {
    command: 'enqueue',
    options: {
      file: ['agent-tools/src/commit-queue/index.ts'],
      'claim-id': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'agent-name': 'Prismatic Waxing Constellation',
      platform: 'codex',
      model: 'gpt-5.5',
      'session-id-prefix': '019dcd',
      'commit-subject': 'feat(queue): add commit queue helper',
      now: '2099-01-01T00:00:00Z',
    },
  },
  {
    command: 'phase',
    options: {
      file: [],
      'intent-id': '11111111-1111-4111-8111-111111111111',
      phase: 'staging',
      now: '2099-01-01T00:00:00Z',
    },
  },
  {
    command: 'record-staged',
    options: {
      file: [],
      'intent-id': '11111111-1111-4111-8111-111111111111',
      now: '2099-01-01T00:00:00Z',
    },
  },
  {
    command: 'verify-staged',
    options: {
      file: [],
      'intent-id': '11111111-1111-4111-8111-111111111111',
      'commit-subject': 'feat(queue): add commit queue helper',
      now: '2099-01-01T00:00:00Z',
    },
  },
  {
    command: 'complete',
    options: {
      file: [],
      'intent-id': '11111111-1111-4111-8111-111111111111',
      now: '2099-01-01T00:00:00Z',
    },
  },
];

describe('commit-queue CLI read commands', () => {
  it('dispatches status to the aggregate queue report', async () => {
    const output = stdoutBuffer();

    await expect(
      runCommitQueueCli({
        command: 'status',
        options: { file: [], now: '2026-04-27T07:25:00Z' },
        repoRoot: '/repo',
        readRegistry: async () => registry(),
        stdout: output.stdout,
      }),
    ).resolves.toBe(0);

    expect(JSON.parse(output.text())).toMatchObject({
      total: 2,
      active: 1,
      expired: 1,
    });
  });

  it('dispatches list with intent, lifecycle, agent, and queue-status filters', async () => {
    const output = stdoutBuffer();

    await expect(
      runCommitQueueCli({
        command: 'list',
        options: {
          file: [],
          prefix: '2222',
          phase: 'pre_commit',
          'agent-name': 'Prismatic Waxing A',
          'queue-status': 'expired',
          now: '2026-04-27T07:25:00Z',
        },
        repoRoot: '/repo',
        readRegistry: async () => registry(),
        stdout: output.stdout,
      }),
    ).resolves.toBe(0);

    expect(JSON.parse(output.text()).map((entry: CommitIntent) => entry.intent_id)).toStrictEqual([
      '22222222-2222-4222-8222-222222222222',
    ]);
  });

  it('dispatches show to one exact queue entry', async () => {
    const output = stdoutBuffer();

    await expect(
      runCommitQueueCli({
        command: 'show',
        options: {
          file: [],
          'intent-id': '22222222-2222-4222-8222-222222222222',
          now: '2026-04-27T07:25:00Z',
        },
        repoRoot: '/repo',
        readRegistry: async () => registry(),
        stdout: output.stdout,
      }),
    ).resolves.toBe(0);

    expect(JSON.parse(output.text())).toMatchObject({
      intent_id: '22222222-2222-4222-8222-222222222222',
      queue_status: 'expired',
    });
  });

  it('rejects unknown options for status', async () => {
    await expect(
      runCommitQueueCli({
        command: 'status',
        options: { file: [], 'claim-id': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' },
        repoRoot: '/repo',
      }),
    ).rejects.toThrow('unknown option for commit-queue status: --claim-id');
  });

  it.each(writeCommandNowCases)(
    'rejects operational --now overrides for $command',
    async ({ command, options }) => {
      await expect(
        runCommitQueueCli({
          command,
          options,
          repoRoot: '/repo',
        }),
      ).rejects.toThrow(`unknown option for commit-queue ${command}: --now`);
    },
  );

  it('reports usage for prototype-named unknown commands with options', async () => {
    await expect(
      runCommitQueueCli({
        command: 'constructor',
        options: { file: [], 'intent-id': '11111111-1111-4111-8111-111111111111' },
        repoRoot: '/repo',
      }),
    ).rejects.toThrow('Usage: pnpm agent-tools:commit-queue');
  });

  it('rejects calendar-overflow inspection clocks', async () => {
    await expect(
      runCommitQueueCli({
        command: 'status',
        options: { file: [], now: '2026-02-31T07:25:00Z' },
        repoRoot: '/repo',
        readRegistry: async () => registry(),
      }),
    ).rejects.toThrow('invalid ISO date-time for --now: 2026-02-31T07:25:00Z');
  });
});
