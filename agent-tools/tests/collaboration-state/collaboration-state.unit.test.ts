import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  archiveStaleClaims,
  createCommsEvent,
  deriveCollaborationIdentity,
  renderSharedCommsLog,
  runCollaborationStateCli,
  updateJsonFileWithRetry,
  updateJsonStateWithRetry,
  validateSharedStateAgentId,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationRegistry,
} from '../../src/collaboration-state';

const codexThreadId = '019dd34d-cb6a-74e0-a29d-6cb8a65ea14b';
const nowIso = '2026-04-28T09:37:11Z';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

interface CounterState {
  readonly value: number;
}

function claim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: '11111111-1111-4111-8111-111111111111',
    agent_id: woodland,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/shared-comms-log.md'] }],
    claimed_at: '2026-04-28T08:00:00Z',
    freshness_seconds: 14400,
    intent: 'Test collaboration-state write safety.',
    ...overrides,
  };
}

describe('deriveCollaborationIdentity', () => {
  it('derives distinct Codex state identity from CODEX_THREAD_ID', () => {
    expect(
      deriveCollaborationIdentity({
        platform: 'codex',
        model: 'GPT-5',
        env: { CODEX_THREAD_ID: codexThreadId },
      }),
    ).toStrictEqual({
      agentId: woodland,
      seed_source: 'CODEX_THREAD_ID',
    });
  });

  it('rejects Codex/unknown shared-state writes when CODEX_THREAD_ID is present', () => {
    expect(
      validateSharedStateAgentId({
        agentId: {
          agent_name: 'Codex',
          platform: 'codex',
          model: 'GPT-5',
          session_id_prefix: 'unknown',
        },
        env: { CODEX_THREAD_ID: codexThreadId },
      }),
    ).toStrictEqual({
      ok: false,
      reason:
        'codex shared-state writes must use CODEX_THREAD_ID-derived identity when CODEX_THREAD_ID is present',
    });
  });
});

describe('runCollaborationStateCli', () => {
  it('accepts the root pnpm -- argument separator before commands', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'identity', 'preflight', '--platform', 'codex', '--model', 'GPT-5'],
      env: { CODEX_THREAD_ID: codexThreadId },
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('"session_id_prefix": "019dd3"');
  });

  it('accepts command-only check flags without a topic', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-check-'));
    const activePath = join(tempDir, 'active.json');
    const closedPath = join(tempDir, 'closed.json');
    await writeFile(activePath, '{"schema_version":"1.3.0","commit_queue":[],"claims":[]}\n');
    await writeFile(closedPath, '{"schema_version":"1.3.0","claims":[]}\n');

    try {
      const result = await runCollaborationStateCli({
        argv: ['--', 'check', '--active', activePath, '--closed', closedPath],
        env: {},
      });

      expect(result).toStrictEqual({ exitCode: 0, stdout: 'ok\n', stderr: '' });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe('createCommsEvent', () => {
  it('rejects malformed and future UTC timestamps', () => {
    expect(() =>
      createCommsEvent(
        {
          event_id: 'event-one',
          created_at: '2026-04-28T10:00:00Z',
          author: woodland,
          title: 'future event',
          body: 'This should not render yet.',
        },
        { nowIso },
      ),
    ).toThrow('created_at must not be in the future');

    expect(() =>
      createCommsEvent(
        {
          event_id: 'event-two',
          created_at: '2026-04-28 09:37:11',
          author: woodland,
          title: 'local-looking event',
          body: 'This lacks the UTC Z suffix.',
        },
        { nowIso },
      ),
    ).toThrow('created_at must be UTC ISO 8601 with trailing Z');
  });

  it('rejects duplicate immutable communication event ids', () => {
    expect(() =>
      createCommsEvent(
        {
          event_id: 'event-one',
          created_at: nowIso,
          author: woodland,
          title: 'duplicate event',
          body: 'Duplicate event ids would overwrite immutable history.',
        },
        { nowIso, existingEventIds: ['event-one'] },
      ),
    ).toThrow('communication event already exists: event-one');
  });
});

describe('renderSharedCommsLog', () => {
  it('renders immutable communication events chronologically', () => {
    const rendered = renderSharedCommsLog({
      events: [
        createCommsEvent(
          {
            event_id: 'event-two',
            created_at: '2026-04-28T09:05:00Z',
            author: woodland,
            title: 'second event',
            body: 'Rendered second.',
          },
          { nowIso },
        ),
        createCommsEvent(
          {
            event_id: 'event-one',
            created_at: '2026-04-28T09:00:00Z',
            author: woodland,
            title: 'first event',
            body: 'Rendered first.',
          },
          { nowIso },
        ),
      ],
    });

    expect(rendered.indexOf('first event')).toBeLessThan(rendered.indexOf('second event'));
    expect(rendered).toContain('# Agent-to-Agent Shared Communication Log');
    expect(rendered).toContain('Rendered first.\n\n---\n\n## 2026-04-28T09:05:00Z');
  });
});

describe('archiveStaleClaims', () => {
  it('archives stale claims without marking work successful', () => {
    const active: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [
        claim({
          claimed_at: '2026-04-28T08:00:00Z',
          freshness_seconds: 900,
        }),
        claim({
          claim_id: '22222222-2222-4222-8222-222222222222',
          claimed_at: '2026-04-28T09:30:00Z',
          freshness_seconds: 14400,
        }),
      ],
    };

    const archived = archiveStaleClaims({
      active,
      closed: { schema_version: '1.3.0', claims: [] },
      nowIso,
      closedBy: woodland,
    });

    expect(archived.active.claims).toHaveLength(1);
    expect(archived.closed.claims).toMatchObject([
      {
        claim_id: '11111111-1111-4111-8111-111111111111',
        closure: {
          kind: 'stale',
          summary: 'Archived stale/orphaned claim after its freshness TTL expired.',
        },
      },
    ]);
  });
});

describe('updateJsonStateWithRetry', () => {
  it('retries when the state text changes between read and write', async () => {
    const writes: string[] = [];
    const reads = ['{"value":1}\n', '{"value":2}\n', '{"value":2}\n'];

    const result = await updateJsonStateWithRetry({
      maxAttempts: 3,
      parseText: parseCounterState,
      readText: () => reads.shift() ?? '{"value":2}\n',
      writeText: (value) => {
        writes.push(value);
      },
      transform: (value: { readonly value: number }) => ({
        value: value.value + 1,
      }),
    });

    expect(result).toStrictEqual({ attempts: 2 });
    expect(writes).toStrictEqual(['{\n  "value": 3\n}\n']);
  });
});

describe('updateJsonFileWithRetry', () => {
  it('serializes concurrent JSON file updates without lost writes', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-'));
    const statePath = join(tempDir, 'counter.json');
    await writeFile(statePath, '{"value":0}\n');

    try {
      await Promise.all(
        Array.from({ length: 5 }, () =>
          updateJsonFileWithRetry({
            filePath: statePath,
            maxAttempts: 3,
            parseText: parseCounterState,
            transform: (value) => ({ value: value.value + 1 }),
          }),
        ),
      );

      expect(parseCounterState(await readFile(statePath, 'utf8'))).toStrictEqual({ value: 5 });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});

function parseCounterState(text: string): CounterState {
  const parsed: unknown = JSON.parse(text);
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'value' in parsed &&
    typeof parsed.value === 'number'
  ) {
    return { value: parsed.value };
  }

  throw new Error('invalid counter state');
}
