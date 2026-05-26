import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  archiveStaleClaims,
  createCommsEvent,
  deriveCollaborationIdentity,
  runCollaborationStateCli,
  updateJsonFileWithRetry,
  updateJsonStateWithRetry,
  validateSharedStateAgentId,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationRegistry,
} from '../../src/collaboration-state';
import {
  closeSummaryFromOptions,
  createClaimFromOptions,
  formatOpenClaimResult,
} from '../../src/collaboration-state/cli-claim-commands';
import {
  commsSendDefaults,
  formatCommsSendResult,
} from '../../src/collaboration-state/cli-comms-commands';
import { claimReport } from '../../src/collaboration-state/claim-reports';
import { parseOptions, type Options } from '../../src/collaboration-state/cli-options';

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
    const result = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });

    expect(result.seed_source).toBe('CODEX_THREAD_ID');
    expect(result.agentId).toMatchObject(woodland);
    expect(result.agentId.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
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

  it('fails identity preflight when an id-keyed claim shares the routing id but uses a different model', async () => {
    // PDR-076a: same (name, id) with different model is a live collision.
    const envDerived = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    }).agentId;
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-preflight-'));
    const activePath = join(tempDir, 'active.json');
    const registry: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [claim({ agent_id: { ...envDerived, model: 'GPT-5.1' } })],
    };
    await writeFile(activePath, `${JSON.stringify(registry)}\n`);

    try {
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'identity',
          'preflight',
          '--platform',
          'codex',
          '--model',
          'GPT-5',
          '--active',
          activePath,
          '--now',
          nowIso,
        ],
        env: { CODEX_THREAD_ID: codexThreadId },
      });

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain('collides with live identity');
      expect(result.stderr).toContain('GPT-5.1');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('accepts command-only check flags without a topic', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'collaboration-state-check-'));
    const activePath = join(tempDir, 'active.json');
    const closedPath = join(tempDir, 'closed.json');
    const eventsDir = join(tempDir, 'events');
    await writeFile(activePath, '{"schema_version":"1.3.0","commit_queue":[],"claims":[]}\n');
    await writeFile(closedPath, '{"schema_version":"1.3.0","claims":[]}\n');

    try {
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'check',
          '--active',
          activePath,
          '--closed',
          closedPath,
          '--comms-dir',
          eventsDir,
        ],
        env: {},
      });

      expect(result).toStrictEqual({ exitCode: 0, stdout: 'ok\n', stderr: '' });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('parses repeated area-pattern flags as an ordered collection', () => {
    const parsed = parseOptions([
      '--',
      'claims',
      'open',
      '--area-pattern',
      'agent-tools/src/collaboration-state/cli-options.ts',
      '--area-pattern',
      'agent-tools/src/collaboration-state/cli-claim-commands.ts',
    ]);

    expect(parsed).toMatchObject({
      files: [],
      areaPatterns: [
        'agent-tools/src/collaboration-state/cli-options.ts',
        'agent-tools/src/collaboration-state/cli-claim-commands.ts',
      ],
    });
  });

  it('parses repeated file flags as an ordered collection', () => {
    const parsed = parseOptions([
      '--',
      'claims',
      'open',
      '--file',
      'agent-tools/src/collaboration-state/cli-options.ts',
      '--file',
      'agent-tools/src/collaboration-state/cli-claim-commands.ts',
    ]);

    expect(parsed).toMatchObject({
      files: [
        'agent-tools/src/collaboration-state/cli-options.ts',
        'agent-tools/src/collaboration-state/cli-claim-commands.ts',
      ],
      areaPatterns: [],
    });
  });

  it('parses repeated tag flags as an ordered collection', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'append',
      '--tag',
      'heartbeat',
      '--tag',
      'behaviour-note',
    ]);

    expect(parsed).toMatchObject({
      tags: ['heartbeat', 'behaviour-note'],
      files: [],
      areaPatterns: [],
    });
  });

  it('exposes an empty tags array when no --tag is provided', () => {
    const parsed = parseOptions(['--', 'comms', 'append', '--title', 'no tags here']);

    expect(parsed.tags).toStrictEqual([]);
  });

  it('builds claim areas from repeated area-pattern values', () => {
    const opened = createClaimFromOptions(
      options(
        {
          active: 'active.json',
          thread: 'agentic-engineering-enhancements',
          'area-kind': 'files',
          intent: 'Exercise area pattern claim construction.',
          now: nowIso,
          'claim-id': '33333333-3333-4333-8333-333333333333',
        },
        [],
        [
          'agent-tools/src/collaboration-state/cli-options.ts',
          'agent-tools/src/collaboration-state/cli-claim-commands.ts',
        ],
      ),
      woodland,
    );

    expect(opened).toMatchObject({
      claim_id: '33333333-3333-4333-8333-333333333333',
      areas: [
        {
          patterns: [
            'agent-tools/src/collaboration-state/cli-options.ts',
            'agent-tools/src/collaboration-state/cli-claim-commands.ts',
          ],
        },
      ],
    });
  });

  it('rejects mixed file and area-pattern sources when opening a claim', async () => {
    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'claims',
        'open',
        '--active',
        'active.json',
        '--thread',
        'agentic-engineering-enhancements',
        '--area-kind',
        'files',
        '--file',
        'agent-tools/src/collaboration-state/cli-options.ts',
        '--area-pattern',
        'agent-tools/src/collaboration-state/cli-claim-commands.ts',
        '--intent',
        'Exercise mixed area source validation.',
        '--now',
        nowIso,
        '--platform',
        'cursor',
        '--model',
        'GPT-5.5',
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: 'Moonlit Transiting Prism',
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'e86710',
      },
    });

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(
      'Error: claims open accepts either --file or --area-pattern, not both',
    );
  });

  it('returns help for top-level, topic, and action requests', async () => {
    const topLevel = await runCollaborationStateCli({ argv: ['--', 'help'], env: {} });
    expect(topLevel.exitCode).toBe(0);
    expect(topLevel.stdout).toContain('claims         open, heartbeat, close');

    const topic = await runCollaborationStateCli({ argv: ['--', 'claims', 'help'], env: {} });
    expect(topic.exitCode).toBe(0);
    expect(topic.stdout).toContain('claims status --active <path>');

    const action = await runCollaborationStateCli({
      argv: ['--', 'claims', 'open', '--help'],
      env: {},
    });
    expect(action.exitCode).toBe(0);
    expect(action.stdout).toContain('claims open --active <path>');
    expect(action.stdout).toContain('--area-kind <files|workspace|plan|adr|git>');
    expect(action.stdout).toContain('use either repeatable --file or repeatable --area-pattern');
  });

  it('reports unknown options before missing required options', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'claims', 'open', '--bogus'],
      env: {},
    });

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('unknown option for claims open: --bogus');
  });

  it('reports command-specific unknown options before missing required options', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'claims', 'list', '--thread', 'wrong-place'],
      env: {},
    });

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('claims list --active <path> [--now <iso>]');
  });

  it('prints command help with the specific validation error', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'claims', 'open', '--bogus'],
      env: {},
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('claims open --active <path>');
    expect(result.stderr).toContain('Error: unknown option for claims open: --bogus');
  });

  it('lists supported area kinds when an unsupported kind is supplied', async () => {
    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'claims',
        'open',
        '--active',
        'active.json',
        '--thread',
        'agentic-engineering-enhancements',
        '--area-kind',
        'file',
        '--file',
        'agent-tools/src/collaboration-state/cli-options.ts',
        '--intent',
        'Exercise area kind validation.',
        '--now',
        nowIso,
        '--platform',
        'cursor',
        '--model',
        'GPT-5.5',
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: 'Moonlit Transiting Prism',
        PRACTICE_AGENT_SESSION_ID_CURSOR: 'e86710',
      },
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('claims open --active <path>');
    expect(result.stderr).toContain(
      'Error: unsupported area kind: file. Expected one of: files | workspace | plan | adr | git',
    );
  });

  it('documents identity seed inputs in comms send help', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'send', '--help'],
      env: {},
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('PRACTICE_AGENT_SESSION_ID_CURSOR');
    expect(result.stdout).toContain('OAK_AGENT_IDENTITY_OVERRIDE');
  });

  it('does not fall back to production IO for imported comms commands', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'render', '--comms-dir', 'state/comms', '--output', 'state/log.md'],
      env: {},
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain(
      'collaboration-state CLI IO must be provided by the composition layer',
    );
  });

  it('resolves closure-summary as an alias for summary', () => {
    expect(closeSummaryFromOptions(options({ 'closure-summary': 'Closed via alias.' }))).toBe(
      'Closed via alias.',
    );
    expect(() =>
      closeSummaryFromOptions(
        options({ summary: 'Primary summary.', 'closure-summary': 'Alias summary.' }),
      ),
    ).toThrow('claims close accepts either --summary or --closure-summary, not both');
    expect(() => closeSummaryFromOptions(options({}))).toThrow(
      'claims close requires either --summary or --closure-summary',
    );
  });

  it('prints comms send help when an identity-name flag is unsupported', async () => {
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'send', '--agent-name', 'Moonlit Transiting Prism'],
      env: {},
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('comms send --title <title>');
    expect(result.stderr).toContain('PRACTICE_AGENT_SESSION_ID_CURSOR');
    expect(result.stderr).toContain('Error: unknown option for comms send: --agent-name');
  });
});

