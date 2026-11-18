import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { createCollaborationAjv } from '../../src/collaboration-state/collaboration-json-validation';
import {
  ACTIVE_CLAIMS_SCHEMA_VERSION,
  type CollaborationRegistry,
} from '../../src/collaboration-state/types';
import { commsEventSchema } from './comms-event-schema-fixture';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// Split from comms-tags.integration.test.ts (max-lines) at the ADR-186
// emitter migration: everything heartbeat-mode lives here — the Lane A
// PDR-078 §5 typed-origin guards and the lifecycle-shape emission,
// thread resolution, and rejection contracts.

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

/**
 * Registry seed for the claim-anchored cases: heartbeats REQUIRE an
 * active claim row (F-73's settled disposition; PDR-078 §4 — a standby
 * neither needs nor can emit a heartbeat), the row must belong to the
 * emitting identity, and the row supplies the lifecycle event's thread.
 */
function registryWithClaim(
  claimId: string,
  thread: string,
  holder: typeof senderWithId = senderWithId,
): CollaborationRegistry {
  return {
    schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
    claims: [
      {
        claim_id: claimId,
        agent_id: holder,
        thread,
        areas: [{ kind: 'git', patterns: ['docs/test-branch'] }],
        claimed_at: '2026-05-24T10:00:00Z',
        intent: 'heartbeat claim-anchor seed',
      },
    ],
  };
}

describe('comms heartbeat mode — ADR-186 lifecycle shape (append/send emitter)', () => {
  it('rejects --body argv on a heartbeat-tagged append (Lane A — PDR-078 §5 typed-origin)', async () => {
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--body',
        'active; free-form prose, not allowed for heartbeat',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-rejected',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*--body.*rejected/);
    expect(result.stderr).toMatch(/--claim-id.*--intent-id.*--branch.*--current-cycle-label/);
  });

  it('rejects --body-file argv on a heartbeat-tagged append (typed-origin guard)', async () => {
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--body-file',
        'state/never-read.txt',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-rejected-file',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*--body-file.*rejected/);
  });

  it('rejects a heartbeat-tagged append with no typed state args (cure-naming error)', async () => {
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-missing-state',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*typed state args/);
    expect(result.stderr).toMatch(/--claim-id/);
    expect(result.stderr).toMatch(/--intent-id/);
    expect(result.stderr).toMatch(/--branch/);
    expect(result.stderr).toMatch(/--current-cycle-label/);
  });

  it('emits the ADR-186 lifecycle shape with thread derived from the real claim row via comms append --tag heartbeat', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime({
      activeClaims: registryWithClaim('claim-7c3f', 'estate-registry-thread'),
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-7c3f',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--event-id',
        'message-heartbeat-composed',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'message-heartbeat-composed',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'lifecycle',
        event_type: 'heartbeat',
        occurred_at: '2026-05-24T10:18:00Z',
        author: senderWithId,
        agent_id: senderWithId,
        thread: 'estate-registry-thread',
        claim_id: 'claim-7c3f',
        title: 'Heartbeat: Test Agent — Test lane',
        subject: 'Heartbeat: Test Agent — Test lane',
        body: 'active; claim=claim-7c3f; intent=lane-test; branch=docs/test-branch; cycle=test-cycle',
        tags: ['heartbeat'],
      },
    ]);
  });

  it('validates the emitted lifecycle heartbeat against the canonical comms-event schema', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime({
      activeClaims: registryWithClaim('claim-7c3f', 'estate-registry-thread'),
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-7c3f',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--event-id',
        'message-heartbeat-schema',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    // The fake runtime's writeCommsEvent never runs the product Ajv gate, so
    // schema conformance of the new shape is proven HERE against the same
    // canonical schema module the product validator loads — through the SAME
    // exported Ajv construction the product validator uses (formats
    // validated), so this gate cannot drift blind to a malformed date-time.
    const validate = createCollaborationAjv().compile(commsEventSchema);
    const [written] = fake.readCommsEvents(commsDir);
    expect(validate(written), JSON.stringify(validate.errors)).toBe(true);
  });

  it('rejects heartbeat mode when no active claim row matches --claim-id (claim-anchored liveness, F-73 disposition)', async () => {
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-with-no-row',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/require an active claim/);
    expect(result.stderr).toMatch(/PDR-078 §4; F-73/);
    expect(result.stderr).toMatch(/open a claim first/);
    expect(fake.readCommsEvents('state/comms')).toStrictEqual([]);
  });

  it("rejects a peer's claim id — a heartbeat anchors to the emitting seat's OWN active claim", async () => {
    const peerWithId = deriveCollaborationIdentity({
      platform: sender.platform,
      model: sender.model,
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: 'Distant Roaming Peer',
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'ffee12',
      },
    }).agentId;
    const fake = createFakeCollaborationRuntime({
      activeClaims: registryWithClaim('claim-peer', 'peer-thread', peerWithId),
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-peer',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/own active claim/);
    expect(result.stderr).toMatch(/belongs to 'Distant Roaming Peer'/);
    expect(fake.readCommsEvents('state/comms')).toStrictEqual([]);
  });

  it('rejects --thread argv as an unknown option — the thread has no override surface (closed shape)', async () => {
    const fake = createFakeCollaborationRuntime({
      activeClaims: registryWithClaim('claim-7c3f', 'estate-registry-thread'),
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-7c3f',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--thread',
        'invented-thread',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/unknown option/);
    expect(result.stderr).toMatch(/--thread/);
    expect(fake.readCommsEvents('state/comms')).toStrictEqual([]);
  });

  it('rejects --in-response-to in heartbeat mode instead of silently dropping the F-77 edge', async () => {
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
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-7c3f',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--in-response-to',
        'some-antecedent-event',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/--in-response-to rejected/);
    expect(fake.readCommsEvents('state/comms')).toStrictEqual([]);
  });

  it('derives thread from the active claim row named by --claim-id via comms send --tag heartbeat (mirrors append path)', async () => {
    const commsDir = 'state/comms';
    const seededRegistry: CollaborationRegistry = {
      schema_version: ACTIVE_CLAIMS_SCHEMA_VERSION,
      claims: [
        {
          claim_id: 'claim-send',
          agent_id: senderWithId,
          thread: 'estate-derive-thread',
          areas: [{ kind: 'git', patterns: ['docs/send-branch'] }],
          claimed_at: '2026-05-24T10:00:00Z',
          intent: 'heartbeat derive-path seed',
        },
      ],
    };
    const fake = createFakeCollaborationRuntime({ activeClaims: seededRegistry });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'send',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-send',
        '--intent-id',
        'lane-send',
        '--branch',
        'docs/send-branch',
        '--current-cycle-label',
        'send-cycle',
        '--event-id',
        'message-heartbeat-send',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'message-heartbeat-send',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'lifecycle',
        event_type: 'heartbeat',
        occurred_at: '2026-05-24T10:18:00Z',
        author: senderWithId,
        agent_id: senderWithId,
        thread: 'estate-derive-thread',
        claim_id: 'claim-send',
        title: 'Heartbeat: Test Agent — Test lane',
        subject: 'Heartbeat: Test Agent — Test lane',
        body: 'active; claim=claim-send; intent=lane-send; branch=docs/send-branch; cycle=send-cycle',
        tags: ['heartbeat'],
      },
    ]);
  });
});
