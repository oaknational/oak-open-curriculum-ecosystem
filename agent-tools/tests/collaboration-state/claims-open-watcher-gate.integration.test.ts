/**
 * Integration coverage for the F-95 claims-open precondition through the real
 * CLI dispatcher and filesystem. `claims open` exposes NO comms-seen path
 * override by design (a planted heartbeat must not satisfy the load-bearing
 * backstop), so these cases exercise the canonical default dir
 * (`.agent/state/collaboration/comms-seen`, resolved relative to the process
 * cwd) directly:
 *
 * - a solo registry opens with no watcher (the bootstrap fast-path — no dir
 *   dependency at all);
 * - opening into a registry that already holds another live agent is refused
 *   (exit 2, registry unmutated) because this session has no live comms
 *   watcher at the canonical path.
 *
 * The "populated + live watcher → opens" path is identity- and IO-bound and is
 * covered deterministically by the unit suite (injected `WatcherStalenessIo`);
 * reproducing it here would require planting a heartbeat at the canonical path,
 * the very override this gate refuses to expose.
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

function openArgv(activePath: string): readonly string[] {
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
    try {
      await seedRegistry(activePath, true);

      const result = await runCollaborationStateCli({
        argv: openArgv(activePath),
        env: claimerEnv,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain('blind to comms');
      expect(claimCount(await readText(activePath))).toBe(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('opens a solo registry with no watcher (bootstrap fast-path)', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedRegistry(activePath, false);

      const result = await runCollaborationStateCli({
        argv: openArgv(activePath),
        env: claimerEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(claimCount(await readText(activePath))).toBe(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