describe('claim CLI reports', () => {
  it('formats the full claim id when opening a claim', () => {
    const opened = createClaimFromOptions(
      options(
        {
          active: 'active.json',
          thread: 'agentic-engineering-enhancements',
          'area-kind': 'files',
          intent: 'Exercise structured claim output.',
          now: nowIso,
          'claim-id': '22222222-2222-4222-8222-222222222222',
        },
        ['agent-tools/src/collaboration-state/cli.ts'],
      ),
      woodland,
    );

    expect(JSON.parse(formatOpenClaimResult(opened))).toMatchObject({
      claim_id: '22222222-2222-4222-8222-222222222222',
      claim: {
        claim_id: '22222222-2222-4222-8222-222222222222',
        areas: [{ patterns: ['agent-tools/src/collaboration-state/cli.ts'] }],
      },
    });
  });

  it('formats freshness from heartbeat or claimed timestamp without schema fields', () => {
    expect(
      claimReport(
        claim({
          claimed_at: '2026-04-28T09:00:00Z',
          heartbeat_at: '2026-04-28T09:30:00Z',
          freshness_seconds: 900,
        }),
        nowIso,
      ),
    ).toMatchObject({
      fresh_until: '2026-04-28T09:45:00.000Z',
      freshness_status: 'fresh',
      age_seconds: 431,
    });
    expect(
      claimReport(
        claim({
          claimed_at: '2026-04-28T08:00:00Z',
          freshness_seconds: 60,
        }),
        nowIso,
      ),
    ).toMatchObject({
      freshness_status: 'stale',
    });
  });

  it('builds comms send defaults from the repo root', () => {
    expect(commsSendDefaults(options({ 'repo-root': '/repo' }), nowIso, 'event-one')).toStrictEqual(
      {
        'comms-dir': '/repo/.agent/state/collaboration/comms',
        active: '/repo/.agent/state/collaboration/active-claims.json',
        now: nowIso,
        'created-at': nowIso,
        'event-id': 'event-one',
        output: '/repo/.agent/state/collaboration/shared-comms-log.md',
      },
    );
  });

  it('formats comms send output from resolved write paths', () => {
    expect(
      formatCommsSendResult(
        options({ 'comms-dir': '/custom/comms', output: '/custom/shared-comms-log.md' }),
        'event-one',
      ),
    ).toBe(
      '{\n' +
        '  "event_id": "event-one",\n' +
        '  "event_path": "/custom/comms/event-one.json",\n' +
        '  "shared_log_path": "/custom/shared-comms-log.md"\n' +
        '}\n',
    );
  });
});

describe('createCommsEvent', () => {
  it('rejects malformed and future UTC timestamps', () => {
    expect(() =>
      createCommsEvent(
        {
          schema_version: '2.0.0',
          event_id: 'event-one',
          created_at: '2026-04-28T10:00:00Z',
          kind: 'narrative',
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
          schema_version: '2.0.0',
          event_id: 'event-two',
          created_at: '2026-04-28 09:37:11',
          kind: 'narrative',
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
          schema_version: '2.0.0',
          event_id: 'event-one',
          created_at: nowIso,
          kind: 'narrative',
          author: woodland,
          title: 'duplicate event',
          body: 'Duplicate event ids would overwrite immutable history.',
        },
        { nowIso, existingEventIds: ['event-one'] },
      ),
    ).toThrow('communication event already exists: event-one');
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

function options(
  values: Readonly<Record<string, string>>,
  files: readonly string[] = [],
  areaPatterns: readonly string[] = [],
  tags: readonly string[] = [],
): Options {
  const parsedValues = new Map<string, string>();
  for (const key in values) {
    parsedValues.set(key, values[key] ?? '');
  }

  return {
    command: undefined,
    topic: undefined,
    values: parsedValues,
    files,
    areaPatterns,
    tags,
  };
}
