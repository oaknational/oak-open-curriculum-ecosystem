/**
 * Integration coverage for the PDR-063 handoff subcommands (F-94) through the
 * real CLI dispatcher: `claims set-handoff` records a pointer and fails loud on
 * an unmatched id; `claims adopt` rewrites the claim's agent_id to the ADOPTING
 * session's derived identity (not the retiree's) and fails loud on an unmatched
 * id. Writes go through the locked transactional registry, so a no-match leaves
 * the file unmutated.
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

const retiree = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
} as const;

const retireeEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: retiree.agent_name,
  PRACTICE_AGENT_SESSION_ID_CODEX: retiree.session_id_prefix,
} as const;

const successor = {
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  agent_name: 'Seal hunts Offing',
  session_id_prefix: '8210d6',
} as const;

const successorEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: successor.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: successor.session_id_prefix,
} as const;

const retireeWithId = deriveCollaborationIdentity({
  platform: retiree.platform,
  model: retiree.model,
  env: retireeEnv,
}).agentId;

const nowIso = '2026-06-25T08:00:00Z';
const seededClaimId = '4d2f8a1c-9b3e-4c5d-8e7f-0a1b2c3d4e5f';
const unmatchedClaimId = 'ffffffff-ffff-4fff-8fff-ffffffffffff';
const handoffPath = `.agent/state/collaboration/handoffs/${seededClaimId}.md`;

describe('claims set-handoff', () => {
  it('records the handoff-record pointer and reports it', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'set-handoff',
          '--active',
          activePath,
          '--claim-id',
          seededClaimId,
          '--path',
          handoffPath,
        ],
        env: {},
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(
        `set handoff record on claim ${seededClaimId} to ${handoffPath}\n`,
      );
      expect(await readText(activePath)).toContain(handoffPath);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('exits non-zero and leaves the file unchanged when no active claim matches', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'set-handoff',
          '--active',
          activePath,
          '--claim-id',
          unmatchedClaimId,
          '--path',
          handoffPath,
        ],
        env: {},
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain(`no active claim matches ${unmatchedClaimId}`);
      expect(await readText(activePath)).not.toContain('handoff_record_path');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('rejects a path outside the handoffs directory', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'set-handoff',
          '--active',
          activePath,
          '--claim-id',
          seededClaimId,
          '--path',
          '.agent/state/collaboration/comms/x.json',
        ],
        env: {},
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain('handoff record path must be under');
      expect(await readText(activePath)).not.toContain('handoff_record_path');
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

describe('claims adopt', () => {
  it("rewrites the claim agent_id to the adopting session's identity, not the retiree's", async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'adopt',
          '--active',
          activePath,
          '--claim-id',
          seededClaimId,
          '--platform',
          successor.platform,
          '--model',
          successor.model,
        ],
        env: successorEnv,
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(`adopted claim ${seededClaimId} as ${successor.agent_name}\n`);

      const written = await readText(activePath);
      expect(written).toContain(successor.agent_name);
      expect(written).toContain(successor.session_id_prefix);
      expect(written).not.toContain(retiree.agent_name);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('exits non-zero and leaves the file unchanged when no active claim matches', async () => {
    const repoRoot = await makeTempCollaborationRepo({ seedCommsEvent: false });
    const activePath = join(repoRoot, '.agent/state/collaboration/active-claims.json');
    try {
      await seedActiveClaim(activePath);

      const result = await runCollaborationStateCli({
        argv: [
          '--',
          'claims',
          'adopt',
          '--active',
          activePath,
          '--claim-id',
          unmatchedClaimId,
          '--platform',
          successor.platform,
          '--model',
          successor.model,
        ],
        env: successorEnv,
      });

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain(`no active claim matches ${unmatchedClaimId}`);
      const written = await readText(activePath);
      expect(written).toContain(retiree.agent_name);
      expect(written).not.toContain(successor.agent_name);
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});

async function seedActiveClaim(activePath: string): Promise<void> {
  await writeJson(activePath, {
    schema_version: '1.3.0',
    commit_queue: [],
    claims: [
      {
        claim_id: seededClaimId,
        agent_id: retireeWithId,
        thread: 'agentic-engineering-enhancements',
        areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
        claimed_at: nowIso,
        freshness_seconds: 14400,
        sidebar_open: false,
        intent: 'Handoff subcommand integration test claim.',
      },
    ],
  });
}
