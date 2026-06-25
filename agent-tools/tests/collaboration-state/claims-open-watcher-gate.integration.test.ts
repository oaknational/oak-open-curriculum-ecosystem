/**
 * Integration coverage for the F-95 claims-open precondition through the real
 * CLI dispatcher and filesystem: opening a claim into a registry that already
 * holds another live agent is refused (exit 2, registry unmutated) when this
 * session has no live comms watcher, and allowed (exit 0, claim appended) when
 * a fresh heartbeat exists at the session-derived path. A solo registry opens
 * with no watcher (the bootstrap fast-path).
 */
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import {
  makeTempCollaborationRepo,
  readText,
  removeDirectory,
  writeJson,
  writeText,
} from '../test-helpers/temp-collaboration-state';

const claimer = {
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  agent_name: 'Seal hunts Offing',
  session_id_prefix: '8210d6',
} as const;
const claimerEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: claimer.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: claimer.session_id_prefix,
} as const;

const other = deriveCollaborationIdentity({
  platform: 'codex',
  model: 'GPT-5',
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: 'Woodland Creeping Petal',
    PRACTICE_AGENT_SESSION_ID_CODEX: '019dd3',
  },
}).agentId;

const nowIso = '2026-06-25T08:00:00.000Z';

function heartbeatText(): string {
  return JSON.stringify({
    schema_version: '0.1.0',
    pid: 1,
    started_at: nowIso,
    last_drain_at: nowIso,
    last_emit_at: nowIso,
    last_error_at: null,
    emitted_count: 2,
    heartbeat_interval_ms: 30000,
    watcher_identity: {
      ...claimer,
      id: '8210d600-0000-5000-8000-000000000000',
      naming_schema_version: 'override',
    },
  });
}

function openArgv(activePath: string, commsSeenDir: string): readonly string[] {
  return [
    '--',
    'claims',
    'open',
    '--active',
    activePath,
    '--thread',
    'agentic-engineering-enhancements',
    '--area-kind',
    'files',
    '--area-pattern',
    'agent-tools/src/**',
    '--intent',
    'F-95 gate integration test.',
    '--now',
    nowIso,
    '--platform',
    claimer.platform,
    '--model',
    claimer.model,
    '--comms-seen-dir',
    commsSeenDir,
  ];
}

async function seedRegistry(activePath: string, withOtherLiveAgent: boolean): Promise<void> {
  await writeJson(activePath, {
    schema_version: '1.3.0',
    commit_queue: [],
    claims: withOtherLiveAgent
      ? [
          {
            claim_id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
            agent_id: other,
            thread: 'eef',
            areas: [{ kind: 'files', patterns: ['packages/**'] }],
            claimed_at: nowIso,
            freshness_seconds: 14400,
            sidebar_open: false,
            intent: 'Another live agent.',
          },
        ]
      : [],
  });
}

function claimCount(text: string): number {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed === 'object' && parsed !== null && 'claims' in parsed) {
    const { claims } = parsed;
    if (Array.isArray(claims)) {
      return claims.length;
    }
  }
  throw new Error('expected a claims registry');
}

describe('claims open watcher precondition (F-95)', () => {
  it('refuses to open into a populated registry with no live watcher, leaving it unmutated', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const commsSeenDir = join(repoRoot, '.agent/state/collaboration/comms-seen');
    try {
      await seedRegistry(activePath, true);

      const result = await runCollaborationStateCli({
        argv: openArgv(activePath, commsSeenDir),
        env: claimerEnv,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain('blind to comms');
      expect(claimCount(await readText(activePath))).toBe(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('opens into a populated registry when a fresh watcher heartbeat is present', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const commsSeenDir = join(repoRoot, '.agent/state/collaboration/comms-seen');
    try {
      await seedRegistry(activePath, true);
      await writeText(
        join(commsSeenDir, `${claimer.agent_name}.json.heartbeat.json`),
        heartbeatText(),
      );

      const result = await runCollaborationStateCli({
        argv: openArgv(activePath, commsSeenDir),
        env: claimerEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(claimCount(await readText(activePath))).toBe(2);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('opens a solo registry with no watcher (bootstrap fast-path)', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const commsSeenDir = join(repoRoot, '.agent/state/collaboration/comms-seen');
    try {
      await seedRegistry(activePath, false);

      const result = await runCollaborationStateCli({
        argv: openArgv(activePath, commsSeenDir),
        env: claimerEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(claimCount(await readText(activePath))).toBe(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
