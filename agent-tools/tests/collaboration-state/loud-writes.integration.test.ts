import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { ACTIVE_CLAIMS_SCHEMA_VERSION } from '../../src/collaboration-state/types';
import {
  makeTempCollaborationRepo,
  readText,
  removeDirectory,
  writeJson,
} from '../test-helpers/temp-collaboration-state';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

/**
 * Loud-write contract: every writing subcommand reports its write with an
 * explicit success token on stdout, and a write that matches nothing fails
 * loudly instead of silently no-opping. A successful invocation is provable
 * from its output alone — agents verify the token, not the filesystem.
 */

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const senderEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
} as const;

const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: senderEnv,
}).agentId;

const nowIso = '2026-06-11T07:00:00Z';
const seededClaimId = '4d2f8a1c-9b3e-4c5d-8e7f-0a1b2c3d4e5f';
const unmatchedClaimId = 'ffffffff-ffff-4fff-8fff-ffffffffffff';

describe('comms write commands report their writes', () => {
  it('comms append reports the written event id and path', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        nowIso,
        '--created-at',
        nowIso,
        '--title',
        'Loud append',
        '--body',
        'Loud body.',
        '--event-id',
        'loud-append',
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    // The reported event path is host-joined from the comms dir, so the
    // expectation is derived in host form (the POSIX literal on POSIX).
    expect(result.stdout).toBe(
      `wrote comms event loud-append to ${join('state/comms', 'loud-append.json')}\n`,
    );
  });

  it('comms append in heartbeat mode reports the written event id and path', async () => {
    // Seed the registry row the ADR-186 lifecycle shape derives its thread
    // from (no --thread passed here — this pins the derive path staying
    // loud-write green for armed heartbeat loops).
    const fake = createFakeCollaborationRuntime({
      activeClaims: {
        schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
        commit_queue: [],
        claims: [
          {
            claim_id: seededClaimId,
            agent_id: senderWithId,
            thread: 'loud-writes-thread',
            areas: [{ kind: 'git', patterns: ['fix/loud-writes'] }],
            claimed_at: nowIso,
            intent: 'loud-writes heartbeat seed',
          },
        ],
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        nowIso,
        '--created-at',
        nowIso,
        '--title',
        'Heartbeat: Wooded Spreading Thicket (5c8f3c) — loud-writes lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        seededClaimId,
        '--intent-id',
        'loud-writes',
        '--branch',
        'fix/loud-writes',
        '--current-cycle-label',
        'cycle-1',
        '--event-id',
        'loud-heartbeat',
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe(
      `wrote comms event loud-heartbeat to ${join('state/comms', 'loud-heartbeat.json')}\n`,
    );
  });

  it('comms render reports the shared log path it wrote', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'render',
        '--comms-dir',
        'state/comms',
        '--output',
        'state/shared-comms-log.md',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('wrote shared comms log to state/shared-comms-log.md\n');
    expect(fake.readTextFile('state/shared-comms-log.md')).toContain(
      '# Agent-to-Agent Shared Communication Log',
    );
  });
});

describe('claims write commands report their writes and fail loudly on no match', () => {
  it('claims close reports the closed claim id and archive destination', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const closedPath = join(repoRoot, '.agent/state/collaboration/closed-claims.archive.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'close',
          '--active',
          activePath,
          '--closed',
          closedPath,
          '--claim-id',
          seededClaimId,
          '--summary',
          'Boundary complete.',
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`closed claim ${seededClaimId} (archived to ${closedPath})\n`);
      expect(parsedClaims(await readText(activePath))).toHaveLength(0);
      expect(parsedClaims(await readText(closedPath))).toHaveLength(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims close exits non-zero and names the id when no active claim matches', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const closedPath = join(repoRoot, '.agent/state/collaboration/closed-claims.archive.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'close',
          '--active',
          activePath,
          '--closed',
          closedPath,
          '--claim-id',
          unmatchedClaimId,
          '--summary',
          'Nothing to close.',
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain(`no active claim matches ${unmatchedClaimId}`);
      expect(parsedClaims(await readText(activePath))).toHaveLength(1);
      expect(parsedClaims(await readText(closedPath))).toHaveLength(0);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims heartbeat reports the claim it touched', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'heartbeat',
          '--active',
          activePath,
          '--claim-id',
          seededClaimId,
          '--now',
          nowIso,
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`recorded heartbeat on claim ${seededClaimId}\n`);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims heartbeat exits non-zero and names the id when no active claim matches', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'heartbeat',
          '--active',
          activePath,
          '--claim-id',
          unmatchedClaimId,
          '--now',
          nowIso,
        ],
        env: {},
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain(`no active claim matches ${unmatchedClaimId}`);
      expect(await readText(activePath)).not.toContain('heartbeat_at');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims archive-stale reports 1 stale claim archived and the archive path', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const closedPath = join(repoRoot, '.agent/state/collaboration/closed-claims.archive.json');
    try {
      await seedActiveClaim(activePath, {
        claimed_at: '2026-06-01T00:00:00Z',
        freshness_seconds: 60,
      });

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'archive-stale',
          '--active',
          activePath,
          '--closed',
          closedPath,
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`archived 1 stale claim to ${closedPath}\n`);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims archive-stale reports 0 stale claims when none are stale', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const closedPath = join(repoRoot, '.agent/state/collaboration/closed-claims.archive.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'archive-stale',
          '--active',
          activePath,
          '--closed',
          closedPath,
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`archived 0 stale claims to ${closedPath}\n`);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims close defaults --closed to the coordination home when omitted (F-108)', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const defaultClosedPath = join(
      repoRoot,
      '.agent/state/collaboration/closed-claims.archive.json',
    );
    try {
      await seedActiveClaim(activePath);

      // No --closed; --repo-root makes the home resolution hermetic (the
      // resolveClosedPath repo-root branch short-circuits git), proving the
      // dispatcher composes withResolvedClosed onto the close handler — a revert
      // of that wiring would surface here as a missing-required-option error.
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'close',
          '--active',
          activePath,
          '--repo-root',
          repoRoot,
          '--claim-id',
          seededClaimId,
          '--summary',
          'Boundary complete.',
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(
        `closed claim ${seededClaimId} (archived to ${defaultClosedPath})\n`,
      );
      expect(parsedClaims(await readText(activePath))).toHaveLength(0);
      expect(parsedClaims(await readText(defaultClosedPath))).toHaveLength(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('claims archive-stale defaults --closed to the coordination home when omitted (F-108)', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    const defaultClosedPath = join(
      repoRoot,
      '.agent/state/collaboration/closed-claims.archive.json',
    );
    try {
      await seedActiveClaim(activePath, {
        claimed_at: '2026-06-01T00:00:00Z',
        freshness_seconds: 60,
      });

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'archive-stale',
          '--active',
          activePath,
          '--repo-root',
          repoRoot,
          '--now',
          nowIso,
          '--platform',
          sender.platform,
          '--model',
          sender.model,
        ],
        env: senderEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`archived 1 stale claim to ${defaultClosedPath}\n`);
      expect(parsedClaims(await readText(defaultClosedPath))).toHaveLength(1);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

describe('conversation and escalation write commands report their writes', () => {
  it('conversation append reports the file it appended to', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const conversationPath = join(
      repoRoot,
      '.agent/state/collaboration/conversations/loud-conversation.json',
    );
    try {
      await writeJson(conversationPath, conversationFixture());

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'conversation',
          'append',
          '--file',
          conversationPath,
          '--entry-json',
          JSON.stringify(conversationEntryFixture()),
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`appended entry to ${conversationPath}\n`);
      expect(await readText(conversationPath)).toContain('"entry-001"');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('escalation open reports the file it wrote', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const escalationPath = join(
      repoRoot,
      '.agent/state/collaboration/escalations/loud-escalation.json',
    );
    try {
      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'escalation',
          'open',
          '--file',
          escalationPath,
          '--body-json',
          JSON.stringify(escalationFixture()),
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`wrote ${escalationPath}\n`);
      expect(await readText(escalationPath)).toContain('"loud-escalation"');
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

async function seedActiveClaim(
  activePath: string,
  overrides: { readonly claimed_at?: string; readonly freshness_seconds?: number } = {},
): Promise<void> {
  await writeJson(activePath, {
    schema_version: '1.3.0',
    commit_queue: [],
    claims: [
      {
        claim_id: seededClaimId,
        agent_id: senderWithId,
        thread: 'eef',
        areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
        claimed_at: overrides.claimed_at ?? '2026-06-11T06:00:00Z',
        freshness_seconds: overrides.freshness_seconds ?? 14400,
        sidebar_open: false,
        intent: 'Loud-write contract test claim.',
      },
    ],
  });
}

function parsedClaims(text: string): readonly unknown[] {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed === 'object' && parsed !== null && 'claims' in parsed) {
    const { claims } = parsed;
    if (Array.isArray(claims)) {
      return claims;
    }
  }
  throw new Error('expected a claims registry document');
}

function conversationFixture(): unknown {
  return {
    schema_version: '1.0.0',
    conversation_id: 'loud-conversation',
    thread: 'eef',
    status: 'open',
    title: 'Loud-write contract conversation',
    participants: [
      {
        agent_name: sender.agent_name,
        platform: sender.platform,
        model: sender.model,
        session_id_prefix: sender.session_id_prefix,
      },
    ],
    opened_at: nowIso,
    entries: [],
  };
}

function conversationEntryFixture(): unknown {
  return {
    entry_id: 'entry-001',
    kind: 'message',
    created_at: nowIso,
    author: {
      agent_name: sender.agent_name,
      platform: sender.platform,
      model: sender.model,
      session_id_prefix: sender.session_id_prefix,
    },
    body: 'Loud-write contract entry.',
  };
}

function escalationFixture(): unknown {
  return {
    schema_version: '1.0.0',
    escalation_id: 'loud-escalation',
    status: 'open',
    thread: 'eef',
    conversation_id: 'loud-conversation',
    originating_entry_id: 'entry-001',
    title: 'Loud-write contract escalation',
    opened_at: nowIso,
    opened_by: {
      agent_name: sender.agent_name,
      platform: sender.platform,
      model: sender.model,
      session_id_prefix: sender.session_id_prefix,
    },
    owner_action_requested: 'Confirm the loud-write contract.',
    reason: 'Contract test.',
  };
}
